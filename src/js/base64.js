/**
 * OneDevKit - Base64 Encoder & Decoder
 * Encode text/files to Base64 and decode Base64 to text
 */

(function() {
  'use strict';

  const Base64Tool = {
    maxFileSize: 5 * 1024 * 1024, // 5MB

    /**
     * Encode string to Base64
     */
    encode(str, options = {}) {
      try {
        // Convert string to UTF-8 bytes then to Base64
        const utf8Bytes = new TextEncoder().encode(str);
        const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
        let base64 = btoa(binaryString);

        // Apply URL-safe encoding if requested
        if (options.urlSafe) {
          base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }

        // Add line breaks if requested (MIME format - 76 chars per line)
        if (options.lineBreaks) {
          base64 = base64.match(/.{1,76}/g)?.join('\n') || base64;
        }

        return base64;
      } catch (e) {
        throw new Error('Failed to encode: ' + e.message);
      }
    },

    /**
     * Decode Base64 to string
     */
    decode(base64, options = {}) {
      try {
        // Clean the input
        let cleaned = base64.trim();

        // Remove line breaks
        cleaned = cleaned.replace(/[\r\n]/g, '');

        // Convert URL-safe characters back
        if (options.urlSafe || cleaned.includes('-') || cleaned.includes('_')) {
          cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding if needed
          const padding = cleaned.length % 4;
          if (padding) {
            cleaned += '='.repeat(4 - padding);
          }
        }

        // Decode Base64 to binary string
        const binaryString = atob(cleaned);

        // Convert binary string to UTF-8
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        return new TextDecoder().decode(bytes);
      } catch (e) {
        throw new Error('Invalid Base64 string. Please check your input.');
      }
    },

    /**
     * Encode file to Base64
     */
    encodeFile(file) {
      return new Promise((resolve, reject) => {
        if (file.size > this.maxFileSize) {
          reject(new Error(`File too large. Maximum size is ${this.formatBytes(this.maxFileSize)}`));
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          // Get the Base64 part after the data URL prefix
          const base64 = reader.result.split(',')[1];
          resolve({
            base64: base64,
            dataUrl: reader.result,
            mimeType: file.type,
            fileName: file.name,
            fileSize: file.size
          });
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      });
    },

    /**
     * Validate if string is valid Base64
     */
    isValidBase64(str) {
      // Clean the string first
      const cleaned = str.replace(/[\r\n\s]/g, '').replace(/-/g, '+').replace(/_/g, '/');

      // Check if it matches Base64 pattern
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

      if (!base64Regex.test(cleaned)) {
        return false;
      }

      // Try to decode
      try {
        atob(cleaned);
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Format bytes to human readable
     */
    formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },

    /**
     * Get sample text
     */
    getSampleText() {
      return 'Hello, World! This is a sample text for Base64 encoding.\n\nBase64 is commonly used to encode binary data for transmission over text-based protocols.';
    },

    /**
     * Initialize the tool
     */
    init() {
      this.inputEl = document.getElementById('base64-input');
      this.outputEl = document.getElementById('base64-output');
      this.errorEl = document.getElementById('base64-error');
      this.fileInput = document.getElementById('file-input');
      this.fileDropZone = document.getElementById('file-drop-zone');
      this.fileInfo = document.getElementById('file-info');

      this.currentMode = 'text';
      this.currentFile = null;

      this.bindEvents();
    },

    bindEvents() {
      // Mode toggle
      const modeTextBtn = document.getElementById('mode-text');
      const modeFileBtn = document.getElementById('mode-file');

      if (modeTextBtn) {
        modeTextBtn.addEventListener('click', () => this.setMode('text'));
      }

      if (modeFileBtn) {
        modeFileBtn.addEventListener('click', () => this.setMode('file'));
      }

      // Encode button
      const encodeBtn = document.getElementById('encode-base64');
      if (encodeBtn) {
        encodeBtn.addEventListener('click', () => this.handleEncode());
      }

      // Decode button
      const decodeBtn = document.getElementById('decode-base64');
      if (decodeBtn) {
        decodeBtn.addEventListener('click', () => this.handleDecode());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-base64');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-base64');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }

      // Sample button
      const sampleBtn = document.getElementById('sample-base64');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => this.loadSample());
      }

      // File input
      if (this.fileInput) {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
      }

      // Clear file button
      const clearFileBtn = document.getElementById('clear-file');
      if (clearFileBtn) {
        clearFileBtn.addEventListener('click', () => this.clearFile());
      }

      // Drag and drop
      if (this.fileDropZone) {
        this.fileDropZone.addEventListener('click', () => this.fileInput?.click());

        this.fileDropZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          this.fileDropZone.classList.add('drag-over');
        });

        this.fileDropZone.addEventListener('dragleave', () => {
          this.fileDropZone.classList.remove('drag-over');
        });

        this.fileDropZone.addEventListener('drop', (e) => {
          e.preventDefault();
          this.fileDropZone.classList.remove('drag-over');
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            this.handleFile(files[0]);
          }
        });
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
      this.currentMode = mode;

      const textSection = document.getElementById('text-input-section');
      const fileSection = document.getElementById('file-input-section');
      const modeTextBtn = document.getElementById('mode-text');
      const modeFileBtn = document.getElementById('mode-file');
      const decodeBtn = document.getElementById('decode-base64');

      if (mode === 'text') {
        textSection?.classList.remove('hidden');
        fileSection?.classList.add('hidden');
        modeTextBtn?.classList.add('active');
        modeFileBtn?.classList.remove('active');
        decodeBtn?.classList.remove('hidden');
      } else {
        textSection?.classList.add('hidden');
        fileSection?.classList.remove('hidden');
        modeTextBtn?.classList.remove('active');
        modeFileBtn?.classList.add('active');
        // Hide decode button in file mode (can only encode files)
        decodeBtn?.classList.add('hidden');
      }

      this.clear();
    },

    handleFileSelect(e) {
      const file = e.target.files?.[0];
      if (file) {
        this.handleFile(file);
      }
    },

    handleFile(file) {
      if (file.size > this.maxFileSize) {
        this.showError(`File too large. Maximum size is ${this.formatBytes(this.maxFileSize)}`);
        return;
      }

      this.currentFile = file;
      this.showFileInfo(file);
      this.hideError();
    },

    showFileInfo(file) {
      const fileNameEl = document.getElementById('file-name');
      const fileSizeEl = document.getElementById('file-size');

      if (fileNameEl) fileNameEl.textContent = file.name;
      if (fileSizeEl) fileSizeEl.textContent = this.formatBytes(file.size);

      this.fileInfo?.classList.remove('hidden');
    },

    clearFile() {
      this.currentFile = null;
      if (this.fileInput) this.fileInput.value = '';
      this.fileInfo?.classList.add('hidden');
      this.clear();
    },

    getOptions() {
      return {
        urlSafe: document.getElementById('url-safe')?.checked || false,
        lineBreaks: document.getElementById('line-breaks')?.checked || false
      };
    },

    async handleEncode() {
      this.hideError();
      const options = this.getOptions();

      if (this.currentMode === 'file') {
        if (!this.currentFile) {
          this.showError('Please select a file to encode');
          return;
        }

        try {
          const result = await this.encodeFile(this.currentFile);
          let base64 = result.base64;

          // Apply options
          if (options.urlSafe) {
            base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          }

          if (options.lineBreaks) {
            base64 = base64.match(/.{1,76}/g)?.join('\n') || base64;
          }

          this.showOutput(base64);
          this.updateStatsWithValues(result.fileSize, base64.replace(/\n/g, '').length);
          this.trackUsage('encode-file');
        } catch (e) {
          this.showError(e.message);
        }
      } else {
        const input = this.inputEl?.value;
        if (!input) {
          this.showError('Please enter text to encode');
          return;
        }

        try {
          const encoded = this.encode(input, options);
          this.showOutput(encoded);
          this.updateStats();
          this.trackUsage('encode');
        } catch (e) {
          this.showError(e.message);
        }
      }
    },

    handleDecode() {
      const input = this.inputEl?.value?.trim();
      if (!input) {
        this.showError('Please enter Base64 to decode');
        return;
      }

      const options = this.getOptions();

      try {
        const decoded = this.decode(input, options);
        this.showOutput(decoded);
        this.updateStats();
        this.trackUsage('decode');
        this.hideError();
      } catch (e) {
        this.showError(e.message);
      }
    },

    showOutput(text) {
      if (this.outputEl) {
        this.outputEl.textContent = text;
        this.outputEl.classList.remove('tool-output-placeholder');
      }
    },

    showError(message) {
      if (!this.errorEl) return;

      this.errorEl.textContent = message;
      this.errorEl.classList.remove('hidden');
    },

    hideError() {
      if (this.errorEl) {
        this.errorEl.classList.add('hidden');
      }
    },

    updateStats() {
      const input = this.inputEl?.value || '';
      const output = this.outputEl?.textContent || '';

      if (output && !this.outputEl?.classList.contains('tool-output-placeholder')) {
        const inputSize = new Blob([input]).size;
        const outputSize = new Blob([output.replace(/\n/g, '')]).size;
        this.updateStatsWithValues(inputSize, outputSize);
      } else {
        this.resetStats();
      }
    },

    updateStatsWithValues(inputSize, outputSize) {
      const inputSizeEl = document.getElementById('input-size');
      const outputSizeEl = document.getElementById('output-size');
      const ratioEl = document.getElementById('size-ratio');

      if (inputSizeEl) inputSizeEl.textContent = this.formatBytes(inputSize);
      if (outputSizeEl) outputSizeEl.textContent = this.formatBytes(outputSize);

      if (ratioEl && inputSize > 0) {
        const ratio = (outputSize / inputSize).toFixed(2);
        ratioEl.textContent = `${ratio}x`;
      }
    },

    resetStats() {
      const inputSizeEl = document.getElementById('input-size');
      const outputSizeEl = document.getElementById('output-size');
      const ratioEl = document.getElementById('size-ratio');

      if (inputSizeEl) inputSizeEl.textContent = '-';
      if (outputSizeEl) outputSizeEl.textContent = '-';
      if (ratioEl) ratioEl.textContent = '-';
    },

    copy() {
      const text = this.outputEl?.textContent || '';

      if (!text || this.outputEl?.classList.contains('tool-output-placeholder')) {
        return;
      }

      const copyBtn = document.getElementById('copy-base64');

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('base64-encoder');
      } else {
        // Fallback
        navigator.clipboard.writeText(text).then(() => {
          if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 2000);
          }
        });
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
      this.resetStats();
    },

    loadSample() {
      if (this.inputEl) {
        this.inputEl.value = this.getSampleText();
        this.hideError();
      }
    },

    trackUsage(action) {
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('base64-encoder', action);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Base64Tool.init());
  } else {
    Base64Tool.init();
  }

  // Export for external access and testing
  window.Base64Tool = Base64Tool;

})();
