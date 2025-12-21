/**
 * Unit tests for Common Utilities
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  addEventListener: jest.fn()
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  }
});

// Mock DOM elements
document.querySelector = jest.fn(() => null);
document.querySelectorAll = jest.fn(() => []);
document.createElement = jest.fn((tag) => ({
  className: '',
  setAttribute: jest.fn(),
  appendChild: jest.fn(),
  click: jest.fn(),
  style: {},
  innerHTML: '',
  textContent: '',
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    toggle: jest.fn()
  }
}));
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

// Mock URL
global.URL.createObjectURL = jest.fn(() => 'blob:mock');
global.URL.revokeObjectURL = jest.fn();
global.Blob = jest.fn((content, options) => ({ content, options }));

// Load the module
require('../../src/js/common.js');

describe('OneDevKit Common Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Validation', () => {
    describe('isValidJSON()', () => {
      test('returns true for valid JSON object', () => {
        expect(window.OneDevKit.Validation.isValidJSON('{"key": "value"}')).toBe(true);
      });

      test('returns true for valid JSON array', () => {
        expect(window.OneDevKit.Validation.isValidJSON('[1, 2, 3]')).toBe(true);
      });

      test('returns true for JSON primitives', () => {
        expect(window.OneDevKit.Validation.isValidJSON('"string"')).toBe(true);
        expect(window.OneDevKit.Validation.isValidJSON('123')).toBe(true);
        expect(window.OneDevKit.Validation.isValidJSON('true')).toBe(true);
        expect(window.OneDevKit.Validation.isValidJSON('null')).toBe(true);
      });

      test('returns false for invalid JSON', () => {
        expect(window.OneDevKit.Validation.isValidJSON('not json')).toBe(false);
        expect(window.OneDevKit.Validation.isValidJSON('{key: value}')).toBe(false);
        expect(window.OneDevKit.Validation.isValidJSON("{'key': 'value'}")).toBe(false);
      });

      test('returns false for empty string', () => {
        expect(window.OneDevKit.Validation.isValidJSON('')).toBe(false);
      });
    });

    describe('isValidURL()', () => {
      test('returns true for valid HTTP URL', () => {
        expect(window.OneDevKit.Validation.isValidURL('http://example.com')).toBe(true);
      });

      test('returns true for valid HTTPS URL', () => {
        expect(window.OneDevKit.Validation.isValidURL('https://example.com')).toBe(true);
      });

      test('returns true for URL with path', () => {
        expect(window.OneDevKit.Validation.isValidURL('https://example.com/path/to/page')).toBe(true);
      });

      test('returns true for URL with query params', () => {
        expect(window.OneDevKit.Validation.isValidURL('https://example.com?foo=bar')).toBe(true);
      });

      test('returns false for invalid URL', () => {
        expect(window.OneDevKit.Validation.isValidURL('not a url')).toBe(false);
        expect(window.OneDevKit.Validation.isValidURL('example.com')).toBe(false);
      });
    });

    describe('isValidEmail()', () => {
      test('returns true for valid email', () => {
        expect(window.OneDevKit.Validation.isValidEmail('test@example.com')).toBe(true);
        expect(window.OneDevKit.Validation.isValidEmail('user.name@domain.co.uk')).toBe(true);
      });

      test('returns false for invalid email', () => {
        expect(window.OneDevKit.Validation.isValidEmail('not-an-email')).toBe(false);
        expect(window.OneDevKit.Validation.isValidEmail('missing@domain')).toBe(false);
        expect(window.OneDevKit.Validation.isValidEmail('@nodomain.com')).toBe(false);
        expect(window.OneDevKit.Validation.isValidEmail('spaces in@email.com')).toBe(false);
      });
    });
  });

  describe('debounce()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('delays function execution', () => {
      const fn = jest.fn();
      const debounced = window.OneDevKit.debounce(fn, 100);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('only calls function once for rapid calls', () => {
      const fn = jest.fn();
      const debounced = window.OneDevKit.debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('passes arguments to function', () => {
      const fn = jest.fn();
      const debounced = window.OneDevKit.debounce(fn, 100);

      debounced('arg1', 'arg2');
      jest.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    test('resets timer on subsequent calls', () => {
      const fn = jest.fn();
      const debounced = window.OneDevKit.debounce(fn, 100);

      debounced();
      jest.advanceTimersByTime(50);
      debounced();
      jest.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('calls function immediately on first call', () => {
      const fn = jest.fn();
      const throttled = window.OneDevKit.throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('ignores calls within limit', () => {
      const fn = jest.fn();
      const throttled = window.OneDevKit.throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('allows call after limit expires', () => {
      const fn = jest.fn();
      const throttled = window.OneDevKit.throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('passes arguments to function', () => {
      const fn = jest.fn();
      const throttled = window.OneDevKit.throttle(fn, 100);

      throttled('arg1', 'arg2');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('Toast', () => {
    test('show() creates container if not exists', () => {
      window.OneDevKit.Toast.container = null;
      window.OneDevKit.Toast.show('Test message', 'success');
      expect(document.createElement).toHaveBeenCalledWith('div');
    });

    test('show() accepts different types', () => {
      const types = ['success', 'error', 'info', 'warning'];
      types.forEach(type => {
        expect(() => window.OneDevKit.Toast.show('Message', type)).not.toThrow();
      });
    });
  });

  describe('Analytics', () => {
    test('trackEvent() calls gtag when available', () => {
      window.gtag = jest.fn();
      window.OneDevKit.Analytics.trackEvent('test_event', { param: 'value' });
      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', { param: 'value' });
    });

    test('trackEvent() does not throw when gtag unavailable', () => {
      delete window.gtag;
      expect(() => window.OneDevKit.Analytics.trackEvent('test_event')).not.toThrow();
    });

    test('trackToolUsage() sends correct event', () => {
      window.gtag = jest.fn();
      window.OneDevKit.Analytics.trackToolUsage('json-formatter', 'format');
      expect(window.gtag).toHaveBeenCalledWith('event', 'tool_usage', {
        tool_name: 'json-formatter',
        action: 'format'
      });
    });

    test('trackCopy() sends correct event', () => {
      window.gtag = jest.fn();
      window.OneDevKit.Analytics.trackCopy('uuid-generator');
      expect(window.gtag).toHaveBeenCalledWith('event', 'copy_result', {
        tool_name: 'uuid-generator'
      });
    });
  });

  describe('Download', () => {
    test('text() creates blob and triggers download', () => {
      window.OneDevKit.Download.text('content', 'file.txt', 'text/plain');
      expect(global.Blob).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    test('image() triggers download with canvas data', () => {
      const mockCanvas = {
        toDataURL: jest.fn(() => 'data:image/png;base64,mockdata')
      };
      window.OneDevKit.Download.image(mockCanvas, 'image.png');
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    });
  });

  describe('Clipboard', () => {
    test('copy() uses navigator.clipboard API', async () => {
      const result = await window.OneDevKit.Clipboard.copy('test text', null);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });
  });

  describe('Loading', () => {
    test('show() disables element', () => {
      const element = {
        innerHTML: 'Original',
        disabled: false,
        dataset: {}
      };
      window.OneDevKit.Loading.show(element);
      expect(element.disabled).toBe(true);
      expect(element.dataset.originalContent).toBe('Original');
    });

    test('hide() restores element', () => {
      const element = {
        innerHTML: 'Loading...',
        disabled: true,
        dataset: { originalContent: 'Original' }
      };
      window.OneDevKit.Loading.hide(element);
      expect(element.disabled).toBe(false);
      expect(element.innerHTML).toBe('Original');
    });

    test('show() handles null element', () => {
      expect(() => window.OneDevKit.Loading.show(null)).not.toThrow();
    });

    test('hide() handles null element', () => {
      expect(() => window.OneDevKit.Loading.hide(null)).not.toThrow();
    });
  });
});
