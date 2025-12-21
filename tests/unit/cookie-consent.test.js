/**
 * Unit tests for Cookie Consent
 */

// Store original functions
const originalCreateElement = document.createElement.bind(document);
const originalHeadAppendChild = document.head.appendChild.bind(document.head);

// Mock localStorage
let mockStorage = {};
const localStorageMock = {
  getItem: jest.fn(key => mockStorage[key] || null),
  setItem: jest.fn((key, value) => { mockStorage[key] = value; }),
  removeItem: jest.fn(key => { delete mockStorage[key]; }),
  clear: jest.fn(() => { mockStorage = {}; })
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Create mock banner element
const mockBanner = document.createElement('div');
mockBanner.className = 'cookie-banner';

// Mock querySelector
const originalQuerySelector = document.querySelector.bind(document);
document.querySelector = jest.fn((selector) => {
  if (selector === '.cookie-banner') return mockBanner;
  if (selector === '[data-cookie-accept]') {
    const btn = document.createElement('button');
    return btn;
  }
  if (selector === '[data-cookie-reject]') {
    const btn = document.createElement('button');
    return btn;
  }
  return originalQuerySelector(selector);
});

// Track script creation
let scriptCreated = false;
const originalCreateElementFn = document.createElement.bind(document);
document.createElement = jest.fn((tag) => {
  if (tag === 'script') {
    scriptCreated = true;
  }
  return originalCreateElementFn(tag);
});

// Mock head appendChild to track calls
const appendChildSpy = jest.spyOn(document.head, 'appendChild');

// Mock dataLayer
window.dataLayer = [];

// Load the module
require('../../src/js/cookie-consent.js');

describe('CookieConsent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage = {};
    window.gaLoaded = false;
    scriptCreated = false;
    mockBanner.classList.remove('show');
  });

  describe('STORAGE_KEY', () => {
    test('has correct storage key', () => {
      expect(window.CookieConsent.STORAGE_KEY).toBe('onedevkit-cookie-consent');
    });
  });

  describe('CONSENT_VERSION', () => {
    test('has consent version defined', () => {
      expect(window.CookieConsent.CONSENT_VERSION).toBe('1.0');
    });
  });

  describe('getConsent()', () => {
    test('returns null when no consent stored', () => {
      const consent = window.CookieConsent.getConsent();
      expect(consent).toBeNull();
    });

    test('returns parsed consent object when stored', () => {
      const storedConsent = {
        accepted: true,
        version: '1.0',
        timestamp: '2024-01-01T00:00:00.000Z'
      };
      mockStorage['onedevkit-cookie-consent'] = JSON.stringify(storedConsent);

      const consent = window.CookieConsent.getConsent();
      expect(consent).toEqual(storedConsent);
    });

    test('returns null for invalid JSON', () => {
      mockStorage['onedevkit-cookie-consent'] = 'invalid json';
      const consent = window.CookieConsent.getConsent();
      expect(consent).toBeNull();
    });
  });

  describe('setConsent()', () => {
    test('stores accepted consent in localStorage', () => {
      window.CookieConsent.setConsent(true);

      expect(localStorageMock.setItem).toHaveBeenCalled();
      const storedValue = JSON.parse(mockStorage['onedevkit-cookie-consent']);
      expect(storedValue.accepted).toBe(true);
      expect(storedValue.version).toBe('1.0');
      expect(storedValue.timestamp).toBeDefined();
    });

    test('stores rejected consent in localStorage', () => {
      window.CookieConsent.setConsent(false);

      const storedValue = JSON.parse(mockStorage['onedevkit-cookie-consent']);
      expect(storedValue.accepted).toBe(false);
    });

    test('hides banner after setting consent', () => {
      mockBanner.classList.add('show');
      window.CookieConsent.setConsent(true);
      expect(mockBanner.classList.contains('show')).toBe(false);
    });

    test('loads analytics when accepted', () => {
      window.gaLoaded = false;
      window.CookieConsent.setConsent(true);
      expect(window.gaLoaded).toBe(true);
    });

    test('does not load analytics when rejected', () => {
      window.gaLoaded = false;
      appendChildSpy.mockClear();
      window.CookieConsent.setConsent(false);
      // gaLoaded should still be false after rejection
      expect(window.gaLoaded).toBe(false);
    });
  });

  describe('hasConsented()', () => {
    test('returns falsy when no consent stored', () => {
      mockStorage = {};
      expect(window.CookieConsent.hasConsented()).toBeFalsy();
    });

    test('returns true when accepted with current version', () => {
      mockStorage['onedevkit-cookie-consent'] = JSON.stringify({
        accepted: true,
        version: '1.0',
        timestamp: new Date().toISOString()
      });

      expect(window.CookieConsent.hasConsented()).toBe(true);
    });

    test('returns false when rejected', () => {
      mockStorage['onedevkit-cookie-consent'] = JSON.stringify({
        accepted: false,
        version: '1.0',
        timestamp: new Date().toISOString()
      });

      expect(window.CookieConsent.hasConsented()).toBe(false);
    });

    test('returns false when version mismatch', () => {
      mockStorage['onedevkit-cookie-consent'] = JSON.stringify({
        accepted: true,
        version: '0.9', // Old version
        timestamp: new Date().toISOString()
      });

      expect(window.CookieConsent.hasConsented()).toBe(false);
    });
  });

  describe('resetConsent()', () => {
    test('removes consent from localStorage', () => {
      mockStorage['onedevkit-cookie-consent'] = JSON.stringify({
        accepted: true,
        version: '1.0'
      });

      window.CookieConsent.resetConsent();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('onedevkit-cookie-consent');
    });

    test('shows banner after reset', (done) => {
      mockBanner.classList.remove('show');
      window.CookieConsent.resetConsent();

      // Banner is shown with setTimeout, so we need to wait
      setTimeout(() => {
        expect(mockBanner.classList.contains('show')).toBe(true);
        done();
      }, 150);
    });
  });

  describe('showBanner()', () => {
    test('adds show class to banner with delay', (done) => {
      mockBanner.classList.remove('show');
      window.CookieConsent.showBanner();

      // Should not be called immediately
      expect(mockBanner.classList.contains('show')).toBe(false);

      // Should be called after delay
      setTimeout(() => {
        expect(mockBanner.classList.contains('show')).toBe(true);
        done();
      }, 150);
    });
  });

  describe('hideBanner()', () => {
    test('removes show class from banner', () => {
      mockBanner.classList.add('show');
      window.CookieConsent.hideBanner();
      expect(mockBanner.classList.contains('show')).toBe(false);
    });
  });

  describe('loadAnalytics()', () => {
    test('creates script element for GA', () => {
      window.gaLoaded = false;
      scriptCreated = false;

      window.CookieConsent.loadAnalytics();

      expect(scriptCreated).toBe(true);
      expect(appendChildSpy).toHaveBeenCalled();
    });

    test('does not load twice', () => {
      window.gaLoaded = true;
      appendChildSpy.mockClear();
      scriptCreated = false;

      window.CookieConsent.loadAnalytics();

      expect(scriptCreated).toBe(false);
    });

    test('sets gaLoaded flag after loading', () => {
      window.gaLoaded = false;
      window.CookieConsent.loadAnalytics();

      expect(window.gaLoaded).toBe(true);
    });

    test('initializes dataLayer', () => {
      window.dataLayer = undefined;
      window.gaLoaded = false;

      window.CookieConsent.loadAnalytics();

      expect(window.dataLayer).toBeDefined();
      expect(Array.isArray(window.dataLayer)).toBe(true);
    });

    test('creates global gtag function', () => {
      window.gtag = undefined;
      window.gaLoaded = false;

      window.CookieConsent.loadAnalytics();

      expect(typeof window.gtag).toBe('function');
    });
  });

  describe('consent object structure', () => {
    test('consent has required fields', () => {
      window.CookieConsent.setConsent(true);
      const stored = JSON.parse(mockStorage['onedevkit-cookie-consent']);

      expect(stored).toHaveProperty('accepted');
      expect(stored).toHaveProperty('version');
      expect(stored).toHaveProperty('timestamp');
    });

    test('timestamp is valid ISO string', () => {
      window.CookieConsent.setConsent(true);
      const stored = JSON.parse(mockStorage['onedevkit-cookie-consent']);

      const date = new Date(stored.timestamp);
      expect(date.toISOString()).toBe(stored.timestamp);
    });
  });
});
