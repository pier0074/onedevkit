# OneDevKit

Free online developer tools - JSON formatter, password generator, UUID generator, and more.

## Project Structure

```
onedevkit/
├── index.html                    # Homepage
├── css/
│   └── style.css                 # Main stylesheet
├── js/
│   ├── common.js                 # Shared utilities
│   ├── cookie-consent.js         # GDPR/CCPA cookie consent
│   ├── json-formatter.js         # JSON Formatter tool
│   ├── password-generator.js     # Password Generator tool
│   ├── lorem-ipsum.js            # Lorem Ipsum Generator tool
│   ├── uuid-generator.js         # UUID Generator tool
│   └── qr-generator.js           # QR Code Generator tool
├── tools/
│   ├── json-formatter/
│   ├── password-generator/
│   ├── lorem-ipsum/
│   ├── uuid-generator/
│   └── qr-code-generator/
├── about/
├── privacy/
├── terms/
├── contact/
├── images/
├── 404.html
├── robots.txt
├── sitemap.xml
└── manifest.json
```

## Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks)
- Hosted on Cloudflare Pages
- Zero external dependencies (inline QR code generation)

## Development

1. Clone the repository
2. Open `index.html` in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (npx)
   npx serve
   ```
3. Make changes and test

## Deployment

Push to GitHub → Cloudflare Pages auto-deploys

## SEO Features

- Full meta tags (title, description, canonical, OG, Twitter)
- Schema.org markup (WebApplication, FAQPage, BreadcrumbList)
- XML Sitemap
- robots.txt
- Semantic HTML
- Mobile-first responsive design
- Core Web Vitals optimized

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader friendly
- Skip to content link
- High contrast ratios
- Focus indicators

## License

MIT License - feel free to use and modify.

---

Built with care for developers everywhere.
