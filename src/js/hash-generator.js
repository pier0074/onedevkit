/**
 * OneDevKit - Hash Generator
 * Generate MD5, SHA-1, SHA-256, SHA-512 hashes
 */

(function() {
  'use strict';

  const HashGenerator = {
    /**
     * Generate MD5 hash (pure JavaScript implementation)
     */
    md5(string) {
      function rotateLeft(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
      }

      function addUnsigned(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      }

      function F(x, y, z) { return (x & y) | ((~x) & z); }
      function G(x, y, z) { return (x & z) | (y & (~z)); }
      function H(x, y, z) { return x ^ y ^ z; }
      function I(x, y, z) { return y ^ (x | (~z)); }

      function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function wordToHex(value) {
        let hex = '';
        for (let i = 0; i <= 3; i++) {
          const byte = (value >>> (i * 8)) & 0xFF;
          hex += ('0' + byte.toString(16)).slice(-2);
        }
        return hex;
      }

      // Convert string to UTF-8 bytes
      const utf8 = unescape(encodeURIComponent(string));
      const words = [];
      for (let i = 0; i < utf8.length; i++) {
        words[i >> 2] |= utf8.charCodeAt(i) << ((i % 4) * 8);
      }
      words[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) * 8);

      const len = (((utf8.length + 8) >> 6) + 1) * 16;
      while (words.length < len) words.push(0);
      words[len - 2] = utf8.length * 8;

      let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;

      for (let i = 0; i < words.length; i += 16) {
        const AA = a, BB = b, CC = c, DD = d;
        const x = words.slice(i, i + 16);

        a = FF(a, b, c, d, x[0], 7, 0xD76AA478);
        d = FF(d, a, b, c, x[1], 12, 0xE8C7B756);
        c = FF(c, d, a, b, x[2], 17, 0x242070DB);
        b = FF(b, c, d, a, x[3], 22, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[4], 7, 0xF57C0FAF);
        d = FF(d, a, b, c, x[5], 12, 0x4787C62A);
        c = FF(c, d, a, b, x[6], 17, 0xA8304613);
        b = FF(b, c, d, a, x[7], 22, 0xFD469501);
        a = FF(a, b, c, d, x[8], 7, 0x698098D8);
        d = FF(d, a, b, c, x[9], 12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[10], 17, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[11], 22, 0x895CD7BE);
        a = FF(a, b, c, d, x[12], 7, 0x6B901122);
        d = FF(d, a, b, c, x[13], 12, 0xFD987193);
        c = FF(c, d, a, b, x[14], 17, 0xA679438E);
        b = FF(b, c, d, a, x[15], 22, 0x49B40821);

        a = GG(a, b, c, d, x[1], 5, 0xF61E2562);
        d = GG(d, a, b, c, x[6], 9, 0xC040B340);
        c = GG(c, d, a, b, x[11], 14, 0x265E5A51);
        b = GG(b, c, d, a, x[0], 20, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[5], 5, 0xD62F105D);
        d = GG(d, a, b, c, x[10], 9, 0x02441453);
        c = GG(c, d, a, b, x[15], 14, 0xD8A1E681);
        b = GG(b, c, d, a, x[4], 20, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[9], 5, 0x21E1CDE6);
        d = GG(d, a, b, c, x[14], 9, 0xC33707D6);
        c = GG(c, d, a, b, x[3], 14, 0xF4D50D87);
        b = GG(b, c, d, a, x[8], 20, 0x455A14ED);
        a = GG(a, b, c, d, x[13], 5, 0xA9E3E905);
        d = GG(d, a, b, c, x[2], 9, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[7], 14, 0x676F02D9);
        b = GG(b, c, d, a, x[12], 20, 0x8D2A4C8A);

        a = HH(a, b, c, d, x[5], 4, 0xFFFA3942);
        d = HH(d, a, b, c, x[8], 11, 0x8771F681);
        c = HH(c, d, a, b, x[11], 16, 0x6D9D6122);
        b = HH(b, c, d, a, x[14], 23, 0xFDE5380C);
        a = HH(a, b, c, d, x[1], 4, 0xA4BEEA44);
        d = HH(d, a, b, c, x[4], 11, 0x4BDECFA9);
        c = HH(c, d, a, b, x[7], 16, 0xF6BB4B60);
        b = HH(b, c, d, a, x[10], 23, 0xBEBFBC70);
        a = HH(a, b, c, d, x[13], 4, 0x289B7EC6);
        d = HH(d, a, b, c, x[0], 11, 0xEAA127FA);
        c = HH(c, d, a, b, x[3], 16, 0xD4EF3085);
        b = HH(b, c, d, a, x[6], 23, 0x04881D05);
        a = HH(a, b, c, d, x[9], 4, 0xD9D4D039);
        d = HH(d, a, b, c, x[12], 11, 0xE6DB99E5);
        c = HH(c, d, a, b, x[15], 16, 0x1FA27CF8);
        b = HH(b, c, d, a, x[2], 23, 0xC4AC5665);

        a = II(a, b, c, d, x[0], 6, 0xF4292244);
        d = II(d, a, b, c, x[7], 10, 0x432AFF97);
        c = II(c, d, a, b, x[14], 15, 0xAB9423A7);
        b = II(b, c, d, a, x[5], 21, 0xFC93A039);
        a = II(a, b, c, d, x[12], 6, 0x655B59C3);
        d = II(d, a, b, c, x[3], 10, 0x8F0CCC92);
        c = II(c, d, a, b, x[10], 15, 0xFFEFF47D);
        b = II(b, c, d, a, x[1], 21, 0x85845DD1);
        a = II(a, b, c, d, x[8], 6, 0x6FA87E4F);
        d = II(d, a, b, c, x[15], 10, 0xFE2CE6E0);
        c = II(c, d, a, b, x[6], 15, 0xA3014314);
        b = II(b, c, d, a, x[13], 21, 0x4E0811A1);
        a = II(a, b, c, d, x[4], 6, 0xF7537E82);
        d = II(d, a, b, c, x[11], 10, 0xBD3AF235);
        c = II(c, d, a, b, x[2], 15, 0x2AD7D2BB);
        b = II(b, c, d, a, x[9], 21, 0xEB86D391);

        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
      }

      return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    },

    /**
     * Generate SHA hash using Web Crypto API
     */
    async sha(algorithm, text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Generate SHA-1 hash
     */
    async sha1(text) {
      return this.sha('SHA-1', text);
    },

    /**
     * Generate SHA-256 hash
     */
    async sha256(text) {
      return this.sha('SHA-256', text);
    },

    /**
     * Generate SHA-512 hash
     */
    async sha512(text) {
      return this.sha('SHA-512', text);
    },

    /**
     * Generate all hashes
     */
    async generateAll(text) {
      const [sha1, sha256, sha512] = await Promise.all([
        this.sha1(text),
        this.sha256(text),
        this.sha512(text)
      ]);

      return {
        md5: this.md5(text),
        sha1,
        sha256,
        sha512
      };
    },

    /**
     * Get sample text
     */
    getSampleText() {
      return 'Hello, World!';
    },

    /**
     * Initialize the tool
     */
    init() {
      this.inputEl = document.getElementById('hash-input');
      this.bindEvents();
    },

    bindEvents() {
      // Generate button
      const generateBtn = document.getElementById('generate-hash');
      if (generateBtn) {
        generateBtn.addEventListener('click', () => this.generate());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-hash');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }

      // Sample button
      const sampleBtn = document.getElementById('sample-hash');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => this.loadSample());
      }

      // Copy buttons
      document.querySelectorAll('.hash-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const hashType = btn.dataset.hash;
          this.copyHash(hashType, btn);
        });
      });

      // Auto-generate on input (debounced)
      if (this.inputEl) {
        let timeout;
        this.inputEl.addEventListener('input', () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (this.inputEl.value) {
              this.generate();
            }
          }, 300);
        });
      }
    },

    async generate() {
      const input = this.inputEl?.value;
      if (!input) {
        this.clearResults();
        return;
      }

      try {
        const hashes = await this.generateAll(input);

        document.getElementById('hash-md5').textContent = hashes.md5;
        document.getElementById('hash-sha1').textContent = hashes.sha1;
        document.getElementById('hash-sha256').textContent = hashes.sha256;
        document.getElementById('hash-sha512').textContent = hashes.sha512;

        this.trackUsage('generate');
      } catch (e) {
        console.error('Hash generation failed:', e);
      }
    },

    clearResults() {
      document.getElementById('hash-md5').textContent = '-';
      document.getElementById('hash-sha1').textContent = '-';
      document.getElementById('hash-sha256').textContent = '-';
      document.getElementById('hash-sha512').textContent = '-';
    },

    copyHash(hashType, button) {
      const hashEl = document.getElementById('hash-' + hashType);
      const hash = hashEl?.textContent;

      if (!hash || hash === '-') return;

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(hash, button);
        window.OneDevKit.Analytics.trackCopy('hash-generator');
      }
    },

    clear() {
      if (this.inputEl) {
        this.inputEl.value = '';
      }
      this.clearResults();
    },

    loadSample() {
      if (this.inputEl) {
        this.inputEl.value = this.getSampleText();
        this.generate();
      }
    },

    trackUsage(action) {
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('hash-generator', action);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HashGenerator.init());
  } else {
    HashGenerator.init();
  }

  // Export for external access and testing
  window.HashGenerator = HashGenerator;

})();
