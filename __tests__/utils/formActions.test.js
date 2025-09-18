import { handleFormContinue } from '@/utils/formActions.js';
import { vi } from 'vitest';

describe('Form Actions', () => {
  beforeAll(() => {
    global.fetch = vi.fn();
  });

  beforeEach(() => {
    fetch.mockClear();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  describe('handleFormContinue', () => {
    const mockFormData = {
      sourceCode: 'US',
      targetCode: 'CA',
      salary: '100,000',
      salaryCurrency: 'USD',
      lifestyle: { rent: '2000', food: '500' },
      surprises: { vacation: '200', gifts: '50' },
    };

    it('should calculate and log final savings on successful API call', async () => {
      const mockTaxData = { tax: 15000 };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTaxData,
      });

      const tax = await handleFormContinue(mockFormData);

      expect(fetch).toHaveBeenCalledWith('/api/calculate-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCode: 'US', salary: 100000 }),
      });

      expect(tax).toBe(15000);
      expect(console.log).toHaveBeenCalled();
    });

    it('should log an error on a failed API call', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await handleFormContinue(mockFormData);

      expect(console.error).toHaveBeenCalledWith('Tax calculation error:', expect.any(Error));
    });

    it('should log an error if the API call throws an exception', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await handleFormContinue(mockFormData);

      expect(console.error).toHaveBeenCalledWith('Tax calculation error:', new Error('Network error'));
    });
  });
});
