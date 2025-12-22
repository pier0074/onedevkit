/**
 * OneDevKit - Image Compressor
 * Compress images to specific KB size using Canvas API
 * Pure vanilla JS, no libraries
 */

(function() {
  'use strict';

  const ImageCompressor = {
    targetSizeKB: 100,
    originalFile: null,
    compressedBlob: null,

    /**
     * Format file size for display
     */
    formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    },

    /**
     * Load image from file
     */
    loadImage(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    },

    /**
     * Draw image to canvas with optional resize
     */
    drawToCanvas(img, maxWidth, maxHeight) {
      let width = img.width;
      let height = img.height;

      // Scale down if needed
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      return canvas;
    },

    /**
     * Convert canvas to blob with given quality
     */
    canvasToBlob(canvas, quality) {
      return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
      });
    },

    /**
     * Binary search to find optimal quality for target size
     */
    async findOptimalQuality(canvas, targetBytes) {
      let minQuality = 0.01;
      let maxQuality = 1.0;
      let bestBlob = null;
      let iterations = 0;
      const maxIterations = 15;

      while (iterations < maxIterations) {
        const midQuality = (minQuality + maxQuality) / 2;
        const blob = await this.canvasToBlob(canvas, midQuality);

        if (blob.size <= targetBytes) {
          bestBlob = blob;
          minQuality = midQuality;
        } else {
          maxQuality = midQuality;
        }

        // Close enough (within 5% of target or very close)
        if (bestBlob && Math.abs(bestBlob.size - targetBytes) < targetBytes * 0.05) {
          break;
        }

        iterations++;
      }

      // If still too big, return smallest we got
      if (!bestBlob) {
        bestBlob = await this.canvasToBlob(canvas, 0.01);
      }

      return {
        blob: bestBlob,
        quality: (minQuality * 100).toFixed(0)
      };
    },

    /**
     * Main compression function
     */
    async compress(file, targetKB) {
      const targetBytes = targetKB * 1024;
      const img = await this.loadImage(file);

      this.showStatus('Compressing...', 'processing');

      // Start with original dimensions
      let canvas = this.drawToCanvas(img);
      let result = await this.findOptimalQuality(canvas, targetBytes);

      // If still too big, progressively reduce dimensions
      let scale = 1.0;
      let attempts = 0;

      while (result.blob.size > targetBytes && scale > 0.1 && attempts < 10) {
        scale -= 0.1;
        const newWidth = Math.round(img.width * scale);
        const newHeight = Math.round(img.height * scale);

        canvas = this.drawToCanvas(img, newWidth, newHeight);
        result = await this.findOptimalQuality(canvas, targetBytes);
        attempts++;
      }

      this.compressedBlob = result.blob;

      return {
        blob: result.blob,
        quality: result.quality,
        width: canvas.width,
        height: canvas.height,
        originalSize: file.size,
        compressedSize: result.blob.size
      };
    },

    /**
     * Show status message
     */
    showStatus(message, type) {
      const status = document.getElementById('status');
      if (status) {
        status.textContent = message;
        status.className = 'compression-status show ' + type;
      }
    },

    /**
     * Hide status
     */
    hideStatus() {
      const status = document.getElementById('status');
      if (status) {
        status.className = 'compression-status';
      }
    },

    /**
     * Display compression results
     */
    displayResults(result) {
      const previewSection = document.getElementById('preview-section');
      const originalPreview = document.getElementById('original-preview');
      const compressedPreview = document.getElementById('compressed-preview');
      const originalSize = document.getElementById('original-size');
      const compressedSize = document.getElementById('compressed-size');
      const resultStats = document.getElementById('result-stats');
      const reductionPercent = document.getElementById('reduction-percent');
      const dimensions = document.getElementById('dimensions');
      const qualityUsed = document.getElementById('quality-used');
      const downloadBtn = document.getElementById('download-btn');

      // Show preview section
      if (previewSection) previewSection.classList.add('show');

      // Set previews
      if (originalPreview && this.originalFile) {
        originalPreview.src = URL.createObjectURL(this.originalFile);
      }
      if (compressedPreview && result.blob) {
        compressedPreview.src = URL.createObjectURL(result.blob);
      }

      // Set sizes
      if (originalSize) {
        originalSize.textContent = this.formatSize(result.originalSize);
      }
      if (compressedSize) {
        compressedSize.textContent = this.formatSize(result.compressedSize);
        compressedSize.classList.toggle('success', result.compressedSize <= this.targetSizeKB * 1024);
      }

      // Set stats
      if (resultStats) resultStats.style.display = 'flex';

      const reduction = ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1);
      if (reductionPercent) reductionPercent.textContent = reduction + '%';
      if (dimensions) dimensions.textContent = result.width + ' × ' + result.height;
      if (qualityUsed) qualityUsed.textContent = result.quality + '%';

      // Enable download
      if (downloadBtn) downloadBtn.disabled = false;

      // Update status
      if (result.compressedSize <= this.targetSizeKB * 1024) {
        this.showStatus('Success! Compressed to ' + this.formatSize(result.compressedSize), 'success');
      } else {
        this.showStatus('Compressed to ' + this.formatSize(result.compressedSize) + ' (minimum achievable)', 'success');
      }
    },

    /**
     * Handle file selection
     */
    async handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        this.showStatus('Please select a valid image file', 'error');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.showStatus('File too large. Maximum 10MB allowed.', 'error');
        return;
      }

      this.originalFile = file;

      try {
        const result = await this.compress(file, this.targetSizeKB);
        this.displayResults(result);

        if (window.OneDevKit && window.OneDevKit.Analytics) {
          window.OneDevKit.Analytics.trackToolUsage('image-compressor', 'compress');
        }
      } catch (error) {
        console.error('Compression error:', error);
        this.showStatus('Error compressing image. Please try another file.', 'error');
      }
    },

    /**
     * Download compressed image
     */
    download() {
      if (!this.compressedBlob || !this.originalFile) return;

      const link = document.createElement('a');
      const originalName = this.originalFile.name.replace(/\.[^.]+$/, '');
      link.download = originalName + '_compressed.jpg';
      link.href = URL.createObjectURL(this.compressedBlob);
      link.click();

      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('image-compressor', 'download');
      }
    },

    /**
     * Reset the tool
     */
    reset() {
      this.originalFile = null;
      this.compressedBlob = null;

      const previewSection = document.getElementById('preview-section');
      const resultStats = document.getElementById('result-stats');
      const downloadBtn = document.getElementById('download-btn');
      const fileInput = document.getElementById('file-input');

      if (previewSection) previewSection.classList.remove('show');
      if (resultStats) resultStats.style.display = 'none';
      if (downloadBtn) downloadBtn.disabled = true;
      if (fileInput) fileInput.value = '';

      this.hideStatus();
    },

    /**
     * Set target size from preset or custom input
     */
    setTargetSize(sizeKB) {
      this.targetSizeKB = sizeKB;

      // If file already loaded, recompress
      if (this.originalFile) {
        this.handleFile(this.originalFile);
      }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      const uploadZone = document.getElementById('upload-zone');
      const fileInput = document.getElementById('file-input');
      const downloadBtn = document.getElementById('download-btn');
      const resetBtn = document.getElementById('reset-btn');
      const customSizeDiv = document.getElementById('custom-size');
      const customKBInput = document.getElementById('custom-kb');

      // Upload zone click
      if (uploadZone) {
        uploadZone.addEventListener('click', () => fileInput?.click());

        // Drag and drop
        uploadZone.addEventListener('dragover', e => {
          e.preventDefault();
          uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
          uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', e => {
          e.preventDefault();
          uploadZone.classList.remove('dragover');
          const files = e.dataTransfer.files;
          if (files.length) this.handleFile(files[0]);
        });
      }

      // File input change
      if (fileInput) {
        fileInput.addEventListener('change', e => {
          const file = e.target.files?.[0];
          if (file) this.handleFile(file);
        });
      }

      // Size preset buttons
      document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active state
          document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const size = btn.dataset.size;

          if (size === 'custom') {
            if (customSizeDiv) customSizeDiv.style.display = 'flex';
            const customValue = parseInt(customKBInput?.value, 10) || 100;
            this.setTargetSize(customValue);
          } else {
            if (customSizeDiv) customSizeDiv.style.display = 'none';
            this.setTargetSize(parseInt(size, 10));
          }
        });
      });

      // Custom KB input
      if (customKBInput) {
        customKBInput.addEventListener('change', () => {
          const value = parseInt(customKBInput.value, 10);
          if (value >= 5 && value <= 5000) {
            this.setTargetSize(value);
          }
        });
      }

      // Download button
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => this.download());
      }

      // Reset button
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.reset());
      }
    },

    /**
     * Initialize the tool
     */
    init() {
      this.bindEvents();
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ImageCompressor.init());
  } else {
    ImageCompressor.init();
  }

  // Export for testing
  window.ImageCompressor = ImageCompressor;

})();
