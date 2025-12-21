/**
 * OneDevKit - Unix Timestamp Converter
 * Convert between Unix timestamps and human-readable dates
 */

(function() {
  'use strict';

  const TimestampConverter = {
    updateInterval: null,

    /**
     * Get current Unix timestamp (seconds)
     */
    getCurrentTimestamp() {
      return Math.floor(Date.now() / 1000);
    },

    /**
     * Get current Unix timestamp (milliseconds)
     */
    getCurrentTimestampMs() {
      return Date.now();
    },

    /**
     * Convert timestamp to Date object
     */
    timestampToDate(timestamp) {
      // Handle both seconds and milliseconds
      const ts = Number(timestamp);
      if (isNaN(ts)) {
        throw new Error('Invalid timestamp');
      }

      // If timestamp is less than year 2001 in milliseconds, assume seconds
      const isSeconds = ts < 1000000000000;
      return new Date(isSeconds ? ts * 1000 : ts);
    },

    /**
     * Convert Date to timestamp (seconds)
     */
    dateToTimestamp(date) {
      return Math.floor(date.getTime() / 1000);
    },

    /**
     * Convert Date to timestamp (milliseconds)
     */
    dateToTimestampMs(date) {
      return date.getTime();
    },

    /**
     * Format date to local string
     */
    formatLocal(date) {
      return date.toLocaleString();
    },

    /**
     * Format date to UTC string
     */
    formatUTC(date) {
      return date.toUTCString();
    },

    /**
     * Format date to ISO 8601
     */
    formatISO(date) {
      return date.toISOString();
    },

    /**
     * Get relative time string
     */
    getRelativeTime(date) {
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      const diffWeek = Math.floor(diffDay / 7);
      const diffMonth = Math.floor(diffDay / 30);
      const diffYear = Math.floor(diffDay / 365);

      const isFuture = diffMs < 0;
      const abs = (val) => Math.abs(val);

      let result;
      if (abs(diffSec) < 60) {
        result = abs(diffSec) + ' seconds';
      } else if (abs(diffMin) < 60) {
        result = abs(diffMin) + ' minutes';
      } else if (abs(diffHour) < 24) {
        result = abs(diffHour) + ' hours';
      } else if (abs(diffDay) < 7) {
        result = abs(diffDay) + ' days';
      } else if (abs(diffWeek) < 4) {
        result = abs(diffWeek) + ' weeks';
      } else if (abs(diffMonth) < 12) {
        result = abs(diffMonth) + ' months';
      } else {
        result = abs(diffYear) + ' years';
      }

      return isFuture ? 'in ' + result : result + ' ago';
    },

    /**
     * Initialize the tool
     */
    init() {
      this.bindEvents();
      this.startLiveUpdate();
      this.setDefaultDateTime();
    },

    bindEvents() {
      // Convert timestamp to date
      const convertToDateBtn = document.getElementById('convert-to-date');
      if (convertToDateBtn) {
        convertToDateBtn.addEventListener('click', () => this.convertToDate());
      }

      // Use current timestamp
      const useCurrentBtn = document.getElementById('use-current');
      if (useCurrentBtn) {
        useCurrentBtn.addEventListener('click', () => this.useCurrent());
      }

      // Convert date to timestamp
      const convertToTimestampBtn = document.getElementById('convert-to-timestamp');
      if (convertToTimestampBtn) {
        convertToTimestampBtn.addEventListener('click', () => this.convertToTimestamp());
      }

      // Use now for date input
      const useNowBtn = document.getElementById('use-now');
      if (useNowBtn) {
        useNowBtn.addEventListener('click', () => this.useNow());
      }

      // Auto-convert on timestamp input
      const timestampInput = document.getElementById('timestamp-input');
      if (timestampInput) {
        timestampInput.addEventListener('input', () => {
          if (timestampInput.value) {
            this.convertToDate();
          }
        });
      }

      // Auto-convert on date input
      const dateInput = document.getElementById('date-input');
      if (dateInput) {
        dateInput.addEventListener('change', () => {
          if (dateInput.value) {
            this.convertToTimestamp();
          }
        });
      }
    },

    startLiveUpdate() {
      const updateDisplay = () => {
        const currentEl = document.getElementById('current-timestamp');
        if (currentEl) {
          currentEl.textContent = this.getCurrentTimestamp();
        }
      };

      updateDisplay();
      this.updateInterval = setInterval(updateDisplay, 1000);
    },

    setDefaultDateTime() {
      const dateInput = document.getElementById('date-input');
      if (dateInput) {
        const now = new Date();
        // Format for datetime-local: YYYY-MM-DDTHH:MM
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
    },

    convertToDate() {
      const input = document.getElementById('timestamp-input')?.value;
      if (!input) return;

      try {
        const date = this.timestampToDate(input);

        document.getElementById('result-local').textContent = this.formatLocal(date);
        document.getElementById('result-utc').textContent = this.formatUTC(date);
        document.getElementById('result-iso').textContent = this.formatISO(date);
        document.getElementById('result-relative').textContent = this.getRelativeTime(date);

        this.trackUsage('timestamp-to-date');
      } catch (e) {
        document.getElementById('result-local').textContent = 'Invalid timestamp';
        document.getElementById('result-utc').textContent = '-';
        document.getElementById('result-iso').textContent = '-';
        document.getElementById('result-relative').textContent = '-';
      }
    },

    convertToTimestamp() {
      const input = document.getElementById('date-input')?.value;
      if (!input) return;

      try {
        const date = new Date(input);
        const timestamp = this.dateToTimestamp(date);
        const timestampMs = this.dateToTimestampMs(date);

        document.getElementById('result-timestamp').textContent = timestamp;
        document.getElementById('result-timestamp-ms').textContent = timestampMs;

        this.trackUsage('date-to-timestamp');
      } catch (e) {
        document.getElementById('result-timestamp').textContent = 'Invalid date';
        document.getElementById('result-timestamp-ms').textContent = '-';
      }
    },

    useCurrent() {
      const timestampInput = document.getElementById('timestamp-input');
      if (timestampInput) {
        timestampInput.value = this.getCurrentTimestamp();
        this.convertToDate();
      }
    },

    useNow() {
      this.setDefaultDateTime();
      this.convertToTimestamp();
    },

    trackUsage(action) {
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('timestamp-converter', action);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TimestampConverter.init());
  } else {
    TimestampConverter.init();
  }

  // Export for external access and testing
  window.TimestampConverter = TimestampConverter;

})();
