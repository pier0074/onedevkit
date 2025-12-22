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
      },
      snapchat: {
        name: 'Snapchat',
        presets: {
          'story': { name: 'Story/Snap', width: 1080, height: 1920 },
          'spotlight': { name: 'Spotlight', width: 1080, height: 1920 },
          'profile': { name: 'Profile Photo', width: 320, height: 320 },
          'geofilter': { name: 'Geofilter', width: 1080, height: 2340 }
        }
      },
      discord: {
        name: 'Discord',
        presets: {
          'server-icon': { name: 'Server Icon', width: 512, height: 512 },
          'server-banner': { name: 'Server Banner', width: 960, height: 540 },
          'profile': { name: 'Profile Avatar', width: 128, height: 128 },
          'emoji': { name: 'Custom Emoji', width: 128, height: 128 },
          'sticker': { name: 'Sticker', width: 320, height: 320 }
        }
      },
      twitch: {
        name: 'Twitch',
        presets: {
          'profile': { name: 'Profile Photo', width: 256, height: 256 },
          'offline-banner': { name: 'Offline Banner', width: 1920, height: 1080 },
          'video-player': { name: 'Video Player Banner', width: 1920, height: 480 },
          'panel': { name: 'Panel', width: 320, height: 160 },
          'emote': { name: 'Emote', width: 112, height: 112 }
        }
      },
      threads: {
        name: 'Threads',
        presets: {
          'post': { name: 'Post Image', width: 1080, height: 1350 },
          'post-square': { name: 'Square Post', width: 1080, height: 1080 },
          'profile': { name: 'Profile Photo', width: 320, height: 320 }
        }
      },
      whatsapp: {
        name: 'WhatsApp',
        presets: {
          'status': { name: 'Status', width: 1080, height: 1920 },
          'profile': { name: 'Profile Photo', width: 500, height: 500 },
          'group-icon': { name: 'Group Icon', width: 640, height: 640 }
        }
      },
      custom: {
        name: 'Custom',
        presets: {
          'custom': { name: 'Custom Size', width: 1080, height: 1080 }
        }
      }
    },

    // State
    currentPlatform: 'instagram',
    currentPreset: 'post-square',
    originalImage: null,
    images: [], // For batch processing
    resultBlob: null,
    customWidth: 1080,
    customHeight: 1080,

    // Transform state
    zoom: 100,
    panX: 0,
    panY: 0,
    rotation: 0, // 0, 90, 180, 270
    flipH: false,
    flipV: false,

    // Appearance
    backgroundColor: '#ffffff',
    showGrid: false,
    fitMode: 'cover', // 'cover' or 'contain'
    circleCrop: false,
    borderSize: 0,

    // Filters
    brightness: 100,
    contrast: 100,
    saturation: 100,

    // History for undo/redo
    history: [],
    historyIndex: -1,
    maxHistory: 50,

    // Pan dragging state
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    panInitialX: 0,
    panInitialY: 0,

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
      if (this.currentPlatform === 'custom') {
        return {
          name: 'Custom Size',
          width: this.customWidth,
          height: this.customHeight
        };
      }

      const platform = this.PLATFORMS[this.currentPlatform];
      if (!platform) return null;
      return platform.presets[this.currentPreset] || null;
    },

    /**
     * Save current state to history
     */
    saveState() {
      const state = {
        zoom: this.zoom,
        panX: this.panX,
        panY: this.panY,
        rotation: this.rotation,
        flipH: this.flipH,
        flipV: this.flipV,
        brightness: this.brightness,
        contrast: this.contrast,
        saturation: this.saturation,
        borderSize: this.borderSize,
        circleCrop: this.circleCrop,
        backgroundColor: this.backgroundColor,
        fitMode: this.fitMode
      };

      // Remove any states after current index
      this.history = this.history.slice(0, this.historyIndex + 1);

      // Add new state
      this.history.push(state);

      // Limit history size
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      this.historyIndex = this.history.length - 1;
      this.updateUndoRedoButtons();
    },

    /**
     * Restore state from history
     */
    restoreState(state) {
      this.zoom = state.zoom;
      this.panX = state.panX;
      this.panY = state.panY;
      this.rotation = state.rotation;
      this.flipH = state.flipH;
      this.flipV = state.flipV;
      this.brightness = state.brightness;
      this.contrast = state.contrast;
      this.saturation = state.saturation;
      this.borderSize = state.borderSize;
      this.circleCrop = state.circleCrop;
      this.backgroundColor = state.backgroundColor;
      this.fitMode = state.fitMode;

      this.updateControlsFromState();
      this.renderPreview();
    },

    /**
     * Update UI controls to match current state
     */
    updateControlsFromState() {
      const zoomSlider = document.getElementById('zoom-slider');
      const zoomValue = document.getElementById('zoom-value');
      if (zoomSlider) zoomSlider.value = this.zoom;
      if (zoomValue) zoomValue.textContent = this.zoom + '%';

      const brightnessSlider = document.getElementById('brightness-slider');
      const brightnessValue = document.getElementById('brightness-value');
      if (brightnessSlider) brightnessSlider.value = this.brightness;
      if (brightnessValue) brightnessValue.textContent = this.brightness + '%';

      const contrastSlider = document.getElementById('contrast-slider');
      const contrastValue = document.getElementById('contrast-value');
      if (contrastSlider) contrastSlider.value = this.contrast;
      if (contrastValue) contrastValue.textContent = this.contrast + '%';

      const saturationSlider = document.getElementById('saturation-slider');
      const saturationValue = document.getElementById('saturation-value');
      if (saturationSlider) saturationSlider.value = this.saturation;
      if (saturationValue) saturationValue.textContent = this.saturation + '%';

      const borderSlider = document.getElementById('border-slider');
      const borderValue = document.getElementById('border-value');
      if (borderSlider) borderSlider.value = this.borderSize;
      if (borderValue) borderValue.textContent = this.borderSize + 'px';

      const bgColor = document.getElementById('bg-color');
      if (bgColor) bgColor.value = this.backgroundColor;

      const circleBtn = document.getElementById('circle-crop');
      if (circleBtn) circleBtn.classList.toggle('active', this.circleCrop);

      const fitModeBtn = document.getElementById('fit-mode');
      if (fitModeBtn) {
        fitModeBtn.textContent = this.fitMode === 'cover' ? 'Crop to Fill' : 'Fit (Letterbox)';
        fitModeBtn.classList.toggle('active', this.fitMode === 'contain');
      }
    },

    /**
     * Update undo/redo button states
     */
    updateUndoRedoButtons() {
      const undoBtn = document.getElementById('undo-btn');
      const redoBtn = document.getElementById('redo-btn');

      if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
      if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    },

    /**
     * Undo last action
     */
    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.restoreState(this.history[this.historyIndex]);
        this.updateUndoRedoButtons();
      }
    },

    /**
     * Redo last undone action
     */
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.restoreState(this.history[this.historyIndex]);
        this.updateUndoRedoButtons();
      }
    },

    /**
     * Rotate image by degrees (90, -90, 180)
     */
    rotate(degrees) {
      this.rotation = (this.rotation + degrees + 360) % 360;
      this.saveState();
      this.renderPreview();
    },

    /**
     * Flip image horizontally
     */
    flipHorizontal() {
      this.flipH = !this.flipH;
      this.saveState();
      this.renderPreview();
    },

    /**
     * Flip image vertically
     */
    flipVertical() {
      this.flipV = !this.flipV;
      this.saveState();
      this.renderPreview();
    },

    /**
     * Center the image (reset pan)
     */
    centerImage() {
      this.panX = 0;
      this.panY = 0;
      this.saveState();
      this.renderPreview();
    },

    /**
     * Reset all transforms
     */
    resetTransforms() {
      this.zoom = 100;
      this.panX = 0;
      this.panY = 0;
      this.rotation = 0;
      this.flipH = false;
      this.flipV = false;
      this.brightness = 100;
      this.contrast = 100;
      this.saturation = 100;
      this.borderSize = 0;
      this.circleCrop = false;
      this.saveState();
      this.updateControlsFromState();
      this.renderPreview();
    },

    /**
     * Toggle circle crop
     */
    toggleCircleCrop() {
      this.circleCrop = !this.circleCrop;
      this.saveState();
      this.renderPreview();

      const circleBtn = document.getElementById('circle-crop');
      if (circleBtn) circleBtn.classList.toggle('active', this.circleCrop);
    },

    /**
     * Set border size
     */
    setBorderSize(size) {
      this.borderSize = Math.max(0, Math.min(100, parseInt(size) || 0));
      this.saveState();
      this.renderPreview();
    },

    /**
     * Set filter values
     */
    setFilter(type, value) {
      const val = Math.max(0, Math.min(200, parseInt(value) || 100));
      this[type] = val;
      this.saveState();
      this.renderPreview();
    },

    /**
     * Update custom dimensions
     */
    setCustomDimensions(width, height) {
      this.customWidth = Math.max(10, Math.min(4096, parseInt(width) || 1080));
      this.customHeight = Math.max(10, Math.min(4096, parseInt(height) || 1080));

      if (this.currentPlatform === 'custom') {
        this.PLATFORMS.custom.presets.custom.width = this.customWidth;
        this.PLATFORMS.custom.presets.custom.height = this.customHeight;
        this.updateSpecDisplay();
        if (this.originalImage) {
          this.renderPreview();
        }
      }
    },

    /**
     * Set background color
     */
    setBackgroundColor(color) {
      this.backgroundColor = color;
      this.saveState();
      if (this.originalImage) {
        this.renderPreview();
      }
    },

    /**
     * Toggle grid overlay
     */
    toggleGrid() {
      this.showGrid = !this.showGrid;
      if (this.originalImage) {
        this.renderPreview();
      }
    },

    /**
     * Set fit mode (cover or contain)
     */
    setFitMode(mode) {
      this.fitMode = mode;
      this.saveState();
      if (this.originalImage) {
        this.renderPreview();
      }
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
        btn.className = 'btn-option-lg preset-btn' + (key === this.currentPreset ? ' active' : '');
        btn.dataset.preset = key;
        btn.innerHTML = `
          <span class="option-title">${preset.name}</span>
          <span class="option-subtitle">${preset.width}×${preset.height}</span>
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

      document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.platform === platformKey);
      });

      const customOptions = document.getElementById('custom-options');
      if (customOptions) {
        customOptions.style.display = platformKey === 'custom' ? 'block' : 'none';
      }

      const platform = this.PLATFORMS[platformKey];
      if (platform) {
        const firstPreset = Object.keys(platform.presets)[0];
        this.currentPreset = firstPreset;
      }

      this.buildPresetButtons();
      this.updateSpecDisplay();

      if (this.originalImage) {
        this.renderPreview();
      }
    },

    /**
     * Select preset
     */
    selectPreset(presetKey) {
      this.currentPreset = presetKey;

      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === presetKey);
      });

      this.updateSpecDisplay();

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
     * Render the preview with current transforms
     */
    async renderPreview() {
      if (!this.originalImage) return;

      const spec = this.getCurrentSpec();
      if (!spec) return;

      const canvas = document.getElementById('preview-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      // Calculate dimensions with border
      const borderPx = Math.round((this.borderSize / 100) * Math.min(spec.width, spec.height) * 0.25);
      const innerWidth = spec.width - (borderPx * 2);
      const innerHeight = spec.height - (borderPx * 2);

      // Set canvas to spec dimensions
      canvas.width = spec.width;
      canvas.height = spec.height;

      // Fill with background color
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply circle clip if enabled
      if (this.circleCrop) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(spec.width / 2, spec.height / 2, Math.min(innerWidth, innerHeight) / 2, 0, Math.PI * 2);
        ctx.clip();
      }

      // Create temp canvas for transforms
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      const img = this.originalImage;

      // Handle rotation - swap dimensions for 90/270
      let effectiveWidth = img.width;
      let effectiveHeight = img.height;
      if (this.rotation === 90 || this.rotation === 270) {
        effectiveWidth = img.height;
        effectiveHeight = img.width;
      }

      tempCanvas.width = effectiveWidth;
      tempCanvas.height = effectiveHeight;

      // Apply transforms
      tempCtx.translate(effectiveWidth / 2, effectiveHeight / 2);
      tempCtx.rotate((this.rotation * Math.PI) / 180);
      if (this.flipH) tempCtx.scale(-1, 1);
      if (this.flipV) tempCtx.scale(1, -1);

      // Draw original image centered
      tempCtx.drawImage(img, -img.width / 2, -img.height / 2);

      // Apply filters
      if (this.brightness !== 100 || this.contrast !== 100 || this.saturation !== 100) {
        ctx.filter = `brightness(${this.brightness}%) contrast(${this.contrast}%) saturate(${this.saturation}%)`;
      }

      const scale = this.zoom / 100;
      const canvasRatio = innerWidth / innerHeight;
      const imgRatio = effectiveWidth / effectiveHeight;

      if (this.fitMode === 'contain') {
        let drawWidth, drawHeight;
        if (imgRatio > canvasRatio) {
          drawWidth = innerWidth * scale;
          drawHeight = (innerWidth / imgRatio) * scale;
        } else {
          drawHeight = innerHeight * scale;
          drawWidth = (innerHeight * imgRatio) * scale;
        }

        const drawX = borderPx + (innerWidth - drawWidth) / 2 + this.panX;
        const drawY = borderPx + (innerHeight - drawHeight) / 2 + this.panY;

        ctx.drawImage(tempCanvas, drawX, drawY, drawWidth, drawHeight);
      } else {
        // Cover mode
        let sourceWidth, sourceHeight;

        if (imgRatio > canvasRatio) {
          sourceHeight = effectiveHeight / scale;
          sourceWidth = sourceHeight * canvasRatio;
        } else {
          sourceWidth = effectiveWidth / scale;
          sourceHeight = sourceWidth / canvasRatio;
        }

        const sourceX = (effectiveWidth - sourceWidth) / 2 - (this.panX / scale);
        const sourceY = (effectiveHeight - sourceHeight) / 2 - (this.panY / scale);

        ctx.drawImage(
          tempCanvas,
          Math.max(0, Math.min(sourceX, effectiveWidth - sourceWidth)),
          Math.max(0, Math.min(sourceY, effectiveHeight - sourceHeight)),
          Math.min(sourceWidth, effectiveWidth),
          Math.min(sourceHeight, effectiveHeight),
          borderPx, borderPx,
          innerWidth, innerHeight
        );
      }

      // Reset filter
      ctx.filter = 'none';

      // Restore from circle clip
      if (this.circleCrop) {
        ctx.restore();
      }

      // Draw grid overlay if enabled
      if (this.showGrid) {
        this.drawGrid(ctx, spec.width, spec.height);
      }

      // Generate result
      await this.generateResult();
    },

    /**
     * Draw rule of thirds grid overlay
     */
    drawGrid(ctx, width, height) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(width / 3, 0);
      ctx.lineTo(width / 3, height);
      ctx.moveTo((width * 2) / 3, 0);
      ctx.lineTo((width * 2) / 3, height);
      ctx.moveTo(0, height / 3);
      ctx.lineTo(width, height / 3);
      ctx.moveTo(0, (height * 2) / 3);
      ctx.lineTo(width, (height * 2) / 3);
      ctx.stroke();

      // Shadow for visibility
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 3 + 1, 0);
      ctx.lineTo(width / 3 + 1, height);
      ctx.moveTo((width * 2) / 3 + 1, 0);
      ctx.lineTo((width * 2) / 3 + 1, height);
      ctx.moveTo(0, height / 3 + 1);
      ctx.lineTo(width, height / 3 + 1);
      ctx.moveTo(0, (height * 2) / 3 + 1);
      ctx.lineTo(width, (height * 2) / 3 + 1);
      ctx.stroke();
    },

    /**
     * Generate the result blob
     */
    async generateResult() {
      const canvas = document.getElementById('preview-canvas');
      if (!canvas) return;

      const spec = this.getCurrentSpec();
      if (!spec) return;

      // Use PNG for circle crop (transparency), otherwise JPEG
      const mimeType = this.circleCrop ? 'image/png' : 'image/jpeg';
      const quality = this.circleCrop ? undefined : 0.92;

      const blob = await new Promise(resolve => {
        canvas.toBlob(b => resolve(b), mimeType, quality);
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

        const editor = document.getElementById('editor-section');
        if (editor) editor.classList.add('show');

        // Reset all transforms
        this.zoom = 100;
        this.panX = 0;
        this.panY = 0;
        this.rotation = 0;
        this.flipH = false;
        this.flipV = false;
        this.brightness = 100;
        this.contrast = 100;
        this.saturation = 100;
        this.borderSize = 0;
        this.circleCrop = false;

        // Clear history and save initial state
        this.history = [];
        this.historyIndex = -1;
        this.saveState();

        this.updateControlsFromState();
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
      const ext = this.circleCrop ? 'png' : 'jpg';

      const filename = `${platform.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}_${spec.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${ext}`;

      link.download = filename;
      link.href = URL.createObjectURL(this.resultBlob);
      link.click();

      if (window.OneDevKit?.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('social-media-resizer', 'download');
      }
    },

    /**
     * Download as PNG
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
     * Handle batch file upload
     */
    async handleBatchFiles(files) {
      this.images = [];
      const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

      if (validFiles.length === 0) {
        this.showStatus('No valid image files selected', 'error');
        return;
      }

      this.showStatus(`Processing ${validFiles.length} images...`, 'processing');

      for (const file of validFiles) {
        try {
          const img = await this.loadImage(file);
          this.images.push({ file, img, name: file.name });
        } catch (e) {
          console.error('Failed to load:', file.name);
        }
      }

      if (this.images.length > 0) {
        this.showStatus(`${this.images.length} images ready. Click "Download All" to get ZIP.`, 'success');
        const batchDownload = document.getElementById('download-batch');
        if (batchDownload) batchDownload.disabled = false;
      }
    },

    /**
     * Download all images as individual files
     */
    async downloadBatch() {
      if (this.images.length === 0) return;

      const spec = this.getCurrentSpec();
      if (!spec) return;

      this.showStatus('Processing batch download...', 'processing');

      for (let i = 0; i < this.images.length; i++) {
        const { img, name } = this.images[i];
        this.originalImage = img;
        await this.renderPreview();

        if (this.resultBlob) {
          const link = document.createElement('a');
          const baseName = name.replace(/\.[^/.]+$/, '');
          link.download = `${baseName}_${spec.width}x${spec.height}.jpg`;
          link.href = URL.createObjectURL(this.resultBlob);
          link.click();

          await new Promise(r => setTimeout(r, 300));
        }
      }

      this.showStatus(`Downloaded ${this.images.length} images!`, 'success');
    },

    /**
     * Reset the tool
     */
    reset() {
      this.originalImage = null;
      this.resultBlob = null;
      this.images = [];
      this.zoom = 100;
      this.panX = 0;
      this.panY = 0;
      this.rotation = 0;
      this.flipH = false;
      this.flipV = false;
      this.brightness = 100;
      this.contrast = 100;
      this.saturation = 100;
      this.borderSize = 0;
      this.circleCrop = false;
      this.showGrid = false;
      this.fitMode = 'cover';
      this.history = [];
      this.historyIndex = -1;

      const editor = document.getElementById('editor-section');
      const fileInput = document.getElementById('file-input');
      const batchInput = document.getElementById('batch-input');
      const status = document.getElementById('status');
      const downloadBtn = document.getElementById('download-btn');
      const batchBtn = document.getElementById('download-batch');
      const gridBtn = document.getElementById('toggle-grid');
      const circleBtn = document.getElementById('circle-crop');

      if (editor) editor.classList.remove('show');
      if (fileInput) fileInput.value = '';
      if (batchInput) batchInput.value = '';
      if (status) status.className = 'status-message';
      if (downloadBtn) downloadBtn.disabled = true;
      if (batchBtn) batchBtn.disabled = true;
      if (gridBtn) gridBtn.classList.remove('active');
      if (circleBtn) circleBtn.classList.remove('active');

      this.updateControlsFromState();
      this.updateUndoRedoButtons();
    },

    /**
     * Handle pan start (mouse/touch down)
     */
    startPan(e) {
      if (!this.originalImage) return;

      this.isPanning = true;
      const canvas = document.getElementById('preview-canvas');
      if (canvas) canvas.style.cursor = 'grabbing';

      const point = e.touches ? e.touches[0] : e;
      this.panStartX = point.clientX;
      this.panStartY = point.clientY;
      this.panInitialX = this.panX;
      this.panInitialY = this.panY;

      e.preventDefault();
    },

    /**
     * Handle pan move (mouse/touch move)
     */
    doPan(e) {
      if (!this.isPanning) return;

      const point = e.touches ? e.touches[0] : e;
      const deltaX = point.clientX - this.panStartX;
      const deltaY = point.clientY - this.panStartY;

      // Scale the delta based on canvas display size vs actual size
      const canvas = document.getElementById('preview-canvas');
      const spec = this.getCurrentSpec();
      if (canvas && spec) {
        const scaleX = spec.width / canvas.offsetWidth;
        const scaleY = spec.height / canvas.offsetHeight;

        this.panX = this.panInitialX + (deltaX * scaleX);
        this.panY = this.panInitialY + (deltaY * scaleY);
      }

      this.renderPreview();
      e.preventDefault();
    },

    /**
     * Handle pan end (mouse/touch up)
     */
    endPan(e) {
      if (this.isPanning) {
        this.isPanning = false;
        const canvas = document.getElementById('preview-canvas');
        if (canvas) canvas.style.cursor = 'grab';
        this.saveState();
      }
    },

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
      if (!this.originalImage) return;

      // Don't trigger if focused on input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const step = e.shiftKey ? 10 : 1;

      switch (e.key) {
        case 'ArrowLeft':
          this.panX -= step * 5;
          this.saveState();
          this.renderPreview();
          e.preventDefault();
          break;
        case 'ArrowRight':
          this.panX += step * 5;
          this.saveState();
          this.renderPreview();
          e.preventDefault();
          break;
        case 'ArrowUp':
          this.panY -= step * 5;
          this.saveState();
          this.renderPreview();
          e.preventDefault();
          break;
        case 'ArrowDown':
          this.panY += step * 5;
          this.saveState();
          this.renderPreview();
          e.preventDefault();
          break;
        case '+':
        case '=':
          this.zoom = Math.min(400, this.zoom + step * 5);
          this.updateControlsFromState();
          this.saveState();
          this.renderPreview();
          e.preventDefault();
          break;
        case '-':
        case '_':
          this.zoom = Math.max(10, this.zoom - step * 5);
          this.updateControlsFromState();
          this.saveState();
          this.renderPreview();
          e.preventDefault();
          break;
        case 'r':
        case 'R':
          this.rotate(e.shiftKey ? -90 : 90);
          e.preventDefault();
          break;
        case 'h':
        case 'H':
          this.flipHorizontal();
          e.preventDefault();
          break;
        case 'v':
        case 'V':
          this.flipVertical();
          e.preventDefault();
          break;
        case 'c':
        case 'C':
          this.centerImage();
          e.preventDefault();
          break;
        case 'g':
        case 'G':
          this.toggleGrid();
          const gridBtn = document.getElementById('toggle-grid');
          if (gridBtn) gridBtn.classList.toggle('active', this.showGrid);
          e.preventDefault();
          break;
        case 'z':
        case 'Z':
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              this.redo();
            } else {
              this.undo();
            }
            e.preventDefault();
          }
          break;
        case 'y':
        case 'Y':
          if (e.ctrlKey || e.metaKey) {
            this.redo();
            e.preventDefault();
          }
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            this.resetTransforms();
            e.preventDefault();
          }
          break;
      }
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
            if (e.dataTransfer.files.length > 1) {
              this.handleBatchFiles(e.dataTransfer.files);
            } else {
              this.handleFile(e.dataTransfer.files[0]);
            }
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

      // Batch file input
      const batchInput = document.getElementById('batch-input');
      if (batchInput) {
        batchInput.addEventListener('change', e => {
          if (e.target.files?.length > 0) {
            this.handleBatchFiles(e.target.files);
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
        zoomSlider.addEventListener('change', () => {
          this.saveState();
        });
      }

      // Filter sliders
      const bindFilterSlider = (id, property, suffix = '%') => {
        const slider = document.getElementById(id);
        const valueEl = document.getElementById(id.replace('-slider', '-value'));
        if (slider) {
          slider.addEventListener('input', () => {
            this[property] = parseInt(slider.value);
            if (valueEl) valueEl.textContent = this[property] + suffix;
            this.renderPreview();
          });
          slider.addEventListener('change', () => {
            this.saveState();
          });
        }
      };

      bindFilterSlider('brightness-slider', 'brightness');
      bindFilterSlider('contrast-slider', 'contrast');
      bindFilterSlider('saturation-slider', 'saturation');

      // Border slider
      const borderSlider = document.getElementById('border-slider');
      const borderValue = document.getElementById('border-value');
      if (borderSlider) {
        borderSlider.addEventListener('input', () => {
          this.borderSize = parseInt(borderSlider.value);
          if (borderValue) borderValue.textContent = this.borderSize + 'px';
          this.renderPreview();
        });
        borderSlider.addEventListener('change', () => {
          this.saveState();
        });
      }

      // Custom dimensions
      const customWidth = document.getElementById('custom-width');
      const customHeight = document.getElementById('custom-height');
      if (customWidth && customHeight) {
        const updateCustom = () => {
          this.setCustomDimensions(customWidth.value, customHeight.value);
        };
        customWidth.addEventListener('change', updateCustom);
        customHeight.addEventListener('change', updateCustom);
      }

      // Background color
      const bgColor = document.getElementById('bg-color');
      if (bgColor) {
        bgColor.addEventListener('input', () => {
          this.backgroundColor = bgColor.value;
          this.renderPreview();
        });
        bgColor.addEventListener('change', () => {
          this.saveState();
        });
      }

      // Rotate buttons
      const rotateCW = document.getElementById('rotate-cw');
      const rotateCCW = document.getElementById('rotate-ccw');
      if (rotateCW) rotateCW.addEventListener('click', () => this.rotate(90));
      if (rotateCCW) rotateCCW.addEventListener('click', () => this.rotate(-90));

      // Flip buttons
      const flipHBtn = document.getElementById('flip-h');
      const flipVBtn = document.getElementById('flip-v');
      if (flipHBtn) flipHBtn.addEventListener('click', () => this.flipHorizontal());
      if (flipVBtn) flipVBtn.addEventListener('click', () => this.flipVertical());

      // Center button
      const centerBtn = document.getElementById('center-btn');
      if (centerBtn) centerBtn.addEventListener('click', () => this.centerImage());

      // Reset transforms
      const resetTransformsBtn = document.getElementById('reset-transforms');
      if (resetTransformsBtn) {
        resetTransformsBtn.addEventListener('click', () => this.resetTransforms());
      }

      // Undo/Redo
      const undoBtn = document.getElementById('undo-btn');
      const redoBtn = document.getElementById('redo-btn');
      if (undoBtn) undoBtn.addEventListener('click', () => this.undo());
      if (redoBtn) redoBtn.addEventListener('click', () => this.redo());

      // Fit mode toggle
      const fitModeBtn = document.getElementById('fit-mode');
      if (fitModeBtn) {
        fitModeBtn.addEventListener('click', () => {
          const newMode = this.fitMode === 'cover' ? 'contain' : 'cover';
          this.setFitMode(newMode);
          fitModeBtn.textContent = newMode === 'cover' ? 'Crop to Fill' : 'Fit (Letterbox)';
          fitModeBtn.classList.toggle('active', newMode === 'contain');
        });
      }

      // Grid toggle
      const gridBtn = document.getElementById('toggle-grid');
      if (gridBtn) {
        gridBtn.addEventListener('click', () => {
          this.toggleGrid();
          gridBtn.classList.toggle('active', this.showGrid);
        });
      }

      // Circle crop toggle
      const circleBtn = document.getElementById('circle-crop');
      if (circleBtn) {
        circleBtn.addEventListener('click', () => this.toggleCircleCrop());
      }

      // Pan/drag on canvas
      const canvas = document.getElementById('preview-canvas');
      if (canvas) {
        canvas.style.cursor = 'grab';

        canvas.addEventListener('mousedown', e => this.startPan(e));
        canvas.addEventListener('touchstart', e => this.startPan(e), { passive: false });

        document.addEventListener('mousemove', e => this.doPan(e));
        document.addEventListener('touchmove', e => this.doPan(e), { passive: false });

        document.addEventListener('mouseup', e => this.endPan(e));
        document.addEventListener('touchend', e => this.endPan(e));
      }

      // Keyboard shortcuts
      document.addEventListener('keydown', e => this.handleKeyboard(e));

      // Download buttons
      const downloadBtn = document.getElementById('download-btn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => this.download());
      }

      const downloadPngBtn = document.getElementById('download-png');
      if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', () => this.downloadPNG());
      }

      const downloadBatch = document.getElementById('download-batch');
      if (downloadBatch) {
        downloadBatch.addEventListener('click', () => this.downloadBatch());
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
      this.updateUndoRedoButtons();
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
