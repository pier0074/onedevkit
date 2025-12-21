/**
 * OneDevKit - Cookie Consent Banner
 * GDPR / CCPA compliant cookie consent management
 */

(function() {
  'use strict';

  const CookieConsent = {
    STORAGE_KEY: 'onedevkit-cookie-consent',
    CONSENT_VERSION: '1.0', // Increment to re-ask consent

    init() {
      const consent = this.getConsent();

      if (!consent || consent.version !== this.CONSENT_VERSION) {
        this.showBanner();
      } else if (consent.accepted) {
        this.loadAnalytics();
      }

      this.bindEvents();
    },

    getConsent() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    },

    setConsent(accepted) {
      const consent = {
        accepted: accepted,
        version: this.CONSENT_VERSION,
        timestamp: new Date().toISOString()
      };

      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
      } catch (e) {
        // localStorage not available
      }

      if (accepted) {
        this.loadAnalytics();
      }

      this.hideBanner();
    },

    showBanner() {
      const banner = document.querySelector('.cookie-banner');
      if (banner) {
        // Small delay to trigger CSS transition
        setTimeout(() => {
          banner.classList.add('show');
        }, 100);
      }
    },

    hideBanner() {
      const banner = document.querySelector('.cookie-banner');
      if (banner) {
        banner.classList.remove('show');
      }
    },

    bindEvents() {
      const acceptBtn = document.querySelector('[data-cookie-accept]');
      const rejectBtn = document.querySelector('[data-cookie-reject]');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
          this.setConsent(true);
        });
      }

      if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
          this.setConsent(false);
        });
      }
    },

    loadAnalytics() {
      // Only load if not already loaded
      if (window.gaLoaded) return;

      // Google Analytics 4
      // Replace GA_MEASUREMENT_ID with your actual ID when you have one
      const GA_MEASUREMENT_ID = 'G-CL9VJLP0CB';

      // Don't load if placeholder ID
      if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });

      window.gtag = gtag;
      window.gaLoaded = true;
    },

    // Method to check if user has consented (for conditional features)
    hasConsented() {
      const consent = this.getConsent();
      return consent && consent.accepted && consent.version === this.CONSENT_VERSION;
    },

    // Method to reset consent (for privacy page link)
    resetConsent() {
      localStorage.removeItem(this.STORAGE_KEY);
      this.showBanner();
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
  } else {
    CookieConsent.init();
  }

  // Export for external access
  window.CookieConsent = CookieConsent;

})();
