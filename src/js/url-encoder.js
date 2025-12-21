/**
 * OneDevKit - URL Encoder & Decoder
 * Encode and decode URL components
 */

(function() {
  'use strict';

  const URLEncoder = {
    mode: 'component', // 'component' or 'full'

    /**
     * Encode text for URL (component mode - encodeURIComponent)
     */
    encodeComponent(text) {
      return encodeURIComponent(text);
    },

    /**
     * Encode text for URL (full URL mode - encodeURI)
     */
    encodeFullURL(text) {
      return encodeURI(text);
    },

    /**
     * Decode URL-encoded text (component mode)
     */
    decodeComponent(text) {
      return decodeURIComponent(text);
    },

    /**
     * Decode URL-encoded text (full URL mode)
     */
    decodeFullURL(text) {
      return decodeURI(text);
    },

    /**
     * Encode based on current mode
     */
    encode(text) {
      if (this.mode === 'full') {
        return this.encodeFullURL(text);
      }
      return this.encodeComponent(text);
    },

    /**
     * Decode based on current mode
     */
    decode(text) {
      if (this.mode === 'full') {
        return this.decodeFullURL(text);
      }
      return this.decodeComponent(text);
    },

    /**
     * Get sample text
     */
    getSampleText() {
      return 'https://example.com/search?query=hello world&email=user@email.com&price=$100';
    },

    /**
     * Initialize the tool
     */
    init() {
      this.inputEl = document.getElementById('url-input');
      this.outputEl = document.getElementById('url-output');
      this.errorEl = document.getElementById('url-error');
      this.bindEvents();
    },

    bindEvents() {
      // Encode button
      const encodeBtn = document.getElementById('encode-url');
      if (encodeBtn) {
        encodeBtn.addEventListener('click', () => this.doEncode());
      }

      // Decode button
      const decodeBtn = document.getElementById('decode-url');
      if (decodeBtn) {
        decodeBtn.addEventListener('click', () => this.doDecode());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-url');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-url');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }

      // Sample button
      const sampleBtn = document.getElementById('sample-url');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => this.loadSample());
      }

      // Mode toggle buttons
      const modeComponent = document.getElementById('mode-component');
      const modeFull = document.getElementById('mode-full');

      if (modeComponent) {
        modeComponent.addEventListener('click', () => this.setMode('component'));
      }
      if (modeFull) {
        modeFull.addEventListener('click', () => this.setMode('full'));
      }

      // Input change - update stats
      if (this.inputEl) {
        this.inputEl.addEventListener('input', () => {
          this.hideError();
          this.updateStats();
        });
      }
    },

    setMode(mode) {
      this.mode = mode;

      // Update button states
      const modeComponent = document.getElementById('mode-component');
      const modeFull = document.getElementById('mode-full');

      if (modeComponent && modeFull) {
        modeComponent.classList.toggle('active', mode === 'component');
        modeFull.classList.toggle('active', mode === 'full');
      }
    },

    doEncode() {
      const input = this.inputEl?.value;
      if (!input) {
        this.showError('Please enter text to encode');
        return;
      }

      try {
        const encoded = this.encode(input);
        this.showOutput(encoded);
        this.hideError();
        this.trackUsage('encode');
      } catch (e) {
        this.showError('Encoding failed: ' + e.message);
      }
    },

    doDecode() {
      const input = this.inputEl?.value;
      if (!input) {
        this.showError('Please enter URL-encoded text to decode');
        return;
      }

      try {
        const decoded = this.decode(input);
        this.showOutput(decoded);
        this.hideError();
        this.trackUsage('decode');
      } catch (e) {
        this.showError('Decoding failed: Invalid URL-encoded string');
      }
    },

    showOutput(text) {
      if (this.outputEl) {
        this.outputEl.textContent = text;
        this.outputEl.classList.remove('tool-output-placeholder');
      }
      this.updateStats();
    },

    showError(message) {
      if (this.errorEl) {
        this.errorEl.textContent = message;
        this.errorEl.classList.remove('hidden');
      }
    },

    hideError() {
      if (this.errorEl) {
        this.errorEl.classList.add('hidden');
      }
    },

    updateStats() {
      const input = this.inputEl?.value || '';
      const output = this.outputEl?.textContent || '';
      const isPlaceholder = this.outputEl?.classList.contains('tool-output-placeholder');

      const inputLengthEl = document.getElementById('input-length');
      const outputLengthEl = document.getElementById('output-length');

      if (inputLengthEl) {
        inputLengthEl.textContent = input.length + ' chars';
      }
      if (outputLengthEl) {
        outputLengthEl.textContent = isPlaceholder ? '-' : output.length + ' chars';
      }
    },

    copy() {
      const text = this.outputEl?.textContent;
      if (!text || this.outputEl?.classList.contains('tool-output-placeholder')) {
        return;
      }

      const copyBtn = document.getElementById('copy-url');
      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('url-encoder');
      }
    },

    clear() {
      if (this.inputEl) {
        this.inputEl.value = '';
      }

      if (this.outputEl) {
        this.outputEl.textContent = 'Encoded or decoded result will appear here';
        this.outputEl.classList.add('tool-output-placeholder');
      }

      this.hideError();
      this.updateStats();
    },

    loadSample() {
      if (this.inputEl) {
        this.inputEl.value = this.getSampleText();
        this.updateStats();
      }
    },

    trackUsage(action) {
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('url-encoder', action);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => URLEncoder.init());
  } else {
    URLEncoder.init();
  }

  // Export for external access and testing
  window.URLEncoder = URLEncoder;

})();
