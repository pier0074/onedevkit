/**
 * Unit tests for JWT Decoder
 */

// Mock DOM elements
document.getElementById = jest.fn(() => null);
document.querySelectorAll = jest.fn(() => []);

// Load the module
require('../../src/js/jwt-decoder.js');

describe('JWTDecoder', () => {
  // Sample valid JWT tokens for testing
  const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('base64UrlDecode()', () => {
    test('decodes standard Base64URL', () => {
      // "hello" in Base64URL
      const encoded = 'aGVsbG8';
      const result = window.JWTDecoder.base64UrlDecode(encoded);
      expect(result).toBe('hello');
    });

    test('handles URL-safe characters', () => {
      // Base64URL uses - and _ instead of + and /
      const standard = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const result = window.JWTDecoder.base64UrlDecode(standard);
      expect(result).toContain('alg');
    });

    test('handles missing padding', () => {
      // Base64URL often omits padding
      const noPadding = 'aGVsbG8';
      const result = window.JWTDecoder.base64UrlDecode(noPadding);
      expect(result).toBe('hello');
    });

    test('throws on invalid encoding', () => {
      expect(() => window.JWTDecoder.base64UrlDecode('!!!invalid!!!')).toThrow();
    });
  });

  describe('decode()', () => {
    test('decodes valid JWT', () => {
      const result = window.JWTDecoder.decode(sampleJWT);

      expect(result).toHaveProperty('header');
      expect(result).toHaveProperty('payload');
      expect(result).toHaveProperty('signature');
      expect(result).toHaveProperty('raw');
    });

    test('extracts correct header', () => {
      const result = window.JWTDecoder.decode(sampleJWT);

      expect(result.header.alg).toBe('HS256');
      expect(result.header.typ).toBe('JWT');
    });

    test('extracts correct payload', () => {
      const result = window.JWTDecoder.decode(sampleJWT);

      expect(result.payload.sub).toBe('1234567890');
      expect(result.payload.name).toBe('John Doe');
      expect(result.payload.iat).toBe(1516239022);
    });

    test('extracts signature', () => {
      const result = window.JWTDecoder.decode(sampleJWT);

      expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    });

    test('includes raw parts', () => {
      const result = window.JWTDecoder.decode(sampleJWT);

      expect(result.raw.header).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      expect(result.raw.payload).toBe('eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ');
      expect(result.raw.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    });

    test('throws on null token', () => {
      expect(() => window.JWTDecoder.decode(null)).toThrow('Token is required');
    });

    test('throws on empty token', () => {
      expect(() => window.JWTDecoder.decode('')).toThrow('Token is required');
    });

    test('throws on non-string token', () => {
      expect(() => window.JWTDecoder.decode(123)).toThrow('Token is required');
    });

    test('throws on token with wrong number of parts', () => {
      expect(() => window.JWTDecoder.decode('only.two')).toThrow('Invalid JWT format');
      expect(() => window.JWTDecoder.decode('one')).toThrow('Invalid JWT format');
      expect(() => window.JWTDecoder.decode('a.b.c.d')).toThrow('Invalid JWT format');
    });

    test('throws on invalid header', () => {
      expect(() => window.JWTDecoder.decode('invalid.eyJzdWIiOiIxIn0.sig')).toThrow('Invalid JWT header');
    });

    test('throws on invalid payload', () => {
      expect(() => window.JWTDecoder.decode('eyJhbGciOiJIUzI1NiJ9.invalid.sig')).toThrow('Invalid JWT payload');
    });

    test('trims whitespace from token', () => {
      const tokenWithSpaces = '  ' + sampleJWT + '  ';
      const result = window.JWTDecoder.decode(tokenWithSpaces);

      expect(result.header.alg).toBe('HS256');
    });
  });

  describe('isExpired()', () => {
    test('returns true for expired token', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
      expect(window.JWTDecoder.isExpired(payload)).toBe(true);
    });

    test('returns false for valid token', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour from now
      expect(window.JWTDecoder.isExpired(payload)).toBe(false);
    });

    test('returns null if no exp claim', () => {
      const payload = { sub: '123' };
      expect(window.JWTDecoder.isExpired(payload)).toBeNull();
    });

    test('handles token expiring now', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) };
      expect(window.JWTDecoder.isExpired(payload)).toBe(true);
    });
  });

  describe('isNotYetValid()', () => {
    test('returns true for future nbf', () => {
      const payload = { nbf: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour from now
      expect(window.JWTDecoder.isNotYetValid(payload)).toBe(true);
    });

    test('returns false for past nbf', () => {
      const payload = { nbf: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
      expect(window.JWTDecoder.isNotYetValid(payload)).toBe(false);
    });

    test('returns null if no nbf claim', () => {
      const payload = { sub: '123' };
      expect(window.JWTDecoder.isNotYetValid(payload)).toBeNull();
    });
  });

  describe('formatTimestamp()', () => {
    test('formats Unix timestamp to readable date', () => {
      const timestamp = 1704067200; // 2024-01-01 00:00:00 UTC
      const result = window.JWTDecoder.formatTimestamp(timestamp);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('returns null for null timestamp', () => {
      expect(window.JWTDecoder.formatTimestamp(null)).toBeNull();
    });

    test('returns null for undefined timestamp', () => {
      expect(window.JWTDecoder.formatTimestamp(undefined)).toBeNull();
    });
  });

  describe('getSampleToken()', () => {
    test('returns valid JWT format', () => {
      const token = window.JWTDecoder.getSampleToken();
      const parts = token.split('.');

      expect(parts.length).toBe(3);
    });

    test('sample token can be decoded', () => {
      const token = window.JWTDecoder.getSampleToken();
      const result = window.JWTDecoder.decode(token);

      expect(result.header.alg).toBe('HS256');
      expect(result.header.typ).toBe('JWT');
    });

    test('sample token has expected claims', () => {
      const token = window.JWTDecoder.getSampleToken();
      const result = window.JWTDecoder.decode(token);

      expect(result.payload).toHaveProperty('sub');
      expect(result.payload).toHaveProperty('name');
      expect(result.payload).toHaveProperty('iat');
      expect(result.payload).toHaveProperty('exp');
    });

    test('sample token is not expired', () => {
      const token = window.JWTDecoder.getSampleToken();
      const result = window.JWTDecoder.decode(token);

      expect(window.JWTDecoder.isExpired(result.payload)).toBe(false);
    });
  });

  describe('prettyPrint()', () => {
    test('formats object with indentation', () => {
      const obj = { name: 'John', age: 30 };
      const result = window.JWTDecoder.prettyPrint(obj);

      expect(result).toContain('\n');
      expect(result).toContain('  ');
    });

    test('includes all properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = window.JWTDecoder.prettyPrint(obj);

      expect(result).toContain('"a"');
      expect(result).toContain('"b"');
      expect(result).toContain('"c"');
    });

    test('is valid JSON', () => {
      const obj = { test: 'value' };
      const result = window.JWTDecoder.prettyPrint(obj);

      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe('real-world JWT scenarios', () => {
    test('handles JWT with many claims', () => {
      // Create a token with many claims
      const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'key123' }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const payload = btoa(JSON.stringify({
        sub: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['admin', 'user'],
        iat: 1704067200,
        exp: 1704153600,
        iss: 'https://auth.example.com',
        aud: 'https://api.example.com'
      })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const signature = 'fakesignature';

      const token = `${header}.${payload}.${signature}`;
      const result = window.JWTDecoder.decode(token);

      expect(result.payload.roles).toEqual(['admin', 'user']);
      expect(result.payload.iss).toBe('https://auth.example.com');
    });

    test('handles JWT with nested objects', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256' }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const payload = btoa(JSON.stringify({
        user: { id: 1, profile: { name: 'John' } }
      })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const signature = 'sig';

      const token = `${header}.${payload}.${signature}`;
      const result = window.JWTDecoder.decode(token);

      expect(result.payload.user.profile.name).toBe('John');
    });
  });
});
