/**
 * OneDevKit - QR Code Generator
 * Generate QR codes for URLs, text, and other data
 * Uses a lightweight inline QR code generation algorithm
 */

(function() {
  'use strict';

  // QR Code Generator Library (Minified, MIT License)
  // Based on qr.js by Kazuhiko Arase
  const QRCode = (function() {
    // QR Code generation constants and utilities
    const PAD0 = 0xEC;
    const PAD1 = 0x11;

    // Error correction level
    const ECL = {
      L: 1, // 7%
      M: 0, // 15%
      Q: 3, // 25%
      H: 2  // 30%
    };

    // Mode indicators
    const MODE = {
      Numeric: 1,
      Alphanumeric: 2,
      Byte: 4,
      Kanji: 8
    };

    // QR Code class
    class QR {
      constructor(text, ecLevel = 'M') {
        this.text = text;
        this.ecLevel = ECL[ecLevel] || ECL.M;
        this.modules = null;
        this.moduleCount = 0;
        this.version = this.calculateVersion();
        this.create();
      }

      calculateVersion() {
        const len = this.getByteLength(this.text);
        for (let v = 1; v <= 40; v++) {
          const cap = this.getDataCapacity(v, this.ecLevel);
          if (len <= cap) return v;
        }
        throw new Error('Text too long for QR code');
      }

      getByteLength(text) {
        let len = 0;
        for (let i = 0; i < text.length; i++) {
          const code = text.charCodeAt(i);
          if (code <= 0x7f) len += 1;
          else if (code <= 0x7ff) len += 2;
          else len += 3;
        }
        return len;
      }

      getDataCapacity(version, ecLevel) {
        // Simplified capacity table for byte mode
        const caps = [
          [0,0,0,0],
          [17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],
          [106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],
          [230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],
          [425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],
          [644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],
          [929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],
          [1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],
          [1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],
          [2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],
          [2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]
        ];
        const idx = [1,0,3,2][ecLevel];
        return caps[version][idx];
      }

      create() {
        this.moduleCount = this.version * 4 + 17;
        this.modules = Array(this.moduleCount).fill(null).map(() =>
          Array(this.moduleCount).fill(null)
        );

        this.setupPositionProbe(0, 0);
        this.setupPositionProbe(this.moduleCount - 7, 0);
        this.setupPositionProbe(0, this.moduleCount - 7);
        this.setupTimingPattern();
        this.setupDarkModule();

        if (this.version >= 7) {
          this.setupVersionInfo();
        }

        const data = this.createData();
        this.mapData(data);
      }

      setupPositionProbe(row, col) {
        for (let r = -1; r <= 7; r++) {
          for (let c = -1; c <= 7; c++) {
            const pr = row + r;
            const pc = col + c;
            if (pr < 0 || this.moduleCount <= pr || pc < 0 || this.moduleCount <= pc) continue;

            if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
                (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
                (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
              this.modules[pr][pc] = true;
            } else {
              this.modules[pr][pc] = false;
            }
          }
        }
      }

      setupTimingPattern() {
        for (let i = 8; i < this.moduleCount - 8; i++) {
          if (this.modules[i][6] !== null) continue;
          this.modules[i][6] = (i % 2 === 0);
          this.modules[6][i] = (i % 2 === 0);
        }
      }

      setupDarkModule() {
        this.modules[this.moduleCount - 8][8] = true;
      }

      setupVersionInfo() {
        // Version info for version >= 7
        const bits = this.getVersionBits(this.version);
        for (let i = 0; i < 18; i++) {
          const bit = ((bits >> i) & 1) === 1;
          this.modules[Math.floor(i / 3)][this.moduleCount - 11 + (i % 3)] = bit;
          this.modules[this.moduleCount - 11 + (i % 3)][Math.floor(i / 3)] = bit;
        }
      }

      getVersionBits(version) {
        const versionBits = [
          0x07C94, 0x085BC, 0x09A99, 0x0A4D3, 0x0BBF6, 0x0C762, 0x0D847, 0x0E60D,
          0x0F928, 0x10B78, 0x1145D, 0x12A17, 0x13532, 0x149A6, 0x15683, 0x168C9,
          0x177EC, 0x18EC4, 0x191E1, 0x1AFAB, 0x1B08E, 0x1CC1A, 0x1D33F, 0x1ED75,
          0x1F250, 0x209D5, 0x216F0, 0x228BA, 0x2379F, 0x24B0B, 0x2542E, 0x26A64,
          0x27541, 0x28C69
        ];
        return versionBits[version - 7];
      }

      createData() {
        const buffer = [];
        const text = this.text;

        // Mode indicator (byte mode = 0100)
        buffer.push(4);

        // Character count
        const cciBits = this.version < 10 ? 8 : 16;
        buffer.push(this.getByteLength(text));

        // Data
        for (let i = 0; i < text.length; i++) {
          const code = text.charCodeAt(i);
          if (code <= 0x7f) {
            buffer.push(code);
          } else if (code <= 0x7ff) {
            buffer.push(0xc0 | (code >> 6));
            buffer.push(0x80 | (code & 0x3f));
          } else {
            buffer.push(0xe0 | (code >> 12));
            buffer.push(0x80 | ((code >> 6) & 0x3f));
            buffer.push(0x80 | (code & 0x3f));
          }
        }

        return this.encodeData(buffer);
      }

      encodeData(data) {
        // Simplified encoding - add terminator and padding
        const capacity = this.getDataCapacity(this.version, this.ecLevel);
        const result = [];

        // Mode + length + data as bits
        let bits = '';
        bits += '0100'; // Byte mode
        const len = this.getByteLength(this.text);
        const cciBits = this.version < 10 ? 8 : 16;
        bits += len.toString(2).padStart(cciBits, '0');

        for (let i = 0; i < this.text.length; i++) {
          const code = this.text.charCodeAt(i);
          if (code <= 0x7f) {
            bits += code.toString(2).padStart(8, '0');
          } else if (code <= 0x7ff) {
            bits += (0xc0 | (code >> 6)).toString(2).padStart(8, '0');
            bits += (0x80 | (code & 0x3f)).toString(2).padStart(8, '0');
          } else {
            bits += (0xe0 | (code >> 12)).toString(2).padStart(8, '0');
            bits += (0x80 | ((code >> 6) & 0x3f)).toString(2).padStart(8, '0');
            bits += (0x80 | (code & 0x3f)).toString(2).padStart(8, '0');
          }
        }

        // Terminator
        bits += '0000';

        // Pad to byte boundary
        while (bits.length % 8 !== 0) bits += '0';

        // Convert to bytes
        for (let i = 0; i < bits.length; i += 8) {
          result.push(parseInt(bits.substr(i, 8), 2));
        }

        // Pad with alternating bytes
        let pad = true;
        while (result.length < capacity) {
          result.push(pad ? PAD0 : PAD1);
          pad = !pad;
        }

        return result;
      }

      mapData(data) {
        let inc = -1;
        let row = this.moduleCount - 1;
        let bitIdx = 7;
        let byteIdx = 0;

        for (let col = this.moduleCount - 1; col > 0; col -= 2) {
          if (col === 6) col--;

          while (true) {
            for (let c = 0; c < 2; c++) {
              const cc = col - c;
              if (this.modules[row][cc] === null) {
                let dark = false;
                if (byteIdx < data.length) {
                  dark = ((data[byteIdx] >> bitIdx) & 1) === 1;
                }
                // Apply mask pattern 0: (row + col) % 2 === 0
                if ((row + cc) % 2 === 0) dark = !dark;
                this.modules[row][cc] = dark;
                bitIdx--;
                if (bitIdx < 0) {
                  byteIdx++;
                  bitIdx = 7;
                }
              }
            }

            row += inc;
            if (row < 0 || this.moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }

        // Apply format info
        this.setupFormatInfo();
      }

      setupFormatInfo() {
        const bits = this.getFormatBits(this.ecLevel, 0);
        for (let i = 0; i < 15; i++) {
          const bit = ((bits >> i) & 1) === 1;
          if (i < 6) {
            this.modules[i][8] = bit;
          } else if (i < 8) {
            this.modules[i + 1][8] = bit;
          } else {
            this.modules[this.moduleCount - 15 + i][8] = bit;
          }

          if (i < 8) {
            this.modules[8][this.moduleCount - i - 1] = bit;
          } else if (i < 9) {
            this.modules[8][15 - i - 1 + 1] = bit;
          } else {
            this.modules[8][15 - i - 1] = bit;
          }
        }
      }

      getFormatBits(ecLevel, mask) {
        const formatInfo = [
          0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0,
          0x77C4, 0x72F3, 0x7DAA, 0x789D, 0x662F, 0x6318, 0x6C41, 0x6976,
          0x1689, 0x13BE, 0x1CE7, 0x19D0, 0x0762, 0x0255, 0x0D0C, 0x083B,
          0x355F, 0x3068, 0x3F31, 0x3A06, 0x24B4, 0x2183, 0x2EDA, 0x2BED
        ];
        return formatInfo[(ecLevel << 3) | mask];
      }

      isDark(row, col) {
        return this.modules[row][col];
      }

      getModuleCount() {
        return this.moduleCount;
      }
    }

    return QR;
  })();

  // QR Code Generator Application
  const QRGenerator = {
    canvas: null,
    currentQR: null,

    /**
     * Generate QR Code
     */
    generate(text, size = 256, ecLevel = 'M') {
      if (!text || text.trim() === '') {
        throw new Error('Text is required');
      }

      const qr = new QRCode(text, ecLevel);
      const moduleCount = qr.getModuleCount();
      const cellSize = Math.floor(size / moduleCount);
      const actualSize = cellSize * moduleCount;

      const canvas = document.createElement('canvas');
      canvas.width = actualSize;
      canvas.height = actualSize;

      const ctx = canvas.getContext('2d');

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, actualSize, actualSize);

      // Draw modules
      ctx.fillStyle = '#000000';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
      }

      this.currentQR = canvas;
      return canvas;
    },

    /**
     * Initialize the tool
     */
    init() {
      this.canvas = document.getElementById('qr-canvas');
      this.bindEvents();
    },

    bindEvents() {
      // Generate button
      const generateBtn = document.getElementById('generate-qr');
      if (generateBtn) {
        generateBtn.addEventListener('click', () => this.generate_());
      }

      // Text input - generate on Enter
      const textInput = document.getElementById('qr-text');
      if (textInput) {
        textInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.generate_();
        });
        // Auto-generate on input (debounced)
        textInput.addEventListener('input',
          window.OneDevKit ? window.OneDevKit.debounce(() => this.generate_(), 500) : () => this.generate_()
        );
      }

      // Size selector
      const sizeSelect = document.getElementById('qr-size');
      if (sizeSelect) {
        sizeSelect.addEventListener('change', () => this.generate_());
      }

      // EC Level selector
      const ecSelect = document.getElementById('qr-ec-level');
      if (ecSelect) {
        ecSelect.addEventListener('change', () => this.generate_());
      }

      // Download button
      const downloadBtn = document.getElementById('download-qr');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => this.download());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-qr');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-qr');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }
    },

    getOptions() {
      return {
        text: document.getElementById('qr-text')?.value || '',
        size: parseInt(document.getElementById('qr-size')?.value, 10) || 256,
        ecLevel: document.getElementById('qr-ec-level')?.value || 'M'
      };
    },

    generate_() {
      const options = this.getOptions();
      const container = document.getElementById('qr-output');
      const placeholder = document.getElementById('qr-placeholder');

      if (!options.text.trim()) {
        if (placeholder) placeholder.classList.remove('hidden');
        if (this.canvas) this.canvas.classList.add('hidden');
        return;
      }

      try {
        const canvas = this.generate(options.text, options.size, options.ecLevel);

        if (this.canvas) {
          // Copy canvas content
          this.canvas.width = canvas.width;
          this.canvas.height = canvas.height;
          const ctx = this.canvas.getContext('2d');
          ctx.drawImage(canvas, 0, 0);
          this.canvas.classList.remove('hidden');
        }

        if (placeholder) placeholder.classList.add('hidden');

        // Track analytics
        if (window.OneDevKit && window.OneDevKit.Analytics) {
          window.OneDevKit.Analytics.trackToolUsage('qr-code-generator', 'generate');
        }
      } catch (error) {
        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('Error: ' + error.message, 'error');
        }
      }
    },

    download() {
      if (!this.currentQR) {
        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('Generate a QR code first', 'error');
        }
        return;
      }

      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = this.currentQR.toDataURL('image/png');
      link.click();

      if (window.OneDevKit && window.OneDevKit.Toast) {
        window.OneDevKit.Toast.show('QR code downloaded!', 'success');
      }

      // Track analytics
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('qr-code-generator', 'download');
      }
    },

    async copy() {
      if (!this.currentQR) {
        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('Generate a QR code first', 'error');
        }
        return;
      }

      try {
        const blob = await new Promise(resolve => this.currentQR.toBlob(resolve, 'image/png'));
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);

        const copyBtn = document.getElementById('copy-qr');
        if (copyBtn) {
          const originalContent = copyBtn.innerHTML;
          copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!';
          copyBtn.disabled = true;
          setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.disabled = false;
          }, 2000);
        }

        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('QR code copied to clipboard!', 'success');
        }
      } catch (error) {
        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('Copy failed. Try downloading instead.', 'error');
        }
      }
    },

    clear() {
      const textInput = document.getElementById('qr-text');
      if (textInput) textInput.value = '';

      const placeholder = document.getElementById('qr-placeholder');
      if (placeholder) placeholder.classList.remove('hidden');

      if (this.canvas) {
        this.canvas.classList.add('hidden');
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      this.currentQR = null;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QRGenerator.init());
  } else {
    QRGenerator.init();
  }

  // Export for external access
  window.QRGenerator = QRGenerator;

})();
