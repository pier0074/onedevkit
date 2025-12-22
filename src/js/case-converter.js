/**
 * OneDevKit - Case Converter
 * Convert text between different case styles
 */

(function() {
  'use strict';

  const CaseConverter = {
    currentCase: null,

    /**
     * Convert to UPPERCASE
     */
    toUpper(text) {
      return text.toUpperCase();
    },

    /**
     * Convert to lowercase
     */
    toLower(text) {
      return text.toLowerCase();
    },

    /**
     * Convert to Title Case
     */
    toTitle(text) {
      return text.toLowerCase().replace(/(?:^|\s|["'([{])\S/g, char => char.toUpperCase());
    },

    /**
     * Convert to Sentence case
     */
    toSentence(text) {
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, char => char.toUpperCase());
    },

    /**
     * Split text into words (handles spaces, hyphens, underscores, camelCase)
     */
    splitWords(text) {
      return text
        // Insert space before uppercase letters in camelCase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Replace separators with spaces
        .replace(/[-_.\s]+/g, ' ')
        // Split and filter empty
        .split(' ')
        .filter(word => word.length > 0);
    },

    /**
     * Convert to camelCase
     */
    toCamel(text) {
      const words = this.splitWords(text);
      return words.map((word, index) => {
        const lower = word.toLowerCase();
        return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join('');
    },

    /**
     * Convert to PascalCase
     */
    toPascal(text) {
      const words = this.splitWords(text);
      return words.map(word => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join('');
    },

    /**
     * Convert to snake_case
     */
    toSnake(text) {
      const words = this.splitWords(text);
      return words.map(word => word.toLowerCase()).join('_');
    },

    /**
     * Convert to kebab-case
     */
    toKebab(text) {
      const words = this.splitWords(text);
      return words.map(word => word.toLowerCase()).join('-');
    },

    /**
     * Convert to CONSTANT_CASE
     */
    toConstant(text) {
      const words = this.splitWords(text);
      return words.map(word => word.toUpperCase()).join('_');
    },

    /**
     * Convert to dot.case
     */
    toDot(text) {
      const words = this.splitWords(text);
      return words.map(word => word.toLowerCase()).join('.');
    },

    /**
     * Toggle case (swap upper/lower)
     */
    toToggle(text) {
      return text.split('').map(char => {
        if (char === char.toUpperCase()) {
          return char.toLowerCase();
        }
        return char.toUpperCase();
      }).join('');
    },

    /**
     * Alternating case (AbCdEf)
     */
    toAlternating(text) {
      let upper = true;
      return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
          const result = upper ? char.toUpperCase() : char.toLowerCase();
          upper = !upper;
          return result;
        }
        return char;
      }).join('');
    },

    /**
     * Convert text based on case type
     */
    convert(text, caseType) {
      if (!text) return '';

      const converters = {
        'upper': this.toUpper,
        'lower': this.toLower,
        'title': this.toTitle,
        'sentence': this.toSentence,
        'camel': this.toCamel,
        'pascal': this.toPascal,
        'snake': this.toSnake,
        'kebab': this.toKebab,
        'constant': this.toConstant,
        'dot': this.toDot,
        'toggle': this.toToggle,
        'alternating': this.toAlternating
      };

      const converter = converters[caseType];
      return converter ? converter.call(this, text) : text;
    },

    /**
     * Handle case button click
     */
    handleCaseClick(caseType) {
      this.currentCase = caseType;

      // Update button states
      document.querySelectorAll('.case-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.case === caseType);
      });

      // Convert text
      this.updateOutput();

      // Track analytics
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('case-converter', caseType);
      }
    },

    /**
     * Update output based on current input and case
     */
    updateOutput() {
      const input = document.getElementById('input-text');
      const output = document.getElementById('output-text');

      if (!input || !output || !this.currentCase) return;

      output.value = this.convert(input.value, this.currentCase);
    },

    /**
     * Copy output to clipboard
     */
    copy() {
      const output = document.getElementById('output-text');
      const copyBtn = document.getElementById('copy-output');

      if (!output || !output.value) return;

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(output.value, copyBtn);
        window.OneDevKit.Analytics.trackCopy('case-converter');
      }
    },

    /**
     * Swap input and output
     */
    swap() {
      const input = document.getElementById('input-text');
      const output = document.getElementById('output-text');

      if (!input || !output) return;

      const temp = input.value;
      input.value = output.value;
      output.value = temp;
    },

    /**
     * Clear all text
     */
    clear() {
      const input = document.getElementById('input-text');
      const output = document.getElementById('output-text');

      if (input) input.value = '';
      if (output) output.value = '';

      // Clear active state
      this.currentCase = null;
      document.querySelectorAll('.case-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      if (input) input.focus();
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      // Case buttons
      document.querySelectorAll('.case-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.handleCaseClick(btn.dataset.case);
        });
      });

      // Input text - update output on change
      const input = document.getElementById('input-text');
      if (input) {
        input.addEventListener('input', () => this.updateOutput());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-output');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Swap button
      const swapBtn = document.getElementById('swap-text');
      if (swapBtn) {
        swapBtn.addEventListener('click', () => this.swap());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-all');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }
    },

    /**
     * Initialize the tool
     */
    init() {
      this.bindEvents();
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CaseConverter.init());
  } else {
    CaseConverter.init();
  }

  // Export for testing
  window.CaseConverter = CaseConverter;

})();
