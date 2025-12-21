/**
 * @jest-environment jsdom
 */

describe('Diff Checker', () => {
  let DiffChecker;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <textarea id="text-original"></textarea>
      <textarea id="text-modified"></textarea>
      <div id="diff-result"></div>
      <div id="stat-additions">0</div>
      <div id="stat-deletions">0</div>
      <div id="stat-unchanged">0</div>
      <button id="compare-btn"></button>
      <button id="sample-diff"></button>
      <button id="clear-diff"></button>
      <button id="swap-texts"></button>
      <button class="diff-view-btn active" data-view="unified"></button>
      <button class="diff-view-btn" data-view="split"></button>
    `;

    // Load the module
    jest.resetModules();
    const module = require('../../src/js/diff-checker.js');
    DiffChecker = module.DiffChecker;
  });

  describe('LCS Algorithm', () => {
    test('finds longest common subsequence', () => {
      const checker = new DiffChecker();
      const lcs = checker.lcs(['a', 'b', 'c'], ['a', 'c']);

      expect(lcs).toEqual(['a', 'c']);
    });

    test('handles empty arrays', () => {
      const checker = new DiffChecker();
      const lcs = checker.lcs([], ['a', 'b']);

      expect(lcs).toEqual([]);
    });

    test('handles identical arrays', () => {
      const checker = new DiffChecker();
      const lcs = checker.lcs(['a', 'b', 'c'], ['a', 'b', 'c']);

      expect(lcs).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Diff Computation', () => {
    test('detects additions', () => {
      const checker = new DiffChecker();
      const diff = checker.computeDiff('line1', 'line1\nline2');

      expect(diff.additions).toBe(1);
      expect(diff.deletions).toBe(0);
      expect(diff.unchanged).toBe(1);
    });

    test('detects deletions', () => {
      const checker = new DiffChecker();
      const diff = checker.computeDiff('line1\nline2', 'line1');

      expect(diff.additions).toBe(0);
      expect(diff.deletions).toBe(1);
      expect(diff.unchanged).toBe(1);
    });

    test('detects modifications', () => {
      const checker = new DiffChecker();
      const diff = checker.computeDiff('line1\nline2', 'line1\nmodified');

      expect(diff.additions).toBe(1);
      expect(diff.deletions).toBe(1);
      expect(diff.unchanged).toBe(1);
    });

    test('handles identical texts', () => {
      const checker = new DiffChecker();
      const diff = checker.computeDiff('same\ntext', 'same\ntext');

      expect(diff.additions).toBe(0);
      expect(diff.deletions).toBe(0);
      expect(diff.unchanged).toBe(2);
    });

    test('handles empty texts', () => {
      const checker = new DiffChecker();
      const diff = checker.computeDiff('', '');

      expect(diff.additions).toBe(0);
      expect(diff.deletions).toBe(0);
      // Empty string split produces one empty element
      expect(diff.unchanged).toBe(1);
    });
  });

  describe('UI Updates', () => {
    test('compare updates stats', () => {
      const checker = new DiffChecker();
      document.getElementById('text-original').value = 'line1\nline2';
      document.getElementById('text-modified').value = 'line1\nmodified\nline3';
      checker.compare();

      expect(document.getElementById('stat-additions').textContent).toBe('2');
      expect(document.getElementById('stat-deletions').textContent).toBe('1');
      expect(document.getElementById('stat-unchanged').textContent).toBe('1');
    });

    test('compare renders unified view', () => {
      const checker = new DiffChecker();
      document.getElementById('text-original').value = 'old';
      document.getElementById('text-modified').value = 'new';
      checker.currentView = 'unified';
      checker.compare();

      const result = document.getElementById('diff-result');
      expect(result.innerHTML).toContain('diff-line');
    });

    test('swap exchanges texts', () => {
      const checker = new DiffChecker();
      document.getElementById('text-original').value = 'original';
      document.getElementById('text-modified').value = 'modified';
      checker.swap();

      expect(document.getElementById('text-original').value).toBe('modified');
      expect(document.getElementById('text-modified').value).toBe('original');
    });

    test('clear resets everything', () => {
      const checker = new DiffChecker();
      document.getElementById('text-original').value = 'text';
      document.getElementById('text-modified').value = 'text';
      checker.compare();

      checker.clear();

      expect(document.getElementById('text-original').value).toBe('');
      expect(document.getElementById('text-modified').value).toBe('');
      expect(document.getElementById('stat-additions').textContent).toBe('0');
      expect(document.getElementById('stat-deletions').textContent).toBe('0');
    });
  });

  describe('Sample Loading', () => {
    test('load sample populates both fields', () => {
      const checker = new DiffChecker();
      checker.loadSample();

      expect(document.getElementById('text-original').value).not.toBe('');
      expect(document.getElementById('text-modified').value).not.toBe('');
    });
  });

  describe('HTML Escaping', () => {
    test('escapes HTML in diff output', () => {
      const checker = new DiffChecker();
      const escaped = checker.escapeHtml('<script>alert("xss")</script>');

      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
    });
  });

  describe('View Modes', () => {
    test('unified view shows single column', () => {
      const checker = new DiffChecker();
      document.getElementById('text-original').value = 'line1';
      document.getElementById('text-modified').value = 'line2';
      checker.currentView = 'unified';
      checker.compare();

      const result = document.getElementById('diff-result');
      expect(result.innerHTML).not.toContain('diff-side-by-side');
    });

    test('split view shows two columns', () => {
      const checker = new DiffChecker();
      document.getElementById('text-original').value = 'line1';
      document.getElementById('text-modified').value = 'line2';
      checker.currentView = 'split';
      checker.compare();

      const result = document.getElementById('diff-result');
      expect(result.innerHTML).toContain('diff-side-by-side');
    });
  });
});
