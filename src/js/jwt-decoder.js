/**
 * OneDevKit - JWT Decoder
 * Decode and inspect JSON Web Tokens
 */

(function() {
  'use strict';

  const JWTDecoder = {
    /**
     * Decode Base64URL to string
     */
    base64UrlDecode(str) {
      // Replace URL-safe characters
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

      // Pad with '=' if needed
      const pad = base64.length % 4;
      if (pad) {
        base64 += '='.repeat(4 - pad);
      }

      // Decode
      try {
        const decoded = atob(base64);
        // Handle UTF-8
        return decodeURIComponent(
          decoded.split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join('')
        );
      } catch (e) {
        throw new Error('Invalid Base64URL encoding');
      }
    },

    /**
     * Parse JWT token
     */
    decode(token) {
      if (!token || typeof token !== 'string') {
        throw new Error('Token is required');
      }

      // Remove whitespace
      token = token.trim();

      // Split into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      // Decode header
      let header;
      try {
        header = JSON.parse(this.base64UrlDecode(headerB64));
      } catch (e) {
        throw new Error('Invalid JWT header');
      }

      // Decode payload
      let payload;
      try {
        payload = JSON.parse(this.base64UrlDecode(payloadB64));
      } catch (e) {
        throw new Error('Invalid JWT payload');
      }

      return {
        header,
        payload,
        signature: signatureB64,
        raw: {
          header: headerB64,
          payload: payloadB64,
          signature: signatureB64
        }
      };
    },

    /**
     * Check if token is expired
     */
    isExpired(payload) {
      if (!payload.exp) return null;
      return Date.now() >= payload.exp * 1000;
    },

    /**
     * Check if token is not yet valid
     */
    isNotYetValid(payload) {
      if (!payload.nbf) return null;
      return Date.now() < payload.nbf * 1000;
    },

    /**
     * Format timestamp to readable date
     */
    formatTimestamp(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    },

    /**
     * Get sample JWT token
     */
    getSampleToken() {
      // Create a sample JWT (header.payload.signature)
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = {
        sub: '1234567890',
        name: 'John Doe',
        email: 'john@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        role: 'admin'
      };

      const headerB64 = btoa(JSON.stringify(header))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const payloadB64 = btoa(JSON.stringify(payload))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      // Fake signature for demo purposes
      const signatureB64 = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      return `${headerB64}.${payloadB64}.${signatureB64}`;
    },

    /**
     * Pretty print JSON
     */
    prettyPrint(obj) {
      return JSON.stringify(obj, null, 2);
    },

    /**
     * Initialize the tool
     */
    init() {
      this.inputEl = document.getElementById('jwt-input');
      this.bindEvents();
    },

    bindEvents() {
      // Decode button
      const decodeBtn = document.getElementById('decode-jwt');
      if (decodeBtn) {
        decodeBtn.addEventListener('click', () => this.decodeAndDisplay());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-jwt');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }

      // Sample button
      const sampleBtn = document.getElementById('sample-jwt');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => this.loadSample());
      }

      // Copy buttons
      document.querySelectorAll('.jwt-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const part = btn.dataset.part;
          this.copyPart(part, btn);
        });
      });

      // Auto-decode on input
      if (this.inputEl) {
        this.inputEl.addEventListener('input', () => {
          if (this.inputEl.value.includes('.')) {
            this.decodeAndDisplay();
          }
        });
      }
    },

    decodeAndDisplay() {
      const token = this.inputEl?.value?.trim();
      const statusEl = document.getElementById('jwt-status');

      if (!token) {
        this.clearResults();
        if (statusEl) statusEl.classList.add('hidden');
        return;
      }

      try {
        const decoded = this.decode(token);
        this.decoded = decoded;

        // Display header
        document.getElementById('jwt-header').textContent = this.prettyPrint(decoded.header);
        document.getElementById('jwt-header-raw').textContent = decoded.raw.header;

        // Display payload with formatted timestamps
        const payloadDisplay = { ...decoded.payload };
        document.getElementById('jwt-payload').textContent = this.prettyPrint(payloadDisplay);
        document.getElementById('jwt-payload-raw').textContent = decoded.raw.payload;

        // Display signature
        document.getElementById('jwt-signature').textContent = decoded.raw.signature;

        // Show status
        this.showStatus(decoded.payload);

        this.trackUsage('decode');
      } catch (e) {
        this.clearResults();
        if (statusEl) {
          statusEl.className = 'jwt-status invalid';
          statusEl.textContent = 'Error: ' + e.message;
          statusEl.classList.remove('hidden');
        }
      }
    },

    showStatus(payload) {
      const statusEl = document.getElementById('jwt-status');
      if (!statusEl) return;

      const isExpired = this.isExpired(payload);
      const isNotYetValid = this.isNotYetValid(payload);

      let statusClass = 'valid';
      let statusText = 'Token decoded successfully';

      const details = [];

      if (payload.exp) {
        const expDate = this.formatTimestamp(payload.exp);
        if (isExpired) {
          statusClass = 'invalid';
          details.push(`Expired: ${expDate}`);
        } else {
          details.push(`Expires: ${expDate}`);
        }
      }

      if (payload.iat) {
        details.push(`Issued: ${this.formatTimestamp(payload.iat)}`);
      }

      if (payload.nbf) {
        const nbfDate = this.formatTimestamp(payload.nbf);
        if (isNotYetValid) {
          statusClass = 'warning';
          details.push(`Not valid until: ${nbfDate}`);
        }
      }

      if (isExpired) {
        statusText = 'Token is EXPIRED';
      } else if (isNotYetValid) {
        statusText = 'Token is not yet valid';
      }

      statusEl.className = `jwt-status ${statusClass}`;
      statusEl.innerHTML = `<strong>${statusText}</strong>${details.length ? '<br>' + details.join(' | ') : ''}`;
      statusEl.classList.remove('hidden');
    },

    clearResults() {
      document.getElementById('jwt-header').textContent = '-';
      document.getElementById('jwt-header-raw').textContent = '-';
      document.getElementById('jwt-payload').textContent = '-';
      document.getElementById('jwt-payload-raw').textContent = '-';
      document.getElementById('jwt-signature').textContent = '-';
      this.decoded = null;
    },

    copyPart(part, button) {
      if (!this.decoded) return;

      let text;
      if (part === 'header') {
        text = this.prettyPrint(this.decoded.header);
      } else if (part === 'payload') {
        text = this.prettyPrint(this.decoded.payload);
      } else if (part === 'signature') {
        text = this.decoded.raw.signature;
      }

      if (text && window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, button);
        window.OneDevKit.Analytics.trackCopy('jwt-decoder');
      }
    },

    clear() {
      if (this.inputEl) {
        this.inputEl.value = '';
      }
      this.clearResults();
      const statusEl = document.getElementById('jwt-status');
      if (statusEl) statusEl.classList.add('hidden');
    },

    loadSample() {
      if (this.inputEl) {
        this.inputEl.value = this.getSampleToken();
        this.decodeAndDisplay();
      }
    },

    trackUsage(action) {
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('jwt-decoder', action);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => JWTDecoder.init());
  } else {
    JWTDecoder.init();
  }

  // Export for external access and testing
  window.JWTDecoder = JWTDecoder;

})();
