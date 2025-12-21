/**
 * OneDevKit - UUID Generator
 * Generate universally unique identifiers (UUIDs)
 */

(function() {
  'use strict';

  const UUIDGenerator = {
    /**
     * Generate a UUID v4 (random)
     * Uses crypto.getRandomValues for cryptographic randomness
     */
    generateV4() {
      // Use crypto API if available (more secure)
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);

        // Set version (4) and variant (10xx) bits
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx

        // Convert to hex string
        const hex = Array.from(bytes)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        return [
          hex.slice(0, 8),
          hex.slice(8, 12),
          hex.slice(12, 16),
          hex.slice(16, 20),
          hex.slice(20, 32)
        ].join('-');
      }

      // Fallback using Math.random (less secure but works everywhere)
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    /**
     * Generate multiple UUIDs
     */
    generateBulk(count) {
      const uuids = [];
      for (let i = 0; i < count; i++) {
        uuids.push(this.generateV4());
      }
      return uuids;
    },

    /**
     * Validate a UUID string
     */
    validate(uuid) {
      const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return regex.test(uuid);
    },

    /**
     * Get UUID version from string
     */
    getVersion(uuid) {
      if (!this.validate(uuid)) return null;
      return parseInt(uuid.charAt(14), 16);
    },

    /**
     * Initialize the tool
     */
    init() {
      this.bindEvents();
      this.generate(); // Generate one on load
    },

    bindEvents() {
      // Generate button
      const generateBtn = document.getElementById('generate-uuid');
      if (generateBtn) {
        generateBtn.addEventListener('click', () => this.generate());
      }

      // Bulk generate button
      const bulkBtn = document.getElementById('bulk-generate');
      if (bulkBtn) {
        bulkBtn.addEventListener('click', () => this.bulkGenerate());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-uuid');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Copy all button (for bulk)
      const copyAllBtn = document.getElementById('copy-all');
      if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => this.copyAll());
      }

      // Bulk count input
      const bulkCount = document.getElementById('bulk-count');
      if (bulkCount) {
        bulkCount.addEventListener('change', () => {
          const value = parseInt(bulkCount.value, 10);
          if (value < 1) bulkCount.value = 1;
          if (value > 100) bulkCount.value = 100;
        });
      }

      // Validate input
      const validateInput = document.getElementById('validate-input');
      const validateBtn = document.getElementById('validate-btn');
      if (validateInput && validateBtn) {
        validateBtn.addEventListener('click', () => this.validateInput());
        validateInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.validateInput();
        });
      }
    },

    generate() {
      const uuid = this.generateV4();
      const output = document.getElementById('uuid-output');
      const bulkOutput = document.getElementById('bulk-output');

      if (output) {
        output.textContent = uuid;
        output.classList.remove('tool-output-placeholder');
      }

      // Hide bulk output when generating single
      if (bulkOutput) {
        bulkOutput.classList.add('hidden');
      }

      // Track analytics
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('uuid-generator', 'generate');
      }
    },

    bulkGenerate() {
      const countInput = document.getElementById('bulk-count');
      const count = Math.min(100, Math.max(1, parseInt(countInput?.value, 10) || 10));

      const uuids = this.generateBulk(count);
      const output = document.getElementById('uuid-output');
      const bulkOutput = document.getElementById('bulk-output');

      if (output) {
        output.textContent = uuids[0];
        output.classList.remove('tool-output-placeholder');
      }

      if (bulkOutput) {
        bulkOutput.textContent = uuids.join('\n');
        bulkOutput.classList.remove('hidden');
      }

      // Track analytics
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('uuid-generator', 'bulk-generate');
      }
    },

    copy() {
      const output = document.getElementById('uuid-output');
      if (!output) return;

      const text = output.textContent;
      const copyBtn = document.getElementById('copy-uuid');

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('uuid-generator');
      }
    },

    copyAll() {
      const bulkOutput = document.getElementById('bulk-output');
      if (!bulkOutput || bulkOutput.classList.contains('hidden')) return;

      const text = bulkOutput.textContent;
      const copyBtn = document.getElementById('copy-all');

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('uuid-generator');
      }
    },

    validateInput() {
      const input = document.getElementById('validate-input');
      const result = document.getElementById('validate-result');

      if (!input || !result) return;

      const uuid = input.value.trim();

      if (!uuid) {
        result.innerHTML = '';
        return;
      }

      const isValid = this.validate(uuid);
      const version = this.getVersion(uuid);

      if (isValid) {
        result.innerHTML = `<div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <div>Valid UUID (Version ${version})</div>
        </div>`;
      } else {
        result.innerHTML = `<div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <div>Invalid UUID format</div>
        </div>`;
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UUIDGenerator.init());
  } else {
    UUIDGenerator.init();
  }

  // Export for external access
  window.UUIDGenerator = UUIDGenerator;

})();
