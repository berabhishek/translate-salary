import { vi } from 'vitest';

// Mock the client before importing the module that uses it
const mockExecute = vi.fn();
vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({
    execute: mockExecute,
  })),
}));

// Now import the modules that use the mocked client
const { parseRequestBody, validateParams, calculateProgressiveTax, getTaxBrackets, default: handler } = await import('@/pages/api/calculate-tax.js');
const { createClient } = await import('@libsql/client');


describe('Tax Calculation API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockReset();
    console.log = vi.fn(); // Mock console.log to prevent logs during tests
  });

  describe('parseRequestBody', () => {
    it('should parse a valid JSON string', () => {
      const req = { body: '{"key": "value"}' };
      expect(parseRequestBody(req)).toEqual({ key: 'value' });
    });

    it('should return an object if body is already an object', () => {
      const req = { body: { key: 'value' } };
      expect(parseRequestBody(req)).toEqual({ key: 'value' });
    });

    it('should throw an error for invalid JSON', () => {
      const req = { body: 'invalid json' };
      expect(() => parseRequestBody(req)).toThrow('Invalid JSON');
    });

    it('should throw an error for invalid body type', () => {
      const req = { body: null };
      expect(() => parseRequestBody(req)).toThrow('Invalid request body');
    });
  });

  describe('validateParams', () => {
    it('should not throw an error for valid params', () => {
      expect(() => validateParams({ sourceCode: 'US', salary: 50000 })).not.toThrow();
    });

    it('should throw an error for missing sourceCode', () => {
      expect(() => validateParams({ salary: 50000 })).toThrow('Missing or invalid sourceCode');
    });

    it('should throw an error for missing salary', () => {
      expect(() => validateParams({ sourceCode: 'US' })).toThrow('Missing or invalid salary');
    });
  });

  describe('calculateProgressiveTax', () => {
    const brackets = [
      { min_income: 0, max_income: 10000, rate_percent: 10 },
      { min_income: 10000, max_income: 50000, rate_percent: 20 },
      { min_income: 50000, max_income: null, rate_percent: 30 },
    ];

    it('should calculate tax correctly for an income within the first bracket', () => {
      const { tax } = calculateProgressiveTax(5000, brackets);
      expect(tax).toBe(500); // 5000 * 0.10
    });

    it('should calculate tax correctly for an income spanning multiple brackets', () => {
      const { tax } = calculateProgressiveTax(60000, brackets);
      expect(tax).toBe(12000);
    });

    it('should calculate tax correctly for an income at a bracket boundary', () => {
        const { tax } = calculateProgressiveTax(10000, brackets);
        expect(tax).toBe(1000);
    });

    it('should return 0 tax for 0 income', () => {
      const { tax } = calculateProgressiveTax(0, brackets);
      expect(tax).toBe(0);
    });
  });

  describe('getTaxBrackets', () => {
    it('should return tax brackets for a valid country code', async () => {
      const mockRows = [{ min_income: 0, max_income: 10000, rate_percent: 10 }];
      mockExecute.mockResolvedValue({ rows: mockRows });

      const brackets = await getTaxBrackets('US');
      expect(mockExecute).toHaveBeenCalledWith({
        sql: 'SELECT min_income, max_income, rate_percent FROM tax_brackets WHERE country_code = ? ORDER BY min_income ASC',
        args: ['US'],
      });
      expect(brackets).toEqual(mockRows);
    });
  });

  describe('handler', () => {
    let req, res;

    beforeEach(() => {
      req = {
        method: 'POST',
        body: { sourceCode: 'US', salary: 100000 },
      };
      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
    });

    it('should return 405 if method is not POST', async () => {
      req.method = 'GET';
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });

    it('should return 400 for invalid JSON', async () => {
      req.body = 'invalid json';
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid JSON' });
    });

    it('should return 400 for missing parameters', async () => {
      req.body = { salary: 100000 };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid sourceCode' });
    });

    it('should return 404 if no tax brackets are found', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No tax brackets found for country' });
    });

    it('should return 500 for a server error', async () => {
      mockExecute.mockRejectedValue(new Error('DB error'));

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error', details: 'DB error' });
    });

    it('should return 200 and calculate tax on success', async () => {
      const mockBrackets = [
        { min_income: 0, max_income: 10000, rate_percent: 10 },
        { min_income: 10000, max_income: null, rate_percent: 20 },
      ];
      mockExecute.mockResolvedValue({ rows: mockBrackets });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          tax: 19000, // (10000 * 0.10) + (90000 * 0.20) = 1000 + 18000 = 19000
          debug: expect.any(Array),
        })
      );
    });
  });
});
