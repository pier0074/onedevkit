# Translation Reviews

This folder contains translation review history for traceability and future reference.

## Quick Start

```bash
# Check status of all languages
npm run i18n:status

# Full language review (new language or periodic audit)
npm run i18n:review -- --lang=es

# Section review - all languages (for new tools)
npm run i18n:review:section -- --section=tools.new-tool-id

# Apply corrections
npm run i18n:review:apply -- --lang=es
npm run i18n:review:apply:section -- --section=tools.new-tool-id
```

## Structure

```
i18n-reviews/
├── README.md                           # This file
├── ARCHITECTURE.md                     # Detailed architecture docs
├── state.json                          # Tracks review state
│
├── {lang}/                             # Per-language full reviews
│   └── v{NNN}_{date}/
│       ├── export.md                   # Sent to Gemini
│       ├── gemini-response.json        # Gemini's corrections
│       └── correction-report.md        # Applied changes report
│
└── sections/                           # Cross-language reviews
    └── {section}_{date}/
        ├── export.md
        ├── gemini-response.json
        └── correction-report.md
```

## Workflows

### Adding a New Tool
```bash
# After creating tool and adding translations
npm run i18n:review:section -- --section=tools.{tool-id}
# Copy export.md to Gemini, paste response, then:
npm run i18n:review:apply:section -- --section=tools.{tool-id}
```

### Adding a New Language
```bash
# After creating translation file
npm run i18n:review -- --lang={code}
# Copy export.md to Gemini, paste response, then:
npm run i18n:review:apply -- --lang={code}
```

### Periodic Review
```bash
# Create new version for existing language
npm run i18n:review -- --lang=es  # Creates v002, v003, etc.
```

## See Also

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system documentation
- [state.json](./state.json) - Current review state
