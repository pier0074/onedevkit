# Translation Reviews

This folder contains translation review history for traceability and future reference.

## Structure

```
i18n-reviews/
  {lang}/                          # Language code (es, fr, de, etc.)
    v001_2024-12-23/               # Version with date
      export.md                    # Translations sent to Gemini for review
      gemini-response.json         # Gemini's corrections (paste here)
      correction-report.md         # Generated report of applied changes
    v002_2024-12-25/
      ...
```

## Workflow

### 1. Export for Review
```bash
npm run i18n:review -- --lang=es
```
Creates a new version folder with `export.md` ready for Gemini.

### 2. Get Gemini Review
- Copy contents of `export.md` to Gemini Pro
- Copy Gemini's JSON response
- Paste into `gemini-response.json` in the same version folder

### 3. Apply Corrections
```bash
npm run i18n:review:apply -- --lang=es
```
Applies corrections from the latest version's `gemini-response.json` and generates `correction-report.md`.

### 4. Apply from Specific Version
```bash
npm run i18n:review:apply -- --lang=es --version=001
```

## Files Explained

| File | Description |
|------|-------------|
| `export.md` | Full translation table with review instructions for Gemini |
| `gemini-response.json` | Gemini's corrections in JSON format (user adds this) |
| `correction-report.md` | Detailed report of all changes applied |

## Versioning

- Versions are auto-incremented (v001, v002, etc.)
- Date is included for reference
- All versions are preserved for audit trail
