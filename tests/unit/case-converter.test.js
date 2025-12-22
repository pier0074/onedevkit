/**
 * Case Converter Unit Tests
 */

// Mock DOM elements
document.body.innerHTML = `
  <textarea id="input-text"></textarea>
  <textarea id="output-text"></textarea>
  <button class="case-btn" data-case="upper">UPPERCASE</button>
  <button class="case-btn" data-case="lower">lowercase</button>
  <button class="case-btn" data-case="title">Title Case</button>
  <button class="case-btn" data-case="sentence">Sentence case</button>
  <button class="case-btn" data-case="camel">camelCase</button>
  <button class="case-btn" data-case="pascal">PascalCase</button>
  <button class="case-btn" data-case="snake">snake_case</button>
  <button class="case-btn" data-case="kebab">kebab-case</button>
  <button class="case-btn" data-case="constant">CONSTANT_CASE</button>
  <button class="case-btn" data-case="dot">dot.case</button>
  <button class="case-btn" data-case="toggle">tOGGLE</button>
  <button class="case-btn" data-case="alternating">AlTeRnAtInG</button>
  <button id="copy-output"></button>
  <button id="swap-text"></button>
  <button id="load-sample"></button>
  <button id="clear-all"></button>
`;

// Load the module
require('../../src/js/case-converter.js');

describe('CaseConverter', () => {
  describe('toUpper', () => {
    test('converts to uppercase', () => {
      expect(CaseConverter.toUpper('hello world')).toBe('HELLO WORLD');
      expect(CaseConverter.toUpper('Hello')).toBe('HELLO');
      expect(CaseConverter.toUpper('ALREADY UPPER')).toBe('ALREADY UPPER');
    });
  });

  describe('toLower', () => {
    test('converts to lowercase', () => {
      expect(CaseConverter.toLower('HELLO WORLD')).toBe('hello world');
      expect(CaseConverter.toLower('Hello')).toBe('hello');
      expect(CaseConverter.toLower('already lower')).toBe('already lower');
    });
  });

  describe('toTitle', () => {
    test('converts to title case', () => {
      expect(CaseConverter.toTitle('hello world')).toBe('Hello World');
      expect(CaseConverter.toTitle('HELLO WORLD')).toBe('Hello World');
    });

    test('handles punctuation', () => {
      expect(CaseConverter.toTitle('hello, world!')).toBe('Hello, World!');
    });
  });

  describe('toSentence', () => {
    test('converts to sentence case', () => {
      expect(CaseConverter.toSentence('hello world. another sentence.')).toBe('Hello world. Another sentence.');
      expect(CaseConverter.toSentence('HELLO WORLD')).toBe('Hello world');
    });

    test('handles different punctuation', () => {
      expect(CaseConverter.toSentence('hello! how are you?')).toBe('Hello! How are you?');
    });
  });

  describe('splitWords', () => {
    test('splits by spaces', () => {
      expect(CaseConverter.splitWords('hello world')).toEqual(['hello', 'world']);
    });

    test('splits camelCase', () => {
      expect(CaseConverter.splitWords('helloWorld')).toEqual(['hello', 'World']);
    });

    test('splits snake_case', () => {
      expect(CaseConverter.splitWords('hello_world')).toEqual(['hello', 'world']);
    });

    test('splits kebab-case', () => {
      expect(CaseConverter.splitWords('hello-world')).toEqual(['hello', 'world']);
    });
  });

  describe('toCamel', () => {
    test('converts to camelCase', () => {
      expect(CaseConverter.toCamel('hello world')).toBe('helloWorld');
      expect(CaseConverter.toCamel('Hello World')).toBe('helloWorld');
      expect(CaseConverter.toCamel('HELLO WORLD')).toBe('helloWorld');
    });

    test('handles various inputs', () => {
      expect(CaseConverter.toCamel('hello_world')).toBe('helloWorld');
      expect(CaseConverter.toCamel('hello-world')).toBe('helloWorld');
    });
  });

  describe('toPascal', () => {
    test('converts to PascalCase', () => {
      expect(CaseConverter.toPascal('hello world')).toBe('HelloWorld');
      expect(CaseConverter.toPascal('hello_world')).toBe('HelloWorld');
      expect(CaseConverter.toPascal('hello-world')).toBe('HelloWorld');
    });
  });

  describe('toSnake', () => {
    test('converts to snake_case', () => {
      expect(CaseConverter.toSnake('hello world')).toBe('hello_world');
      expect(CaseConverter.toSnake('Hello World')).toBe('hello_world');
      expect(CaseConverter.toSnake('helloWorld')).toBe('hello_world');
    });
  });

  describe('toKebab', () => {
    test('converts to kebab-case', () => {
      expect(CaseConverter.toKebab('hello world')).toBe('hello-world');
      expect(CaseConverter.toKebab('Hello World')).toBe('hello-world');
      expect(CaseConverter.toKebab('helloWorld')).toBe('hello-world');
    });
  });

  describe('toConstant', () => {
    test('converts to CONSTANT_CASE', () => {
      expect(CaseConverter.toConstant('hello world')).toBe('HELLO_WORLD');
      expect(CaseConverter.toConstant('helloWorld')).toBe('HELLO_WORLD');
    });
  });

  describe('toDot', () => {
    test('converts to dot.case', () => {
      expect(CaseConverter.toDot('hello world')).toBe('hello.world');
      expect(CaseConverter.toDot('Hello World')).toBe('hello.world');
    });
  });

  describe('toToggle', () => {
    test('toggles case of each character', () => {
      expect(CaseConverter.toToggle('Hello World')).toBe('hELLO wORLD');
      expect(CaseConverter.toToggle('hello')).toBe('HELLO');
      expect(CaseConverter.toToggle('HELLO')).toBe('hello');
    });
  });

  describe('toAlternating', () => {
    test('alternates case of each letter', () => {
      const result = CaseConverter.toAlternating('hello');
      expect(result).toBe('HeLlO');
    });

    test('skips non-letters', () => {
      const result = CaseConverter.toAlternating('a1b2c');
      expect(result).toBe('A1b2C');
    });
  });

  describe('convert', () => {
    test('returns empty string for empty input', () => {
      expect(CaseConverter.convert('', 'upper')).toBe('');
    });

    test('returns original for unknown case type', () => {
      expect(CaseConverter.convert('hello', 'unknown')).toBe('hello');
    });

    test('converts using specified case type', () => {
      expect(CaseConverter.convert('hello world', 'upper')).toBe('HELLO WORLD');
      expect(CaseConverter.convert('HELLO WORLD', 'lower')).toBe('hello world');
      expect(CaseConverter.convert('hello world', 'camel')).toBe('helloWorld');
    });
  });

  describe('getSampleText', () => {
    test('returns sample text', () => {
      const sample = CaseConverter.getSampleText();
      expect(typeof sample).toBe('string');
      expect(sample.length).toBeGreaterThan(10);
    });
  });

  describe('loadSample', () => {
    test('loads sample text into input', () => {
      const input = document.getElementById('input-text');
      input.value = '';
      CaseConverter.currentCase = null;

      CaseConverter.loadSample();

      expect(input.value).toBe(CaseConverter.getSampleText());
    });

    test('auto-selects title case when no case selected', () => {
      CaseConverter.currentCase = null;

      CaseConverter.loadSample();

      expect(CaseConverter.currentCase).toBe('title');
    });
  });
});
