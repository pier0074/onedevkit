/**
 * OneDevKit - Passport Photo Maker
 * Create passport photos for any country with correct dimensions and file size
 * Pure vanilla JS, no libraries
 */

(function() {
  'use strict';

  const PassportPhoto = {
    // Country specifications
    SPECS: {
      usa: {
        name: 'USA Passport',
        size: '2×2 inches',
        width: 600,
        height: 600,
        maxKB: 240,
        background: 'White'
      },
      india: {
        name: 'India Passport/Visa',
        size: '2×2 inches',
        width: 600,
        height: 600,
        maxKB: 300,
        minKB: 20,
        background: 'White'
      },
      uk: {
        name: 'UK Passport',
        size: '35×45mm',
        width: 413,
        height: 531,
        maxKB: 10240,
        background: 'Light grey'
      },
      schengen: {
        name: 'Schengen Visa',
        size: '35×45mm',
        width: 413,
        height: 531,
        maxKB: 2048,
        background: 'White/Light'
      },
      canada: {
        name: 'Canada Passport',
        size: '50×70mm',
        width: 590,
        height: 826,
        maxKB: 4096,
        background: 'White'
      },
      australia: {
        name: 'Australia Passport',
        size: '35×45mm',
        width: 413,
        height: 531,
        maxKB: 2048,
        background: 'White'
      },
      china: {
        name: 'China Visa',
        size: '33×48mm',
        width: 390,
        height: 567,
        maxKB: 500,
        background: 'White'
      },
      japan: {
        name: 'Japan Passport',
        size: '35×45mm',
        width: 413,
        height: 531,
        maxKB: 2048,
        background: 'White'
      },
      singapore: {
        name: 'Singapore Passport',
        size: '35×45mm',
        width: 400,
        height: 514,
        maxKB: 2048,
        background: 'White'
      },
      custom: {
        name: 'Custom',
        size: 'Custom',
        width: 600,
        height: 600,
        maxKB: 200,
        background: 'Any'
      }
    },

    currentSpec: null,
    originalImage: null,
    zoom: 100,
    offsetX: 0,
    offsetY: 0,
    resultBlob: null,

    /**
     * Format file size
     */
    formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    },

    /**
     * Update specification display
     */
    updateSpecDisplay(specKey) {
      const spec = this.SPECS[specKey];
      if (!spec) return;

      this.currentSpec = spec;

      // Update display elements
      const specSize = document.getElementById('spec-size');
      const specPixels = document.getElementById('spec-pixels');
      const specFilesize = document.getElementById('spec-filesize');
      const specBackground = document.getElementById('spec-background');

      if (specSize) specSize.textContent = spec.size;
      if (specPixels) specPixels.textContent = spec.width + '×' + spec.height + 'px';
      if (specFilesize) specFilesize.textContent = spec.maxKB >= 1024 ?
        (spec.maxKB / 1024).toFixed(0) + 'MB' : spec.maxKB + 'KB';
      if (specBackground) specBackground.textContent = spec.background;

      // Show/hide custom options
      const customOptions = document.getElementById('custom-options');
      if (customOptions) {
        customOptions.style.display = specKey === 'custom' ? 'block' : 'none';
      }

      // Re-render preview if image loaded
      if (this.originalImage) {
        this.renderPreview();
      }
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
     * Show status message
     */
    showStatus(message, type) {
      const status = document.getElementById('status');
      if (status) {
        status.textContent = message;
        status.className = 'status-message show ' + type;
      }
    },

    /**
     * Render the preview with current zoom and crop
     */
    async renderPreview() {
      if (!this.originalImage || !this.currentSpec) return;

      const canvas = document.getElementById('preview-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const spec = this.currentSpec;

      // Set canvas to spec dimensions
      canvas.width = spec.width;
      canvas.height = spec.height;

      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate source dimensions based on zoom
      const img = this.originalImage;
      const scale = this.zoom / 100;

      // Calculate how much of the image to show
      const sourceWidth = spec.width / scale;
      const sourceHeight = spec.height / scale;

      // Center crop
      const sourceX = (img.width - sourceWidth) / 2 + this.offsetX;
      const sourceY = (img.height - sourceHeight) / 2 + this.offsetY;

      // Draw the cropped/zoomed image
      ctx.drawImage(
        img,
        Math.max(0, sourceX),
        Math.max(0, sourceY),
        Math.min(sourceWidth, img.width),
        Math.min(sourceHeight, img.height),
        0, 0,
        spec.width, spec.height
      );

      // Compress and get result
      await this.compressResult();
    },

    /**
     * Compress the preview canvas to meet size requirements
     */
    async compressResult() {
      const canvas = document.getElementById('preview-canvas');
      if (!canvas || !this.currentSpec) return;

      const spec = this.currentSpec;
      const targetBytes = spec.maxKB * 1024;

      // Binary search for optimal quality
      let minQ = 0.1;
      let maxQ = 1.0;
      let bestBlob = null;

      for (let i = 0; i < 10; i++) {
        const midQ = (minQ + maxQ) / 2;
        const blob = await new Promise(resolve => {
          canvas.toBlob(b => resolve(b), 'image/jpeg', midQ);
        });

        if (blob.size <= targetBytes) {
          bestBlob = blob;
          minQ = midQ;
        } else {
          maxQ = midQ;
        }

        if (bestBlob && Math.abs(bestBlob.size - targetBytes) < targetBytes * 0.1) {
          break;
        }
      }

      if (!bestBlob) {
        bestBlob = await new Promise(resolve => {
          canvas.toBlob(b => resolve(b), 'image/jpeg', 0.1);
        });
      }

      this.resultBlob = bestBlob;
      this.updatePreviewStats(bestBlob);
    },

    /**
     * Update preview statistics
     */
    updatePreviewStats(blob) {
      const spec = this.currentSpec;
      const dimensions = document.getElementById('preview-dimensions');
      const filesize = document.getElementById('preview-filesize');
      const status = document.getElementById('preview-status');
      const downloadBtn = document.getElementById('download-btn');
      const downloadPrint = document.getElementById('download-print');

      if (dimensions) dimensions.textContent = spec.width + '×' + spec.height + 'px';
      if (filesize) filesize.textContent = this.formatSize(blob.size);

      const isValid = blob.size <= spec.maxKB * 1024;
      if (status) {
        status.textContent = isValid ? 'Ready' : 'File too large';
        status.className = 'value ' + (isValid ? 'success' : '');
      }

      if (downloadBtn) downloadBtn.disabled = false;
      if (downloadPrint) downloadPrint.disabled = false;
    },

    /**
     * Handle file upload
     */
    async handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        this.showStatus('Please select a valid image file', 'error');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.showStatus('File too large. Maximum 10MB.', 'error');
        return;
      }

      try {
        this.showStatus('Loading image...', 'processing');
        this.originalImage = await this.loadImage(file);

        // Show editor
        const editor = document.getElementById('editor-section');
        const sourceImg = document.getElementById('source-image');

        if (editor) editor.classList.add('show');
        if (sourceImg) sourceImg.src = this.originalImage.src;

        // Reset zoom and offset
        this.zoom = 100;
        this.offsetX = 0;
        this.offsetY = 0;

        const zoomSlider = document.getElementById('zoom-slider');
        if (zoomSlider) zoomSlider.value = 100;

        // Initial render
        await this.renderPreview();
        this.showStatus('Photo loaded! Adjust zoom and download.', 'success');

        if (window.OneDevKit?.Analytics) {
          window.OneDevKit.Analytics.trackToolUsage('passport-photo', 'upload');
        }
      } catch (error) {
        console.error('Error loading image:', error);
        this.showStatus('Error loading image. Please try another file.', 'error');
      }
    },

    /**
     * Download the passport photo
     */
    download() {
      if (!this.resultBlob) return;

      const link = document.createElement('a');
      const countrySelect = document.getElementById('country');
      const country = countrySelect?.value || 'passport';

      link.download = `${country}_photo.jpg`;
      link.href = URL.createObjectURL(this.resultBlob);
      link.click();

      if (window.OneDevKit?.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('passport-photo', 'download');
      }
    },

    /**
     * Create print layout (4x6 with multiple photos)
     */
    async downloadPrintLayout() {
      if (!this.resultBlob || !this.currentSpec) return;

      const spec = this.currentSpec;

      // 4x6 inch at 300 DPI
      const printWidth = 1800;
      const printHeight = 1200;

      const canvas = document.createElement('canvas');
      canvas.width = printWidth;
      canvas.height = printHeight;
      const ctx = canvas.getContext('2d');

      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, printWidth, printHeight);

      // Load the result image
      const img = new Image();
      await new Promise(resolve => {
        img.onload = resolve;
        img.src = URL.createObjectURL(this.resultBlob);
      });

      // Calculate photo size for print (approximately)
      const photoWidth = 300; // ~1 inch at 300 DPI
      const photoHeight = 300;
      const padding = 50;

      // Draw grid of photos
      const cols = Math.floor((printWidth - padding) / (photoWidth + padding));
      const rows = Math.floor((printHeight - padding) / (photoHeight + padding));

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = padding + col * (photoWidth + padding);
          const y = padding + row * (photoHeight + padding);
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
        }
      }

      // Download
      canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.download = 'passport_print_layout.jpg';
        link.href = URL.createObjectURL(blob);
        link.click();
      }, 'image/jpeg', 0.95);
    },

    /**
     * Reset the tool
     */
    reset() {
      this.originalImage = null;
      this.resultBlob = null;
      this.zoom = 100;
      this.offsetX = 0;
      this.offsetY = 0;

      const editor = document.getElementById('editor-section');
      const fileInput = document.getElementById('file-input');
      const status = document.getElementById('status');
      const downloadBtn = document.getElementById('download-btn');
      const downloadPrint = document.getElementById('download-print');

      if (editor) editor.classList.remove('show');
      if (fileInput) fileInput.value = '';
      if (status) status.className = 'status-message';
      if (downloadBtn) downloadBtn.disabled = true;
      if (downloadPrint) downloadPrint.disabled = true;
    },

    /**
     * Bind events
     */
    bindEvents() {
      // Country selector
      const countrySelect = document.getElementById('country');
      if (countrySelect) {
        countrySelect.addEventListener('change', () => {
          this.updateSpecDisplay(countrySelect.value);
        });
      }

      // Custom size inputs
      ['custom-width', 'custom-height', 'custom-maxkb'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('change', () => {
            this.SPECS.custom.width = parseInt(document.getElementById('custom-width')?.value) || 600;
            this.SPECS.custom.height = parseInt(document.getElementById('custom-height')?.value) || 600;
            this.SPECS.custom.maxKB = parseInt(document.getElementById('custom-maxkb')?.value) || 200;
            this.updateSpecDisplay('custom');
          });
        }
      });

      // Upload zone
      const uploadZone = document.getElementById('upload-zone');
      const fileInput = document.getElementById('file-input');

      if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());

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
          if (e.dataTransfer.files.length) {
            this.handleFile(e.dataTransfer.files[0]);
          }
        });
      }

      if (fileInput) {
        fileInput.addEventListener('change', e => {
          if (e.target.files?.length) {
            this.handleFile(e.target.files[0]);
          }
        });
      }

      // Zoom slider
      const zoomSlider = document.getElementById('zoom-slider');
      const zoomValue = document.getElementById('zoom-value');
      if (zoomSlider) {
        zoomSlider.addEventListener('input', () => {
          this.zoom = parseInt(zoomSlider.value);
          if (zoomValue) zoomValue.textContent = this.zoom + '%';
          this.renderPreview();
        });
      }

      // Download buttons
      const downloadBtn = document.getElementById('download-btn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => this.download());
      }

      const downloadPrint = document.getElementById('download-print');
      if (downloadPrint) {
        downloadPrint.addEventListener('click', () => this.downloadPrintLayout());
      }

      // Reset
      const resetBtn = document.getElementById('reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.reset());
      }
    },

    /**
     * Initialize
     */
    init() {
      this.bindEvents();
      this.updateSpecDisplay('usa');
    }
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PassportPhoto.init());
  } else {
    PassportPhoto.init();
  }

  window.PassportPhoto = PassportPhoto;

})();
