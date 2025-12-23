# Add New Language

Add a new language to OneDevKit with complete translations and review workflow.

## Instructions

You are adding a new language to the OneDevKit i18n system. Follow these steps precisely to ensure complete translation coverage.

### Step 1: Identify the Language

Ask the user for:
1. Language code (e.g., "fr", "de", "pt", "ja")
2. Language name in English (e.g., "French")
3. Native language name (e.g., "Français")
4. Locale code (e.g., "fr_FR")
5. Text direction: "ltr" or "rtl"

### Step 2: Check Current Status

```bash
npm run i18n:status
```

This shows existing languages and their coverage.

### Step 3: Update languages.json

Add a new entry to `src/_data/languages.json`:
```json
{
  "code": "{code}",
  "name": "{English name}",
  "nativeName": "{Native name}",
  "dir": "{ltr|rtl}",
  "locale": "{locale}",
  "hreflang": "{code}",
  "default": false,
  "enabled": true
}
```

### Step 4: Create Translation File

Create `src/_data/i18n/{code}.json` by translating the COMPLETE structure from `en.json`.

The translation file MUST include ALL of these sections with translations:

#### Required Sections Checklist:
- [ ] `site` - Site name, tagline, description, meta info
- [ ] `nav` - All navigation items (home, tools, about, contact, faq, privacy, terms, language)
- [ ] `common` - ALL common UI strings (~90+ keys including copy, download, clear, format, validate, encode, decode, etc.)
- [ ] `categories` - All 4 tool categories (Code Tools, Generators, Text & Data, Image Tools)
- [ ] `footer` - company, legal, followUs, allRightsReserved, disclaimer, copyright
- [ ] `errors` - Error messages (404, generic)
- [ ] `tools` - For EACH tool (currently 19+):
  - [ ] name
  - [ ] fullName
  - [ ] description
  - [ ] shortDescription
  - [ ] metaTitle
  - [ ] metaDescription
  - [ ] keywords
  - [ ] howTo (title + steps array)
  - [ ] faq (array of question/answer)
- [ ] `pages` - For EACH page (home, 404, about, contact, faq, privacy, terms):
  - [ ] title
  - [ ] metaDescription
  - [ ] keywords
  - [ ] All page-specific content sections

### Step 5: Translation Guidelines

When translating:
- Maintain the exact same JSON structure
- Keep placeholders like `{year}`, `{value}` unchanged
- Keep brand names "OneDevKit" unchanged
- Keep technical terms (JSON, Base64, UUID, JWT, etc.) in English where standard
- Translate naturally - avoid literal translations
- Ensure appropriate formality level for the culture
- Use native punctuation conventions

### Step 6: Validate Coverage

```bash
npm run i18n:validate
```

Fix any missing translations until validation passes with 100% coverage.

### Step 7: Create Full Language Review

Generate a review export for Gemini to check all translations:

```bash
npm run i18n:review -- --lang={code}
```

This creates a versioned review at `i18n-reviews/{code}/v001_{date}/`

### Step 8: Gemini Review Process

1. Open `i18n-reviews/{code}/v001_{date}/export.md`
2. Copy entire contents to Gemini Pro
3. Gemini will return a JSON array of corrections
4. Paste the JSON into `gemini-response.json` (same folder)
5. Apply corrections:

```bash
npm run i18n:review:apply -- --lang={code}
```

6. Review the generated `correction-report.md`

### Step 9: Update State

The review script automatically updates `i18n-reviews/state.json` with:
- Language coverage
- Last review version
- Review timestamp

### Step 10: Build and Test

```bash
npm run build
```

Verify:
- [ ] All pages render correctly in browser at `/{code}/`
- [ ] Language switcher shows new language
- [ ] Hreflang tags include new language
- [ ] All tool pages have translated content
- [ ] Navigation and footer are translated

### Step 11: Add RTL Support (if applicable)

If the language uses RTL (Arabic, Hebrew, Persian, etc.):
1. Ensure `dir: "rtl"` is set in languages.json
2. Test RTL layout in browser
3. Add any necessary RTL CSS adjustments to layout files

---

## Current Tools List (19 tools - all must be translated):

1. json-formatter
2. base64-encoder
3. url-encoder
4. jwt-decoder
5. password-generator
6. uuid-generator
7. hash-generator
8. lorem-ipsum
9. qr-code-generator
10. timestamp-converter
11. regex-tester
12. color-picker
13. diff-checker
14. markdown-preview
15. word-counter
16. case-converter
17. image-compressor
18. passport-photo
19. social-media-resizer

## Current Pages List (7 pages - all must be translated):

1. home
2. 404
3. about
4. contact
5. faq
6. privacy
7. terms

---

## i18n Review Workflow Integration

After completing translations:

```bash
# 1. Validate 100% coverage
npm run i18n:validate

# 2. Create full language review
npm run i18n:review -- --lang={code}

# 3. After Gemini review, apply corrections
npm run i18n:review:apply -- --lang={code}

# 4. Verify final status
npm run i18n:status

# 5. Build and test
npm run build
```

---

## Validation Checklist

Before completing, verify:
- [ ] `npm run i18n:validate` shows 100% coverage
- [ ] `npm run i18n:status` shows language reviewed
- [ ] `npm run build` completes without errors
- [ ] All pages render correctly in browser
- [ ] Language switcher shows new language
- [ ] Hreflang tags include new language

---

## File Locations Summary

| File | Purpose |
|------|---------|
| `src/_data/languages.json` | Language registry |
| `src/_data/i18n/{code}.json` | Language translations |
| `i18n-reviews/{code}/` | Language review history |
| `i18n-reviews/state.json` | Review state tracking |

---

## Future Reviews

When translations need updates or re-review:

```bash
# Creates next version (v002, v003, etc.)
npm run i18n:review -- --lang={code}
```

All previous versions are preserved for audit trail.
