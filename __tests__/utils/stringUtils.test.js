import { flagEmojiFromCountryCode } from '@/utils/stringUtils.js';

describe('String Utilities', () => {
  describe('flagEmojiFromCountryCode', () => {
    it('should convert a country code to a flag emoji', () => {
      expect(flagEmojiFromCountryCode('US')).toBe('🇺🇸');
      expect(flagEmojiFromCountryCode('CA')).toBe('🇨🇦');
    });

    it('should handle the special case for EU', () => {
      expect(flagEmojiFromCountryCode('EU')).toBe('🇪🇺');
    });

    it('should return a white flag for an invalid code', () => {
      expect(flagEmojiFromCountryCode('USA')).toBe('🏳️');
      expect(flagEmojiFromCountryCode('A')).toBe('🏳️');
      expect(flagEmojiFromCountryCode('')).toBe('🏳️');
      expect(flagEmojiFromCountryCode(null)).toBe('🏳️');
      expect(flagEmojiFromCountryCode(undefined)).toBe('🏳️');
    });

    it('should be case-insensitive', () => {
      expect(flagEmojiFromCountryCode('us')).toBe('🇺🇸');
      expect(flagEmojiFromCountryCode('eu')).toBe('🇪🇺');
    });
  });
});
