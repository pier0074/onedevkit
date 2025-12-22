/**
 * OneDevKit - Social Media Image Resizer
 * Resize images for Instagram, LinkedIn, Twitter, Facebook, and more
 * Pure vanilla JS, no libraries
 */

(function() {
  'use strict';

  const SocialMediaResizer = {
    // Platform specifications
    PLATFORMS: {
      instagram: {
        name: 'Instagram',
        presets: {
          'post-square': { name: 'Square Post', width: 1080, height: 1080 },
          'post-portrait': { name: 'Portrait Post', width: 1080, height: 1350 },
          'post-landscape': { name: 'Landscape Post', width: 1080, height: 566 },
          'story': { name: 'Story/Reel', width: 1080, height: 1920 },
          'profile': { name: 'Profile Photo', width: 320, height: 320 }
        }
      },
      linkedin: {
        name: 'LinkedIn',
        presets: {
          'post': { name: 'Post Image', width: 1200, height: 627 },
          'cover': { name: 'Cover Photo', width: 1584, height: 396 },
          'profile': { name: 'Profile Photo', width: 400, height: 400 },
          'company-logo': { name: 'Company Logo', width: 300, height: 300 }
        }
      },
      twitter: {
        name: 'Twitter/X',
        presets: {
          'post': { name: 'Post Image', width: 1600, height: 900 },
          'header': { name: 'Header Photo', width: 1500, height: 500 },
          'profile': { name: 'Profile Photo', width: 400, height: 400 }
        }
      },
      facebook: {
        name: 'Facebook',
        presets: {
          'post': { name: 'Post Image', width: 1200, height: 630 },
          'cover': { name: 'Cover Photo', width: 820, height: 312 },
          'profile': { name: 'Profile Photo', width: 170, height: 170 },
          'event': { name: 'Event Cover', width: 1920, height: 1080 }
        }
      },
      youtube: {
        name: 'YouTube',
        presets: {
          'thumbnail': { name: 'Video Thumbnail', width: 1280, height: 720 },
          'channel-art': { name: 'Channel Art', width: 2560, height: 1440 },
          'profile': { name: 'Profile Photo', width: 800, height: 800 }
        }
      },
      pinterest: {
        name: 'Pinterest',
        presets: {
          'pin': { name: 'Standard Pin', width: 1000, height: 1500 },
          'pin-square': { name: 'Square Pin', width: 1000, height: 1000 }
        }
      },
      tiktok: {
        name: 'TikTok',
        presets: {
          'video': { name: 'Video/Cover', width: 1080, height: 1920 },
          'profile': { name: 'Profile Photo', width: 200, height: 200 }
        }
      }
    },

    currentPlatform: 'instagram',
    currentPreset: 'post-square',
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
     * Get current specification
     */
    getCurrentSpec() {
      const platform = this.PLATFORMS[this.currentPlatform];
      if (!platform) return null;
      return platform.presets[this.currentPreset] || null;
    },

    /**
     * Build preset buttons for selected platform
     */
    buildPresetButtons() {
      const container = document.getElementById('preset-buttons');
      if (!container) return;

      const platform = this.PLATFORMS[this.currentPlatform];
      if (!platform) return;

      container.innerHTML = '';

      Object.entries(platform.presets).forEach(([key, preset]) => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn' + (key === this.currentPreset ? ' active' : '');
        btn.dataset.preset = key;
        btn.innerHTML = `
          <span class="preset-name">${preset.name}</span>
          <span class="preset-size">${preset.width}×${preset.height}</span>
        `;
        btn.addEventListener('click', () => this.selectPreset(key));
        container.appendChild(btn);
      });
    },

    /**
     * Select platform
     */
    selectPlatform(platformKey) {
      this.currentPlatform = platformKey;

      // Update platform button states
      document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.platform === platformKey);
      });

      // Set default preset for platform
      const platform = this.PLATFORMS[platformKey];
      if (platform) {
        const firstPreset = Object.keys(platform.presets)[0];
        this.currentPreset = firstPreset;
      }

      // Rebuild preset buttons
      this.buildPresetButtons();

      // Update display
      this.updateSpecDisplay();

      // Re-render preview if image loaded
      if (this.originalImage) {
        this.renderPreview();
      }
    },

    /**
     * Select preset
     */
    selectPreset(presetKey) {
      this.currentPreset = presetKey;

      // Update preset button states
      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === presetKey);
      });

      // Update display
      this.updateSpecDisplay();

      // Re-render preview if image loaded
      if (this.originalImage) {
        this.renderPreview();
      }
    },

    /**
     * Update specification display
     */
    updateSpecDisplay() {
      const spec = this.getCurrentSpec();
      if (!spec) return;

      const specName = document.getElementById('spec-name');
      const specDimensions = document.getElementById('spec-dimensions');
      const specRatio = document.getElementById('spec-ratio');

      if (specName) specName.textContent = spec.name;
      if (specDimensions) specDimensions.textContent = `${spec.width}×${spec.height}px`;
      if (specRatio) {
        const gcd = this.gcd(spec.width, spec.height);
        specRatio.textContent = `${spec.width/gcd}:${spec.height/gcd}`;
      }
    },

    /**
     * Greatest common divisor for aspect ratio
     */
    gcd(a, b) {
      return b === 0 ? a : this.gcd(b, a % b);
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
      if (!this.originalImage) return;

      const spec = this.getCurrentSpec();
      if (!spec) return;

      const canvas = document.getElementById('preview-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      // Set canvas to spec dimensions
      canvas.width = spec.width;
      canvas.height = spec.height;

      // Fill with background color
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate source dimensions based on zoom
      const img = this.originalImage;
      const scale = this.zoom / 100;

      // Calculate aspect ratios
      const canvasRatio = spec.width / spec.height;
      const imgRatio = img.width / img.height;

      let sourceWidth, sourceHeight;

      // Fit image to cover canvas area
      if (imgRatio > canvasRatio) {
        // Image is wider - fit by height
        sourceHeight = img.height / scale;
        sourceWidth = sourceHeight * canvasRatio;
      } else {
        // Image is taller - fit by width
        sourceWidth = img.width / scale;
        sourceHeight = sourceWidth / canvasRatio;
      }

      // Center crop with offset
      const sourceX = (img.width - sourceWidth) / 2 + this.offsetX;
      const sourceY = (img.height - sourceHeight) / 2 + this.offsetY;

      // Draw the cropped/zoomed image
      ctx.drawImage(
        img,
        Math.max(0, Math.min(sourceX, img.width - sourceWidth)),
        Math.max(0, Math.min(sourceY, img.height - sourceHeight)),
        Math.min(sourceWidth, img.width),
        Math.min(sourceHeight, img.height),
        0, 0,
        spec.width, spec.height
      );

      // Generate result
      await this.generateResult();
    },

    /**
     * Generate the result blob
     */
    async generateResult() {
      const canvas = document.getElementById('preview-canvas');
      if (!canvas) return;

      const spec = this.getCurrentSpec();
      if (!spec) return;

      // Use high quality JPEG
      const blob = await new Promise(resolve => {
        canvas.toBlob(b => resolve(b), 'image/jpeg', 0.92);
      });

      this.resultBlob = blob;
      this.updatePreviewStats(blob);
    },

    /**
     * Update preview statistics
     */
    updatePreviewStats(blob) {
      const spec = this.getCurrentSpec();
      const dimensions = document.getElementById('preview-dimensions');
      const filesize = document.getElementById('preview-filesize');
      const downloadBtn = document.getElementById('download-btn');

      if (dimensions) dimensions.textContent = `${spec.width}×${spec.height}px`;
      if (filesize) filesize.textContent = this.formatSize(blob.size);
      if (downloadBtn) downloadBtn.disabled = false;
    },

    /**
     * Handle file upload
     */
    async handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        this.showStatus('Please select a valid image file', 'error');
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        this.showStatus('File too large. Maximum 20MB.', 'error');
        return;
      }

      try {
        this.showStatus('Loading image...', 'processing');
        this.originalImage = await this.loadImage(file);

        // Show editor
        const editor = document.getElementById('editor-section');
        if (editor) editor.classList.add('show');

        // Reset zoom and offset
        this.zoom = 100;
        this.offsetX = 0;
        this.offsetY = 0;

        const zoomSlider = document.getElementById('zoom-slider');
        if (zoomSlider) zoomSlider.value = 100;

        const zoomValue = document.getElementById('zoom-value');
        if (zoomValue) zoomValue.textContent = '100%';

        // Initial render
        await this.renderPreview();
        this.showStatus('Image loaded! Adjust and download.', 'success');

        if (window.OneDevKit?.Analytics) {
          window.OneDevKit.Analytics.trackToolUsage('social-media-resizer', 'upload');
        }
      } catch (error) {
        console.error('Error loading image:', error);
        this.showStatus('Error loading image. Please try another file.', 'error');
      }
    },

    /**
     * Download the resized image
     */
    download() {
      if (!this.resultBlob) return;

      const spec = this.getCurrentSpec();
      const link = document.createElement('a');
      const platform = this.PLATFORMS[this.currentPlatform];

      const filename = `${platform.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}_${spec.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;

      link.download = filename;
      link.href = URL.createObjectURL(this.resultBlob);
      link.click();

      if (window.OneDevKit?.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('social-media-resizer', 'download');
      }
    },

    /**
     * Download as PNG (higher quality, larger file)
     */
    async downloadPNG() {
      const canvas = document.getElementById('preview-canvas');
      if (!canvas) return;

      const blob = await new Promise(resolve => {
        canvas.toBlob(b => resolve(b), 'image/png');
      });

      const spec = this.getCurrentSpec();
      const platform = this.PLATFORMS[this.currentPlatform];
      const filename = `${platform.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}_${spec.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
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

      if (editor) editor.classList.remove('show');
      if (fileInput) fileInput.value = '';
      if (status) status.className = 'status-message';
      if (downloadBtn) downloadBtn.disabled = true;
    },

    /**
     * Bind events
     */
    bindEvents() {
      // Platform buttons
      document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.selectPlatform(btn.dataset.platform);
        });
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

      const downloadPngBtn = document.getElementById('download-png');
      if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', () => this.downloadPNG());
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
      this.buildPresetButtons();
      this.updateSpecDisplay();
    }
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SocialMediaResizer.init());
  } else {
    SocialMediaResizer.init();
  }

  window.SocialMediaResizer = SocialMediaResizer;

})();
