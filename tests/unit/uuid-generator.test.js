/**
 * Unit tests for UUID Generator
 */

// Load the UUID Generator module
require('../../src/js/uuid-generator.js');

describe('UUIDGenerator', () => {
  const UUIDGenerator = window.UUIDGenerator;

  // UUID v4 regex pattern
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  describe('generateV4()', () => {
    test('generates valid UUID v4 format', () => {
      const uuid = UUIDGenerator.generateV4();
      expect(uuid).toMatch(uuidV4Regex);
    });

    test('generates lowercase UUID', () => {
      const uuid = UUIDGenerator.generateV4();
      expect(uuid).toBe(uuid.toLowerCase());
    });

    test('generates unique UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 1000; i++) {
        uuids.add(UUIDGenerator.generateV4());
      }
      expect(uuids.size).toBe(1000);
    });

    test('UUID has correct length (36 chars with hyphens)', () => {
      const uuid = UUIDGenerator.generateV4();
      expect(uuid.length).toBe(36);
    });

    test('UUID has hyphens at correct positions', () => {
      const uuid = UUIDGenerator.generateV4();
      expect(uuid[8]).toBe('-');
      expect(uuid[13]).toBe('-');
      expect(uuid[18]).toBe('-');
      expect(uuid[23]).toBe('-');
    });

    test('version nibble is 4', () => {
      const uuid = UUIDGenerator.generateV4();
      expect(uuid[14]).toBe('4');
    });

    test('variant nibble is 8, 9, a, or b', () => {
      const uuid = UUIDGenerator.generateV4();
      expect(['8', '9', 'a', 'b']).toContain(uuid[19]);
    });
  });

  describe('generateBulk()', () => {
    test('generates correct number of UUIDs', () => {
      const uuids = UUIDGenerator.generateBulk(10);
      expect(uuids.length).toBe(10);
    });

    test('all generated UUIDs are valid', () => {
      const uuids = UUIDGenerator.generateBulk(50);
      uuids.forEach(uuid => {
        expect(uuid).toMatch(uuidV4Regex);
      });
    });

    test('all generated UUIDs are unique', () => {
      const uuids = UUIDGenerator.generateBulk(100);
      const unique = new Set(uuids);
      expect(unique.size).toBe(100);
    });
  });

  describe('validate()', () => {
    test('validates correct UUID v4', () => {
      const uuid = UUIDGenerator.generateV4();
      expect(UUIDGenerator.validate(uuid)).toBe(true);
    });

    test('validates uppercase UUID', () => {
      const uuid = UUIDGenerator.generateV4().toUpperCase();
      expect(UUIDGenerator.validate(uuid)).toBe(true);
    });

    test('rejects invalid format', () => {
      expect(UUIDGenerator.validate('not-a-uuid')).toBe(false);
      expect(UUIDGenerator.validate('12345')).toBe(false);
      expect(UUIDGenerator.validate('')).toBe(false);
    });

    test('rejects UUID with invalid characters', () => {
      const invalid = 'zzzzzzzz-zzzz-4zzz-8zzz-zzzzzzzzzzzz';
      expect(UUIDGenerator.validate(invalid)).toBe(false);
    });

    test('accepts common test UUIDs', () => {
      // Valid v4 UUID
      expect(UUIDGenerator.validate('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')).toBe(true);
    });
  });
});
