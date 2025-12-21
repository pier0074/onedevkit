/**
 * Unit tests for Hash Generator
 */

// Mock DOM elements
document.getElementById = jest.fn(() => null);
document.querySelectorAll = jest.fn(() => []);

// Mock Web Crypto API for SHA hashing
const cryptoMock = {
  subtle: {
    digest: jest.fn(async (algorithm, data) => {
      // Simple mock implementation that returns deterministic results
      const text = new TextDecoder().decode(data);
      const algoName = algorithm.replace('-', '').toLowerCase();

      // Known hash values for testing
      const knownHashes = {
        sha1: {
          'hello': 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
          'test': 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
          '': 'da39a3ee5e6b4b0d3255bfef95601890afd80709'
        },
        sha256: {
          'hello': '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
          'test': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          '': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          'deterministic test': 'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418f98a84e39c9c5a9a7fda50a2e97'
        },
        sha512: {
          'test': 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
          'hello': '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
          '': 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
        }
      };

      const hashHex = knownHashes[algoName]?.[text];
      if (hashHex) {
        // Convert hex string to Uint8Array buffer
        const bytes = new Uint8Array(hashHex.length / 2);
        for (let i = 0; i < hashHex.length; i += 2) {
          bytes[i / 2] = parseInt(hashHex.substring(i, i + 2), 16);
        }
        return bytes.buffer;
      }

      // For unknown inputs, return a deterministic mock based on algorithm
      const lengths = { sha1: 20, sha256: 32, sha512: 64 };
      const len = lengths[algoName] || 32;
      const mockBytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        mockBytes[i] = (text.charCodeAt(i % text.length) + i) % 256;
      }
      return mockBytes.buffer;
    })
  }
};

// Apply crypto mock
Object.defineProperty(global, 'crypto', {
  value: cryptoMock,
  writable: true
});

// Load the module
require('../../src/js/hash-generator.js');

describe('HashGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('md5()', () => {
    test('generates correct MD5 for empty string', () => {
      expect(window.HashGenerator.md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    test('generates correct MD5 for "hello"', () => {
      expect(window.HashGenerator.md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    test('generates correct MD5 for "Hello, World!"', () => {
      expect(window.HashGenerator.md5('Hello, World!')).toBe('65a8e27d8879283831b664bd8b7f0ad4');
    });

    test('generates 32 character hash', () => {
      const hash = window.HashGenerator.md5('test');
      expect(hash.length).toBe(32);
    });

    test('generates lowercase hex characters', () => {
      const hash = window.HashGenerator.md5('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    test('handles unicode characters', () => {
      const hash = window.HashGenerator.md5('你好');
      expect(hash.length).toBe(32);
    });

    test('same input produces same hash', () => {
      const hash1 = window.HashGenerator.md5('consistent');
      const hash2 = window.HashGenerator.md5('consistent');
      expect(hash1).toBe(hash2);
    });

    test('different input produces different hash', () => {
      const hash1 = window.HashGenerator.md5('input1');
      const hash2 = window.HashGenerator.md5('input2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('sha1()', () => {
    test('generates 40 character hash', async () => {
      const hash = await window.HashGenerator.sha1('test');
      expect(hash.length).toBe(40);
    });

    test('generates correct SHA-1 for "hello"', async () => {
      const hash = await window.HashGenerator.sha1('hello');
      expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });

    test('generates lowercase hex characters', async () => {
      const hash = await window.HashGenerator.sha1('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('sha256()', () => {
    test('generates 64 character hash', async () => {
      const hash = await window.HashGenerator.sha256('test');
      expect(hash.length).toBe(64);
    });

    test('generates correct SHA-256 for "hello"', async () => {
      const hash = await window.HashGenerator.sha256('hello');
      expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    test('generates lowercase hex characters', async () => {
      const hash = await window.HashGenerator.sha256('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    test('handles empty string', async () => {
      const hash = await window.HashGenerator.sha256('');
      expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
  });

  describe('sha512()', () => {
    test('generates 128 character hash', async () => {
      const hash = await window.HashGenerator.sha512('test');
      expect(hash.length).toBe(128);
    });

    test('generates lowercase hex characters', async () => {
      const hash = await window.HashGenerator.sha512('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('generateAll()', () => {
    test('returns all hash types', async () => {
      const hashes = await window.HashGenerator.generateAll('test');

      expect(hashes).toHaveProperty('md5');
      expect(hashes).toHaveProperty('sha1');
      expect(hashes).toHaveProperty('sha256');
      expect(hashes).toHaveProperty('sha512');
    });

    test('returns correct lengths for all hashes', async () => {
      const hashes = await window.HashGenerator.generateAll('test');

      expect(hashes.md5.length).toBe(32);
      expect(hashes.sha1.length).toBe(40);
      expect(hashes.sha256.length).toBe(64);
      expect(hashes.sha512.length).toBe(128);
    });
  });

  describe('getSampleText()', () => {
    test('returns non-empty sample', () => {
      const sample = window.HashGenerator.getSampleText();
      expect(sample).toBeTruthy();
      expect(sample.length).toBeGreaterThan(0);
    });
  });

  describe('consistency', () => {
    test('MD5 is deterministic', () => {
      const input = 'deterministic test';
      const hash1 = window.HashGenerator.md5(input);
      const hash2 = window.HashGenerator.md5(input);
      expect(hash1).toBe(hash2);
    });

    test('SHA-256 is deterministic', async () => {
      const input = 'deterministic test';
      const hash1 = await window.HashGenerator.sha256(input);
      const hash2 = await window.HashGenerator.sha256(input);
      expect(hash1).toBe(hash2);
    });
  });
});
