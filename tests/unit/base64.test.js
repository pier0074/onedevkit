/**
 * Unit tests for Base64 Encoder & Decoder
 */

// Load the Base64 module
require('../../src/js/base64.js');

describe('Base64Tool', () => {
  const Base64Tool = window.Base64Tool;

  describe('encode()', () => {
    test('encodes simple ASCII string', () => {
      expect(Base64Tool.encode('Hello')).toBe('SGVsbG8=');
    });

    test('encodes "Hello, World!"', () => {
      expect(Base64Tool.encode('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==');
    });

    test('encodes empty string', () => {
      expect(Base64Tool.encode('')).toBe('');
    });

    test('encodes UTF-8 characters', () => {
      const result = Base64Tool.encode('Hello 世界');
      expect(result).toBe('SGVsbG8g5LiW55WM');
    });

    test('encodes with URL-safe option', () => {
      // String that produces + and / in standard Base64
      const input = '>>>>????';
      const standard = Base64Tool.encode(input);
      const urlSafe = Base64Tool.encode(input, { urlSafe: true });

      expect(urlSafe).not.toContain('+');
      expect(urlSafe).not.toContain('/');
      expect(urlSafe).not.toContain('=');
    });

    test('encodes with line breaks option', () => {
      const longString = 'A'.repeat(100);
      const result = Base64Tool.encode(longString, { lineBreaks: true });
      expect(result).toContain('\n');
    });
  });

  describe('decode()', () => {
    test('decodes simple Base64', () => {
      expect(Base64Tool.decode('SGVsbG8=')).toBe('Hello');
    });

    test('decodes "Hello, World!"', () => {
      expect(Base64Tool.decode('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!');
    });

    test('decodes empty string', () => {
      expect(Base64Tool.decode('')).toBe('');
    });

    test('decodes UTF-8 characters', () => {
      expect(Base64Tool.decode('SGVsbG8g5LiW55WM')).toBe('Hello 世界');
    });

    test('decodes URL-safe Base64', () => {
      const urlSafe = 'SGVsbG8-d29ybGQ_';
      const result = Base64Tool.decode(urlSafe, { urlSafe: true });
      expect(result).toBeTruthy();
    });

    test('handles Base64 with line breaks', () => {
      const withBreaks = 'SGVs\nbG8=';
      expect(Base64Tool.decode(withBreaks)).toBe('Hello');
    });

    test('throws on invalid Base64', () => {
      expect(() => Base64Tool.decode('not-valid-base64!!!')).toThrow();
    });
  });

  describe('roundtrip encode/decode', () => {
    const testCases = [
      'Hello, World!',
      '',
      'Special chars: !@#$%^&*()',
      'UTF-8: 你好世界 🌍',
      'Numbers: 12345',
      'Newlines:\nand\ttabs',
      'A'.repeat(1000) // Long string
    ];

    testCases.forEach((input) => {
      test(`roundtrip: "${input.substring(0, 30)}${input.length > 30 ? '...' : ''}"`, () => {
        const encoded = Base64Tool.encode(input);
        const decoded = Base64Tool.decode(encoded);
        expect(decoded).toBe(input);
      });
    });
  });

  describe('isValidBase64()', () => {
    test('returns true for valid Base64', () => {
      expect(Base64Tool.isValidBase64('SGVsbG8=')).toBe(true);
      expect(Base64Tool.isValidBase64('SGVsbG8sIFdvcmxkIQ==')).toBe(true);
    });

    test('returns true for URL-safe Base64', () => {
      expect(Base64Tool.isValidBase64('SGVsbG8-d29ybGQ_')).toBe(true);
    });

    test('returns false for invalid Base64', () => {
      expect(Base64Tool.isValidBase64('not valid!')).toBe(false);
      expect(Base64Tool.isValidBase64('!!!!')).toBe(false);
    });
  });

  describe('formatBytes()', () => {
    test('formats bytes correctly', () => {
      expect(Base64Tool.formatBytes(0)).toBe('0 B');
      expect(Base64Tool.formatBytes(500)).toBe('500 B');
      expect(Base64Tool.formatBytes(1024)).toBe('1 KB');
      expect(Base64Tool.formatBytes(1536)).toBe('1.5 KB');
      expect(Base64Tool.formatBytes(1048576)).toBe('1 MB');
    });
  });
});
