import { formatWithCommas, reformatWithCommasPreserveCaret, parseCurrency } from '@/utils/numberFormat.js';

describe('Number Formatting Utilities', () => {
  describe('formatWithCommas', () => {
    it('should format a number with commas', () => {
      expect(formatWithCommas('1234567')).toBe('1,234,567');
    });

    it('should handle numbers with decimals', () => {
      expect(formatWithCommas('12345.67')).toBe('12,345.67');
    });

    it('should handle a trailing decimal point', () => {
      expect(formatWithCommas('123.')).toBe('123.');
    });

    it('should strip non-numeric characters', () => {
      expect(formatWithCommas('abc123xyz')).toBe('123');
    });

    it('should handle multiple decimal points', () => {
      expect(formatWithCommas('1.2.3')).toBe('1.23');
    });

    it('should handle leading zeros', () => {
      expect(formatWithCommas('00123')).toBe('123');
    });

    it('should return an empty string for empty input', () => {
      expect(formatWithCommas('')).toBe('');
    });
  });

  describe('reformatWithCommasPreserveCaret', () => {
    it('should reformat and preserve caret position', () => {
      const { formatted, caret } = reformatWithCommasPreserveCaret('12345', 3);
      expect(formatted).toBe('12,345');
      expect(caret).toBe(4);
    });

    it('should adjust caret position after adding a comma', () => {
      const { formatted, caret } = reformatWithCommasPreserveCaret('1234567', 4);
      expect(formatted).toBe('1,234,567');
      expect(caret).toBe(5);
    });
  });

  describe('parseCurrency', () => {
    it('should parse a formatted currency string', () => {
      expect(parseCurrency('1,234.56')).toBe(1234.56);
    });

    it('should handle strings without commas', () => {
      expect(parseCurrency('1234')).toBe(1234);
    });

    it('should return 0 for an empty string', () => {
      expect(parseCurrency('')).toBe(0);
    });

    it('should return 0 for a null or undefined input', () => {
      expect(parseCurrency(null)).toBe(0);
      expect(parseCurrency(undefined)).toBe(0);
    });
  });
});
