# OG Image Prompts for OneDevKit

Copy each prompt below and paste directly into your AI image generator.
All images should be **1200x630 pixels**.

---

## 1. Default OG Image
**Filename:** `og-default.png`
**Used on:** Homepage, About, Contact, Privacy, Terms

```
A wide banner image for a developer tools website, 1200x630 pixels, horizontal landscape format. Deep blue gradient background transitioning from #2563eb on the left to #1e40af on the right. Floating 3D code bracket symbols < > and / in white with soft glow effects, arranged asymmetrically. Abstract geometric shapes including hexagons and circles with glassmorphism effect. Subtle grid pattern overlay. Soft light rays coming from top left corner. Clean, modern, professional SaaS aesthetic. No text, no logos, no people. Minimalist tech illustration style.
```

---

## 2. JSON Formatter
**Filename:** `json-formatter.png`
**Used on:** /tools/json-formatter/

```
A wide banner image for a JSON formatting tool, 1200x630 pixels, horizontal landscape format. Deep blue gradient background from #2563eb to #1e40af. Center focus: stylized curly braces { } in white, large and prominent, with a subtle 3D effect. Surrounding the braces: small floating code elements representing JSON structure - colons, commas, square brackets, quotation marks - all in light blue and white with soft glow. Left side shows messy, scattered code symbols, right side shows the same symbols neatly organized in rows, representing the transformation from messy to formatted. Abstract, geometric style. No actual readable text or code. Soft shadows and ambient lighting. Professional developer tool aesthetic.
```

---

## 3. Password Generator
**Filename:** `password-generator.png`
**Used on:** /tools/password-generator/

```
A wide banner image for a password generator tool, 1200x630 pixels, horizontal landscape format. Deep blue gradient background from #2563eb to #1e40af. Center: a modern, stylized padlock icon in white with a glowing shield effect behind it. Around the padlock: floating abstract characters representing password symbols - asterisks *, hash #, at signs @, and random letters - scattered in a circular pattern with motion blur suggesting randomness. Small key icon in the corner. Subtle digital circuit patterns in the background. Secure, trustworthy feeling. Glowing particles and light effects. No readable passwords or actual text. Clean, professional cybersecurity aesthetic.
```

---

## 4. UUID Generator
**Filename:** `uuid-generator.png`
**Used on:** /tools/uuid-generator/

```
A wide banner image for a UUID generator tool, 1200x630 pixels, horizontal landscape format. Deep blue gradient background from #2563eb to #1e40af. Center: a stylized fingerprint icon merged with hexagonal grid pattern, representing unique identification. Floating around it: abstract hexadecimal-style blocks and dashes arranged in the UUID format pattern (8-4-4-4-12 grouping) but without readable characters - just glowing rectangular shapes in white and light blue. Small DNA helix element suggesting uniqueness. Geometric, technical aesthetic with soft glows. Binary or matrix-style subtle background pattern. No actual UUIDs or readable text. Modern, clean developer tool style.
```

---

## 5. Lorem Ipsum Generator
**Filename:** `lorem-ipsum.png`
**Used on:** /tools/lorem-ipsum/

```
A wide banner image for a Lorem Ipsum text generator tool, 1200x630 pixels, horizontal landscape format. Deep blue gradient background from #2563eb to #1e40af. Center: stylized document or page icons with horizontal lines representing text paragraphs, stacked in a cascading 3D arrangement. Abstract typography elements - line shapes of varying lengths representing sentences and paragraphs - floating and arranging themselves into neat columns. Quill pen or typewriter key subtle element in corner. Text placeholder aesthetic without any readable words. Soft paper texture overlay. Clean, minimalist design tool aesthetic. Floating rectangular shapes representing text blocks. Professional and creative feeling.
```

---

## 6. QR Code Generator
**Filename:** `qr-code-generator.png`
**Used on:** /tools/qr-code-generator/

```
A wide banner image for a QR code generator tool, 1200x630 pixels, horizontal landscape format. Deep blue gradient background from #2563eb to #1e40af. Center: a large stylized QR code pattern in white, but abstract and artistic - not a real scannable code. The QR pattern appears to be emerging or forming from scattered pixels on the left that organize into the pattern on the right. Subtle scan line effect with light beam crossing the QR code. Small smartphone silhouette in corner suggesting scanning. Glowing corners on the QR code squares. Digital, modern aesthetic with pixel art influence. Floating square particles around the main QR code. No actual scannable codes. Clean tech aesthetic.
```

---

## Quick Reference

| Image | Filename | Key Visual Elements |
|-------|----------|---------------------|
| Default | `og-default.png` | Code brackets, gradient, geometric shapes |
| JSON | `json-formatter.png` | Curly braces { }, messy-to-organized transformation |
| Password | `password-generator.png` | Padlock, shield, floating symbols |
| UUID | `uuid-generator.png` | Fingerprint + hexagons, dash pattern |
| Lorem | `lorem-ipsum.png` | Document icons, text line shapes |
| QR Code | `qr-code-generator.png` | Abstract QR pattern, scan effect |

---

## After Generation

1. Download each image as PNG
2. Resize to exactly **1200x630** if needed
3. Compress at [tinypng.com](https://tinypng.com) (aim for <100KB each)
4. Save to `/images/og/` folder with the exact filenames above
5. Commit and push:
   ```bash
   git add images/og/
   git commit -m "Add OG images for social sharing"
   git push
   ```
