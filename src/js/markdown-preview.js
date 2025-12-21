/**
 * Markdown Preview Tool
 * Live Markdown editor with preview
 */

class MarkdownPreview {
  constructor() {
    this.input = document.getElementById('markdown-input');
    this.preview = document.getElementById('markdown-preview');
    this.charCount = document.getElementById('char-count');
    this.wordCount = document.getElementById('word-count');
    this.lineCount = document.getElementById('line-count');

    this.init();
  }

  init() {
    // Live preview
    this.input.addEventListener('input', () => this.update());

    // Sample button
    document.getElementById('sample-md').addEventListener('click', () => this.loadSample());

    // Copy HTML button
    document.getElementById('copy-html').addEventListener('click', () => this.copyHtml());

    // Clear button
    document.getElementById('clear-md').addEventListener('click', () => this.clear());

    // Initial render
    this.update();
  }

  update() {
    const markdown = this.input.value;
    const html = this.parse(markdown);
    this.preview.innerHTML = html;
    this.updateStats(markdown);
  }

  parse(markdown) {
    if (!markdown.trim()) {
      return '<p style="color: var(--text-muted);">Start typing to see the preview...</p>';
    }

    let html = markdown;

    // Escape HTML first (but preserve our markdown)
    html = this.escapeHtml(html);

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rules
    html = html.replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '<hr>');

    // Blockquotes (after HTML escape, > becomes &gt;)
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Images (before links to avoid conflict)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Task lists
    html = html.replace(/^- \[x\] (.+)$/gim, '<li class="task-list-item"><input type="checkbox" checked disabled> $1</li>');
    html = html.replace(/^- \[ \] (.+)$/gim, '<li class="task-list-item"><input type="checkbox" disabled> $1</li>');

    // Unordered lists
    html = html.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Wrap consecutive list items
    html = this.wrapLists(html);

    // Tables
    html = this.parseTables(html);

    // Paragraphs - wrap remaining text
    html = this.wrapParagraphs(html);

    return html;
  }

  wrapLists(html) {
    const lines = html.split('\n');
    const result = [];
    let inList = false;
    let listType = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isListItem = line.startsWith('<li');
      const isTaskItem = line.includes('task-list-item');

      if (isListItem && !inList) {
        inList = true;
        listType = isTaskItem ? 'ul class="task-list"' : 'ul';
        result.push(`<${listType}>`);
      } else if (!isListItem && inList) {
        inList = false;
        result.push('</ul>');
        listType = null;
      }

      result.push(line);
    }

    if (inList) {
      result.push('</ul>');
    }

    return result.join('\n');
  }

  parseTables(html) {
    const lines = html.split('\n');
    const result = [];
    let inTable = false;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line is a table row (starts and ends with |)
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
      } else {
        if (inTable) {
          result.push(this.renderTable(tableRows));
          inTable = false;
          tableRows = [];
        }
        result.push(lines[i]);
      }
    }

    if (inTable) {
      result.push(this.renderTable(tableRows));
    }

    return result.join('\n');
  }

  renderTable(rows) {
    if (rows.length < 2) return rows.join('\n');

    const parseRow = (row) => {
      return row.split('|').slice(1, -1).map(cell => cell.trim());
    };

    const headerCells = parseRow(rows[0]);
    const isAlignmentRow = rows[1] && /^\|[\s\-:|]+\|$/.test(rows[1]);

    let html = '<table><thead><tr>';
    headerCells.forEach(cell => {
      html += `<th>${cell}</th>`;
    });
    html += '</tr></thead><tbody>';

    const startRow = isAlignmentRow ? 2 : 1;
    for (let i = startRow; i < rows.length; i++) {
      const cells = parseRow(rows[i]);
      html += '<tr>';
      cells.forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    }

    html += '</tbody></table>';
    return html;
  }

  wrapParagraphs(html) {
    const lines = html.split('\n');
    const result = [];
    let paragraph = [];

    const isBlockElement = (line) => {
      const trimmed = line.trim();
      return trimmed.startsWith('<h') ||
             trimmed.startsWith('<ul') ||
             trimmed.startsWith('</ul') ||
             trimmed.startsWith('<ol') ||
             trimmed.startsWith('</ol') ||
             trimmed.startsWith('<li') ||
             trimmed.startsWith('<blockquote') ||
             trimmed.startsWith('</blockquote') ||
             trimmed.startsWith('<pre') ||
             trimmed.startsWith('</pre') ||
             trimmed.startsWith('<hr') ||
             trimmed.startsWith('<table') ||
             trimmed.startsWith('</table') ||
             trimmed === '';
    };

    const flushParagraph = () => {
      if (paragraph.length > 0) {
        result.push('<p>' + paragraph.join(' ') + '</p>');
        paragraph = [];
      }
    };

    for (const line of lines) {
      if (isBlockElement(line)) {
        flushParagraph();
        if (line.trim()) {
          result.push(line);
        }
      } else {
        paragraph.push(line);
      }
    }

    flushParagraph();

    return result.join('\n');
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  updateStats(text) {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;

    this.charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    this.wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    this.lineCount.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
  }

  loadSample() {
    this.input.value = `# Markdown Preview Demo

This is a **live preview** of your Markdown content. Edit the text on the left to see changes instantly!

## Text Formatting

You can write **bold text**, *italic text*, or ***both***. Use ~~strikethrough~~ for deleted content.

Inline \`code\` looks like this.

## Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

## Lists

### Unordered List
- First item
- Second item
- Third item

### Ordered List
1. Step one
2. Step two
3. Step three

### Task List
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

## Links and Images

Check out [OneDevKit](https://onedevkit.com) for more tools!

## Tables

| Feature | Supported |
|---------|-----------|
| Headers | Yes |
| Bold/Italic | Yes |
| Code Blocks | Yes |
| Tables | Yes |

---

*Made with ❤️ by OneDevKit*`;
    this.update();
  }

  copyHtml() {
    const html = this.preview.innerHTML;
    navigator.clipboard.writeText(html).then(() => {
      const btn = document.getElementById('copy-html');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    });
  }

  clear() {
    this.input.value = '';
    this.update();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MarkdownPreview();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MarkdownPreview };
}
