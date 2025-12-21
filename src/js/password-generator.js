/**
 * OneDevKit - Password Generator
 * Generate secure, random passwords with customizable options
 */

(function() {
  'use strict';

  const PasswordGenerator = {
    // Character sets
    CHARS: {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    },

    // Ambiguous characters to exclude
    AMBIGUOUS: 'il1Lo0O',

    /**
     * Generate a secure random password
     */
    generate(options = {}) {
      const {
        length = 16,
        uppercase = true,
        lowercase = true,
        numbers = true,
        symbols = true,
        excludeAmbiguous = false
      } = options;

      // Build character pool
      let chars = '';
      let requiredChars = [];

      if (uppercase) {
        let set = this.CHARS.uppercase;
        if (excludeAmbiguous) {
          set = set.split('').filter(c => !this.AMBIGUOUS.includes(c)).join('');
        }
        chars += set;
        requiredChars.push(this.getRandomChar(set));
      }

      if (lowercase) {
        let set = this.CHARS.lowercase;
        if (excludeAmbiguous) {
          set = set.split('').filter(c => !this.AMBIGUOUS.includes(c)).join('');
        }
        chars += set;
        requiredChars.push(this.getRandomChar(set));
      }

      if (numbers) {
        let set = this.CHARS.numbers;
        if (excludeAmbiguous) {
          set = set.split('').filter(c => !this.AMBIGUOUS.includes(c)).join('');
        }
        chars += set;
        requiredChars.push(this.getRandomChar(set));
      }

      if (symbols) {
        chars += this.CHARS.symbols;
        requiredChars.push(this.getRandomChar(this.CHARS.symbols));
      }

      // Need at least one character type
      if (chars.length === 0) {
        chars = this.CHARS.lowercase;
        requiredChars.push(this.getRandomChar(chars));
      }

      // Generate password
      let password = '';

      // Start with required characters from each type
      for (const char of requiredChars) {
        password += char;
      }

      // Fill remaining length with random characters
      const remainingLength = Math.max(0, length - password.length);
      for (let i = 0; i < remainingLength; i++) {
        password += this.getRandomChar(chars);
      }

      // Shuffle the password to randomize position of required chars
      password = this.shuffle(password);

      return password;
    },

    /**
     * Get a cryptographically random character from a string
     */
    getRandomChar(str) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return str[array[0] % str.length];
    },

    /**
     * Shuffle a string using Fisher-Yates algorithm
     */
    shuffle(str) {
      const arr = str.split('');
      const array = new Uint32Array(arr.length);
      crypto.getRandomValues(array);

      for (let i = arr.length - 1; i > 0; i--) {
        const j = array[i] % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr.join('');
    },

    /**
     * Calculate password strength (0-4)
     */
    calculateStrength(password) {
      let score = 0;

      // Length checks
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (password.length >= 16) score++;

      // Character diversity checks
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasSymbols = /[^A-Za-z0-9]/.test(password);

      const diversity = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
      if (diversity >= 3) score++;
      if (diversity === 4) score++;

      // Cap at 4
      return Math.min(4, score);
    },

    /**
     * Get strength label and color
     */
    getStrengthInfo(strength) {
      const levels = [
        { label: 'Very Weak', color: '#ef4444', width: '20%' },
        { label: 'Weak', color: '#f59e0b', width: '40%' },
        { label: 'Fair', color: '#eab308', width: '60%' },
        { label: 'Strong', color: '#22c55e', width: '80%' },
        { label: 'Very Strong', color: '#16a34a', width: '100%' }
      ];
      return levels[Math.min(strength, 4)];
    },

    /**
     * Initialize the tool
     */
    init() {
      this.bindEvents();
      this.updateLengthDisplay();
      this.generate_(); // Generate initial password
    },

    bindEvents() {
      // Generate button
      const generateBtn = document.getElementById('generate-password');
      if (generateBtn) {
        generateBtn.addEventListener('click', () => this.generate_());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-password');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Length slider
      const lengthSlider = document.getElementById('password-length');
      if (lengthSlider) {
        lengthSlider.addEventListener('input', () => {
          this.updateLengthDisplay();
          this.generate_();
        });
      }

      // Checkboxes - regenerate on change
      const checkboxes = document.querySelectorAll('.password-option');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => this.generate_());
      });

      // Bulk generate
      const bulkBtn = document.getElementById('bulk-generate-passwords');
      if (bulkBtn) {
        bulkBtn.addEventListener('click', () => this.bulkGenerate());
      }

      // Copy all
      const copyAllBtn = document.getElementById('copy-all-passwords');
      if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => this.copyAll());
      }
    },

    updateLengthDisplay() {
      const slider = document.getElementById('password-length');
      const display = document.getElementById('length-display');
      if (slider && display) {
        display.textContent = slider.value;
      }
    },

    getOptions() {
      return {
        length: parseInt(document.getElementById('password-length')?.value, 10) || 16,
        uppercase: document.getElementById('include-uppercase')?.checked ?? true,
        lowercase: document.getElementById('include-lowercase')?.checked ?? true,
        numbers: document.getElementById('include-numbers')?.checked ?? true,
        symbols: document.getElementById('include-symbols')?.checked ?? true,
        excludeAmbiguous: document.getElementById('exclude-ambiguous')?.checked ?? false
      };
    },

    generate_() {
      const options = this.getOptions();
      const password = this.generate(options);

      // Update output
      const output = document.getElementById('password-output');
      if (output) {
        output.textContent = password;
        output.classList.remove('tool-output-placeholder');
      }

      // Update strength indicator
      this.updateStrengthIndicator(password);

      // Hide bulk output
      const bulkOutput = document.getElementById('bulk-passwords-output');
      if (bulkOutput) {
        bulkOutput.classList.add('hidden');
      }

      // Track analytics
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('password-generator', 'generate');
      }
    },

    updateStrengthIndicator(password) {
      const strength = this.calculateStrength(password);
      const info = this.getStrengthInfo(strength);

      const bar = document.getElementById('strength-bar');
      const label = document.getElementById('strength-label');

      if (bar) {
        bar.style.width = info.width;
        bar.style.backgroundColor = info.color;
      }

      if (label) {
        label.textContent = info.label;
        label.style.color = info.color;
      }
    },

    bulkGenerate() {
      const countInput = document.getElementById('bulk-password-count');
      const count = Math.min(20, Math.max(1, parseInt(countInput?.value, 10) || 5));
      const options = this.getOptions();

      const passwords = [];
      for (let i = 0; i < count; i++) {
        passwords.push(this.generate(options));
      }

      const output = document.getElementById('password-output');
      const bulkOutput = document.getElementById('bulk-passwords-output');

      if (output) {
        output.textContent = passwords[0];
        output.classList.remove('tool-output-placeholder');
      }

      if (bulkOutput) {
        bulkOutput.textContent = passwords.join('\n');
        bulkOutput.classList.remove('hidden');
      }

      this.updateStrengthIndicator(passwords[0]);

      // Track analytics
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('password-generator', 'bulk-generate');
      }
    },

    copy() {
      const output = document.getElementById('password-output');
      if (!output) return;

      const text = output.textContent;
      const copyBtn = document.getElementById('copy-password');

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('password-generator');
      }
    },

    copyAll() {
      const bulkOutput = document.getElementById('bulk-passwords-output');
      if (!bulkOutput || bulkOutput.classList.contains('hidden')) return;

      const text = bulkOutput.textContent;
      const copyBtn = document.getElementById('copy-all-passwords');

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('password-generator');
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PasswordGenerator.init());
  } else {
    PasswordGenerator.init();
  }

  // Export for external access
  window.PasswordGenerator = PasswordGenerator;

})();
