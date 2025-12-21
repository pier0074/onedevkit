/**
 * OneDevKit - Common JavaScript Utilities
 * Shared functionality across all tool pages
 */

(function() {
  'use strict';

  // ============================================
  // Theme Management
  // ============================================

  const ThemeManager = {
    STORAGE_KEY: 'onedevkit-theme',

    init() {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
      this.bindToggle();
    },

    bindToggle() {
      const toggleBtn = document.querySelector('.theme-toggle');
      if (!toggleBtn) return;

      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';

        // If no theme set, check system preference
        if (!current) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', prefersDark ? 'light' : 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', newTheme);
        }

        localStorage.setItem(this.STORAGE_KEY, document.documentElement.getAttribute('data-theme'));
        this.updateIcon();
      });

      this.updateIcon();
    },

    updateIcon() {
      const toggleBtn = document.querySelector('.theme-toggle');
      if (!toggleBtn) return;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.getAttribute('data-theme') &&
         window.matchMedia('(prefers-color-scheme: dark)').matches);

      toggleBtn.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';

      toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  // ============================================
  // Mobile Navigation
  // ============================================

  const MobileNav = {
    init() {
      const toggle = document.querySelector('.nav-toggle');
      const nav = document.querySelector('.nav');

      if (!toggle || !nav) return;

      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
        toggle.innerHTML = isOpen
          ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
      });

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
        }
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }
  };

  // ============================================
  // Copy to Clipboard
  // ============================================

  const Clipboard = {
    async copy(text, button) {
      try {
        await navigator.clipboard.writeText(text);
        this.showSuccess(button);
        Toast.show('Copied to clipboard!', 'success');
        return true;
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
          document.execCommand('copy');
          this.showSuccess(button);
          Toast.show('Copied to clipboard!', 'success');
          return true;
        } catch (e) {
          Toast.show('Failed to copy', 'error');
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },

    showSuccess(button) {
      if (!button) return;

      const originalContent = button.innerHTML;
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
      }, 2000);
    }
  };

  // ============================================
  // Toast Notifications
  // ============================================

  const Toast = {
    container: null,

    init() {
      if (this.container) return;

      this.container = document.createElement('div');
      this.container.className = 'toast';
      this.container.setAttribute('role', 'status');
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 3000) {
      this.init();

      this.container.textContent = message;
      this.container.className = `toast toast-${type}`;

      // Force reflow
      void this.container.offsetWidth;

      this.container.classList.add('show');

      setTimeout(() => {
        this.container.classList.remove('show');
      }, duration);
    }
  };

  // ============================================
  // FAQ Accordion
  // ============================================

  const FAQ = {
    init() {
      const items = document.querySelectorAll('.faq-item');

      items.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        // Set initial ARIA attributes
        const id = 'faq-' + Math.random().toString(36).substr(2, 9);
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', id);
        answer.id = id;

        question.addEventListener('click', () => {
          const isOpen = item.classList.toggle('open');
          question.setAttribute('aria-expanded', isOpen);
        });
      });
    }
  };

  // ============================================
  // Loading States
  // ============================================

  const Loading = {
    show(element) {
      if (!element) return;

      element.dataset.originalContent = element.innerHTML;
      element.innerHTML = '<span class="loading"><span class="spinner"></span> Processing...</span>';
      element.disabled = true;
    },

    hide(element) {
      if (!element || !element.dataset.originalContent) return;

      element.innerHTML = element.dataset.originalContent;
      element.disabled = false;
      delete element.dataset.originalContent;
    }
  };

  // ============================================
  // Form Validation Helpers
  // ============================================

  const Validation = {
    isValidJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    },

    isValidURL(str) {
      try {
        new URL(str);
        return true;
      } catch (e) {
        return false;
      }
    },

    isValidEmail(str) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    }
  };

  // ============================================
  // Debounce & Throttle
  // ============================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ============================================
  // Analytics Events (GA4 compatible)
  // ============================================

  const Analytics = {
    trackEvent(eventName, params = {}) {
      if (typeof gtag === 'function') {
        gtag('event', eventName, params);
      }
    },

    trackToolUsage(toolName, action) {
      this.trackEvent('tool_usage', {
        tool_name: toolName,
        action: action
      });
    },

    trackCopy(toolName) {
      this.trackEvent('copy_result', {
        tool_name: toolName
      });
    }
  };

  // ============================================
  // Download Helper
  // ============================================

  const Download = {
    text(content, filename, mimeType = 'text/plain') {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    image(canvas, filename) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // ============================================
  // Initialization
  // ============================================

  function init() {
    ThemeManager.init();
    MobileNav.init();
    FAQ.init();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // Export to global namespace
  // ============================================

  window.OneDevKit = {
    Clipboard,
    Toast,
    Loading,
    Validation,
    Analytics,
    Download,
    debounce,
    throttle
  };

})();
