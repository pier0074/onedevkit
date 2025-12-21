/**
 * Unit tests for URL Encoder/Decoder
 */

// Mock DOM elements
document.getElementById = jest.fn(() => null);
document.querySelectorAll = jest.fn(() => []);

// Load the module
require('../../src/js/url-encoder.js');

describe('URLEncoder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.URLEncoder.mode = 'component';
  });

  describe('encodeComponent()', () => {
    test('encodes spaces', () => {
      expect(window.URLEncoder.encodeComponent('hello world')).toBe('hello%20world');
    });

    test('encodes special characters', () => {
      expect(window.URLEncoder.encodeComponent('a=b&c=d')).toBe('a%3Db%26c%3Dd');
    });

    test('encodes unicode characters', () => {
      const encoded = window.URLEncoder.encodeComponent('你好');
      expect(encoded).toContain('%');
    });

    test('does not encode alphanumeric', () => {
      expect(window.URLEncoder.encodeComponent('abc123')).toBe('abc123');
    });

    test('encodes URL reserved characters', () => {
      expect(window.URLEncoder.encodeComponent('/?#')).toBe('%2F%3F%23');
    });

    test('handles empty string', () => {
      expect(window.URLEncoder.encodeComponent('')).toBe('');
    });
  });

  describe('encodeFullURL()', () => {
    test('preserves URL structure', () => {
      const url = 'https://example.com/path?query=value';
      const encoded = window.URLEncoder.encodeFullURL(url);
      expect(encoded).toBe(url);
    });

    test('encodes spaces in path', () => {
      const url = 'https://example.com/my path';
      expect(window.URLEncoder.encodeFullURL(url)).toBe('https://example.com/my%20path');
    });

    test('preserves query string structure', () => {
      const url = 'https://example.com?a=1&b=2';
      expect(window.URLEncoder.encodeFullURL(url)).toBe(url);
    });
  });

  describe('decodeComponent()', () => {
    test('decodes percent-encoded spaces', () => {
      expect(window.URLEncoder.decodeComponent('hello%20world')).toBe('hello world');
    });

    test('decodes special characters', () => {
      expect(window.URLEncoder.decodeComponent('a%3Db%26c%3Dd')).toBe('a=b&c=d');
    });

    test('decodes unicode characters', () => {
      const encoded = encodeURIComponent('你好');
      expect(window.URLEncoder.decodeComponent(encoded)).toBe('你好');
    });

    test('handles already decoded string', () => {
      expect(window.URLEncoder.decodeComponent('hello')).toBe('hello');
    });

    test('throws on invalid encoding', () => {
      expect(() => window.URLEncoder.decodeComponent('%')).toThrow();
    });
  });

  describe('decodeFullURL()', () => {
    test('decodes URL-encoded path', () => {
      expect(window.URLEncoder.decodeFullURL('https://example.com/my%20path'))
        .toBe('https://example.com/my path');
    });

    test('preserves URL structure', () => {
      const url = 'https://example.com?a=1&b=2';
      expect(window.URLEncoder.decodeFullURL(url)).toBe(url);
    });
  });

  describe('encode() with mode', () => {
    test('uses component mode by default', () => {
      window.URLEncoder.mode = 'component';
      expect(window.URLEncoder.encode('a/b')).toBe('a%2Fb');
    });

    test('uses full URL mode when set', () => {
      window.URLEncoder.mode = 'full';
      expect(window.URLEncoder.encode('a/b')).toBe('a/b');
    });
  });

  describe('decode() with mode', () => {
    test('uses component mode by default', () => {
      window.URLEncoder.mode = 'component';
      expect(window.URLEncoder.decode('a%2Fb')).toBe('a/b');
    });

    test('uses full URL mode when set', () => {
      window.URLEncoder.mode = 'full';
      // decodeURI preserves reserved characters like %2F (/)
      expect(window.URLEncoder.decode('hello%20world')).toBe('hello world');
    });
  });

  describe('roundtrip encoding/decoding', () => {
    const testCases = [
      'Hello, World!',
      'user@example.com',
      'https://example.com/path?q=test',
      '日本語テスト',
      'a=1&b=2&c=3',
      'special chars: !@#$%^&*()',
    ];

    testCases.forEach(input => {
      test(`roundtrip: "${input.substring(0, 30)}..."`, () => {
        const encoded = window.URLEncoder.encodeComponent(input);
        const decoded = window.URLEncoder.decodeComponent(encoded);
        expect(decoded).toBe(input);
      });
    });
  });

  describe('getSampleText()', () => {
    test('returns non-empty sample', () => {
      const sample = window.URLEncoder.getSampleText();
      expect(sample).toBeTruthy();
      expect(sample.length).toBeGreaterThan(0);
    });
  });
});
