import { parseRequestBody, validateParams, calculateProgressiveTax } from '@/pages/api/calculate-tax.js';

describe('Tax Calculation Utilities', () => {
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
      // 10000 * 0.10 = 1000
      // 40000 * 0.20 = 8000
      // 10000 * 0.30 = 3000
      expect(tax).toBe(12000);
    });

    it('should calculate tax correctly for an income at a bracket boundary', () => {
        const { tax } = calculateProgressiveTax(10000, brackets);
        // 10000 * 0.10 = 1000
        expect(tax).toBe(1000);
    });

    it('should return 0 tax for 0 income', () => {
      const { tax } = calculateProgressiveTax(0, brackets);
      expect(tax).toBe(0);
    });
  });
});
