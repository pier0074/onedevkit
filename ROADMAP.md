# OneDevKit Project Roadmap

## Overview

**OneDevKit** is a passive income project driven by ad revenue from organic search traffic. With 14 tools live and Phase 1 complete, we're ready to expand into high-opportunity niches.

**Current State:** v1.6.0 | 18 Tools | Phase 2 In Progress

**Strategic Direction:** Focus on high-traffic niche tools (image/document compression) rather than competing head-on with giants like ilovepdf.com (283M visits/month).

---

## Business Model

**Revenue Formula:**
```
Revenue = Traffic × Pages/Visit × Ad Impressions × RPM
```

**Key Levers:**
1. **More tools** = More keywords = More organic traffic
2. **Niche focus** = Less competition = Faster ranking
3. **Time on site** = More page views = More ad impressions
4. **Quality/Speed** = Better rankings = More traffic

---

## Verified Competitor Traffic (SimilarWeb Dec 2024)

| Competitor | Monthly Visits | Niche | Takeaway |
|------------|---------------|-------|----------|
| ilovepdf.com | **283M** | PDF tools | Too big to compete directly |
| smallpdf.com | **50M** | PDF tools | Established giant |
| image.pi7.org | **12.5M** | Image compression (India) | **Niche success story** |
| wordcounter.net | **10M** | Word counter | Simple tool, massive traffic |
| tinypng.com | **2.8M** | Image compression | Focused tool |

**Key Insight:** pi7.org proves the India niche works - 83% of their traffic is from India, 77% organic search. They focus on government document requirements (passport photos, specific KB sizes).

---

## Phase 2: High-Traffic Niche Tools (CURRENT)

**Goal:** Target underserved niches with verified demand

### Priority 1: Image Compression Tools

| Tool | Target Keywords | Est. Searches | Competition | Effort |
|------|----------------|---------------|-------------|--------|
| **Image Compressor to Specific KB** | "compress image to 20kb", "resize image to 50kb" | 100K+ combined | Medium | Medium |
| **Passport/Visa Photo Tool** | "passport photo size", "visa photo 2x2" | 500K+ combined | Medium | Medium |
| Word Counter | "word counter", "character count" | 200K+ | Medium | Small |
| Case Converter | "uppercase to lowercase", "text case converter" | 50K+ | Low | Small |

### Why Image Compression First

1. **Verified Demand:** pi7.org gets 12.5M visits/month with these exact tools
2. **Client-Side Feasible:** [Compressor.js](https://github.com/fengyuanchen/compressorjs) and Canvas API work entirely in browser
3. **India Traffic Opportunity:** Government forms require specific file sizes (20KB, 50KB, 100KB)
4. **Long-tail Keywords:** "compress image to 20kb" has less competition than generic "image compressor"

### Technical Approach: Image Compressor

```javascript
// Binary search algorithm for target KB
// Uses Canvas API + quality adjustment
// Fully client-side, no server needed
```

**Libraries:**
- [Compressor.js](https://github.com/fengyuanchen/compressorjs) - JavaScript image compressor
- [client-compress](https://github.com/davejm/client-compress) - Target size compression

### Why NOT PDF Compression

| Reason | Details |
|--------|---------|
| Massive competition | ilovepdf = 283M, smallpdf = 50M visits |
| Technical complexity | Needs WebAssembly/Ghostscript |
| Server costs | Can't do proper PDF compression client-side |
| Lower ROI | Same effort, 10x harder to rank |

---

## Phase 2 Tools - Detailed Specs

### 1. Image Compressor to Specific KB

**Priority:** Must-Have | **Impact:** High | **Effort:** Medium (1 week)

```
Target Keywords:
- "compress image to 20kb" (40K+ searches)
- "compress image to 50kb" (60K+ searches)
- "compress image to 100kb" (50K+ searches)
- "resize image to 20kb" (40K+ searches)

Features:
- Preset buttons: 20KB, 50KB, 100KB, 200KB
- Custom KB input
- Drag & drop upload
- Preview before/after
- Batch processing
- Download as ZIP (multiple images)

Technical:
- Canvas API for compression
- Binary search for exact size targeting
- Quality slider as fallback
- Dimension reduction if needed for very small targets
```

### 2. Passport/Visa Photo Tool

**Priority:** Should-Have | **Impact:** High | **Effort:** Medium (1-2 weeks)

```
Target Keywords:
- "passport photo size" (100K+ searches)
- "passport photo maker" (50K+ searches)
- "visa photo 2x2 inches" (30K+ searches)
- "passport photo India" (50K+ searches)
- "resize photo for visa" (20K+ searches)

Features:
- Country selector with presets:
  - USA: 2x2 inches, 600x600px
  - India: 2x2 inches, 51x51mm, 10KB-300KB
  - UK: 35x45mm
  - Schengen: 35x45mm
- Auto-crop with face detection (optional)
- Background color enforcement (white/light gray)
- Size compression to meet requirements
- Print layout (4x6, A4 with multiple photos)

Technical:
- Canvas API for resize/crop
- Optional: face-api.js for face detection
- Compression to meet KB requirements
```

### 3. Word Counter

**Priority:** Should-Have | **Impact:** Medium-High | **Effort:** Small (2-3 days)

```
Target Keywords:
- "word counter" (200K+ searches)
- "character count" (100K+ searches)
- "word count online" (50K+ searches)

Features:
- Real-time word/character/sentence/paragraph count
- Reading time estimate
- Speaking time estimate
- Keyword density
- Exclude/include spaces option

Technical:
- Pure JavaScript, no dependencies
- Real-time updates with debounce
```

### 4. Case Converter

**Priority:** Nice-to-Have | **Impact:** Medium | **Effort:** Small (1-2 days)

```
Target Keywords:
- "uppercase to lowercase" (50K+ searches)
- "lowercase to uppercase" (30K+ searches)
- "title case converter" (20K+ searches)
- "sentence case" (10K+ searches)

Features:
- UPPERCASE
- lowercase
- Title Case
- Sentence case
- camelCase
- snake_case
- kebab-case
- Alternating CaSe
```

---

## Phase 3: Engagement & Monetization

**Goal:** Maximize revenue from existing traffic

| Feature | Impact | Effort | Description |
|---------|--------|--------|-------------|
| Related Tools Sidebar | High | Small | Show 3-4 related tools on each page |
| Tool History (localStorage) | Medium | Small | Recent tools used, quick access |
| Shareable URLs with State | High | Medium | Save tool state in URL for sharing |
| AdSense Integration | High | Small | Strategic ad placement |

---

## Phase 4: Content & SEO

**Goal:** Capture long-tail search traffic

### Blog Articles (Priority Order)

| Article | Target Keywords | Link To |
|---------|----------------|---------|
| How to Compress Image to Exact Size | "compress image to specific size" | Image Compressor |
| Passport Photo Requirements by Country | "passport photo size [country]" | Passport Tool |
| Regex Cheat Sheet | "regex cheat sheet" | Regex Tester |
| JSON vs YAML: Which to Use | "json vs yaml" | JSON Formatter |

### SEO Enhancements

- [ ] FAQ Schema on all tool pages
- [ ] HowTo Schema for complex tools
- [ ] Internal linking between related tools
- [ ] Tool-specific landing pages for long-tail keywords

---

## Phase 5: International Expansion

**Goal:** Multiply traffic with translations

| Language | Priority | Reason |
|----------|----------|--------|
| Hindi | High | India is top traffic source for niche tools |
| Spanish | High | 500M speakers, less competition |
| Portuguese | Medium | Brazil market |

**Implementation:**
- `/hi/tools/image-compressor/`
- `/es/tools/image-compressor/`
- hreflang tags for proper indexing

---

## Tools NOT to Build

| Tool | Reason |
|------|--------|
| PDF Compressor | Competition too strong (ilovepdf 283M visits) |
| PDF to Word | Same - requires server infrastructure |
| Video Compressor | Bandwidth/server costs |
| PWA/Offline Mode | Reduces return visits |
| CLI Tool | No web traffic |
| API Access | Bypasses ads |

---

## Technical Architecture

### Current Stack
- **Framework:** 11ty (Eleventy) v3.1.2
- **Testing:** Jest + Playwright (88 tests)
- **Hosting:** Cloudflare Pages
- **CSS:** Custom CSS framework with dark mode
- **JS:** Vanilla JavaScript, no heavy frameworks

### Strengths
- All tools run client-side (privacy-first)
- Fast page loads (static site)
- Zero server costs
- SEO-optimized templates
- Accessibility built-in

### Patterns to Preserve
- Tool data in `src/_data/tools.json`
- Common utilities in `src/js/common.js`
- Consistent tool layout via `layouts/tool.njk`
- Unit tests for each tool

---

## Success Metrics

### 3 Months (End of Phase 2)
- [ ] 18 tools live (+4 new)
- [ ] 10,000 monthly organic visitors
- [ ] AdSense approved and running
- [ ] Revenue: $30-100/month

### 6 Months
- [ ] 22 tools live
- [ ] 30,000 monthly organic visitors
- [ ] Blog with 5 articles
- [ ] Revenue: $100-300/month

### 12 Months
- [ ] 30 tools live
- [ ] 100,000 monthly organic visitors
- [ ] 2 languages (English + Spanish)
- [ ] Revenue: $300-1,000/month

---

## Implementation Order

### Immediate (This Week)
1. **Image Compressor to Specific KB** - Highest verified demand
2. **Word Counter** - Quick win, high traffic

### Next Sprint
3. **Case Converter** - Easy, complements word counter
4. **Passport/Visa Photo Tool** - High value, more complex

### Following Sprint
5. **Related Tools Sidebar** - Increase pages/visit
6. **AdSense Integration** - Start revenue

---

## Quick Reference: New Tool Template

Before building any tool, answer:

```
Tool: [Name]
Primary Keyword: [keyword]
Monthly Searches: [volume from Ubersuggest/Ahrefs]
Competition: [Low/Medium/High]
Current #1 Result: [URL]
Can We Beat Them?: [Yes/No - why?]
Client-Side Feasible?: [Yes/No]
Dev Effort: [days]
Estimated Traffic if #1: [searches × 0.3]
Build Priority: [Yes/No]
```

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-22 | 2.0 | Major rewrite with verified traffic data, niche focus on image tools |
| 2025-12-21 | 1.3 | Phase 1 complete with 14 tools |
| 2025-12-21 | 1.0 | Initial roadmap |

---

*Every decision should answer: "Will this bring more visitors who see ads?"*
