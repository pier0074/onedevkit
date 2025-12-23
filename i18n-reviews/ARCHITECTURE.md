# i18n Scalable Architecture

## Overview

This system supports parallel development of:
- **Tools** (backend): Adding new developer tools
- **Languages** (frontend): Adding new translation languages

Both can happen simultaneously without conflicts.

## Directory Structure

```
i18n-reviews/
├── README.md                           # Quick start guide
├── ARCHITECTURE.md                     # This file
├── state.json                          # Tracks what's been reviewed
│
├── {lang}/                             # Per-language full reviews
│   └── v{NNN}_{date}/
│       ├── export.md
│       ├── gemini-response.json
│       └── correction-report.md
│
└── sections/                           # Cross-language section reviews
    └── {section-path}_{date}/          # e.g., tools.image-editor_2025-12-23
        ├── export.md                   # EN + all languages for this section
        ├── gemini-response.json
        └── correction-report.md
```

## State Tracking (state.json)

```json
{
  "lastUpdated": "2025-12-23T10:00:00Z",
  "languages": {
    "es": {
      "enabled": true,
      "lastFullReview": "v001_2025-12-23",
      "lastReviewedCommit": "abc123",
      "coverage": 100
    }
  },
  "sections": {
    "tools.json-formatter": {
      "addedAt": "2024-01-01",
      "reviewedIn": {
        "es": "v001_2025-12-23"
      }
    }
  }
}
```

## Workflows

### Workflow 1: Add New Tool

```bash
# 1. Run the add-tool command (creates tool + EN translations)
/add-tool

# 2. Add translations to all enabled languages
#    The command will generate initial translations

# 3. Review the new tool across ALL languages at once
npm run i18n:review:section -- --section=tools.{tool-id}

# 4. Paste Gemini response, apply corrections
npm run i18n:review:apply:section -- --section=tools.{tool-id}
```

### Workflow 2: Add New Language

```bash
# 1. Run the add-language command (creates full translation file)
/add-language

# 2. Full review of the new language
npm run i18n:review -- --lang={code}

# 3. Paste Gemini response, apply corrections
npm run i18n:review:apply -- --lang={code}
```

### Workflow 3: Incremental Review (Changes Only)

```bash
# Review only keys that changed since last review
npm run i18n:review -- --lang=es --changes-only

# Review only keys added since specific version
npm run i18n:review -- --lang=es --since=v001
```

### Workflow 4: Sync Check

```bash
# Check what's missing or new across all languages
npm run i18n:status

# Output:
# ✓ Spanish (es): 100% coverage, last reviewed v001
# ⚠ French (fr): 95% coverage, 28 new keys since v001
# ✗ German (de): Not yet reviewed
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run i18n:status` | Show coverage & review status for all languages |
| `npm run i18n:validate` | Check translation coverage (existing) |
| `npm run i18n:review -- --lang=es` | Full review for one language |
| `npm run i18n:review -- --lang=es --changes-only` | Review only new/changed keys |
| `npm run i18n:review:section -- --section=tools.{id}` | Review section across all languages |
| `npm run i18n:review:apply -- --lang=es` | Apply corrections for language |
| `npm run i18n:review:apply:section -- --section=tools.{id}` | Apply section corrections |

## Integration with Slash Commands

### /add-tool Integration

After creating a tool, the command:
1. Adds tool to `tools.json`
2. Creates tool partial `.njk`
3. Adds EN translations to `en.json`
4. **Auto-generates translations for all enabled languages**
5. **Creates review export for `tools.{id}` section**
6. Outputs: "Review ready at `i18n-reviews/sections/tools.{id}_{date}/`"

### /add-language Integration

After creating a language, the command:
1. Adds language to `languages.json`
2. Creates `{lang}.json` with all translations
3. **Creates full review export**
4. Updates `state.json` with new language
5. Outputs: "Review ready at `i18n-reviews/{lang}/v001_{date}/`"

## Key Principles

1. **Atomic Reviews**: Each review (full or section) is self-contained
2. **Traceability**: All reviews are versioned and preserved
3. **Parallel Safe**: Tool and language additions don't conflict
4. **Incremental**: Only review what's new when possible
5. **Multi-Language Sections**: New tools reviewed across all languages at once

## Review Scope Options

| Scope | Use Case |
|-------|----------|
| Full language | New language, periodic audit |
| Section (all langs) | New tool, updated tool content |
| Changes only | Incremental improvements |
| Specific version diff | Compare before/after |

## Gemini Prompt - The "Deep-Dive" Review

To get exhaustive reviews (not superficial scans), use this structured prompt that forces the AI from "scanning" mode to "auditing" mode:

```
Role: You are a Senior Localization QA Specialist and Native {LANGUAGE} Copy Editor.

Task: Perform a strict, line-by-line audit of the following translation JSON/Table.

Review Rules:

1. **Consistency Check**: Group similar keys (e.g., all titles, all descriptions, all buttons)
   and ensure they use identical phrasing. If you correct one (e.g., "Free Tools"), ensure
   that correction is applied to every instance of that phrase.

2. **Contextual Grammar**: For keys that are parts of sentences (like "feel free to..." ->
   "contact us"), verify that the grammatical mood (imperative vs. infinitive) matches
   the preceding text.

3. **Naturalness**: Flag any literal translations (Anglicisms) that a native speaker would not say.

4. **Completeness**: Do not summarize. If there are 20 errors, list all 20.

Process: Before outputting the JSON, please simulate a "double-pass" review internally:
- **Pass 1**: Check individual lines for grammar/typos.
- **Pass 2**: Cross-reference keys (e.g., site.title vs home.heroTitle) to ensure branding consistency.

Output: Provide the JSON array of corrections in this format:
[
  {
    "key": "full.key.path",
    "issue": "consistency|grammar|naturalness|typo",
    "current": "current text",
    "suggested": "improved text",
    "explanation": "why this change"
  }
]
```

### Why This Prompt Works Better

| Element | Purpose |
|---------|---------|
| **"Senior Localization QA Specialist"** | Sets higher standard than "translator". A QA specialist looks for bugs and inconsistencies, not just word conversion. |
| **"Group similar keys"** | Fixes the cross-reference problem (e.g., `site.metaTitle` vs `pages.home.heroTitle`). Treats the dataset as a system, not isolated sentences. |
| **"Contextual Grammar"** | Alerts to "broken sentence" issues where grammatical mood must match surrounding context. |
| **"Simulate a double-pass"** | Encourages the model to hold more logic in working memory before generating the response. |
| **"Do not summarize"** | Prevents AI from stopping at "a few examples" when there are more issues. |

### Key Lesson Learned

**Problem**: Gemini may correct `site.tagline` but miss that `pages.home.heroTitle` displays the same text on the homepage.

**Solution**: The "cross-reference keys" instruction in the prompt ensures related keys are checked together for consistency.

### Prompt Variations by Review Type

#### Full Language Review
Add to the base prompt:
```
Context: This is a complete review of all {LANGUAGE} translations for the OneDevKit project.
Focus especially on: UI consistency, SEO text naturalness, and technical terminology.
```

#### Section Review (New Tool)
Add to the base prompt:
```
Context: This is a review of the "{tool-name}" tool translations across {N} languages.
Ensure: Terminology consistency with existing tools, natural phrasing for each language.
```

#### Changes-Only Review
Add to the base prompt:
```
Context: These are newly added translations. Existing translations have been reviewed.
Focus: Integration with existing text style and terminology consistency.
```
