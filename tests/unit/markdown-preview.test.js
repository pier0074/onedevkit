/**
 * @jest-environment jsdom
 */

describe('Markdown Preview', () => {
  let MarkdownPreview;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <textarea id="markdown-input"></textarea>
      <div id="markdown-preview"></div>
      <span id="char-count">0 characters</span>
      <span id="word-count">0 words</span>
      <span id="line-count">0 lines</span>
      <button id="sample-md"></button>
      <button id="copy-html"></button>
      <button id="clear-md"></button>
    `;

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue()
      }
    });

    // Load the module
    jest.resetModules();
    const module = require('../../src/js/markdown-preview.js');
    MarkdownPreview = module.MarkdownPreview;
  });

  describe('Markdown Parsing', () => {
    test('parses headers', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('# Heading 1\n## Heading 2\n### Heading 3');

      expect(html).toContain('<h1>Heading 1</h1>');
      expect(html).toContain('<h2>Heading 2</h2>');
      expect(html).toContain('<h3>Heading 3</h3>');
    });

    test('parses bold text', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('**bold** and __also bold__');

      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<strong>also bold</strong>');
    });

    test('parses italic text', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('*italic* and _also italic_');

      expect(html).toContain('<em>italic</em>');
      expect(html).toContain('<em>also italic</em>');
    });

    test('parses bold italic text', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('***bold italic***');

      expect(html).toContain('<strong><em>bold italic</em></strong>');
    });

    test('parses strikethrough', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('~~deleted~~');

      expect(html).toContain('<del>deleted</del>');
    });

    test('parses inline code', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('Use `console.log()` for debugging');

      expect(html).toContain('<code>console.log()</code>');
    });

    test('parses code blocks', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('```javascript\nconst x = 1;\n```');

      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('const x = 1;');
    });

    test('parses links', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('[Click here](https://example.com)');

      expect(html).toContain('<a href="https://example.com"');
      expect(html).toContain('>Click here</a>');
    });

    test('parses images', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('![Alt text](image.jpg)');

      expect(html).toContain('<img src="image.jpg" alt="Alt text">');
    });

    test('parses unordered lists', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('- Item 1\n- Item 2\n- Item 3');

      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
      expect(html).toContain('<li>Item 3</li>');
      expect(html).toContain('</ul>');
    });

    test('parses blockquotes', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('> This is a quote');

      expect(html).toContain('<blockquote>');
      expect(html).toContain('This is a quote');
    });

    test('parses horizontal rules', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('---');

      expect(html).toContain('<hr>');
    });

    test('parses task lists', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('- [x] Completed\n- [ ] Incomplete');

      expect(html).toContain('task-list-item');
      expect(html).toContain('checked');
    });
  });

  describe('HTML Escaping', () => {
    test('escapes HTML tags', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('<script>alert("xss")</script>');

      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    test('escapes ampersands', () => {
      const preview = new MarkdownPreview();
      const escaped = preview.escapeHtml('Tom & Jerry');

      expect(escaped).toContain('&amp;');
    });
  });

  describe('Statistics', () => {
    test('counts characters', () => {
      const preview = new MarkdownPreview();
      preview.updateStats('Hello');

      expect(document.getElementById('char-count').textContent).toBe('5 characters');
    });

    test('counts words', () => {
      const preview = new MarkdownPreview();
      preview.updateStats('Hello world test');

      expect(document.getElementById('word-count').textContent).toBe('3 words');
    });

    test('counts lines', () => {
      const preview = new MarkdownPreview();
      preview.updateStats('Line 1\nLine 2\nLine 3');

      expect(document.getElementById('line-count').textContent).toBe('3 lines');
    });

    test('handles empty input', () => {
      const preview = new MarkdownPreview();
      preview.updateStats('');

      expect(document.getElementById('char-count').textContent).toBe('0 characters');
      expect(document.getElementById('word-count').textContent).toBe('0 words');
      expect(document.getElementById('line-count').textContent).toBe('1 line');
    });
  });

  describe('UI Functions', () => {
    test('update renders preview', () => {
      const preview = new MarkdownPreview();
      document.getElementById('markdown-input').value = '# Test';
      preview.update();

      expect(document.getElementById('markdown-preview').innerHTML).toContain('<h1>Test</h1>');
    });

    test('clear resets input and preview', () => {
      const preview = new MarkdownPreview();
      document.getElementById('markdown-input').value = '# Test';
      preview.update();

      preview.clear();

      expect(document.getElementById('markdown-input').value).toBe('');
    });

    test('loadSample populates input', () => {
      const preview = new MarkdownPreview();
      preview.loadSample();

      expect(document.getElementById('markdown-input').value).not.toBe('');
      expect(document.getElementById('markdown-preview').innerHTML).toContain('<h1>');
    });

    test('copyHtml copies to clipboard', async () => {
      const preview = new MarkdownPreview();
      document.getElementById('markdown-input').value = '**bold**';
      preview.update();

      await preview.copyHtml();

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  describe('Table Parsing', () => {
    test('parses simple tables', () => {
      const preview = new MarkdownPreview();
      const markdown = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1 | Cell 2 |';
      const html = preview.parse(markdown);

      expect(html).toContain('<table>');
      expect(html).toContain('<th>Header 1</th>');
      expect(html).toContain('<td>Cell 1</td>');
      expect(html).toContain('</table>');
    });
  });

  describe('Empty Content', () => {
    test('shows placeholder for empty input', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('');

      expect(html).toContain('Start typing');
    });

    test('shows placeholder for whitespace-only input', () => {
      const preview = new MarkdownPreview();
      const html = preview.parse('   \n  \n   ');

      expect(html).toContain('Start typing');
    });
  });
});
