/**
 * OneDevKit - QR Code Generator
 * Uses qrcode-generator library (MIT License) by Kazuhiko Arase
 */

(function() {
  'use strict';

  //---------------------------------------------------------------------
  // QR Code Generator Library
  // Copyright (c) 2009 Kazuhiko Arase - MIT License
  //---------------------------------------------------------------------

  var qrcode = function() {
    var createQRCode = function(typeNumber, errorCorrectionLevel) {
      var dataList = [];
      var modules = null;
      var moduleCount = 0;
      var _typeNumber = typeNumber;
      var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];

      var makeImpl = function(mask, data) {
        moduleCount = _typeNumber * 4 + 17;
        modules = new Array(moduleCount);
        for (var i = 0; i < moduleCount; i++) {
          modules[i] = new Array(moduleCount);
        }
        setupPositionProbePattern(0, 0);
        setupPositionProbePattern(moduleCount - 7, 0);
        setupPositionProbePattern(0, moduleCount - 7);
        setupPositionAdjustPattern();
        setupTimingPattern();
        setupTypeInfo(mask);
        if (_typeNumber >= 7) setupTypeNumber();
        var data = createData(_typeNumber, _errorCorrectionLevel, dataList);
        mapData(data, mask);
      };

      var setupPositionProbePattern = function(row, col) {
        for (var r = -1; r <= 7; r++) {
          for (var c = -1; c <= 7; c++) {
            if (row + r <= -1 || moduleCount <= row + r || col + c <= -1 || moduleCount <= col + c) continue;
            if ((0 <= r && r <= 6 && (c == 0 || c == 6)) ||
                (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
                (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
              modules[row + r][col + c] = true;
            } else {
              modules[row + r][col + c] = false;
            }
          }
        }
      };

      var getBestMaskPattern = function() {
        var minLostPoint = 0;
        var pattern = 0;
        for (var i = 0; i < 8; i++) {
          makeImpl(i, dataList);
          var lostPoint = getLostPoint();
          if (i == 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
          }
        }
        return pattern;
      };

      var getLostPoint = function() {
        var lostPoint = 0;
        // Level 1
        for (var row = 0; row < moduleCount; row++) {
          for (var col = 0; col < moduleCount; col++) {
            var sameCount = 0;
            var dark = isDark(row, col);
            for (var r = -1; r <= 1; r++) {
              if (row + r < 0 || moduleCount <= row + r) continue;
              for (var c = -1; c <= 1; c++) {
                if (col + c < 0 || moduleCount <= col + c) continue;
                if (r == 0 && c == 0) continue;
                if (dark == isDark(row + r, col + c)) sameCount++;
              }
            }
            if (sameCount > 5) lostPoint += (3 + sameCount - 5);
          }
        }
        // Level 2
        for (var row = 0; row < moduleCount - 1; row++) {
          for (var col = 0; col < moduleCount - 1; col++) {
            var count = 0;
            if (isDark(row, col)) count++;
            if (isDark(row + 1, col)) count++;
            if (isDark(row, col + 1)) count++;
            if (isDark(row + 1, col + 1)) count++;
            if (count == 0 || count == 4) lostPoint += 3;
          }
        }
        // Level 3
        for (var row = 0; row < moduleCount; row++) {
          for (var col = 0; col < moduleCount - 6; col++) {
            if (isDark(row, col) && !isDark(row, col + 1) && isDark(row, col + 2) &&
                isDark(row, col + 3) && isDark(row, col + 4) && !isDark(row, col + 5) &&
                isDark(row, col + 6)) {
              lostPoint += 40;
            }
          }
        }
        for (var col = 0; col < moduleCount; col++) {
          for (var row = 0; row < moduleCount - 6; row++) {
            if (isDark(row, col) && !isDark(row + 1, col) && isDark(row + 2, col) &&
                isDark(row + 3, col) && isDark(row + 4, col) && !isDark(row + 5, col) &&
                isDark(row + 6, col)) {
              lostPoint += 40;
            }
          }
        }
        // Level 4
        var darkCount = 0;
        for (var col = 0; col < moduleCount; col++) {
          for (var row = 0; row < moduleCount; row++) {
            if (isDark(row, col)) darkCount++;
          }
        }
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;
      };

      var setupTimingPattern = function() {
        for (var r = 8; r < moduleCount - 8; r++) {
          if (modules[r][6] != null) continue;
          modules[r][6] = (r % 2 == 0);
        }
        for (var c = 8; c < moduleCount - 8; c++) {
          if (modules[6][c] != null) continue;
          modules[6][c] = (c % 2 == 0);
        }
      };

      var setupPositionAdjustPattern = function() {
        var pos = QRUtil.getPatternPosition(_typeNumber);
        for (var i = 0; i < pos.length; i++) {
          for (var j = 0; j < pos.length; j++) {
            var row = pos[i];
            var col = pos[j];
            if (modules[row][col] != null) continue;
            for (var r = -2; r <= 2; r++) {
              for (var c = -2; c <= 2; c++) {
                if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
                  modules[row + r][col + c] = true;
                } else {
                  modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      };

      var setupTypeNumber = function() {
        var bits = QRUtil.getBCHTypeNumber(_typeNumber);
        for (var i = 0; i < 18; i++) {
          modules[Math.floor(i / 3)][i % 3 + moduleCount - 8 - 3] = ((bits >> i) & 1) == 1;
        }
        for (var i = 0; i < 18; i++) {
          modules[i % 3 + moduleCount - 8 - 3][Math.floor(i / 3)] = ((bits >> i) & 1) == 1;
        }
      };

      var setupTypeInfo = function(maskPattern) {
        var data = (_errorCorrectionLevel << 3) | maskPattern;
        var bits = QRUtil.getBCHTypeInfo(data);
        for (var i = 0; i < 15; i++) {
          var mod = ((bits >> i) & 1) == 1;
          if (i < 6) {
            modules[i][8] = mod;
          } else if (i < 8) {
            modules[i + 1][8] = mod;
          } else {
            modules[moduleCount - 15 + i][8] = mod;
          }
        }
        for (var i = 0; i < 15; i++) {
          var mod = ((bits >> i) & 1) == 1;
          if (i < 8) {
            modules[8][moduleCount - i - 1] = mod;
          } else if (i < 9) {
            modules[8][15 - i - 1 + 1] = mod;
          } else {
            modules[8][15 - i - 1] = mod;
          }
        }
        modules[moduleCount - 8][8] = true;
      };

      var mapData = function(data, maskPattern) {
        var inc = -1;
        var row = moduleCount - 1;
        var bitIndex = 7;
        var byteIndex = 0;
        var maskFunc = QRUtil.getMaskFunction(maskPattern);
        for (var col = moduleCount - 1; col > 0; col -= 2) {
          if (col == 6) col--;
          while (true) {
            for (var c = 0; c < 2; c++) {
              if (modules[row][col - c] == null) {
                var dark = false;
                if (byteIndex < data.length) {
                  dark = ((data[byteIndex] >>> bitIndex) & 1) == 1;
                }
                if (maskFunc(row, col - c)) dark = !dark;
                modules[row][col - c] = dark;
                bitIndex--;
                if (bitIndex == -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      };

      var isDark = function(row, col) {
        return modules[row][col];
      };

      var getModuleCount = function() {
        return moduleCount;
      };

      var make = function() {
        var bestPattern = getBestMaskPattern();
        makeImpl(bestPattern, dataList);
      };

      return {
        addData: function(data) { dataList.push(qrData(data)); },
        make: make,
        getModuleCount: getModuleCount,
        isDark: isDark
      };
    };

    var qrData = function(data) {
      var mode = QRMode.MODE_8BIT_BYTE;
      var parsedData = [];
      for (var i = 0; i < data.length; i++) {
        var code = data.charCodeAt(i);
        if (code > 0x10000) {
          parsedData.push(0xF0 | ((code & 0x1C0000) >>> 18));
          parsedData.push(0x80 | ((code & 0x3F000) >>> 12));
          parsedData.push(0x80 | ((code & 0xFC0) >>> 6));
          parsedData.push(0x80 | (code & 0x3F));
        } else if (code > 0x800) {
          parsedData.push(0xE0 | ((code & 0xF000) >>> 12));
          parsedData.push(0x80 | ((code & 0xFC0) >>> 6));
          parsedData.push(0x80 | (code & 0x3F));
        } else if (code > 0x80) {
          parsedData.push(0xC0 | ((code & 0x7C0) >>> 6));
          parsedData.push(0x80 | (code & 0x3F));
        } else {
          parsedData.push(code);
        }
      }
      return {
        getMode: function() { return mode; },
        getLength: function() { return parsedData.length; },
        write: function(buffer) {
          for (var i = 0; i < parsedData.length; i++) {
            buffer.put(parsedData[i], 8);
          }
        }
      };
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);
      var buffer = new QRBitBuffer();
      for (var i = 0; i < dataList.length; i++) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i++) {
        totalDataCount += rsBlocks[i].dataCount;
      }
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow: ' + buffer.getLengthInBits() + '>' + totalDataCount * 8;
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) break;
        buffer.put(0xEC, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) break;
        buffer.put(0x11, 8);
      }
      return createBytes(buffer, rsBlocks);
    };

    var createBytes = function(buffer, rsBlocks) {
      var offset = 0;
      var maxDcCount = 0;
      var maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i++) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i++) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0) ? modPoly.getAt(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i++) {
        totalCodeCount += rsBlocks[i].totalCount;
      }
      var data = new Array(totalCodeCount);
      var index = 0;
      for (var i = 0; i < maxDcCount; i++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i < dcdata[r].length) data[index++] = dcdata[r][i];
        }
      }
      for (var i = 0; i < maxEcCount; i++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i < ecdata[r].length) data[index++] = ecdata[r][i];
        }
      }
      return data;
    };

    var QRMode = { MODE_8BIT_BYTE: 1 << 2 };
    var QRErrorCorrectionLevel = { L: 1, M: 0, Q: 3, H: 2 };

    var QRUtil = {
      PATTERN_POSITION_TABLE: [
        [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
        [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54],
        [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74],
        [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
      ],
      G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
      G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
      G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
      getBCHTypeInfo: function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
          d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
        }
        return ((data << 10) | d) ^ QRUtil.G15_MASK;
      },
      getBCHTypeNumber: function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
          d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18)));
        }
        return (data << 12) | d;
      },
      getBCHDigit: function(data) {
        var digit = 0;
        while (data != 0) { digit++; data >>>= 1; }
        return digit;
      },
      getPatternPosition: function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
      },
      getMaskFunction: function(maskPattern) {
        switch (maskPattern) {
          case 0: return function(i, j) { return (i + j) % 2 == 0; };
          case 1: return function(i, j) { return i % 2 == 0; };
          case 2: return function(i, j) { return j % 3 == 0; };
          case 3: return function(i, j) { return (i + j) % 3 == 0; };
          case 4: return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0; };
          case 5: return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
          case 6: return function(i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 == 0; };
          case 7: return function(i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 == 0; };
          default: throw 'bad maskPattern:' + maskPattern;
        }
      },
      getErrorCorrectPolynomial: function(errorCorrectLength) {
        var a = new QRPolynomial([1], 0);
        for (var i = 0; i < errorCorrectLength; i++) {
          a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
        }
        return a;
      },
      getLengthInBits: function(mode, type) {
        if (1 <= type && type < 10) return 8;
        else if (type < 27) return 16;
        else if (type < 41) return 16;
        throw 'type:' + type;
      }
    };

    var QRMath = {
      glog: function(n) {
        if (n < 1) throw 'glog(' + n + ')';
        return QRMath.LOG_TABLE[n];
      },
      gexp: function(n) {
        while (n < 0) n += 255;
        while (n >= 256) n -= 255;
        return QRMath.EXP_TABLE[n];
      },
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256)
    };
    for (var i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
    for (var i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    for (var i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

    var QRPolynomial = function(num, shift) {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) offset++;
      this.num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    };
    QRPolynomial.prototype = {
      getAt: function(index) { return this.num[index]; },
      getLength: function() { return this.num.length; },
      multiply: function(e) {
        var num = new Array(this.getLength() + e.getLength() - 1);
        for (var i = 0; i < this.getLength(); i++) {
          for (var j = 0; j < e.getLength(); j++) {
            num[i + j] ^= QRMath.gexp(QRMath.glog(this.getAt(i)) + QRMath.glog(e.getAt(j)));
          }
        }
        return new QRPolynomial(num, 0);
      },
      mod: function(e) {
        if (this.getLength() - e.getLength() < 0) return this;
        var ratio = QRMath.glog(this.getAt(0)) - QRMath.glog(e.getAt(0));
        var num = new Array(this.getLength());
        for (var i = 0; i < this.getLength(); i++) num[i] = this.getAt(i);
        for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
        return new QRPolynomial(num, 0).mod(e);
      }
    };

    var QRRSBlock = {
      RS_BLOCK_TABLE: [
        [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
        [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
        [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
        [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
        [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
        [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
        [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],
        [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],
        [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16],
        [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13],
        [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15],
        [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12],
        [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13],
        [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13],
        [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16],
        [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15],
        [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15],
        [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14],
        [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16],
        [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17],
        [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13],
        [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16],
        [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17],
        [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16],
        [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17],
        [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16],
        [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16],
        [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16],
        [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16],
        [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16],
        [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16],
        [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16],
        [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17],
        [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16],
        [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16],
        [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16],
        [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16],
        [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16],
        [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]
      ],
      getRSBlocks: function(typeNumber, errorCorrectionLevel) {
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectionLevel);
        var length = rsBlock.length / 3;
        var list = [];
        for (var i = 0; i < length; i++) {
          var count = rsBlock[i * 3 + 0];
          var totalCount = rsBlock[i * 3 + 1];
          var dataCount = rsBlock[i * 3 + 2];
          for (var j = 0; j < count; j++) {
            list.push({ totalCount: totalCount, dataCount: dataCount });
          }
        }
        return list;
      },
      getRsBlockTable: function(typeNumber, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case QRErrorCorrectionLevel.L: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
          case QRErrorCorrectionLevel.M: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
          case QRErrorCorrectionLevel.Q: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
          case QRErrorCorrectionLevel.H: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
          default: return undefined;
        }
      }
    };

    var QRBitBuffer = function() {
      this.buffer = [];
      this.length = 0;
    };
    QRBitBuffer.prototype = {
      getBuffer: function() { return this.buffer; },
      getLengthInBits: function() { return this.length; },
      put: function(num, length) {
        for (var i = 0; i < length; i++) {
          this.putBit(((num >>> (length - i - 1)) & 1) == 1);
        }
      },
      putBit: function(bit) {
        var bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) this.buffer.push(0);
        if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
        this.length++;
      }
    };

    return function(typeNumber, errorCorrectionLevel) {
      return createQRCode(typeNumber, errorCorrectionLevel);
    };
  }();

  // Calculate minimum version needed for data
  function getMinVersion(text, ecLevel) {
    var caps = {
      L: [17,32,53,78,106,134,154,192,230,271,321,367,425,458,520,586,644,718,792,858,929,1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563,2699,2809,2953],
      M: [14,26,42,62,84,106,122,152,180,213,251,287,331,362,412,450,504,560,624,666,711,779,857,911,997,1059,1125,1190,1264,1370,1452,1538,1628,1722,1809,1911,1989,2099,2213,2331],
      Q: [11,20,32,46,60,74,86,108,130,151,177,203,241,258,292,322,364,394,442,482,509,565,611,661,715,751,805,868,908,982,1030,1112,1168,1228,1283,1351,1423,1499,1579,1663],
      H: [7,14,24,34,44,58,64,84,98,119,137,155,177,194,220,250,280,310,338,382,403,439,461,511,535,593,625,658,698,742,790,842,898,958,983,1051,1093,1139,1219,1273]
    };
    var len = 0;
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      if (code <= 0x7f) len += 1;
      else if (code <= 0x7ff) len += 2;
      else len += 3;
    }
    var capList = caps[ecLevel];
    for (var v = 0; v < capList.length; v++) {
      if (len <= capList[v]) return v + 1;
    }
    return 40;
  }

  // QR Code Generator Application
  var QRGenerator = {
    canvas: null,
    currentQR: null,

    generate: function(text, size, ecLevel) {
      if (!text || text.trim() === '') {
        throw new Error('Text is required');
      }
      size = size || 256;
      ecLevel = ecLevel || 'M';

      var version = getMinVersion(text, ecLevel);
      var qr = qrcode(version, ecLevel);
      qr.addData(text);
      qr.make();

      var moduleCount = qr.getModuleCount();
      var cellSize = Math.floor(size / moduleCount);
      var actualSize = cellSize * moduleCount;
      var margin = Math.floor((size - actualSize) / 2);

      var canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext('2d');

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Draw modules
      ctx.fillStyle = '#000000';
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(margin + col * cellSize, margin + row * cellSize, cellSize, cellSize);
          }
        }
      }

      this.currentQR = canvas;
      return canvas;
    },

    init: function() {
      this.canvas = document.getElementById('qr-canvas');
      this.bindEvents();
    },

    bindEvents: function() {
      var self = this;
      var generateBtn = document.getElementById('generate-qr');
      if (generateBtn) {
        generateBtn.addEventListener('click', function() { self.generate_(); });
      }

      var textInput = document.getElementById('qr-text');
      if (textInput) {
        textInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') self.generate_();
        });
        textInput.addEventListener('input', window.OneDevKit ? window.OneDevKit.debounce(function() { self.generate_(); }, 500) : function() { self.generate_(); });
      }

      var sizeSelect = document.getElementById('qr-size');
      if (sizeSelect) {
        sizeSelect.addEventListener('change', function() { self.generate_(); });
      }

      var ecSelect = document.getElementById('qr-ec-level');
      if (ecSelect) {
        ecSelect.addEventListener('change', function() { self.generate_(); });
      }

      var downloadBtn = document.getElementById('download-qr');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', function() { self.download(); });
      }

      var copyBtn = document.getElementById('copy-qr');
      if (copyBtn) {
        copyBtn.addEventListener('click', function() { self.copy(); });
      }

      var clearBtn = document.getElementById('clear-qr');
      if (clearBtn) {
        clearBtn.addEventListener('click', function() { self.clear(); });
      }
    },

    getOptions: function() {
      return {
        text: document.getElementById('qr-text')?.value || '',
        size: parseInt(document.getElementById('qr-size')?.value, 10) || 256,
        ecLevel: document.getElementById('qr-ec-level')?.value || 'M'
      };
    },

    generate_: function() {
      var options = this.getOptions();
      var placeholder = document.getElementById('qr-placeholder');

      if (!options.text.trim()) {
        if (placeholder) placeholder.classList.remove('hidden');
        if (this.canvas) this.canvas.classList.add('hidden');
        return;
      }

      try {
        var canvas = this.generate(options.text, options.size, options.ecLevel);

        if (this.canvas) {
          this.canvas.width = canvas.width;
          this.canvas.height = canvas.height;
          var ctx = this.canvas.getContext('2d');
          ctx.drawImage(canvas, 0, 0);
          this.canvas.classList.remove('hidden');
        }

        if (placeholder) placeholder.classList.add('hidden');

        if (window.OneDevKit && window.OneDevKit.Analytics) {
          window.OneDevKit.Analytics.trackToolUsage('qr-code-generator', 'generate');
        }
      } catch (error) {
        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('Error: ' + error.message, 'error');
        }
      }
    },

    download: function() {
      if (!this.currentQR) {
        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('Generate a QR code first', 'error');
        }
        return;
      }

      var link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = this.currentQR.toDataURL('image/png');
      link.click();

      if (window.OneDevKit && window.OneDevKit.Toast) {
        window.OneDevKit.Toast.show('QR code downloaded!', 'success');
      }
    },

    copy: async function() {
      if (!this.currentQR) {
        if (window.OneDevKit && window.OneDevKit.Toast) {
          window.OneDevKit.Toast.show('Generate a QR code first', 'error');
        }
        return;
      }

      try {
        var self = this;
        var blob = await new Promise(function(resolve) { self.currentQR.toBlob(resolve, 'image/png'); });
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

        var copyBtn = document.getElementById('copy-qr');
        if (copyBtn) {
          var originalContent = copyBtn.innerHTML;
          copyBtn.innerHTML = 'Copied!';
          copyBtn.disabled = true;
          setTimeout(function() {
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

    clear: function() {
      var textInput = document.getElementById('qr-text');
      if (textInput) textInput.value = '';

      var placeholder = document.getElementById('qr-placeholder');
      if (placeholder) placeholder.classList.remove('hidden');

      if (this.canvas) {
        this.canvas.classList.add('hidden');
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      this.currentQR = null;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { QRGenerator.init(); });
  } else {
    QRGenerator.init();
  }

  window.QRGenerator = QRGenerator;
})();
