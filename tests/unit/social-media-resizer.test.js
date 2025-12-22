/**
 * Social Media Image Resizer Unit Tests
 * Note: Full image processing testing requires browser Canvas API
 * These tests cover utility functions and specifications
 */

// Mock DOM elements
document.body.innerHTML = `
  <button class="btn-option platform-btn active" data-platform="instagram">Instagram</button>
  <button class="btn-option platform-btn" data-platform="facebook">Facebook</button>
  <button class="btn-option platform-btn" data-platform="twitter">Twitter/X</button>
  <button class="btn-option platform-btn" data-platform="linkedin">LinkedIn</button>
  <button class="btn-option platform-btn" data-platform="youtube">YouTube</button>
  <button class="btn-option platform-btn" data-platform="tiktok">TikTok</button>
  <button class="btn-option platform-btn" data-platform="pinterest">Pinterest</button>
  <button class="btn-option platform-btn" data-platform="snapchat">Snapchat</button>
  <button class="btn-option platform-btn" data-platform="whatsapp">WhatsApp</button>
  <button class="btn-option platform-btn" data-platform="discord">Discord</button>
  <button class="btn-option platform-btn" data-platform="twitch">Twitch</button>
  <button class="btn-option platform-btn" data-platform="threads">Threads</button>
  <button class="btn-option platform-btn" data-platform="custom">Custom</button>
  <div id="custom-options" style="display: none;"></div>
  <input type="number" id="custom-width" value="1080">
  <input type="number" id="custom-height" value="1080">
  <div id="preset-buttons"></div>
  <div id="spec-name"></div>
  <div id="spec-dimensions"></div>
  <div id="spec-ratio"></div>
  <div id="upload-zone"></div>
  <input type="file" id="file-input">
  <input type="file" id="batch-input" multiple>
  <div id="status"></div>
  <div id="editor-section"></div>
  <canvas id="preview-canvas"></canvas>
  <div id="preview-dimensions"></div>
  <div id="preview-filesize"></div>
  <input type="range" id="zoom-slider" value="100">
  <span id="zoom-value">100%</span>
  <input type="color" id="bg-color" value="#ffffff">
  <button id="fit-mode">Crop to Fill</button>
  <button id="toggle-grid">Show Grid</button>
  <button id="download-btn" disabled></button>
  <button id="download-png"></button>
  <button id="download-batch" disabled></button>
  <button id="reset-btn"></button>
`;

// Load the module
require('../../src/js/social-media-resizer.js');

describe('SocialMediaResizer', () => {
  beforeEach(() => {
    SocialMediaResizer.originalImage = null;
    SocialMediaResizer.resultBlob = null;
    SocialMediaResizer.zoom = 100;
    SocialMediaResizer.panX = 0;
    SocialMediaResizer.panY = 0;
    SocialMediaResizer.rotation = 0;
    SocialMediaResizer.flipH = false;
    SocialMediaResizer.flipV = false;
    SocialMediaResizer.brightness = 100;
    SocialMediaResizer.contrast = 100;
    SocialMediaResizer.saturation = 100;
    SocialMediaResizer.borderSize = 0;
    SocialMediaResizer.circleCrop = false;
    SocialMediaResizer.currentPlatform = 'instagram';
    SocialMediaResizer.currentPreset = 'post-square';
    SocialMediaResizer.history = [];
    SocialMediaResizer.historyIndex = -1;
  });

  describe('PLATFORMS', () => {
    test('has Instagram platform', () => {
      const instagram = SocialMediaResizer.PLATFORMS.instagram;
      expect(instagram).toBeDefined();
      expect(instagram.name).toBe('Instagram');
      expect(instagram.presets['post-square']).toBeDefined();
      expect(instagram.presets['post-square'].width).toBe(1080);
      expect(instagram.presets['post-square'].height).toBe(1080);
    });

    test('has LinkedIn platform', () => {
      const linkedin = SocialMediaResizer.PLATFORMS.linkedin;
      expect(linkedin).toBeDefined();
      expect(linkedin.presets.post.width).toBe(1200);
      expect(linkedin.presets.post.height).toBe(627);
    });

    test('has Twitter platform', () => {
      const twitter = SocialMediaResizer.PLATFORMS.twitter;
      expect(twitter).toBeDefined();
      expect(twitter.presets.post.width).toBe(1600);
      expect(twitter.presets.post.height).toBe(900);
    });

    test('has Facebook platform', () => {
      const facebook = SocialMediaResizer.PLATFORMS.facebook;
      expect(facebook).toBeDefined();
      expect(facebook.presets.post.width).toBe(1200);
      expect(facebook.presets.post.height).toBe(630);
    });

    test('has YouTube platform', () => {
      const youtube = SocialMediaResizer.PLATFORMS.youtube;
      expect(youtube).toBeDefined();
      expect(youtube.presets.thumbnail.width).toBe(1280);
      expect(youtube.presets.thumbnail.height).toBe(720);
    });

    test('has Pinterest platform', () => {
      const pinterest = SocialMediaResizer.PLATFORMS.pinterest;
      expect(pinterest).toBeDefined();
      expect(pinterest.presets.pin.width).toBe(1000);
      expect(pinterest.presets.pin.height).toBe(1500);
    });

    test('has TikTok platform', () => {
      const tiktok = SocialMediaResizer.PLATFORMS.tiktok;
      expect(tiktok).toBeDefined();
      expect(tiktok.presets.video.width).toBe(1080);
      expect(tiktok.presets.video.height).toBe(1920);
    });

    test('has all expected platforms', () => {
      const expectedPlatforms = ['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'pinterest', 'tiktok', 'snapchat', 'discord', 'twitch', 'threads', 'whatsapp', 'custom'];
      expectedPlatforms.forEach(platform => {
        expect(SocialMediaResizer.PLATFORMS[platform]).toBeDefined();
      });
    });

    test('has Snapchat platform', () => {
      const snapchat = SocialMediaResizer.PLATFORMS.snapchat;
      expect(snapchat).toBeDefined();
      expect(snapchat.presets.story.width).toBe(1080);
      expect(snapchat.presets.story.height).toBe(1920);
    });

    test('has Discord platform', () => {
      const discord = SocialMediaResizer.PLATFORMS.discord;
      expect(discord).toBeDefined();
      expect(discord.presets['server-icon'].width).toBe(512);
      expect(discord.presets['server-icon'].height).toBe(512);
    });

    test('has Twitch platform', () => {
      const twitch = SocialMediaResizer.PLATFORMS.twitch;
      expect(twitch).toBeDefined();
      expect(twitch.presets['offline-banner'].width).toBe(1920);
    });

    test('has Threads platform', () => {
      const threads = SocialMediaResizer.PLATFORMS.threads;
      expect(threads).toBeDefined();
      expect(threads.presets.post.width).toBe(1080);
    });

    test('has WhatsApp platform', () => {
      const whatsapp = SocialMediaResizer.PLATFORMS.whatsapp;
      expect(whatsapp).toBeDefined();
      expect(whatsapp.presets.status.width).toBe(1080);
      expect(whatsapp.presets.status.height).toBe(1920);
    });

    test('has Custom platform', () => {
      const custom = SocialMediaResizer.PLATFORMS.custom;
      expect(custom).toBeDefined();
      expect(custom.presets.custom).toBeDefined();
    });
  });

  describe('Instagram presets', () => {
    test('has square post preset', () => {
      const preset = SocialMediaResizer.PLATFORMS.instagram.presets['post-square'];
      expect(preset.width).toBe(1080);
      expect(preset.height).toBe(1080);
    });

    test('has portrait post preset', () => {
      const preset = SocialMediaResizer.PLATFORMS.instagram.presets['post-portrait'];
      expect(preset.width).toBe(1080);
      expect(preset.height).toBe(1350);
    });

    test('has story preset', () => {
      const preset = SocialMediaResizer.PLATFORMS.instagram.presets.story;
      expect(preset.width).toBe(1080);
      expect(preset.height).toBe(1920);
    });
  });

  describe('formatSize', () => {
    test('formats bytes correctly', () => {
      expect(SocialMediaResizer.formatSize(500)).toBe('500 B');
      expect(SocialMediaResizer.formatSize(1024)).toBe('1.0 KB');
      expect(SocialMediaResizer.formatSize(102400)).toBe('100.0 KB');
      expect(SocialMediaResizer.formatSize(1048576)).toBe('1.00 MB');
    });
  });

  describe('gcd', () => {
    test('calculates greatest common divisor', () => {
      expect(SocialMediaResizer.gcd(1080, 1080)).toBe(1080);
      expect(SocialMediaResizer.gcd(1920, 1080)).toBe(120);
      expect(SocialMediaResizer.gcd(1200, 627)).toBe(3);
    });
  });

  describe('getCurrentSpec', () => {
    test('returns current spec for Instagram', () => {
      SocialMediaResizer.currentPlatform = 'instagram';
      SocialMediaResizer.currentPreset = 'post-square';
      const spec = SocialMediaResizer.getCurrentSpec();
      expect(spec.width).toBe(1080);
      expect(spec.height).toBe(1080);
    });

    test('returns current spec for YouTube thumbnail', () => {
      SocialMediaResizer.currentPlatform = 'youtube';
      SocialMediaResizer.currentPreset = 'thumbnail';
      const spec = SocialMediaResizer.getCurrentSpec();
      expect(spec.width).toBe(1280);
      expect(spec.height).toBe(720);
    });
  });

  describe('showStatus', () => {
    test('shows status message', () => {
      SocialMediaResizer.showStatus('Loading...', 'processing');
      const status = document.getElementById('status');
      expect(status.textContent).toBe('Loading...');
      expect(status.className).toContain('processing');
    });
  });

  describe('reset', () => {
    test('resets all state', () => {
      SocialMediaResizer.originalImage = { src: 'test' };
      SocialMediaResizer.resultBlob = new Blob();
      SocialMediaResizer.zoom = 150;

      SocialMediaResizer.reset();

      expect(SocialMediaResizer.originalImage).toBeNull();
      expect(SocialMediaResizer.resultBlob).toBeNull();
      expect(SocialMediaResizer.zoom).toBe(100);
    });
  });

  describe('selectPlatform', () => {
    test('changes current platform', () => {
      SocialMediaResizer.selectPlatform('linkedin');
      expect(SocialMediaResizer.currentPlatform).toBe('linkedin');
    });

    test('sets default preset for new platform', () => {
      SocialMediaResizer.selectPlatform('youtube');
      expect(SocialMediaResizer.currentPreset).toBe('thumbnail');
    });
  });

  describe('selectPreset', () => {
    test('changes current preset', () => {
      SocialMediaResizer.selectPreset('story');
      expect(SocialMediaResizer.currentPreset).toBe('story');
    });
  });

  describe('setCustomDimensions', () => {
    test('sets custom width and height', () => {
      SocialMediaResizer.currentPlatform = 'custom';
      SocialMediaResizer.setCustomDimensions(800, 600);
      expect(SocialMediaResizer.customWidth).toBe(800);
      expect(SocialMediaResizer.customHeight).toBe(600);
    });

    test('clamps values to valid range', () => {
      SocialMediaResizer.setCustomDimensions(5, 5000);
      expect(SocialMediaResizer.customWidth).toBe(10);
      expect(SocialMediaResizer.customHeight).toBe(4096);
    });
  });

  describe('setBackgroundColor', () => {
    test('sets background color', () => {
      SocialMediaResizer.setBackgroundColor('#ff0000');
      expect(SocialMediaResizer.backgroundColor).toBe('#ff0000');
    });
  });

  describe('toggleGrid', () => {
    test('toggles grid state', () => {
      SocialMediaResizer.showGrid = false;
      SocialMediaResizer.toggleGrid();
      expect(SocialMediaResizer.showGrid).toBe(true);
      SocialMediaResizer.toggleGrid();
      expect(SocialMediaResizer.showGrid).toBe(false);
    });
  });

  describe('setFitMode', () => {
    test('sets fit mode', () => {
      SocialMediaResizer.setFitMode('contain');
      expect(SocialMediaResizer.fitMode).toBe('contain');
      SocialMediaResizer.setFitMode('cover');
      expect(SocialMediaResizer.fitMode).toBe('cover');
    });
  });

  describe('initialization', () => {
    test('module is initialized', () => {
      expect(SocialMediaResizer).toBeDefined();
      expect(typeof SocialMediaResizer.handleFile).toBe('function');
      expect(typeof SocialMediaResizer.renderPreview).toBe('function');
      expect(typeof SocialMediaResizer.download).toBe('function');
      expect(typeof SocialMediaResizer.handleBatchFiles).toBe('function');
      expect(typeof SocialMediaResizer.downloadBatch).toBe('function');
    });
  });

  describe('rotate', () => {
    test('rotates 90 degrees clockwise', () => {
      SocialMediaResizer.rotation = 0;
      SocialMediaResizer.rotate(90);
      expect(SocialMediaResizer.rotation).toBe(90);
    });

    test('rotates 90 degrees counter-clockwise', () => {
      SocialMediaResizer.rotation = 0;
      SocialMediaResizer.rotate(-90);
      expect(SocialMediaResizer.rotation).toBe(270);
    });

    test('wraps around at 360', () => {
      SocialMediaResizer.rotation = 270;
      SocialMediaResizer.rotate(90);
      expect(SocialMediaResizer.rotation).toBe(0);
    });
  });

  describe('flip', () => {
    test('flips horizontal', () => {
      SocialMediaResizer.flipH = false;
      SocialMediaResizer.flipHorizontal();
      expect(SocialMediaResizer.flipH).toBe(true);
      SocialMediaResizer.flipHorizontal();
      expect(SocialMediaResizer.flipH).toBe(false);
    });

    test('flips vertical', () => {
      SocialMediaResizer.flipV = false;
      SocialMediaResizer.flipVertical();
      expect(SocialMediaResizer.flipV).toBe(true);
      SocialMediaResizer.flipVertical();
      expect(SocialMediaResizer.flipV).toBe(false);
    });
  });

  describe('centerImage', () => {
    test('resets pan to center', () => {
      SocialMediaResizer.panX = 100;
      SocialMediaResizer.panY = -50;
      SocialMediaResizer.centerImage();
      expect(SocialMediaResizer.panX).toBe(0);
      expect(SocialMediaResizer.panY).toBe(0);
    });
  });

  describe('resetTransforms', () => {
    test('resets all transform properties', () => {
      SocialMediaResizer.zoom = 150;
      SocialMediaResizer.panX = 100;
      SocialMediaResizer.rotation = 90;
      SocialMediaResizer.flipH = true;
      SocialMediaResizer.brightness = 120;
      SocialMediaResizer.borderSize = 20;
      SocialMediaResizer.circleCrop = true;

      SocialMediaResizer.resetTransforms();

      expect(SocialMediaResizer.zoom).toBe(100);
      expect(SocialMediaResizer.panX).toBe(0);
      expect(SocialMediaResizer.rotation).toBe(0);
      expect(SocialMediaResizer.flipH).toBe(false);
      expect(SocialMediaResizer.brightness).toBe(100);
      expect(SocialMediaResizer.borderSize).toBe(0);
      expect(SocialMediaResizer.circleCrop).toBe(false);
    });
  });

  describe('toggleCircleCrop', () => {
    test('toggles circle crop state', () => {
      SocialMediaResizer.circleCrop = false;
      SocialMediaResizer.toggleCircleCrop();
      expect(SocialMediaResizer.circleCrop).toBe(true);
      SocialMediaResizer.toggleCircleCrop();
      expect(SocialMediaResizer.circleCrop).toBe(false);
    });
  });

  describe('setBorderSize', () => {
    test('sets border size within range', () => {
      SocialMediaResizer.setBorderSize(50);
      expect(SocialMediaResizer.borderSize).toBe(50);
    });

    test('clamps border size to valid range', () => {
      SocialMediaResizer.setBorderSize(-10);
      expect(SocialMediaResizer.borderSize).toBe(0);
      SocialMediaResizer.setBorderSize(200);
      expect(SocialMediaResizer.borderSize).toBe(100);
    });
  });

  describe('setFilter', () => {
    test('sets brightness', () => {
      SocialMediaResizer.setFilter('brightness', 150);
      expect(SocialMediaResizer.brightness).toBe(150);
    });

    test('sets contrast', () => {
      SocialMediaResizer.setFilter('contrast', 80);
      expect(SocialMediaResizer.contrast).toBe(80);
    });

    test('sets saturation', () => {
      SocialMediaResizer.setFilter('saturation', 120);
      expect(SocialMediaResizer.saturation).toBe(120);
    });

    test('clamps filter values', () => {
      SocialMediaResizer.setFilter('brightness', -50);
      expect(SocialMediaResizer.brightness).toBe(0);
      SocialMediaResizer.setFilter('brightness', 300);
      expect(SocialMediaResizer.brightness).toBe(200);
    });
  });

  describe('history (undo/redo)', () => {
    test('saves state to history', () => {
      SocialMediaResizer.history = [];
      SocialMediaResizer.historyIndex = -1;
      SocialMediaResizer.saveState();
      expect(SocialMediaResizer.history.length).toBe(1);
      expect(SocialMediaResizer.historyIndex).toBe(0);
    });

    test('undo reverts to previous state', () => {
      SocialMediaResizer.history = [];
      SocialMediaResizer.historyIndex = -1;
      SocialMediaResizer.zoom = 100;
      SocialMediaResizer.saveState();
      SocialMediaResizer.zoom = 150;
      SocialMediaResizer.saveState();

      expect(SocialMediaResizer.historyIndex).toBe(1);
      SocialMediaResizer.undo();
      expect(SocialMediaResizer.historyIndex).toBe(0);
      expect(SocialMediaResizer.zoom).toBe(100);
    });

    test('redo restores undone state', () => {
      SocialMediaResizer.history = [];
      SocialMediaResizer.historyIndex = -1;
      SocialMediaResizer.zoom = 100;
      SocialMediaResizer.saveState();
      SocialMediaResizer.zoom = 150;
      SocialMediaResizer.saveState();
      SocialMediaResizer.undo();

      SocialMediaResizer.redo();
      expect(SocialMediaResizer.historyIndex).toBe(1);
      expect(SocialMediaResizer.zoom).toBe(150);
    });

    test('undo does nothing at start of history', () => {
      SocialMediaResizer.history = [];
      SocialMediaResizer.historyIndex = -1;
      SocialMediaResizer.saveState();
      SocialMediaResizer.undo();
      expect(SocialMediaResizer.historyIndex).toBe(0);
    });

    test('redo does nothing at end of history', () => {
      SocialMediaResizer.history = [];
      SocialMediaResizer.historyIndex = -1;
      SocialMediaResizer.saveState();
      SocialMediaResizer.redo();
      expect(SocialMediaResizer.historyIndex).toBe(0);
    });
  });
});
