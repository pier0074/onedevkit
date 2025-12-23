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

## Gemini Prompt Variations

### Full Language Review
"Review all Spanish translations for accuracy, naturalness, and consistency."

### Section Review (Multi-Language)
"Review translations for the {tool} tool in Spanish, French, and German. Ensure consistency across languages."

### Changes-Only Review
"Review these newly added translations. Previous translations have been reviewed."
