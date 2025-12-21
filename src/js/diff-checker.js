/**
 * Diff Checker Tool
 * Compare two texts and highlight differences
 */

class DiffChecker {
  constructor() {
    this.originalText = document.getElementById('text-original');
    this.modifiedText = document.getElementById('text-modified');
    this.diffResult = document.getElementById('diff-result');
    this.statAdditions = document.getElementById('stat-additions');
    this.statDeletions = document.getElementById('stat-deletions');
    this.statUnchanged = document.getElementById('stat-unchanged');

    this.currentView = 'unified';

    this.init();
  }

  init() {
    // Compare button
    document.getElementById('compare-btn').addEventListener('click', () => this.compare());

    // Sample button
    document.getElementById('sample-diff').addEventListener('click', () => this.loadSample());

    // Clear button
    document.getElementById('clear-diff').addEventListener('click', () => this.clear());

    // Swap button
    document.getElementById('swap-texts').addEventListener('click', () => this.swap());

    // View toggle
    document.querySelectorAll('.diff-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentView = btn.dataset.view;
        this.compare();
      });
    });

    // Auto-compare on input (debounced)
    let timeout;
    [this.originalText, this.modifiedText].forEach(textarea => {
      textarea.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => this.compare(), 300);
      });
    });
  }

  compare() {
    const original = this.originalText.value;
    const modified = this.modifiedText.value;

    if (!original && !modified) {
      this.diffResult.innerHTML = '<div class="diff-empty">Enter text in both fields and click Compare to see differences.</div>';
      this.updateStats(0, 0, 0);
      return;
    }

    const diff = this.computeDiff(original, modified);
    this.updateStats(diff.additions, diff.deletions, diff.unchanged);

    if (this.currentView === 'unified') {
      this.renderUnified(diff.lines);
    } else {
      this.renderSideBySide(diff.lines);
    }
  }

  computeDiff(original, modified) {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');

    // Compute LCS (Longest Common Subsequence)
    const lcs = this.lcs(originalLines, modifiedLines);

    const lines = [];
    let oi = 0, mi = 0, li = 0;
    let additions = 0, deletions = 0, unchanged = 0;

    while (oi < originalLines.length || mi < modifiedLines.length) {
      if (li < lcs.length && oi < originalLines.length && originalLines[oi] === lcs[li] &&
          mi < modifiedLines.length && modifiedLines[mi] === lcs[li]) {
        // Unchanged line
        lines.push({
          type: 'unchanged',
          content: originalLines[oi],
          originalLine: oi + 1,
          modifiedLine: mi + 1
        });
        unchanged++;
        oi++;
        mi++;
        li++;
      } else if (mi < modifiedLines.length && (li >= lcs.length || modifiedLines[mi] !== lcs[li])) {
        // Addition
        lines.push({
          type: 'addition',
          content: modifiedLines[mi],
          originalLine: null,
          modifiedLine: mi + 1
        });
        additions++;
        mi++;
      } else if (oi < originalLines.length && (li >= lcs.length || originalLines[oi] !== lcs[li])) {
        // Deletion
        lines.push({
          type: 'deletion',
          content: originalLines[oi],
          originalLine: oi + 1,
          modifiedLine: null
        });
        deletions++;
        oi++;
      }
    }

    return { lines, additions, deletions, unchanged };
  }

  lcs(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find LCS
    const result = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        result.unshift(a[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return result;
  }

  renderUnified(lines) {
    if (lines.length === 0) {
      this.diffResult.innerHTML = '<div class="diff-empty">No differences found - texts are identical.</div>';
      return;
    }

    const html = lines.map(line => {
      const prefix = line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' ';
      const lineNum = line.type === 'deletion' ? line.originalLine : line.modifiedLine;

      return `
        <div class="diff-line ${line.type}">
          <div class="diff-line-number">${lineNum || ''}</div>
          <div class="diff-line-content">${prefix} ${this.escapeHtml(line.content)}</div>
        </div>
      `;
    }).join('');

    this.diffResult.innerHTML = html;
  }

  renderSideBySide(lines) {
    if (lines.length === 0) {
      this.diffResult.innerHTML = '<div class="diff-empty">No differences found - texts are identical.</div>';
      return;
    }

    const leftLines = [];
    const rightLines = [];

    lines.forEach(line => {
      if (line.type === 'unchanged') {
        leftLines.push({ ...line, side: 'left' });
        rightLines.push({ ...line, side: 'right' });
      } else if (line.type === 'deletion') {
        leftLines.push({ ...line, side: 'left' });
        rightLines.push({ type: 'empty', content: '', side: 'right' });
      } else if (line.type === 'addition') {
        leftLines.push({ type: 'empty', content: '', side: 'left' });
        rightLines.push({ ...line, side: 'right' });
      }
    });

    const renderSide = (sideLines, header) => {
      const linesHtml = sideLines.map(line => {
        const lineNum = line.type === 'deletion' ? line.originalLine :
                        line.type === 'addition' ? line.modifiedLine :
                        line.type === 'unchanged' ? (line.side === 'left' ? line.originalLine : line.modifiedLine) : '';

        return `
          <div class="diff-line ${line.type === 'empty' ? '' : line.type}">
            <div class="diff-line-number">${lineNum}</div>
            <div class="diff-line-content">${this.escapeHtml(line.content)}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="diff-side">
          <div class="diff-side-header">${header}</div>
          ${linesHtml}
        </div>
      `;
    };

    this.diffResult.innerHTML = `
      <div class="diff-side-by-side">
        ${renderSide(leftLines, 'Original')}
        ${renderSide(rightLines, 'Modified')}
      </div>
    `;
  }

  updateStats(additions, deletions, unchanged) {
    this.statAdditions.textContent = additions;
    this.statDeletions.textContent = deletions;
    this.statUnchanged.textContent = unchanged;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  loadSample() {
    this.originalText.value = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const users = ["Alice", "Bob"];
users.forEach(greet);`;

    this.modifiedText.value = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return true;
}

const users = ["Alice", "Bob", "Charlie"];
users.forEach(user => greet(user));
console.log("Done!");`;

    this.compare();
  }

  swap() {
    const temp = this.originalText.value;
    this.originalText.value = this.modifiedText.value;
    this.modifiedText.value = temp;
    this.compare();
  }

  clear() {
    this.originalText.value = '';
    this.modifiedText.value = '';
    this.diffResult.innerHTML = '<div class="diff-empty">Enter text in both fields and click Compare to see differences.</div>';
    this.updateStats(0, 0, 0);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DiffChecker();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiffChecker };
}
