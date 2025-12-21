/**
 * Unit tests for Unix Timestamp Converter
 */

// Mock DOM elements
document.getElementById = jest.fn(() => null);
document.querySelectorAll = jest.fn(() => []);

// Load the module
require('../../src/js/timestamp-converter.js');

describe('TimestampConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentTimestamp()', () => {
    test('returns current time in seconds', () => {
      const before = Math.floor(Date.now() / 1000);
      const result = window.TimestampConverter.getCurrentTimestamp();
      const after = Math.floor(Date.now() / 1000);

      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });

    test('returns integer', () => {
      const result = window.TimestampConverter.getCurrentTimestamp();
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('getCurrentTimestampMs()', () => {
    test('returns current time in milliseconds', () => {
      const before = Date.now();
      const result = window.TimestampConverter.getCurrentTimestampMs();
      const after = Date.now();

      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });

    test('returns integer', () => {
      const result = window.TimestampConverter.getCurrentTimestampMs();
      expect(Number.isInteger(result)).toBe(true);
    });

    test('is approximately 1000x larger than seconds', () => {
      const seconds = window.TimestampConverter.getCurrentTimestamp();
      const ms = window.TimestampConverter.getCurrentTimestampMs();

      expect(Math.floor(ms / 1000)).toBe(seconds);
    });
  });

  describe('timestampToDate()', () => {
    test('converts Unix timestamp in seconds', () => {
      // 2024-01-01 00:00:00 UTC
      const timestamp = 1704067200;
      const date = window.TimestampConverter.timestampToDate(timestamp);

      expect(date.getUTCFullYear()).toBe(2024);
      expect(date.getUTCMonth()).toBe(0); // January
      expect(date.getUTCDate()).toBe(1);
    });

    test('converts Unix timestamp in milliseconds', () => {
      // 2024-01-01 00:00:00 UTC in milliseconds
      const timestamp = 1704067200000;
      const date = window.TimestampConverter.timestampToDate(timestamp);

      expect(date.getUTCFullYear()).toBe(2024);
      expect(date.getUTCMonth()).toBe(0);
      expect(date.getUTCDate()).toBe(1);
    });

    test('auto-detects seconds vs milliseconds', () => {
      const seconds = 1704067200;
      const ms = 1704067200000;

      const dateFromSeconds = window.TimestampConverter.timestampToDate(seconds);
      const dateFromMs = window.TimestampConverter.timestampToDate(ms);

      expect(dateFromSeconds.getTime()).toBe(dateFromMs.getTime());
    });

    test('handles string input', () => {
      const timestamp = '1704067200';
      const date = window.TimestampConverter.timestampToDate(timestamp);

      expect(date.getUTCFullYear()).toBe(2024);
    });

    test('throws on invalid input', () => {
      expect(() => window.TimestampConverter.timestampToDate('invalid')).toThrow('Invalid timestamp');
    });

    test('handles zero timestamp (Unix epoch)', () => {
      const date = window.TimestampConverter.timestampToDate(0);

      expect(date.getUTCFullYear()).toBe(1970);
      expect(date.getUTCMonth()).toBe(0);
      expect(date.getUTCDate()).toBe(1);
    });
  });

  describe('dateToTimestamp()', () => {
    test('converts Date to Unix timestamp in seconds', () => {
      const date = new Date(Date.UTC(2024, 0, 1, 0, 0, 0));
      const timestamp = window.TimestampConverter.dateToTimestamp(date);

      expect(timestamp).toBe(1704067200);
    });

    test('returns integer', () => {
      const date = new Date();
      const timestamp = window.TimestampConverter.dateToTimestamp(date);

      expect(Number.isInteger(timestamp)).toBe(true);
    });

    test('handles Date at Unix epoch', () => {
      const date = new Date(0);
      const timestamp = window.TimestampConverter.dateToTimestamp(date);

      expect(timestamp).toBe(0);
    });
  });

  describe('dateToTimestampMs()', () => {
    test('converts Date to Unix timestamp in milliseconds', () => {
      const date = new Date(Date.UTC(2024, 0, 1, 0, 0, 0));
      const timestamp = window.TimestampConverter.dateToTimestampMs(date);

      expect(timestamp).toBe(1704067200000);
    });

    test('preserves milliseconds', () => {
      const date = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 123));
      const timestamp = window.TimestampConverter.dateToTimestampMs(date);

      expect(timestamp).toBe(1704067200123);
    });
  });

  describe('formatLocal()', () => {
    test('returns non-empty string', () => {
      const date = new Date();
      const result = window.TimestampConverter.formatLocal(date);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatUTC()', () => {
    test('returns UTC formatted string', () => {
      const date = new Date(Date.UTC(2024, 0, 1, 12, 30, 0));
      const result = window.TimestampConverter.formatUTC(date);

      expect(result).toContain('2024');
      expect(result).toContain('GMT');
    });
  });

  describe('formatISO()', () => {
    test('returns ISO 8601 formatted string', () => {
      const date = new Date(Date.UTC(2024, 0, 1, 12, 30, 0));
      const result = window.TimestampConverter.formatISO(date);

      expect(result).toBe('2024-01-01T12:30:00.000Z');
    });

    test('ends with Z for UTC', () => {
      const date = new Date();
      const result = window.TimestampConverter.formatISO(date);

      expect(result).toMatch(/Z$/);
    });
  });

  describe('getRelativeTime()', () => {
    test('returns "X seconds ago" for recent past', () => {
      const date = new Date(Date.now() - 30000); // 30 seconds ago
      const result = window.TimestampConverter.getRelativeTime(date);

      expect(result).toMatch(/\d+ seconds ago/);
    });

    test('returns "X minutes ago" for minutes past', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      const result = window.TimestampConverter.getRelativeTime(date);

      expect(result).toMatch(/\d+ minutes ago/);
    });

    test('returns "X hours ago" for hours past', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
      const result = window.TimestampConverter.getRelativeTime(date);

      expect(result).toMatch(/\d+ hours ago/);
    });

    test('returns "X days ago" for days past', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      const result = window.TimestampConverter.getRelativeTime(date);

      expect(result).toMatch(/\d+ days ago/);
    });

    test('returns "in X seconds" for near future', () => {
      const date = new Date(Date.now() + 30000); // 30 seconds from now
      const result = window.TimestampConverter.getRelativeTime(date);

      expect(result).toMatch(/in \d+ seconds/);
    });

    test('returns "in X hours" for hours future', () => {
      const date = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours from now
      const result = window.TimestampConverter.getRelativeTime(date);

      expect(result).toMatch(/in \d+ hours/);
    });
  });

  describe('roundtrip conversion', () => {
    test('timestamp -> date -> timestamp is consistent', () => {
      const original = 1704067200;
      const date = window.TimestampConverter.timestampToDate(original);
      const result = window.TimestampConverter.dateToTimestamp(date);

      expect(result).toBe(original);
    });

    test('current time roundtrip', () => {
      const now = window.TimestampConverter.getCurrentTimestamp();
      const date = window.TimestampConverter.timestampToDate(now);
      const result = window.TimestampConverter.dateToTimestamp(date);

      expect(result).toBe(now);
    });
  });
});
