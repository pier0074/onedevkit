/**
 * Regex Tester Tool
 * Test and debug regular expressions with real-time matching
 */

class RegexTester {
  constructor() {
    this.patternInput = document.getElementById('regex-pattern');
    this.flagsInput = document.getElementById('regex-flags-input');
    this.testStringInput = document.getElementById('test-string');
    this.highlightedOutput = document.getElementById('highlighted-output');
    this.matchesInfo = document.getElementById('matches-info');
    this.errorDisplay = document.getElementById('regex-error');
    this.matchCount = document.getElementById('match-count');
    this.groupCount = document.getElementById('group-count');
    this.execTime = document.getElementById('exec-time');

    this.flagCheckboxes = {
      g: document.getElementById('flag-g'),
      i: document.getElementById('flag-i'),
      m: document.getElementById('flag-m'),
      s: document.getElementById('flag-s'),
      u: document.getElementById('flag-u')
    };

    this.init();
  }

  init() {
    // Real-time testing
    this.patternInput.addEventListener('input', () => this.runTest());
    this.testStringInput.addEventListener('input', () => this.runTest());
    this.flagsInput.addEventListener('input', () => this.syncFlagsFromInput());

    // Flag checkboxes
    Object.entries(this.flagCheckboxes).forEach(([flag, checkbox]) => {
      checkbox.addEventListener('change', () => this.syncFlagsToInput());
    });

    // Buttons
    document.getElementById('sample-regex').addEventListener('click', () => this.loadSample());
    document.getElementById('clear-regex').addEventListener('click', () => this.clear());
  }

  getFlags() {
    return this.flagsInput.value.trim();
  }

  syncFlagsFromInput() {
    const flags = this.getFlags();
    Object.entries(this.flagCheckboxes).forEach(([flag, checkbox]) => {
      checkbox.checked = flags.includes(flag);
    });
    this.runTest();
  }

  syncFlagsToInput() {
    let flags = '';
    Object.entries(this.flagCheckboxes).forEach(([flag, checkbox]) => {
      if (checkbox.checked) flags += flag;
    });
    this.flagsInput.value = flags;
    this.runTest();
  }

  runTest() {
    const pattern = this.patternInput.value;
    const testString = this.testStringInput.value;
    const flags = this.getFlags();

    // Clear previous results
    this.hideError();

    if (!pattern) {
      this.resetOutput();
      return;
    }

    try {
      const startTime = performance.now();
      const regex = new RegExp(pattern, flags);
      const matches = this.findAllMatches(regex, testString);
      const endTime = performance.now();

      this.updateStats(matches, regex, endTime - startTime);
      this.highlightMatches(testString, matches);
      this.displayMatchDetails(matches);
    } catch (error) {
      this.showError(error.message);
      this.resetOutput();
    }
  }

  findAllMatches(regex, text) {
    const matches = [];

    if (!text) return matches;

    if (regex.global) {
      let match;
      let lastIndex = -1;

      while ((match = regex.exec(text)) !== null) {
        // Prevent infinite loops on zero-length matches
        if (match.index === lastIndex) {
          regex.lastIndex++;
          continue;
        }
        lastIndex = match.index;

        matches.push({
          value: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1),
          namedGroups: match.groups || {}
        });

        // Safety limit
        if (matches.length >= 1000) break;
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          value: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1),
          namedGroups: match.groups || {}
        });
      }
    }

    return matches;
  }

  updateStats(matches, regex, time) {
    this.matchCount.textContent = matches.length;

    // Count capture groups from the regex
    const groupCount = this.countGroups(regex);
    this.groupCount.textContent = groupCount;

    this.execTime.textContent = time < 1 ? '<1ms' : `${Math.round(time)}ms`;
  }

  countGroups(regex) {
    // Count capturing groups by counting unescaped (
    const source = regex.source;
    let count = 0;
    let i = 0;

    while (i < source.length) {
      if (source[i] === '\\') {
        i += 2; // Skip escaped character
        continue;
      }
      if (source[i] === '(' && source[i + 1] !== '?') {
        count++;
      } else if (source[i] === '(' && source.substring(i, i + 3) === '(?<') {
        count++; // Named group
      } else if (source[i] === '(' && source.substring(i, i + 3) === '(?:') {
        // Non-capturing group, don't count
      }
      i++;
    }

    return count;
  }

  highlightMatches(text, matches) {
    if (!text) {
      this.highlightedOutput.innerHTML = '<span style="color: var(--text-muted);">Enter a pattern and test string to see matches highlighted.</span>';
      return;
    }

    if (matches.length === 0) {
      this.highlightedOutput.textContent = text;
      return;
    }

    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    let result = '';
    let lastIndex = 0;

    sortedMatches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        result += this.escapeHtml(text.substring(lastIndex, match.index));
      }

      // Add highlighted match
      const className = i % 2 === 0 ? 'match-highlight' : 'match-highlight';
      result += `<span class="${className}">${this.escapeHtml(match.value)}</span>`;

      lastIndex = match.index + match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result += this.escapeHtml(text.substring(lastIndex));
    }

    this.highlightedOutput.innerHTML = result;
  }

  displayMatchDetails(matches) {
    if (matches.length === 0) {
      this.matchesInfo.innerHTML = '<p style="color: var(--text-muted); font-size: var(--text-sm);">No matches found.</p>';
      return;
    }

    const html = matches.map((match, i) => {
      let groupsHtml = '';

      // Display indexed groups
      if (match.groups.length > 0) {
        groupsHtml = '<div class="match-groups">';
        match.groups.forEach((group, gi) => {
          groupsHtml += `
            <div class="match-group">
              <span class="match-group-name">Group ${gi + 1}:</span>
              <span class="match-group-value">${group !== undefined ? this.escapeHtml(group) : '(undefined)'}</span>
            </div>
          `;
        });
        groupsHtml += '</div>';
      }

      // Display named groups
      const namedGroupEntries = Object.entries(match.namedGroups);
      if (namedGroupEntries.length > 0) {
        if (!groupsHtml) groupsHtml = '<div class="match-groups">';
        else groupsHtml = groupsHtml.replace('</div>', '');

        namedGroupEntries.forEach(([name, value]) => {
          groupsHtml += `
            <div class="match-group">
              <span class="match-group-name">${this.escapeHtml(name)}:</span>
              <span class="match-group-value">${value !== undefined ? this.escapeHtml(value) : '(undefined)'}</span>
            </div>
          `;
        });
        groupsHtml += '</div>';
      }

      return `
        <div class="match-card">
          <div class="match-card-header">
            <span class="match-index">Match ${i + 1}</span>
            <span class="match-position">Index: ${match.index} - ${match.index + match.length}</span>
          </div>
          <div class="match-value">${this.escapeHtml(match.value)}</div>
          ${groupsHtml}
        </div>
      `;
    }).join('');

    this.matchesInfo.innerHTML = html;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    this.errorDisplay.textContent = `Error: ${message}`;
    this.errorDisplay.classList.remove('hidden');
  }

  hideError() {
    this.errorDisplay.classList.add('hidden');
  }

  resetOutput() {
    this.matchCount.textContent = '0';
    this.groupCount.textContent = '0';
    this.execTime.textContent = '0ms';
    this.highlightedOutput.innerHTML = '<span style="color: var(--text-muted);">Enter a pattern and test string to see matches highlighted.</span>';
    this.matchesInfo.innerHTML = '<p style="color: var(--text-muted); font-size: var(--text-sm);">Match details will appear here.</p>';
  }

  loadSample() {
    this.patternInput.value = '(?<protocol>https?):\\/\\/(?<domain>[\\w.-]+)(?<path>\\/[\\w./-]*)?';
    this.flagsInput.value = 'gi';
    this.syncFlagsFromInput();
    this.testStringInput.value = `Here are some URLs to match:
https://www.example.com/path/to/page
http://api.github.com/users
https://onedevkit.com/tools/regex-tester/
ftp://not-a-match.com (won't match - wrong protocol)
https://sub.domain.example.org/file.html`;
    this.runTest();
  }

  clear() {
    this.patternInput.value = '';
    this.flagsInput.value = 'g';
    this.syncFlagsFromInput();
    this.testStringInput.value = '';
    this.hideError();
    this.resetOutput();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new RegexTester();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RegexTester };
}
