/**
 * OneDevKit - JSON Formatter & Validator
 * Format, minify, and validate JSON with syntax highlighting
 */

(function() {
  'use strict';

  const JSONFormatter = {
    /**
     * Format/beautify JSON
     */
    format(json, indent = 2) {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, indent);
    },

    /**
     * Minify JSON
     */
    minify(json) {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed);
    },

    /**
     * Validate JSON and return detailed error info
     */
    validate(json) {
      try {
        JSON.parse(json);
        return { valid: true, error: null };
      } catch (e) {
        const errorInfo = this.parseError(e, json);
        return { valid: false, error: errorInfo };
      }
    },

    /**
     * Parse JSON error to extract line/column info
     */
    parseError(error, json) {
      const message = error.message;
      let line = 1;
      let column = 1;
      let position = null;

      // Try to extract position from error message
      // Chrome: "at position X"
      // Firefox: "at line X column Y"
      const posMatch = message.match(/at position (\d+)/);
      const lineColMatch = message.match(/at line (\d+) column (\d+)/);

      if (posMatch) {
        position = parseInt(posMatch[1], 10);
        // Convert position to line/column
        const lines = json.substring(0, position).split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      } else if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      }

      return {
        message: message,
        line: line,
        column: column,
        position: position
      };
    },

    /**
     * Syntax highlight JSON
     */
    highlight(json) {
      if (!json) return '';

      // Escape HTML first
      let escaped = json
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Apply syntax highlighting
      return escaped
        // Strings (must come first to avoid conflicts)
        .replace(/"([^"\\]|\\.)*"/g, (match) => {
          // Check if it's a key or value
          return `<span class="json-string">${match}</span>`;
        })
        // Numbers
        .replace(/\b(-?\d+\.?\d*([eE][+-]?\d+)?)\b/g, '<span class="json-number">$1</span>')
        // Booleans
        .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
        // Null
        .replace(/\bnull\b/g, '<span class="json-null">null</span>')
        // Keys (strings followed by colon)
        .replace(/<span class="json-string">("([^"\\]|\\.)*")<\/span>\s*:/g,
          '<span class="json-key">$1</span>:');
    },

    /**
     * Get JSON statistics
     */
    getStats(json) {
      try {
        const parsed = JSON.parse(json);
        const stats = {
          size: new Blob([json]).size,
          minifiedSize: new Blob([JSON.stringify(parsed)]).size,
          keys: 0,
          arrays: 0,
          objects: 0,
          strings: 0,
          numbers: 0,
          booleans: 0,
          nulls: 0,
          depth: 0
        };

        const analyze = (obj, depth = 0) => {
          stats.depth = Math.max(stats.depth, depth);

          if (obj === null) {
            stats.nulls++;
          } else if (Array.isArray(obj)) {
            stats.arrays++;
            obj.forEach(item => analyze(item, depth + 1));
          } else if (typeof obj === 'object') {
            stats.objects++;
            Object.keys(obj).forEach(key => {
              stats.keys++;
              analyze(obj[key], depth + 1);
            });
          } else if (typeof obj === 'string') {
            stats.strings++;
          } else if (typeof obj === 'number') {
            stats.numbers++;
          } else if (typeof obj === 'boolean') {
            stats.booleans++;
          }
        };

        analyze(parsed);
        return stats;
      } catch (e) {
        return null;
      }
    },

    /**
     * Sample JSON data
     */
    getSampleJSON() {
      return JSON.stringify({
        "name": "OneDevKit",
        "version": "1.0.0",
        "description": "Free online developer tools",
        "tools": [
          "JSON Formatter",
          "UUID Generator",
          "Password Generator",
          "Lorem Ipsum",
          "QR Code Generator"
        ],
        "features": {
          "free": true,
          "noSignup": true,
          "privacyFocused": true
        },
        "stats": {
          "users": 10000,
          "rating": 4.9
        },
        "lastUpdated": null
      }, null, 2);
    },

    /**
     * Initialize the tool
     */
    init() {
      this.inputEl = document.getElementById('json-input');
      this.outputEl = document.getElementById('json-output');
      this.highlightedEl = document.getElementById('json-highlighted');
      this.errorEl = document.getElementById('json-error');

      this.bindEvents();
    },

    bindEvents() {
      // Format button
      const formatBtn = document.getElementById('format-json');
      if (formatBtn) {
        formatBtn.addEventListener('click', () => this.formatJSON());
      }

      // Minify button
      const minifyBtn = document.getElementById('minify-json');
      if (minifyBtn) {
        minifyBtn.addEventListener('click', () => this.minifyJSON());
      }

      // Validate button
      const validateBtn = document.getElementById('validate-json');
      if (validateBtn) {
        validateBtn.addEventListener('click', () => this.validateJSON());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-json');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-json');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }

      // Sample button
      const sampleBtn = document.getElementById('sample-json');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => this.loadSample());
      }

      // Input change - live validation
      if (this.inputEl) {
        this.inputEl.addEventListener('input', () => {
          this.hideError();
          this.updateStats();
        });
      }

      // Indent selector
      const indentSelect = document.getElementById('json-indent');
      if (indentSelect) {
        indentSelect.addEventListener('change', () => {
          if (this.outputEl && this.outputEl.textContent) {
            this.formatJSON();
          }
        });
      }
    },

    getIndent() {
      const indentSelect = document.getElementById('json-indent');
      if (!indentSelect) return 2;

      const value = indentSelect.value;
      if (value === 'tab') return '\t';
      return parseInt(value, 10);
    },

    formatJSON() {
      const input = this.inputEl?.value?.trim();
      if (!input) {
        this.showError('Please enter JSON to format');
        return;
      }

      try {
        const indent = this.getIndent();
        const formatted = this.format(input, indent);
        this.showOutput(formatted);
        this.hideError();
        this.updateStats();
        this.trackUsage('format');
      } catch (e) {
        const validation = this.validate(input);
        this.showError(validation.error);
      }
    },

    minifyJSON() {
      const input = this.inputEl?.value?.trim();
      if (!input) {
        this.showError('Please enter JSON to minify');
        return;
      }

      try {
        const minified = this.minify(input);
        this.showOutput(minified);
        this.hideError();
        this.updateStats();
        this.trackUsage('minify');
      } catch (e) {
        const validation = this.validate(input);
        this.showError(validation.error);
      }
    },

    validateJSON() {
      const input = this.inputEl?.value?.trim();
      if (!input) {
        this.showError('Please enter JSON to validate');
        return;
      }

      const result = this.validate(input);

      if (result.valid) {
        this.showSuccess('Valid JSON!');
        this.hideError();
        this.trackUsage('validate');
      } else {
        this.showError(result.error);
      }
    },

    showOutput(json) {
      if (this.outputEl) {
        this.outputEl.textContent = json;
        this.outputEl.classList.remove('tool-output-placeholder');
      }

      if (this.highlightedEl) {
        this.highlightedEl.innerHTML = this.highlight(json);
        this.highlightedEl.classList.remove('hidden');
        if (this.outputEl) {
          this.outputEl.classList.add('hidden');
        }
      }
    },

    showError(error) {
      if (!this.errorEl) return;

      let message = '';
      if (typeof error === 'string') {
        message = error;
      } else if (error && error.message) {
        message = `Error at line ${error.line}, column ${error.column}: ${error.message}`;
      }

      this.errorEl.textContent = message;
      this.errorEl.classList.remove('hidden');
      this.errorEl.classList.add('visible');

      // Highlight error line in input
      this.highlightErrorLine(error);
    },

    hideError() {
      if (this.errorEl) {
        this.errorEl.classList.add('hidden');
        this.errorEl.classList.remove('visible');
      }
    },

    showSuccess(message) {
      if (window.OneDevKit && window.OneDevKit.Toast) {
        window.OneDevKit.Toast.show(message, 'success');
      } else {
        alert(message);
      }
    },

    highlightErrorLine(error) {
      if (!error || !error.line || !this.inputEl) return;

      const lines = this.inputEl.value.split('\n');
      let position = 0;

      for (let i = 0; i < error.line - 1; i++) {
        position += lines[i].length + 1; // +1 for newline
      }

      // Set selection to error line
      const lineStart = position;
      const lineEnd = position + (lines[error.line - 1]?.length || 0);

      this.inputEl.focus();
      this.inputEl.setSelectionRange(lineStart, lineEnd);
    },

    updateStats() {
      const input = this.inputEl?.value?.trim();
      const stats = input ? this.getStats(input) : null;

      const sizeEl = document.getElementById('json-size');
      const keysEl = document.getElementById('json-keys');
      const depthEl = document.getElementById('json-depth');

      if (stats) {
        if (sizeEl) {
          const savedBytes = stats.size - stats.minifiedSize;
          const savedPercent = stats.size > 0 ? Math.round((savedBytes / stats.size) * 100) : 0;
          sizeEl.textContent = this.formatBytes(stats.size);
          sizeEl.title = `Minified: ${this.formatBytes(stats.minifiedSize)} (${savedPercent}% smaller)`;
        }
        if (keysEl) keysEl.textContent = stats.keys.toLocaleString();
        if (depthEl) depthEl.textContent = stats.depth;
      } else {
        if (sizeEl) sizeEl.textContent = '-';
        if (keysEl) keysEl.textContent = '-';
        if (depthEl) depthEl.textContent = '-';
      }
    },

    formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },

    copy() {
      let text = '';

      if (this.highlightedEl && !this.highlightedEl.classList.contains('hidden')) {
        text = this.outputEl?.textContent || '';
      } else if (this.outputEl) {
        text = this.outputEl.textContent || '';
      }

      if (!text) {
        text = this.inputEl?.value || '';
      }

      const copyBtn = document.getElementById('copy-json');

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('json-formatter');
      }
    },

    clear() {
      if (this.inputEl) {
        this.inputEl.value = '';
      }

      if (this.outputEl) {
        this.outputEl.textContent = 'Formatted JSON will appear here';
        this.outputEl.classList.add('tool-output-placeholder');
        this.outputEl.classList.remove('hidden');
      }

      if (this.highlightedEl) {
        this.highlightedEl.innerHTML = '';
        this.highlightedEl.classList.add('hidden');
      }

      this.hideError();
      this.updateStats();
    },

    loadSample() {
      if (this.inputEl) {
        this.inputEl.value = this.getSampleJSON();
        this.formatJSON();
      }
    },

    trackUsage(action) {
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('json-formatter', action);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => JSONFormatter.init());
  } else {
    JSONFormatter.init();
  }

  // Export for external access
  window.JSONFormatter = JSONFormatter;

})();
