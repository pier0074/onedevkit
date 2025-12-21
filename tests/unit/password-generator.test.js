/**
 * Unit tests for Password Generator
 */

// Load the Password Generator module
require('../../src/js/password-generator.js');

describe('PasswordGenerator', () => {
  const PasswordGenerator = window.PasswordGenerator;

  describe('generate()', () => {
    test('generates password of default length (16)', () => {
      const password = PasswordGenerator.generate();
      expect(password.length).toBe(16);
    });

    test('generates password of specified length', () => {
      const password = PasswordGenerator.generate({ length: 24 });
      expect(password.length).toBe(24);
    });

    test('generates different lengths', () => {
      expect(PasswordGenerator.generate({ length: 8 }).length).toBe(8);
      expect(PasswordGenerator.generate({ length: 32 }).length).toBe(32);
      expect(PasswordGenerator.generate({ length: 64 }).length).toBe(64);
    });

    test('generates unique passwords', () => {
      const passwords = new Set();
      for (let i = 0; i < 100; i++) {
        passwords.add(PasswordGenerator.generate());
      }
      // All 100 should be unique
      expect(passwords.size).toBe(100);
    });

    test('includes uppercase when option enabled', () => {
      const options = {
        length: 20,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false
      };
      const password = PasswordGenerator.generate(options);
      expect(password).toMatch(/^[A-Z]+$/);
    });

    test('includes lowercase when option enabled', () => {
      const options = {
        length: 20,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false
      };
      const password = PasswordGenerator.generate(options);
      expect(password).toMatch(/^[a-z]+$/);
    });

    test('includes numbers when option enabled', () => {
      const options = {
        length: 20,
        uppercase: false,
        lowercase: false,
        numbers: true,
        symbols: false
      };
      const password = PasswordGenerator.generate(options);
      expect(password).toMatch(/^[0-9]+$/);
    });

    test('includes symbols when option enabled', () => {
      const options = {
        length: 20,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: true
      };
      const password = PasswordGenerator.generate(options);
      expect(password).toMatch(/^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
    });

    test('excludes ambiguous characters when option enabled', () => {
      const options = {
        length: 100,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        excludeAmbiguous: true
      };
      const password = PasswordGenerator.generate(options);
      expect(password).not.toMatch(/[ilL1oO0]/);
    });
  });

  describe('calculateStrength()', () => {
    // calculateStrength returns 0-4 (integer score)
    test('weak password (short, only lowercase)', () => {
      const score = PasswordGenerator.calculateStrength('abc');
      expect(score).toBeLessThanOrEqual(1);
    });

    test('medium password', () => {
      const score = PasswordGenerator.calculateStrength('Abcdef123');
      expect(score).toBeGreaterThanOrEqual(2);
      expect(score).toBeLessThanOrEqual(3);
    });

    test('strong password', () => {
      const score = PasswordGenerator.calculateStrength('Abc123!@#XyzPqr');
      expect(score).toBeGreaterThanOrEqual(3);
    });

    test('very strong password', () => {
      const score = PasswordGenerator.calculateStrength('X9#kL2$mN8@pQ5!rT7%wE');
      expect(score).toBe(4);
    });

    test('empty password has zero strength', () => {
      const score = PasswordGenerator.calculateStrength('');
      expect(score).toBe(0);
    });

    test('returns a number', () => {
      const score = PasswordGenerator.calculateStrength('test');
      expect(typeof score).toBe('number');
    });
  });

  describe('getStrengthInfo()', () => {
    test('returns label and color for each strength level', () => {
      for (let i = 0; i <= 4; i++) {
        const info = PasswordGenerator.getStrengthInfo(i);
        expect(info.label).toBeDefined();
        expect(info.color).toBeDefined();
        expect(info.width).toBeDefined();
      }
    });

    test('returns correct labels', () => {
      expect(PasswordGenerator.getStrengthInfo(0).label).toBe('Very Weak');
      expect(PasswordGenerator.getStrengthInfo(4).label).toBe('Very Strong');
    });
  });
});
