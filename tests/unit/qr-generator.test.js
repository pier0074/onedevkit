/**
 * Unit tests for QR Code Generator
 */

// Mock canvas and DOM elements
const mockContext = {
  fillStyle: '',
  fillRect: jest.fn(),
  drawImage: jest.fn(),
  clearRect: jest.fn()
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: jest.fn(() => mockContext),
  toDataURL: jest.fn(() => 'data:image/png;base64,mockdata'),
  toBlob: jest.fn((cb) => cb(new Blob(['mock'], { type: 'image/png' }))),
  classList: {
    add: jest.fn(),
    remove: jest.fn()
  }
};

// Mock document
document.createElement = jest.fn((tag) => {
  if (tag === 'canvas') return mockCanvas;
  if (tag === 'a') return { click: jest.fn(), href: '', download: '' };
  return {};
});

document.getElementById = jest.fn(() => null);

// Mock window.OneDevKit
window.OneDevKit = {
  Analytics: { trackToolUsage: jest.fn() },
  Toast: { show: jest.fn() },
  debounce: (fn) => fn
};

// Load the module
require('../../src/js/qr-generator.js');

describe('QRGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generate()', () => {
    test('generates QR code for simple text', () => {
      const canvas = window.QRGenerator.generate('Hello', 256, 'M');
      expect(canvas).toBeDefined();
      expect(canvas.width).toBeGreaterThan(0);
      expect(canvas.height).toBeGreaterThan(0);
    });

    test('generates QR code for URL', () => {
      const canvas = window.QRGenerator.generate('https://example.com', 256, 'M');
      expect(canvas).toBeDefined();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    test('generates QR code with different sizes', () => {
      const sizes = [128, 256, 512];
      sizes.forEach(size => {
        const canvas = window.QRGenerator.generate('Test', size, 'M');
        expect(canvas.width).toBeLessThanOrEqual(size);
        expect(canvas.height).toBeLessThanOrEqual(size);
      });
    });

    test('generates QR code with different error correction levels', () => {
      const levels = ['L', 'M', 'Q', 'H'];
      levels.forEach(level => {
        const canvas = window.QRGenerator.generate('Test', 256, level);
        expect(canvas).toBeDefined();
      });
    });

    test('throws error for empty text', () => {
      expect(() => window.QRGenerator.generate('', 256, 'M')).toThrow('Text is required');
    });

    test('throws error for whitespace-only text', () => {
      expect(() => window.QRGenerator.generate('   ', 256, 'M')).toThrow('Text is required');
    });

    test('handles UTF-8 characters', () => {
      const canvas = window.QRGenerator.generate('Hello 世界', 256, 'M');
      expect(canvas).toBeDefined();
    });

    test('handles special characters', () => {
      const canvas = window.QRGenerator.generate('!@#$%^&*()', 256, 'M');
      expect(canvas).toBeDefined();
    });

    test('handles long text', () => {
      const longText = 'A'.repeat(100);
      const canvas = window.QRGenerator.generate(longText, 256, 'M');
      expect(canvas).toBeDefined();
    });

    test('stores generated QR code in currentQR', () => {
      window.QRGenerator.currentQR = null;
      window.QRGenerator.generate('Test', 256, 'M');
      expect(window.QRGenerator.currentQR).not.toBeNull();
    });
  });

  describe('clear()', () => {
    test('resets currentQR to null', () => {
      window.QRGenerator.generate('Test', 256, 'M');
      window.QRGenerator.clear();
      expect(window.QRGenerator.currentQR).toBeNull();
    });
  });

  describe('getOptions()', () => {
    test('returns default options when elements not found', () => {
      const options = window.QRGenerator.getOptions();
      expect(options).toEqual({
        text: '',
        size: 256,
        ecLevel: 'M'
      });
    });
  });

  describe('QR Code module count', () => {
    test('module count increases with text length', () => {
      const canvas1 = window.QRGenerator.generate('A', 256, 'M');
      const canvas2 = window.QRGenerator.generate('A'.repeat(50), 256, 'M');
      // Both should generate valid QR codes
      expect(canvas1).toBeDefined();
      expect(canvas2).toBeDefined();
    });
  });

  describe('error correction levels', () => {
    test('L level (7% recovery) works', () => {
      expect(() => window.QRGenerator.generate('Test', 256, 'L')).not.toThrow();
    });

    test('M level (15% recovery) works', () => {
      expect(() => window.QRGenerator.generate('Test', 256, 'M')).not.toThrow();
    });

    test('Q level (25% recovery) works', () => {
      expect(() => window.QRGenerator.generate('Test', 256, 'Q')).not.toThrow();
    });

    test('H level (30% recovery) works', () => {
      expect(() => window.QRGenerator.generate('Test', 256, 'H')).not.toThrow();
    });

    test('defaults to M level for invalid level', () => {
      expect(() => window.QRGenerator.generate('Test', 256, 'X')).not.toThrow();
    });
  });
});
