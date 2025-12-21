/**
 * Unit tests for JSON Formatter & Validator
 */

// Load the JSON Formatter module
require('../../src/js/json-formatter.js');

describe('JSONFormatter', () => {
  const JSONFormatter = window.JSONFormatter;

  describe('format()', () => {
    test('formats simple JSON object', () => {
      const input = '{"name":"test","value":123}';
      const result = JSONFormatter.format(input, 2);
      expect(result).toBe('{\n  "name": "test",\n  "value": 123\n}');
    });

    test('formats with custom indentation', () => {
      const input = '{"a":1}';
      const result4 = JSONFormatter.format(input, 4);
      expect(result4).toContain('    "a"');
    });

    test('formats nested objects', () => {
      const input = '{"outer":{"inner":"value"}}';
      const result = JSONFormatter.format(input, 2);
      expect(result).toContain('"outer"');
      expect(result).toContain('"inner"');
    });

    test('formats arrays', () => {
      const input = '{"arr":[1,2,3]}';
      const result = JSONFormatter.format(input, 2);
      expect(result).toContain('[\n');
      expect(result).toContain('1,');
    });

    test('throws on invalid JSON', () => {
      expect(() => JSONFormatter.format('{invalid}')).toThrow();
    });
  });

  describe('minify()', () => {
    test('minifies formatted JSON', () => {
      const input = '{\n  "name": "test",\n  "value": 123\n}';
      const result = JSONFormatter.minify(input);
      expect(result).toBe('{"name":"test","value":123}');
    });

    test('minifies already minified JSON', () => {
      const input = '{"a":1}';
      const result = JSONFormatter.minify(input);
      expect(result).toBe('{"a":1}');
    });

    test('throws on invalid JSON', () => {
      expect(() => JSONFormatter.minify('{invalid}')).toThrow();
    });
  });

  describe('validate()', () => {
    test('returns valid for correct JSON', () => {
      const result = JSONFormatter.validate('{"valid": true}');
      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    test('returns invalid for incorrect JSON', () => {
      const result = JSONFormatter.validate('{invalid}');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('returns error details for invalid JSON', () => {
      const result = JSONFormatter.validate('{"missing": }');
      expect(result.valid).toBe(false);
      expect(result.error.message).toBeTruthy();
    });

    test('validates empty object', () => {
      expect(JSONFormatter.validate('{}').valid).toBe(true);
    });

    test('validates empty array', () => {
      expect(JSONFormatter.validate('[]').valid).toBe(true);
    });

    test('validates null', () => {
      expect(JSONFormatter.validate('null').valid).toBe(true);
    });

    test('validates primitives', () => {
      expect(JSONFormatter.validate('"string"').valid).toBe(true);
      expect(JSONFormatter.validate('123').valid).toBe(true);
      expect(JSONFormatter.validate('true').valid).toBe(true);
      expect(JSONFormatter.validate('false').valid).toBe(true);
    });
  });

  describe('getStats()', () => {
    test('returns correct stats for object', () => {
      const input = '{"a": 1, "b": "string", "c": true, "d": null}';
      const stats = JSONFormatter.getStats(input);

      expect(stats.keys).toBe(4);
      expect(stats.numbers).toBe(1);
      expect(stats.strings).toBe(1);
      expect(stats.booleans).toBe(1);
      expect(stats.nulls).toBe(1);
    });

    test('calculates depth correctly', () => {
      const shallow = '{"a": 1}';
      const deep = '{"a": {"b": {"c": {"d": 1}}}}';

      expect(JSONFormatter.getStats(shallow).depth).toBe(1);
      expect(JSONFormatter.getStats(deep).depth).toBe(4);
    });

    test('counts arrays', () => {
      const input = '{"arr1": [1,2,3], "arr2": [4,5]}';
      const stats = JSONFormatter.getStats(input);
      expect(stats.arrays).toBe(2);
    });

    test('returns null for invalid JSON', () => {
      expect(JSONFormatter.getStats('{invalid}')).toBe(null);
    });
  });

  describe('highlight()', () => {
    test('highlights strings', () => {
      const result = JSONFormatter.highlight('"test"');
      expect(result).toContain('json-string');
    });

    test('highlights numbers', () => {
      const result = JSONFormatter.highlight('123');
      expect(result).toContain('json-number');
    });

    test('highlights booleans', () => {
      const result = JSONFormatter.highlight('true');
      expect(result).toContain('json-boolean');
    });

    test('highlights null', () => {
      const result = JSONFormatter.highlight('null');
      expect(result).toContain('json-null');
    });

    test('escapes HTML', () => {
      const result = JSONFormatter.highlight('"<script>"');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });
  });

  describe('roundtrip format/minify', () => {
    const testCases = [
      '{"simple": "object"}',
      '{"nested": {"deep": {"value": 1}}}',
      '{"array": [1, 2, 3]}',
      '{"mixed": [{"a": 1}, {"b": 2}]}',
      '{"unicode": "你好世界"}',
      '{"special": "line\\nbreak"}',
    ];

    testCases.forEach((input) => {
      test(`roundtrip preserves data: ${input.substring(0, 40)}`, () => {
        const formatted = JSONFormatter.format(input);
        const minified = JSONFormatter.minify(formatted);
        // Parse both to compare actual data
        expect(JSON.parse(minified)).toEqual(JSON.parse(input));
      });
    });
  });
});
