/**
 * Social Media Image Resizer Unit Tests
 * Note: Full image processing testing requires browser Canvas API
 * These tests cover utility functions and specifications
 */

// Mock DOM elements
document.body.innerHTML = `
  <button class="platform-btn active" data-platform="instagram">Instagram</button>
  <button class="platform-btn" data-platform="linkedin">LinkedIn</button>
  <button class="platform-btn" data-platform="twitter">Twitter/X</button>
  <button class="platform-btn" data-platform="facebook">Facebook</button>
  <button class="platform-btn" data-platform="youtube">YouTube</button>
  <button class="platform-btn" data-platform="pinterest">Pinterest</button>
  <button class="platform-btn" data-platform="tiktok">TikTok</button>
  <div id="preset-buttons"></div>
  <div id="spec-name"></div>
  <div id="spec-dimensions"></div>
  <div id="spec-ratio"></div>
  <div id="upload-zone"></div>
  <input type="file" id="file-input">
  <div id="status"></div>
  <div id="editor-section"></div>
  <canvas id="preview-canvas"></canvas>
  <div id="preview-dimensions"></div>
  <div id="preview-filesize"></div>
  <input type="range" id="zoom-slider" value="100">
  <span id="zoom-value">100%</span>
  <button id="download-btn" disabled></button>
  <button id="download-png"></button>
  <button id="reset-btn"></button>
`;

// Load the module
require('../../src/js/social-media-resizer.js');

describe('SocialMediaResizer', () => {
  beforeEach(() => {
    SocialMediaResizer.originalImage = null;
    SocialMediaResizer.resultBlob = null;
    SocialMediaResizer.zoom = 100;
    SocialMediaResizer.currentPlatform = 'instagram';
    SocialMediaResizer.currentPreset = 'post-square';
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
      const expectedPlatforms = ['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'pinterest', 'tiktok'];
      expectedPlatforms.forEach(platform => {
        expect(SocialMediaResizer.PLATFORMS[platform]).toBeDefined();
      });
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

  describe('initialization', () => {
    test('module is initialized', () => {
      expect(SocialMediaResizer).toBeDefined();
      expect(typeof SocialMediaResizer.handleFile).toBe('function');
      expect(typeof SocialMediaResizer.renderPreview).toBe('function');
      expect(typeof SocialMediaResizer.download).toBe('function');
    });
  });
});
