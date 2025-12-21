/**
 * Color Picker & Converter Tool
 * Convert between HEX, RGB, and HSL color formats
 */

class ColorPicker {
  constructor() {
    this.colorPicker = document.getElementById('color-picker');
    this.colorPreview = document.getElementById('color-preview');
    this.previewText = document.getElementById('preview-text');

    // Custom visual picker
    this.gradientBox = document.getElementById('color-gradient-box');
    this.colorCursor = document.getElementById('color-cursor');
    this.hueSlider = document.getElementById('color-hue-slider');
    this.hueCursor = document.getElementById('hue-cursor');

    // HEX
    this.hexInput = document.getElementById('hex-input');

    // RGB
    this.rgbR = document.getElementById('rgb-r');
    this.rgbG = document.getElementById('rgb-g');
    this.rgbB = document.getElementById('rgb-b');
    this.rgbRSlider = document.getElementById('rgb-r-slider');
    this.rgbGSlider = document.getElementById('rgb-g-slider');
    this.rgbBSlider = document.getElementById('rgb-b-slider');
    this.rgbCss = document.getElementById('rgb-css');

    // HSL
    this.hslH = document.getElementById('hsl-h');
    this.hslS = document.getElementById('hsl-s');
    this.hslL = document.getElementById('hsl-l');
    this.hslHSlider = document.getElementById('hsl-h-slider');
    this.hslSSlider = document.getElementById('hsl-s-slider');
    this.hslLSlider = document.getElementById('hsl-l-slider');
    this.hslCss = document.getElementById('hsl-css');

    // Palettes
    this.shadesPalette = document.getElementById('shades-palette');
    this.tintsPalette = document.getElementById('tints-palette');
    this.complementaryPalette = document.getElementById('complementary-palette');

    this.currentColor = { r: 37, g: 99, b: 235 };
    this.currentHue = 221; // Track hue separately for the gradient box
    this.isDraggingGradient = false;
    this.isDraggingHue = false;

    this.init();
  }

  init() {
    // Custom visual picker - Gradient box
    this.gradientBox.addEventListener('mousedown', (e) => this.startGradientDrag(e));
    this.gradientBox.addEventListener('touchstart', (e) => this.startGradientDrag(e), { passive: false });

    // Custom visual picker - Hue slider
    this.hueSlider.addEventListener('mousedown', (e) => this.startHueDrag(e));
    this.hueSlider.addEventListener('touchstart', (e) => this.startHueDrag(e), { passive: false });

    // Global mouse/touch events for dragging
    document.addEventListener('mousemove', (e) => this.handleDrag(e));
    document.addEventListener('touchmove', (e) => this.handleDrag(e), { passive: false });
    document.addEventListener('mouseup', () => this.stopDrag());
    document.addEventListener('touchend', () => this.stopDrag());

    // Native color picker (hidden, but still functional)
    this.colorPicker.addEventListener('input', (e) => {
      this.setFromHex(e.target.value);
    });

    // HEX input
    this.hexInput.addEventListener('input', (e) => {
      const hex = e.target.value.trim();
      if (this.isValidHex(hex)) {
        this.setFromHex(hex);
      }
    });

    // RGB inputs
    [this.rgbR, this.rgbG, this.rgbB].forEach(input => {
      input.addEventListener('input', () => this.setFromRgbInputs());
    });

    // RGB sliders
    this.rgbRSlider.addEventListener('input', (e) => {
      this.rgbR.value = e.target.value;
      this.setFromRgbInputs();
    });
    this.rgbGSlider.addEventListener('input', (e) => {
      this.rgbG.value = e.target.value;
      this.setFromRgbInputs();
    });
    this.rgbBSlider.addEventListener('input', (e) => {
      this.rgbB.value = e.target.value;
      this.setFromRgbInputs();
    });

    // HSL inputs
    [this.hslH, this.hslS, this.hslL].forEach(input => {
      input.addEventListener('input', () => this.setFromHslInputs());
    });

    // HSL sliders
    this.hslHSlider.addEventListener('input', (e) => {
      this.hslH.value = e.target.value;
      this.setFromHslInputs();
    });
    this.hslSSlider.addEventListener('input', (e) => {
      this.hslS.value = e.target.value;
      this.setFromHslInputs();
    });
    this.hslLSlider.addEventListener('input', (e) => {
      this.hslL.value = e.target.value;
      this.setFromHslInputs();
    });

    // Random color button
    document.getElementById('random-color').addEventListener('click', () => this.randomColor());

    // Copy buttons
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => this.copyValue(btn.dataset.copy));
    });

    // Initialize palettes
    this.updatePalettes();

    // Initialize visual picker cursor positions
    this.updateVisualPickerFromColor();
  }

  // Visual picker methods
  startGradientDrag(e) {
    e.preventDefault();
    this.isDraggingGradient = true;
    this.updateGradientFromEvent(e);
  }

  startHueDrag(e) {
    e.preventDefault();
    this.isDraggingHue = true;
    this.updateHueFromEvent(e);
  }

  handleDrag(e) {
    if (this.isDraggingGradient) {
      e.preventDefault();
      this.updateGradientFromEvent(e);
    } else if (this.isDraggingHue) {
      e.preventDefault();
      this.updateHueFromEvent(e);
    }
  }

  stopDrag() {
    this.isDraggingGradient = false;
    this.isDraggingHue = false;
  }

  updateGradientFromEvent(e) {
    const rect = this.gradientBox.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Calculate position as percentage (0-1)
    let x = (clientX - rect.left) / rect.width;
    let y = (clientY - rect.top) / rect.height;

    // Clamp to 0-1
    x = this.clamp(x, 0, 1);
    y = this.clamp(y, 0, 1);

    // Update cursor position
    this.colorCursor.style.left = (x * 100) + '%';
    this.colorCursor.style.top = (y * 100) + '%';

    // Convert to HSV: x = saturation, y = value (inverted)
    const s = x * 100;
    const v = (1 - y) * 100;

    // Convert HSV to RGB
    this.currentColor = this.hsvToRgb(this.currentHue, s, v);
    this.updateAllDisplays();
  }

  updateHueFromEvent(e) {
    const rect = this.hueSlider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    // Calculate position as percentage (0-1)
    let x = (clientX - rect.left) / rect.width;
    x = this.clamp(x, 0, 1);

    // Update cursor position
    this.hueCursor.style.left = (x * 100) + '%';

    // Convert to hue (0-360)
    this.currentHue = x * 360;

    // Update gradient box background
    this.gradientBox.style.backgroundColor = `hsl(${this.currentHue}, 100%, 50%)`;

    // Recalculate color based on current gradient position
    const cursorLeft = parseFloat(this.colorCursor.style.left) / 100;
    const cursorTop = parseFloat(this.colorCursor.style.top) / 100;
    const s = cursorLeft * 100;
    const v = (1 - cursorTop) * 100;

    this.currentColor = this.hsvToRgb(this.currentHue, s, v);
    this.updateAllDisplays();
  }

  updateVisualPickerFromColor() {
    const { r, g, b } = this.currentColor;
    const hsv = this.rgbToHsv(r, g, b);

    // Update hue
    this.currentHue = hsv.h;
    this.hueCursor.style.left = (hsv.h / 360 * 100) + '%';
    this.gradientBox.style.backgroundColor = `hsl(${hsv.h}, 100%, 50%)`;

    // Update gradient cursor (x = saturation, y = 1 - value)
    this.colorCursor.style.left = hsv.s + '%';
    this.colorCursor.style.top = (100 - hsv.v) + '%';
  }

  // HSV conversion methods
  hsvToRgb(h, s, v) {
    h /= 360;
    s /= 100;
    v /= 100;

    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h, s, v = max;

    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, v: v * 100 };
  }

  setFromHex(hex) {
    const rgb = this.hexToRgb(hex);
    if (rgb) {
      this.currentColor = rgb;
      this.updateVisualPickerFromColor();
      this.updateAllDisplays();
    }
  }

  setFromRgbInputs() {
    this.currentColor = {
      r: this.clamp(parseInt(this.rgbR.value) || 0, 0, 255),
      g: this.clamp(parseInt(this.rgbG.value) || 0, 0, 255),
      b: this.clamp(parseInt(this.rgbB.value) || 0, 0, 255)
    };
    this.updateVisualPickerFromColor();
    this.updateAllDisplays();
  }

  setFromHslInputs() {
    const h = this.clamp(parseInt(this.hslH.value) || 0, 0, 360);
    const s = this.clamp(parseInt(this.hslS.value) || 0, 0, 100);
    const l = this.clamp(parseInt(this.hslL.value) || 0, 0, 100);
    this.currentColor = this.hslToRgb(h, s, l);
    this.updateVisualPickerFromColor();
    this.updateAllDisplays(true); // Skip HSL update to avoid loop
  }

  updateAllDisplays(skipHsl = false) {
    const { r, g, b } = this.currentColor;
    const hex = this.rgbToHex(r, g, b);
    const hsl = this.rgbToHsl(r, g, b);

    // Update preview
    this.colorPreview.style.backgroundColor = hex;
    this.previewText.textContent = hex.toUpperCase();
    this.previewText.style.color = this.getContrastColor(r, g, b);

    // Update native picker
    this.colorPicker.value = hex;

    // Update HEX
    if (document.activeElement !== this.hexInput) {
      this.hexInput.value = hex.toUpperCase();
    }

    // Update RGB
    if (document.activeElement !== this.rgbR) {
      this.rgbR.value = r;
      this.rgbRSlider.value = r;
    }
    if (document.activeElement !== this.rgbG) {
      this.rgbG.value = g;
      this.rgbGSlider.value = g;
    }
    if (document.activeElement !== this.rgbB) {
      this.rgbB.value = b;
      this.rgbBSlider.value = b;
    }
    this.rgbCss.value = `rgb(${r}, ${g}, ${b})`;

    // Update HSL
    if (!skipHsl) {
      if (document.activeElement !== this.hslH) {
        this.hslH.value = Math.round(hsl.h);
        this.hslHSlider.value = Math.round(hsl.h);
      }
      if (document.activeElement !== this.hslS) {
        this.hslS.value = Math.round(hsl.s);
        this.hslSSlider.value = Math.round(hsl.s);
      }
      if (document.activeElement !== this.hslL) {
        this.hslL.value = Math.round(hsl.l);
        this.hslLSlider.value = Math.round(hsl.l);
      }
    }
    this.hslCss.value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

    // Update palettes
    this.updatePalettes();
  }

  updatePalettes() {
    const { r, g, b } = this.currentColor;
    const hsl = this.rgbToHsl(r, g, b);

    // Shades (darker)
    this.shadesPalette.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const l = Math.max(0, hsl.l - (i * 10));
      const rgb = this.hslToRgb(hsl.h, hsl.s, l);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      this.shadesPalette.appendChild(this.createPaletteColor(hex));
    }

    // Tints (lighter)
    this.tintsPalette.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const l = Math.min(100, hsl.l + (i * 10));
      const rgb = this.hslToRgb(hsl.h, hsl.s, l);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      this.tintsPalette.appendChild(this.createPaletteColor(hex));
    }

    // Complementary & analogous
    this.complementaryPalette.innerHTML = '';
    const angles = [0, 30, 60, 180, 210, 240, 300];
    angles.forEach(angle => {
      const h = (hsl.h + angle) % 360;
      const rgb = this.hslToRgb(h, hsl.s, hsl.l);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      this.complementaryPalette.appendChild(this.createPaletteColor(hex));
    });
  }

  createPaletteColor(hex) {
    const div = document.createElement('div');
    div.className = 'palette-color';
    div.style.backgroundColor = hex;
    div.title = hex.toUpperCase();
    div.addEventListener('click', () => this.setFromHex(hex));
    return div;
  }

  randomColor() {
    this.currentColor = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
    this.updateVisualPickerFromColor();
    this.updateAllDisplays();
  }

  copyValue(format) {
    let value;
    switch (format) {
      case 'hex':
        value = this.hexInput.value;
        break;
      case 'rgb':
        value = this.rgbCss.value;
        break;
      case 'hsl':
        value = this.hslCss.value;
        break;
    }

    navigator.clipboard.writeText(value).then(() => {
      const btn = document.querySelector(`[data-copy="${format}"]`);
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    });
  }

  // Color conversion utilities
  isValidHex(hex) {
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  getContrastColor(r, g, b) {
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ColorPicker();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ColorPicker };
}
