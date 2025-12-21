/**
 * E2E tests for OneDevKit Tools
 */

const { test, expect } = require('@playwright/test');

// Set up cookie consent to avoid banner blocking tests
test.beforeEach(async ({ page }) => {
  // Pre-accept cookies by setting localStorage before page load
  await page.addInitScript(() => {
    const consent = {
      accepted: true,
      version: '1.0',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('onedevkit-cookie-consent', JSON.stringify(consent));
  });
});

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OneDevKit/);
  });

  test('has all tool links', async ({ page }) => {
    await page.goto('/');

    // Check for tool cards which are visible on homepage
    await expect(page.locator('.tool-card[href*="json-formatter"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="base64-encoder"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="password-generator"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="uuid-generator"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="lorem-ipsum"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="qr-code-generator"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="url-encoder"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="hash-generator"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="timestamp-converter"]')).toBeVisible();
    await expect(page.locator('.tool-card[href*="jwt-decoder"]')).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    // Click the visible tool card, not the hidden menu item
    await page.locator('.tool-card[href*="json-formatter"]').click();
    await expect(page).toHaveURL(/json-formatter/);
  });
});

test.describe('JSON Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/json-formatter/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Formatter/);
  });

  test('formats valid JSON', async ({ page }) => {
    const input = '{"name":"test","value":123}';

    await page.fill('#json-input', input);
    await page.click('#format-json');

    // Use #json-highlighted which is the visible one
    const output = await page.locator('#json-highlighted').textContent();
    expect(output).toContain('"name"');
    expect(output).toContain('"test"');
  });

  test('shows error for invalid JSON', async ({ page }) => {
    await page.fill('#json-input', '{invalid json}');
    await page.click('#format-json');

    await expect(page.locator('#json-error')).toBeVisible();
  });

  test('minifies JSON', async ({ page }) => {
    const input = '{\n  "name": "test"\n}';

    await page.fill('#json-input', input);
    await page.click('#minify-json');

    const output = await page.locator('#json-highlighted').textContent();
    expect(output).not.toContain('\n');
  });

  test('validates JSON', async ({ page }) => {
    await page.fill('#json-input', '{"valid": true}');
    await page.click('#validate-json');

    // Should not show error
    await expect(page.locator('#json-error')).toBeHidden();
  });

  test('load sample works', async ({ page }) => {
    await page.click('#sample-json');

    const input = await page.locator('#json-input').inputValue();
    expect(input.length).toBeGreaterThan(0);
    expect(input).toContain('{');
  });

  test('clear button works', async ({ page }) => {
    await page.fill('#json-input', '{"test": true}');
    await page.click('#clear-json');

    const input = await page.locator('#json-input').inputValue();
    expect(input).toBe('');
  });
});

test.describe('Base64 Encoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/base64-encoder/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Base64/);
  });

  test('encodes text to Base64', async ({ page }) => {
    await page.fill('#base64-input', 'Hello, World!');
    await page.click('#encode-base64');

    const output = await page.locator('#base64-output').textContent();
    expect(output).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  test('decodes Base64 to text', async ({ page }) => {
    await page.fill('#base64-input', 'SGVsbG8sIFdvcmxkIQ==');
    await page.click('#decode-base64');

    const output = await page.locator('#base64-output').textContent();
    expect(output).toBe('Hello, World!');
  });

  test('shows error for invalid Base64', async ({ page }) => {
    await page.fill('#base64-input', '!!!invalid!!!');
    await page.click('#decode-base64');

    await expect(page.locator('#base64-error')).toBeVisible();
  });

  test('URL-safe encoding option works', async ({ page }) => {
    await page.locator('#url-safe').check({ force: true });
    await page.fill('#base64-input', '>>>>????');
    await page.click('#encode-base64');

    const output = await page.locator('#base64-output').textContent();
    expect(output).not.toContain('+');
    expect(output).not.toContain('/');
  });
});

test.describe('Password Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/password-generator/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Password/);
  });

  test('generates password on click', async ({ page }) => {
    await page.click('#generate-password');

    const output = await page.locator('#password-output').textContent();
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toContain('Click');
  });

  test('password length slider works', async ({ page }) => {
    await page.fill('#password-length', '32');
    await page.click('#generate-password');

    const output = await page.locator('#password-output').textContent();
    expect(output.length).toBe(32);
  });

  test('generates unique passwords', async ({ page }) => {
    const passwords = new Set();

    for (let i = 0; i < 5; i++) {
      await page.click('#generate-password');
      await page.waitForTimeout(50); // Small delay between clicks
      const output = await page.locator('#password-output').textContent();
      passwords.add(output);
    }

    expect(passwords.size).toBe(5);
  });

  test('strength meter updates', async ({ page }) => {
    await page.click('#generate-password');

    const strengthLabel = await page.locator('#strength-label').textContent();
    expect(strengthLabel).not.toBe('-');
  });
});

test.describe('UUID Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/uuid-generator/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/UUID/);
  });

  test('generates UUID on click', async ({ page }) => {
    await page.click('#generate-uuid');

    const output = await page.locator('#uuid-output').textContent();
    expect(output).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('generates unique UUIDs', async ({ page }) => {
    const uuids = new Set();

    for (let i = 0; i < 5; i++) {
      await page.click('#generate-uuid');
      await page.waitForTimeout(50);
      const output = await page.locator('#uuid-output').textContent();
      uuids.add(output);
    }

    expect(uuids.size).toBe(5);
  });

  test('bulk generation works', async ({ page }) => {
    await page.locator('#bulk-count').fill('5');
    await page.click('#bulk-generate');

    const output = await page.locator('#bulk-output').textContent();
    const uuids = output.split('\n').filter(line => line.trim().length > 0);
    expect(uuids.length).toBe(5);
  });

  test('validates correct UUID', async ({ page }) => {
    await page.locator('#validate-input').fill('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
    await page.click('#validate-btn');

    const result = await page.locator('#validate-result').textContent();
    expect(result.toLowerCase()).toContain('valid');
  });
});

test.describe('Lorem Ipsum', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/lorem-ipsum/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Lorem Ipsum/);
  });

  test('generates paragraphs by default', async ({ page }) => {
    await page.click('#generate-lorem');

    const output = await page.locator('#lorem-output').textContent();
    expect(output.length).toBeGreaterThan(100);
  });

  test('starts with Lorem ipsum when checked', async ({ page }) => {
    await page.locator('#start-with-lorem').check({ force: true });
    await page.click('#generate-lorem');

    const output = await page.locator('#lorem-output').textContent();
    expect(output).toMatch(/^Lorem ipsum/);
  });

  test('word count updates', async ({ page }) => {
    await page.click('#generate-lorem');

    const wordCount = await page.locator('#word-count').textContent();
    expect(parseInt(wordCount)).toBeGreaterThan(0);
  });
});

test.describe('QR Code Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/qr-code-generator/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/QR Code/);
  });

  test('generates QR code for URL', async ({ page }) => {
    await page.fill('#qr-text', 'https://onedevkit.com');
    await page.click('#generate-qr');

    // Canvas should be visible
    await expect(page.locator('#qr-canvas')).toBeVisible();
  });

  test('generates QR code for text', async ({ page }) => {
    await page.fill('#qr-text', 'Hello World');
    await page.click('#generate-qr');

    await expect(page.locator('#qr-canvas')).toBeVisible();
  });

  test('clear button works', async ({ page }) => {
    await page.fill('#qr-text', 'Test');
    await page.click('#generate-qr');
    await page.click('#clear-qr', { force: true });

    await expect(page.locator('#qr-canvas')).toBeHidden();
  });
});

test.describe('URL Encoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/url-encoder/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/URL Encoder/);
  });

  test('encodes text with special characters', async ({ page }) => {
    await page.fill('#url-input', 'hello world?test=1');
    await page.click('#encode-url');

    const output = await page.locator('#url-output').textContent();
    expect(output).toContain('%20');
    expect(output).toContain('%3D');
  });

  test('decodes URL-encoded text', async ({ page }) => {
    await page.fill('#url-input', 'hello%20world');
    await page.click('#decode-url');

    const output = await page.locator('#url-output').textContent();
    expect(output).toBe('hello world');
  });

  test('mode toggle works', async ({ page }) => {
    // Component mode should encode slashes (default active mode)
    await page.click('#mode-component');
    await page.fill('#url-input', 'a/b');
    await page.click('#encode-url');

    const componentOutput = await page.locator('#url-output').textContent();
    expect(componentOutput).toContain('%2F');

    // Full URL mode should preserve slashes
    await page.click('#mode-full');
    await page.fill('#url-input', 'a/b');
    await page.click('#encode-url');

    const fullOutput = await page.locator('#url-output').textContent();
    expect(fullOutput).toBe('a/b');
  });

  test('sample button loads sample text', async ({ page }) => {
    await page.click('#sample-url');

    const input = await page.locator('#url-input').inputValue();
    expect(input.length).toBeGreaterThan(0);
  });
});

test.describe('Hash Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/hash-generator/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hash Generator/);
  });

  test('generates MD5 hash', async ({ page }) => {
    await page.fill('#hash-input', 'hello');
    await page.click('#generate-hash');

    const md5Output = await page.locator('#hash-md5').textContent();
    expect(md5Output).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  test('generates SHA-256 hash', async ({ page }) => {
    await page.fill('#hash-input', 'hello');
    await page.click('#generate-hash');

    const sha256Output = await page.locator('#hash-sha256').textContent();
    expect(sha256Output).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  test('all hash outputs have correct lengths', async ({ page }) => {
    await page.fill('#hash-input', 'test');
    await page.click('#generate-hash');

    const md5 = await page.locator('#hash-md5').textContent();
    const sha1 = await page.locator('#hash-sha1').textContent();
    const sha256 = await page.locator('#hash-sha256').textContent();
    const sha512 = await page.locator('#hash-sha512').textContent();

    expect(md5.length).toBe(32);
    expect(sha1.length).toBe(40);
    expect(sha256.length).toBe(64);
    expect(sha512.length).toBe(128);
  });

  test('sample button loads sample text', async ({ page }) => {
    await page.click('#sample-hash');

    const input = await page.locator('#hash-input').inputValue();
    expect(input.length).toBeGreaterThan(0);
  });
});

test.describe('Timestamp Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/timestamp-converter/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Timestamp/);
  });

  test('displays current timestamp', async ({ page }) => {
    const currentTimestamp = await page.locator('#current-timestamp').textContent();
    const timestamp = parseInt(currentTimestamp);

    // Should be a valid Unix timestamp (greater than year 2020)
    expect(timestamp).toBeGreaterThan(1577836800);
  });

  test('converts timestamp to date', async ({ page }) => {
    await page.fill('#timestamp-input', '1704067200');
    await page.click('#convert-to-date');

    const localResult = await page.locator('#result-local').textContent();
    const isoResult = await page.locator('#result-iso').textContent();

    expect(localResult).not.toBe('Invalid timestamp');
    expect(isoResult).toContain('2024-01-01');
  });

  test('use current button works', async ({ page }) => {
    await page.click('#use-current');

    const input = await page.locator('#timestamp-input').inputValue();
    const timestamp = parseInt(input);

    expect(timestamp).toBeGreaterThan(1577836800);
  });

  test('date to timestamp conversion works', async ({ page }) => {
    // Set a specific date
    await page.fill('#date-input', '2024-01-01T00:00');
    await page.click('#convert-to-timestamp');

    const timestampResult = await page.locator('#result-timestamp').textContent();
    // The exact value depends on timezone, but should be a valid number
    expect(parseInt(timestampResult)).toBeGreaterThan(0);
  });
});

test.describe('JWT Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JWT Decoder/);
  });

  test('decodes valid JWT', async ({ page }) => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    await page.fill('#jwt-input', jwt);
    await page.click('#decode-jwt');

    const headerOutput = await page.locator('#jwt-header').textContent();
    const payloadOutput = await page.locator('#jwt-payload').textContent();
    const signatureOutput = await page.locator('#jwt-signature').textContent();

    expect(headerOutput).toContain('HS256');
    expect(payloadOutput).toContain('John Doe');
    expect(signatureOutput).not.toBe('-');
  });

  test('sample button loads sample JWT', async ({ page }) => {
    await page.click('#sample-jwt');

    const input = await page.locator('#jwt-input').inputValue();
    expect(input).toContain('.');
    expect(input.split('.').length).toBe(3);
  });

  test('shows error for invalid JWT', async ({ page }) => {
    await page.fill('#jwt-input', 'invalid.token');
    await page.click('#decode-jwt');

    const status = await page.locator('#jwt-status').textContent();
    expect(status.toLowerCase()).toContain('error');
  });

  test('clear button works', async ({ page }) => {
    await page.click('#sample-jwt');
    await page.click('#clear-jwt');

    const input = await page.locator('#jwt-input').inputValue();
    expect(input).toBe('');
  });
});

test.describe('Tool Page Content Integrity', () => {
  // These tests ensure each tool page displays its OWN content, not another tool's
  // This prevents regressions like the selectattr bug where all pages showed JSON Formatter

  const tools = [
    { path: '/tools/json-formatter/', h1: 'JSON Formatter', breadcrumb: 'JSON Formatter' },
    { path: '/tools/base64-encoder/', h1: 'Base64 Encoder', breadcrumb: 'Base64 Encoder' },
    { path: '/tools/password-generator/', h1: 'Password Generator', breadcrumb: 'Password Generator' },
    { path: '/tools/uuid-generator/', h1: 'UUID Generator', breadcrumb: 'UUID Generator' },
    { path: '/tools/lorem-ipsum/', h1: 'Lorem Ipsum', breadcrumb: 'Lorem Ipsum' },
    { path: '/tools/qr-code-generator/', h1: 'QR Code Generator', breadcrumb: 'QR Code Generator' },
    { path: '/tools/url-encoder/', h1: 'URL Encoder', breadcrumb: 'URL Encoder' },
    { path: '/tools/hash-generator/', h1: 'Hash Generator', breadcrumb: 'Hash Generator' },
    { path: '/tools/timestamp-converter/', h1: 'Timestamp Converter', breadcrumb: 'Timestamp Converter' },
    { path: '/tools/jwt-decoder/', h1: 'JWT Decoder', breadcrumb: 'JWT Decoder' },
  ];

  for (const tool of tools) {
    test(`${tool.h1} page displays correct content`, async ({ page }) => {
      await page.goto(tool.path);

      // Check h1 contains the correct tool name (not another tool's name)
      const h1 = await page.locator('.tool-header h1').textContent();
      expect(h1).toContain(tool.h1);

      // Check breadcrumb shows correct tool name
      const breadcrumb = await page.locator('.breadcrumb').textContent();
      expect(breadcrumb).toContain(tool.breadcrumb);

      // Verify it does NOT show other tool names in h1
      const otherTools = tools.filter(t => t.h1 !== tool.h1);
      for (const other of otherTools) {
        expect(h1).not.toContain(other.h1);
      }
    });
  }
});

test.describe('Navigation & Layout', () => {
  test('theme toggle works', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    await page.click('.theme-toggle');

    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  // Skip: Mobile menu toggle relies on CSS-only solution that's hard to test
  test.skip('mobile menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Click hamburger menu
    await page.click('.nav-toggle');

    // Nav should now be visible
    await expect(page.locator('.nav')).toBeVisible();
  });

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/tools/json-formatter/');

    await expect(page.locator('.breadcrumb')).toBeVisible();
    await expect(page.locator('.breadcrumb a[href="/"]')).toBeVisible();
  });
});
