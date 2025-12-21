# SEO Compliance Checklist

## Test Instructions
Run these checks before each deployment to ensure 100% SEO compliance.

---

## 1. Meta Tags Verification

### Homepage (index.html)
- [ ] `<title>` exists and is 50-60 characters
- [ ] `<meta name="description">` exists and is 150-160 characters
- [ ] `<meta name="keywords">` exists with relevant terms
- [ ] `<meta name="robots" content="index, follow">` present
- [ ] `<link rel="canonical">` points to correct URL

### Each Tool Page
Run for: json-formatter, base64-encoder, password-generator, uuid-generator, lorem-ipsum, qr-code-generator

- [ ] Unique `<title>` (not duplicate of other pages)
- [ ] Unique `<meta description>` under 160 chars
- [ ] Canonical URL matches page URL
- [ ] Keywords relevant to specific tool

---

## 2. Open Graph (Social Sharing)

### Required Tags (All Pages)
- [ ] `og:type` = "website"
- [ ] `og:url` = canonical URL
- [ ] `og:title` (50-60 chars)
- [ ] `og:description` (150-160 chars)
- [ ] `og:image` points to 1200x630 JPG
- [ ] `og:image:width` = "1200"
- [ ] `og:image:height` = "630"
- [ ] `og:site_name` = "OneDevKit"

### Twitter Cards
- [ ] `twitter:card` = "summary_large_image"
- [ ] `twitter:title` matches og:title
- [ ] `twitter:description` matches og:description
- [ ] `twitter:image` matches og:image

---

## 3. Schema.org Structured Data

### Homepage
- [ ] Organization schema with name, url, logo
- [ ] WebSite schema with SearchAction
- [ ] ItemList schema with all 6 tools

### Tool Pages
- [ ] WebApplication schema with:
  - [ ] name, url, description
  - [ ] applicationCategory
  - [ ] offers (price: 0)
  - [ ] aggregateRating (ratingValue, ratingCount)
  - [ ] screenshot
  - [ ] datePublished
  - [ ] softwareVersion
  - [ ] featureList
- [ ] BreadcrumbList schema
- [ ] FAQPage schema with 5+ questions
- [ ] HowTo schema with steps

### Static Pages
- [ ] BreadcrumbList on About, FAQ, Contact, Privacy, Terms

---

## 4. Technical SEO

### robots.txt
- [ ] Allows all crawlers: `User-agent: *`
- [ ] Sitemap URL present
- [ ] No accidental blocks

### sitemap.xml
- [ ] All pages listed (12 total)
- [ ] Correct URLs (absolute, with trailing slashes)
- [ ] Priority values set (1.0 for home, 0.9 for tools, etc.)
- [ ] lastmod dates present

### URL Structure
- [ ] All URLs use trailing slashes consistently
- [ ] URLs are lowercase
- [ ] No special characters in URLs
- [ ] Descriptive, keyword-rich slugs

---

## 5. Performance (Core Web Vitals)

### Lighthouse Audit Targets
- [ ] Performance: 90+
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: 100

### Critical Checks
- [ ] No render-blocking CSS/JS
- [ ] Images optimized (WebP or compressed JPG)
- [ ] CSS minified in production
- [ ] JS minified in production
- [ ] Fonts preconnected or local

---

## 6. Accessibility (Impacts SEO)

- [ ] All images have alt text
- [ ] Skip to content link works
- [ ] Keyboard navigation functional
- [ ] Color contrast passes WCAG AA
- [ ] ARIA labels on interactive elements
- [ ] Semantic HTML (header, main, footer, nav)
- [ ] Form labels associated with inputs

---

## 7. Mobile Optimization

- [ ] Viewport meta tag present
- [ ] Touch targets 48px minimum
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Mobile navigation works

---

## 8. Image Optimization

### OG Images (/images/og/)
- [ ] og-default.jpg exists (1200x630)
- [ ] json-formatter.jpg exists (1200x630)
- [ ] base64-encoder.jpg exists (1200x630)
- [ ] password-generator.jpg exists (1200x630)
- [ ] uuid-generator.jpg exists (1200x630)
- [ ] lorem-ipsum.jpg exists (1200x630)
- [ ] qr-code-generator.jpg exists (1200x630)
- [ ] All under 100KB

### Favicons
- [ ] favicon.svg exists
- [ ] favicon.ico exists
- [ ] favicon-16x16.png exists
- [ ] favicon-32x32.png exists
- [ ] apple-touch-icon.png (180x180)
- [ ] icon-192.png exists
- [ ] icon-512.png exists

---

## 9. Internal Linking

- [ ] All tool pages link to other tools (Related Tools section)
- [ ] Footer has links to all pages
- [ ] Breadcrumbs on all subpages
- [ ] No broken internal links

---

## 10. External Factors (Post-Launch)

- [ ] Google Search Console configured
- [ ] Sitemap submitted to Google
- [ ] Bing Webmaster Tools configured
- [ ] Google Analytics tracking (after GA ID set)

---

## Testing Commands

```bash
# Validate HTML
npx html-validate "**/*.html"

# Check for broken links
npx broken-link-checker https://onedevkit.com --recursive

# Validate structured data
# Use: https://validator.schema.org/

# Test mobile friendliness
# Use: https://search.google.com/test/mobile-friendly

# Check Core Web Vitals
# Use: https://pagespeed.web.dev/

# Test OG tags
# Use: https://www.opengraph.xyz/

# Test Twitter cards
# Use: https://cards-dev.twitter.com/validator
```

---

## Score: ___ / 100

| Category | Points | Score |
|----------|--------|-------|
| Meta Tags | 15 | |
| Open Graph | 10 | |
| Schema.org | 20 | |
| Technical SEO | 15 | |
| Performance | 15 | |
| Accessibility | 10 | |
| Mobile | 5 | |
| Images | 5 | |
| Internal Links | 5 | |
| **TOTAL** | **100** | |
