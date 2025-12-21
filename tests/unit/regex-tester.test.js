/**
 * @jest-environment jsdom
 */

describe('Regex Tester', () => {
  let RegexTester;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <input type="text" id="regex-pattern">
      <input type="text" id="regex-flags-input" value="g">
      <textarea id="test-string"></textarea>
      <div id="highlighted-output"></div>
      <div id="matches-info"></div>
      <div id="regex-error" class="hidden"></div>
      <div id="match-count">0</div>
      <div id="group-count">0</div>
      <div id="exec-time">0ms</div>
      <input type="checkbox" id="flag-g" checked>
      <input type="checkbox" id="flag-i">
      <input type="checkbox" id="flag-m">
      <input type="checkbox" id="flag-s">
      <input type="checkbox" id="flag-u">
      <button id="sample-regex"></button>
      <button id="clear-regex"></button>
    `;

    // Load the module
    jest.resetModules();
    const module = require('../../src/js/regex-tester.js');
    RegexTester = module.RegexTester;
  });

  describe('Pattern Matching', () => {
    test('finds simple pattern matches', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = '\\d+';
      document.getElementById('test-string').value = 'abc 123 def 456';
      tester.runTest();

      expect(document.getElementById('match-count').textContent).toBe('2');
    });

    test('handles global flag correctly', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = 'test';
      document.getElementById('regex-flags-input').value = 'g';
      document.getElementById('test-string').value = 'test test test';
      tester.runTest();

      expect(document.getElementById('match-count').textContent).toBe('3');
    });

    test('handles case insensitive flag', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = 'hello';
      document.getElementById('regex-flags-input').value = 'gi';
      document.getElementById('test-string').value = 'Hello HELLO hello';
      tester.runTest();

      expect(document.getElementById('match-count').textContent).toBe('3');
    });

    test('handles no matches', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = 'xyz';
      document.getElementById('test-string').value = 'abc def';
      tester.runTest();

      expect(document.getElementById('match-count').textContent).toBe('0');
    });
  });

  describe('Capture Groups', () => {
    test('counts capture groups correctly', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = '(\\w+)@(\\w+)\\.(\\w+)';
      document.getElementById('test-string').value = 'test@example.com';
      tester.runTest();

      expect(document.getElementById('group-count').textContent).toBe('3');
    });

    test('handles named groups', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = '(?<user>\\w+)@(?<domain>\\w+)';
      document.getElementById('test-string').value = 'test@example';
      tester.runTest();

      expect(document.getElementById('group-count').textContent).toBe('2');
      expect(document.getElementById('matches-info').innerHTML).toContain('user');
      expect(document.getElementById('matches-info').innerHTML).toContain('domain');
    });
  });

  describe('Error Handling', () => {
    test('shows error for invalid regex', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = '[invalid';
      document.getElementById('test-string').value = 'test';
      tester.runTest();

      const errorEl = document.getElementById('regex-error');
      expect(errorEl.classList.contains('hidden')).toBe(false);
      expect(errorEl.textContent).toContain('Error');
    });

    test('hides error when pattern is valid', () => {
      const tester = new RegexTester();

      // First trigger an error
      document.getElementById('regex-pattern').value = '[invalid';
      tester.runTest();

      // Then fix the pattern
      document.getElementById('regex-pattern').value = 'valid';
      tester.runTest();

      const errorEl = document.getElementById('regex-error');
      expect(errorEl.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Highlighting', () => {
    test('highlights matches in output', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = 'test';
      document.getElementById('test-string').value = 'this is a test';
      tester.runTest();

      const output = document.getElementById('highlighted-output').innerHTML;
      expect(output).toContain('match-highlight');
      expect(output).toContain('test');
    });

    test('escapes HTML in test string', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = 'script';
      document.getElementById('test-string').value = '<script>alert("xss")</script>';
      tester.runTest();

      const output = document.getElementById('highlighted-output').innerHTML;
      expect(output).not.toContain('<script>');
      expect(output).toContain('&lt;');
    });
  });

  describe('Clear Functionality', () => {
    test('clear resets all fields', () => {
      const tester = new RegexTester();
      document.getElementById('regex-pattern').value = 'test';
      document.getElementById('test-string').value = 'test string';
      tester.runTest();

      tester.clear();

      expect(document.getElementById('regex-pattern').value).toBe('');
      expect(document.getElementById('test-string').value).toBe('');
      expect(document.getElementById('match-count').textContent).toBe('0');
    });
  });

  describe('Sample Loading', () => {
    test('load sample populates fields', () => {
      const tester = new RegexTester();
      tester.loadSample();

      expect(document.getElementById('regex-pattern').value).not.toBe('');
      expect(document.getElementById('test-string').value).not.toBe('');
      expect(parseInt(document.getElementById('match-count').textContent)).toBeGreaterThan(0);
    });
  });
});
