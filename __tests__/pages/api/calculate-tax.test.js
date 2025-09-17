import handler, { internals } from '@/pages/api/calculate-tax.js';

describe('Tax Calculation API', () => {
  describe('parseRequestBody', () => {
    it('should parse a valid JSON string', () => {
      const req = { body: '{"key": "value"}' };
      expect(internals.parseRequestBody(req)).toEqual({ key: 'value' });
    });

    it('should return an object if body is already an object', () => {
      const req = { body: { key: 'value' } };
      expect(internals.parseRequestBody(req)).toEqual({ key: 'value' });
    });

    it('should throw an error for invalid JSON', () => {
      const req = { body: 'invalid json' };
      expect(() => internals.parseRequestBody(req)).toThrow('Invalid JSON');
    });

    it('should throw an error for invalid body type', () => {
      const req = { body: null };
      expect(() => internals.parseRequestBody(req)).toThrow('Invalid request body');
    });
  });

  describe('validateParams', () => {
    it('should not throw an error for valid params', () => {
      expect(() => internals.validateParams({ sourceCode: 'US', salary: 50000 })).not.toThrow();
    });

    it('should throw an error for missing sourceCode', () => {
      expect(() => internals.validateParams({ salary: 50000 })).toThrow('Missing or invalid sourceCode');
    });

    it('should throw an error for missing salary', () => {
      expect(() => internals.validateParams({ sourceCode: 'US' })).toThrow('Missing or invalid salary');
    });
  });

  describe('calculateProgressiveTax', () => {
    const brackets = [
      { min_income: 0, max_income: 10000, rate_percent: 10 },
      { min_income: 10000, max_income: 50000, rate_percent: 20 },
      { min_income: 50000, max_income: null, rate_percent: 30 },
    ];

    it('should calculate tax correctly for an income within the first bracket', () => {
      const { tax } = internals.calculateProgressiveTax(5000, brackets);
      expect(tax).toBe(500); // 5000 * 0.10
    });

    it('should calculate tax correctly for an income spanning multiple brackets', () => {
      const { tax } = internals.calculateProgressiveTax(60000, brackets);
      // 10000 * 0.10 = 1000
      // 40000 * 0.20 = 8000
      // 10000 * 0.30 = 3000
      expect(tax).toBe(12000);
    });

    it('should calculate tax correctly for an income at a bracket boundary', () => {
        const { tax } = internals.calculateProgressiveTax(10000, brackets);
        // 10000 * 0.10 = 1000
        expect(tax).toBe(1000);
    });

    it('should return 0 tax for 0 income', () => {
      const { tax } = internals.calculateProgressiveTax(0, brackets);
      expect(tax).toBe(0);
    });
  });

  describe('API handler', () => {
    let req, res;

    beforeEach(() => {
      req = {
        method: 'POST',
        body: { sourceCode: 'ANY', salary: 100000 },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 405 if method is not POST', async () => {
      req.method = 'GET';
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });

    it('should return 400 for invalid parameters', async () => {
      req.body = { sourceCode: 'ANY' }; // Missing salary
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid salary' });
    });

    it('should return 404 if no tax brackets are found', async () => {
      jest.spyOn(internals, 'getTaxBrackets').mockResolvedValue([]);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No tax brackets found for country' });
    });

    it('should calculate and return tax successfully', async () => {
      const mockBrackets = [
        { min_income: 0, max_income: 20000, rate_percent: 15 },
        { min_income: 20000, max_income: null, rate_percent: 25 },
      ];
      jest.spyOn(internals, 'getTaxBrackets').mockResolvedValue(mockBrackets);

      await handler(req, res);

      // 20000 * 0.15 = 3000
      // 80000 * 0.25 = 20000
      const expectedTax = 23000;

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ tax: expectedTax }));
    });
  });
});
