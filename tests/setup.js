/**
 * Jest setup file - polyfills for jsdom environment
 */

const { TextEncoder, TextDecoder } = require('util');

// Polyfill TextEncoder/TextDecoder for jsdom
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock crypto.getRandomValues for UUID and Password generators
const crypto = require('crypto');
global.crypto = {
  getRandomValues: (buffer) => {
    return crypto.randomFillSync(buffer);
  }
};

// Mock window.crypto as well
Object.defineProperty(window, 'crypto', {
  value: global.crypto
});
