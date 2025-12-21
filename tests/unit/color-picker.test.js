/**
 * @jest-environment jsdom
 */

describe('Color Picker', () => {
  let ColorPicker;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <input type="color" id="color-picker" value="#2563eb">
      <div id="color-preview"></div>
      <span id="preview-text"></span>
      <div id="color-gradient-box" style="background-color: hsl(221, 100%, 50%);">
        <div id="color-cursor" style="left: 84%; top: 8%;"></div>
      </div>
      <div id="color-hue-slider">
        <div id="hue-cursor" style="left: 61%;"></div>
      </div>
      <input type="text" id="hex-input" value="#2563EB">
      <input type="number" id="rgb-r" value="37">
      <input type="number" id="rgb-g" value="99">
      <input type="number" id="rgb-b" value="235">
      <input type="range" id="rgb-r-slider" value="37">
      <input type="range" id="rgb-g-slider" value="99">
      <input type="range" id="rgb-b-slider" value="235">
      <input type="text" id="rgb-css">
      <input type="number" id="hsl-h" value="221">
      <input type="number" id="hsl-s" value="83">
      <input type="number" id="hsl-l" value="53">
      <input type="range" id="hsl-h-slider" value="221">
      <input type="range" id="hsl-s-slider" value="83">
      <input type="range" id="hsl-l-slider" value="53">
      <input type="text" id="hsl-css">
      <div id="shades-palette"></div>
      <div id="tints-palette"></div>
      <div id="complementary-palette"></div>
      <button id="random-color"></button>
      <button data-copy="hex"></button>
      <button data-copy="rgb"></button>
      <button data-copy="hsl"></button>
    `;

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue()
      }
    });

    // Load the module
    jest.resetModules();
    const module = require('../../src/js/color-picker.js');
    ColorPicker = module.ColorPicker;
  });

  describe('Color Conversions', () => {
    test('converts HEX to RGB correctly', () => {
      const picker = new ColorPicker();
      const rgb = picker.hexToRgb('#ff5733');

      expect(rgb.r).toBe(255);
      expect(rgb.g).toBe(87);
      expect(rgb.b).toBe(51);
    });

    test('handles 3-digit HEX', () => {
      const picker = new ColorPicker();
      const rgb = picker.hexToRgb('#f00');

      expect(rgb.r).toBe(255);
      expect(rgb.g).toBe(0);
      expect(rgb.b).toBe(0);
    });

    test('converts RGB to HEX correctly', () => {
      const picker = new ColorPicker();
      const hex = picker.rgbToHex(255, 87, 51);

      expect(hex.toLowerCase()).toBe('#ff5733');
    });

    test('converts RGB to HSL correctly', () => {
      const picker = new ColorPicker();
      const hsl = picker.rgbToHsl(255, 0, 0); // Pure red

      expect(Math.round(hsl.h)).toBe(0);
      expect(Math.round(hsl.s)).toBe(100);
      expect(Math.round(hsl.l)).toBe(50);
    });

    test('converts HSL to RGB correctly', () => {
      const picker = new ColorPicker();
      const rgb = picker.hslToRgb(0, 100, 50); // Pure red

      expect(rgb.r).toBe(255);
      expect(rgb.g).toBe(0);
      expect(rgb.b).toBe(0);
    });

    test('handles grayscale in HSL', () => {
      const picker = new ColorPicker();
      const rgb = picker.hslToRgb(0, 0, 50); // Gray

      expect(rgb.r).toBe(128);
      expect(rgb.g).toBe(128);
      expect(rgb.b).toBe(128);
    });
  });

  describe('HEX Validation', () => {
    test('validates correct HEX format', () => {
      const picker = new ColorPicker();

      expect(picker.isValidHex('#ff5733')).toBe(true);
      expect(picker.isValidHex('#FFF')).toBe(true);
      expect(picker.isValidHex('ff5733')).toBe(true);
    });

    test('rejects invalid HEX format', () => {
      const picker = new ColorPicker();

      expect(picker.isValidHex('#ff573')).toBe(false);
      expect(picker.isValidHex('#gggggg')).toBe(false);
      expect(picker.isValidHex('invalid')).toBe(false);
    });
  });

  describe('Contrast Color', () => {
    test('returns white for dark colors', () => {
      const picker = new ColorPicker();
      const contrast = picker.getContrastColor(0, 0, 0); // Black

      expect(contrast).toBe('#ffffff');
    });

    test('returns black for light colors', () => {
      const picker = new ColorPicker();
      const contrast = picker.getContrastColor(255, 255, 255); // White

      expect(contrast).toBe('#000000');
    });
  });

  describe('Color Updates', () => {
    test('setFromHex updates all displays', () => {
      const picker = new ColorPicker();
      picker.setFromHex('#ff0000');

      expect(document.getElementById('rgb-r').value).toBe('255');
      expect(document.getElementById('rgb-g').value).toBe('0');
      expect(document.getElementById('rgb-b').value).toBe('0');
    });

    test('random color generates valid color', () => {
      const picker = new ColorPicker();
      picker.randomColor();

      const r = parseInt(document.getElementById('rgb-r').value);
      const g = parseInt(document.getElementById('rgb-g').value);
      const b = parseInt(document.getElementById('rgb-b').value);

      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(255);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(255);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(255);
    });
  });

  describe('Palettes', () => {
    test('generates shade palette', () => {
      const picker = new ColorPicker();
      picker.updatePalettes();

      const shades = document.getElementById('shades-palette');
      expect(shades.children.length).toBe(7);
    });

    test('generates tint palette', () => {
      const picker = new ColorPicker();
      picker.updatePalettes();

      const tints = document.getElementById('tints-palette');
      expect(tints.children.length).toBe(7);
    });

    test('generates complementary palette', () => {
      const picker = new ColorPicker();
      picker.updatePalettes();

      const complementary = document.getElementById('complementary-palette');
      expect(complementary.children.length).toBe(7);
    });
  });

  describe('Clamp Utility', () => {
    test('clamps value within range', () => {
      const picker = new ColorPicker();

      expect(picker.clamp(50, 0, 100)).toBe(50);
      expect(picker.clamp(-10, 0, 100)).toBe(0);
      expect(picker.clamp(150, 0, 100)).toBe(100);
    });
  });
});
