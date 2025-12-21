# OneDevKit - Free Online Developer Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Pages](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Pages-orange)](https://pages.cloudflare.com/)

A collection of free, privacy-focused developer tools that run entirely in your browser. No signup required, no data stored on servers.

**Live Site:** [https://onedevkit.com](https://onedevkit.com)

## Project Purpose

This is a **passive income project** designed to generate revenue through advertising (Google AdSense) by attracting high organic traffic from developers searching for free online tools. The strategy focuses on:

- **SEO-optimized content** to rank for developer tool searches
- **High-quality, fast tools** that users bookmark and return to
- **Ad placements** that monetize traffic without degrading user experience
- **Zero server costs** through static hosting on Cloudflare Pages free tier

---

## Table of Contents

- [Project Purpose](#project-purpose)
- [Features](#features)
- [Available Tools](#available-tools)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [SEO & Analytics Setup](#seo--analytics-setup)
- [Monetization Strategy](#monetization-strategy)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **100% Free** - No premium tiers, no subscriptions
- **Privacy First** - All processing happens client-side
- **No Signup** - Use instantly, no account required
- **Offline Ready** - PWA support for offline use
- **Mobile Friendly** - Responsive design for all devices
- **Dark Mode** - System preference detection + manual toggle
- **SEO Optimized** - Schema.org markup, Open Graph, Twitter Cards
- **GDPR/CCPA Compliant** - Cookie consent with opt-out
- **Zero Dependencies** - Pure HTML, CSS, JavaScript

---

## Available Tools

| Tool | Description | URL |
|------|-------------|-----|
| **JSON Formatter** | Format, validate, beautify, and minify JSON | `/tools/json-formatter/` |
| **Base64 Encoder** | Encode/decode Base64, file upload support | `/tools/base64-encoder/` |
| **URL Encoder** | Encode/decode URLs and query strings | `/tools/url-encoder/` |
| **JWT Decoder** | Decode and inspect JSON Web Tokens | `/tools/jwt-decoder/` |
| **Password Generator** | Generate secure random passwords | `/tools/password-generator/` |
| **UUID Generator** | Generate UUID v4 with bulk support | `/tools/uuid-generator/` |
| **Hash Generator** | Generate MD5, SHA-1, SHA-256, SHA-512 hashes | `/tools/hash-generator/` |
| **Lorem Ipsum** | Generate placeholder text | `/tools/lorem-ipsum/` |
| **QR Code Generator** | Create QR codes for URLs/text | `/tools/qr-code-generator/` |
| **Timestamp Converter** | Convert Unix timestamps to dates and vice versa | `/tools/timestamp-converter/` |

---

## Tech Stack

- **Static Site Generator:** Eleventy (11ty) with Nunjucks templates
- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Testing:** Jest (unit tests) + Playwright (E2E tests)
- **Hosting:** Cloudflare Pages (free tier)
- **Analytics:** Google Analytics 4 (optional, consent-based)
- **PWA:** Web App Manifest + Service Worker ready
- **SEO:** Schema.org JSON-LD, Open Graph, Twitter Cards

---

## Project Structure

```
onedevkit/
├── .eleventy.js               # Eleventy configuration
├── package.json               # Node.js dependencies & scripts
│
├── src/                       # Source files (Eleventy input)
│   ├── _data/
│   │   ├── tools.json         # Tool definitions (single source of truth)
│   │   └── site.json          # Site metadata
│   │
│   ├── _includes/
│   │   ├── layouts/           # Nunjucks layouts (base, tool, page)
│   │   └── partials/          # Reusable components (header, footer, nav)
│   │
│   ├── css/
│   │   └── style.css          # Complete design system
│   │
│   ├── js/
│   │   ├── common.js          # Shared utilities
│   │   ├── cookie-consent.js  # GDPR/CCPA compliance
│   │   ├── json-formatter.js  # JSON tool logic
│   │   ├── base64.js          # Base64 tool logic
│   │   ├── url-encoder.js     # URL encoder/decoder
│   │   ├── jwt-decoder.js     # JWT decoder
│   │   ├── password-generator.js
│   │   ├── uuid-generator.js
│   │   ├── hash-generator.js  # Hash generator (MD5, SHA)
│   │   ├── lorem-ipsum.js
│   │   ├── qr-generator.js
│   │   └── timestamp-converter.js
│   │
│   ├── images/
│   │   └── og/                # Open Graph images (1200x630)
│   │
│   ├── tools/                 # Tool page templates
│   ├── pages/                 # Static pages (about, contact, etc.)
│   ├── index.njk              # Homepage template
│   └── sitemap.njk            # Auto-generated sitemap
│
├── dist/                      # Build output (Eleventy output)
│
└── tests/
    ├── unit/                  # Jest unit tests
    └── e2e/                   # Playwright E2E tests
```

---

## Local Development

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm

### Quick Start

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
# Open http://localhost:8080

# Build for production
npm run build
```

### Available Scripts

```bash
npm run dev          # Start Eleventy dev server with hot reload
npm run build        # Build static site to dist/
npm run clean        # Remove dist/ folder
npm run test         # Run all tests (unit + e2e)
npm run test:unit    # Run Jest unit tests only
npm run test:e2e     # Run Playwright E2E tests only
```

---

## Production Deployment

### Cloudflare Pages (Recommended)

Cloudflare Pages offers free hosting with global CDN, SSL, and unlimited bandwidth.

#### Step 1: Connect Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Select the repository: `onedevkit`

#### Step 2: Build Settings

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |

#### Step 3: Deploy

1. Click **Save and Deploy**
2. Wait for deployment (usually < 1 minute)
3. Your site is live at: `https://onedevkit.pages.dev`

#### Step 4: Custom Domain

1. Go to **Custom domains** tab
2. Add `onedevkit.com`
3. Update DNS at your registrar:
   - **CNAME:** `@` → `onedevkit.pages.dev`
   - **CNAME:** `www` → `onedevkit.pages.dev`
4. Cloudflare auto-provisions SSL

#### Step 5: Redirects (Optional)

Create `_redirects` file in root:
```
/privacy-policy  /privacy  301
/terms-of-service  /terms  301
```

### Alternative Hosting Options

| Platform | Free Tier | Custom Domain | SSL |
|----------|-----------|---------------|-----|
| **Cloudflare Pages** | Unlimited | Yes | Auto |
| **GitHub Pages** | 100GB/mo | Yes | Auto |
| **Netlify** | 100GB/mo | Yes | Auto |
| **Vercel** | 100GB/mo | Yes | Auto |

---

## SEO & Analytics Setup

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://onedevkit.com`
3. Verify ownership via DNS TXT record
4. Submit sitemap: `https://onedevkit.com/sitemap.xml`

### Google Analytics 4

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID (format: `G-XXXXXXXXXX`)
3. Edit `js/cookie-consent.js`:
   ```javascript
   const GA_MEASUREMENT_ID = 'G-YOUR_ACTUAL_ID';
   ```
4. Analytics loads only after user consent (GDPR compliant)

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site and verify
3. Submit sitemap

### Structured Data Testing

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## Monetization Strategy

### Revenue Streams for Passive Income

#### 1. Google AdSense (Primary)

**Setup:**
1. Apply at [adsense.google.com](https://www.adsense.google.com)
2. Wait for approval (requires traffic history)
3. Add ad units to tool pages

**Recommended Placements:**
- Below tool header (before tool area)
- After "How to Use" section
- In Related Tools section
- Sidebar on desktop

**Expected Revenue:**
- Developer tools: $1-5 RPM (per 1000 page views)
- 10,000 monthly visitors = $10-50/month
- 100,000 monthly visitors = $100-500/month

#### 2. Affiliate Links

**Relevant Products:**
- Password managers (1Password, Bitwarden, LastPass)
- Development tools (JetBrains, VS Code extensions)
- Hosting services (Cloudflare, DigitalOcean)
- VPN services
- Learning platforms (Udemy, Pluralsight)

**Integration Points:**
- Password Generator → "Store passwords securely with [Password Manager]"
- About page → "Built with these tools"
- Blog posts (if added)

#### 3. Premium Features (Future)

Potential upsells (keep core free):
- Remove ads ($2.99 one-time)
- API access for developers
- Bulk operations (1000+ UUIDs)
- Custom QR code colors/logos

#### 4. Donations

- Ko-fi / Buy Me a Coffee button
- GitHub Sponsors
- Crypto donations

### Traffic Growth Strategies

1. **SEO (Already Implemented)**
   - Schema.org markup for rich snippets
   - FAQPage for Featured Snippets
   - HowTo for step-by-step snippets

2. **Content Marketing**
   - Add blog with developer tutorials
   - "How to validate JSON" articles
   - Link back to tools

3. **Social Media**
   - Share on Reddit (r/webdev, r/programming)
   - Dev.to, Hashnode articles
   - Twitter/X developer community

4. **Backlinks**
   - Submit to tool directories
   - Developer resource lists
   - Stack Overflow answers (where relevant)

---

## Testing

### Unit Tests (Jest)

```bash
npm run test:unit        # Run all unit tests
npm run test:unit:watch  # Watch mode
```

**Coverage:** 289 tests across 12 test suites
- JSON Formatter (30 tests)
- Base64 Encoder (24 tests)
- URL Encoder (17 tests)
- JWT Decoder (20 tests)
- Password Generator (17 tests)
- UUID Generator (15 tests)
- Hash Generator (16 tests)
- Lorem Ipsum (15 tests)
- QR Generator (18 tests)
- Timestamp Converter (18 tests)
- Common Utilities (33 tests)
- Cookie Consent (25 tests)

### E2E Tests (Playwright)

```bash
npm run test:e2e     # Run headless
npm run test:e2e:ui  # Interactive UI mode
```

**Coverage:** 65 tests covering all 10 tools, UI interactions, and content integrity

### Manual Testing

```bash
# Lighthouse audit
npx lighthouse https://onedevkit.com --view

# HTML validation
npx html-validate "dist/**/*.html"

# Broken link check
npx broken-link-checker https://onedevkit.com -r
```

### Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | 90+ | Chrome DevTools |
| Lighthouse Accessibility | 100 | Chrome DevTools |
| Lighthouse SEO | 100 | Chrome DevTools |
| First Contentful Paint | < 1.5s | PageSpeed Insights |
| Time to Interactive | < 3s | PageSpeed Insights |

---

## Pre-Launch Checklist

Before going live, verify:

- [x] Update `GA_MEASUREMENT_ID` in `cookie-consent.js`
- [x] Test all tools function correctly
- [x] Verify OG images display properly
- [x] Submit sitemap to Google/Bing
- [x] Set up Google Search Console
- [x] Test cookie consent flow
- [x] Verify dark mode works
- [x] Test mobile responsiveness
- [x] Check all internal links work
- [x] Run Lighthouse audit

---

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Skip to content link
- High contrast ratios
- Focus indicators
- Semantic HTML structure

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use 2-space indentation
- Follow existing naming conventions
- Comment complex logic
- Maintain accessibility (ARIA, semantic HTML)

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/pier0074/onedevkit/issues)
- **Contact:** Via contact page at onedevkit.com

---

**Built with vanilla HTML, CSS, and JavaScript.**
