/**
 * Image Compressor Unit Tests
 * Note: Full image compression testing requires browser Canvas API
 * These tests cover utility functions only
 */

// Mock DOM elements
document.body.innerHTML = `
  <div id="upload-zone"></div>
  <input type="file" id="file-input">
  <div class="size-btn" data-size="20">20 KB</div>
  <div class="size-btn" data-size="50">50 KB</div>
  <div class="size-btn active" data-size="100">100 KB</div>
  <div id="custom-size" style="display: none;"></div>
  <input type="number" id="custom-kb" value="150">
  <div id="status"></div>
  <div id="preview-section"></div>
  <img id="original-preview">
  <img id="compressed-preview">
  <div id="original-size"></div>
  <div id="compressed-size"></div>
  <div id="result-stats" style="display: none;"></div>
  <div id="reduction-percent"></div>
  <div id="dimensions"></div>
  <div id="quality-used"></div>
  <button id="download-btn" disabled></button>
  <button id="reset-btn"></button>
`;

// Load the module
require('../../src/js/image-compressor.js');

describe('ImageCompressor', () => {
  beforeEach(() => {
    ImageCompressor.targetSizeKB = 100;
    ImageCompressor.originalFile = null;
    ImageCompressor.compressedBlob = null;
  });

  describe('formatSize', () => {
    test('formats bytes correctly', () => {
      expect(ImageCompressor.formatSize(500)).toBe('500 B');
      expect(ImageCompressor.formatSize(1024)).toBe('1.0 KB');
      expect(ImageCompressor.formatSize(1536)).toBe('1.5 KB');
      expect(ImageCompressor.formatSize(102400)).toBe('100.0 KB');
    });

    test('formats megabytes correctly', () => {
      expect(ImageCompressor.formatSize(1048576)).toBe('1.00 MB');
      expect(ImageCompressor.formatSize(2621440)).toBe('2.50 MB');
    });
  });

  describe('showStatus', () => {
    test('shows status message with correct class', () => {
      ImageCompressor.showStatus('Processing...', 'processing');
      const status = document.getElementById('status');
      expect(status.textContent).toBe('Processing...');
      expect(status.className).toContain('processing');
    });

    test('shows success message', () => {
      ImageCompressor.showStatus('Done!', 'success');
      const status = document.getElementById('status');
      expect(status.textContent).toBe('Done!');
      expect(status.className).toContain('success');
    });
  });

  describe('hideStatus', () => {
    test('hides status message', () => {
      ImageCompressor.showStatus('Test', 'processing');
      ImageCompressor.hideStatus();
      const status = document.getElementById('status');
      expect(status.className).toBe('compression-status');
    });
  });

  describe('setTargetSize', () => {
    test('updates target size', () => {
      ImageCompressor.setTargetSize(50);
      expect(ImageCompressor.targetSizeKB).toBe(50);
    });
  });

  describe('reset', () => {
    test('resets all state', () => {
      ImageCompressor.originalFile = { name: 'test.jpg' };
      ImageCompressor.compressedBlob = new Blob();

      ImageCompressor.reset();

      expect(ImageCompressor.originalFile).toBeNull();
      expect(ImageCompressor.compressedBlob).toBeNull();
    });
  });

  describe('initialization', () => {
    test('module is initialized', () => {
      expect(ImageCompressor).toBeDefined();
      expect(typeof ImageCompressor.compress).toBe('function');
      expect(typeof ImageCompressor.formatSize).toBe('function');
    });
  });
});
