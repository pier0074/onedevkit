# Add New Tool

Add a new developer tool to OneDevKit with complete multi-language support.

## Instructions

You are adding a new tool to OneDevKit. Follow these steps to ensure complete implementation across all enabled languages.

### Step 1: Gather Tool Information

Ask the user for:
1. Tool ID (kebab-case, e.g., "html-formatter")
2. Tool name (short display name)
3. Full tool name (descriptive title)
4. Category: "Code Tools" | "Generators" | "Text & Data" | "Image Tools"
5. Brief description (1-2 sentences)
6. Tool functionality details

### Step 2: Check Enabled Languages

```bash
node -e "console.log(require('./src/_data/languages.json').filter(l=>l.enabled).map(l=>l.code+' ('+l.nativeName+')').join('\n'))"
```

Note all enabled languages - you will need to add translations for each.

### Step 3: Create Tool Data Entry

Add to `src/_data/tools.json`:
```json
{
  "id": "{tool-id}",
  "name": "{Tool Name}",
  "fullName": "{Full Tool Name}",
  "category": "{Category}",
  "description": "{Brief description}",
  "icon": "<path ... />",
  "popular": false
}
```

Choose an appropriate SVG icon path from Heroicons or similar.

### Step 4: Create Tool Partial

Create `src/_includes/tools/{tool-id}.njk`:

```njk
{# {Tool Name} Tool Partial #}
<div class="tool-container">
  {# Tool-specific HTML and JavaScript #}
</div>

<script>
  // Tool functionality
</script>
```

### Step 5: Add English Translations

Add to `src/_data/i18n/en.json` under `tools.{tool-id}`:

```json
"{tool-id}": {
  "name": "{Tool Name}",
  "fullName": "{Full Tool Name}",
  "description": "{Brief description}",
  "shortDescription": "{Very brief}",
  "metaTitle": "{Full Name} - Free Online Tool | OneDevKit",
  "metaDescription": "{SEO description 150-160 chars}",
  "keywords": "{keyword1}, {keyword2}, {keyword3}, ...",
  "howTo": {
    "title": "How to Use",
    "steps": [
      {
        "title": "Step 1 Title",
        "description": "Step 1 description"
      },
      {
        "title": "Step 2 Title",
        "description": "Step 2 description"
      },
      {
        "title": "Step 3 Title",
        "description": "Step 3 description"
      }
    ]
  },
  "faq": [
    {
      "question": "Common question 1?",
      "answer": "Detailed answer 1"
    },
    {
      "question": "Common question 2?",
      "answer": "Detailed answer 2"
    },
    {
      "question": "Common question 3?",
      "answer": "Detailed answer 3"
    }
  ]
}
```

### Step 6: Add Translations for ALL Enabled Languages

For EACH enabled language (e.g., Spanish `es`), add the translated tool entry to `src/_data/i18n/{lang}.json`:

**IMPORTANT**: Translate naturally, don't just do literal translations. Consider:
- Cultural appropriateness
- Technical term conventions in that language
- Natural phrasing

#### Example for Spanish (es.json):
```json
"{tool-id}": {
  "name": "{Spanish Name}",
  "fullName": "{Spanish Full Name}",
  "description": "{Spanish description}",
  "shortDescription": "{Spanish brief}",
  "metaTitle": "{Spanish Full Name} - Herramienta Online Gratis | OneDevKit",
  "metaDescription": "{Spanish SEO description}",
  "keywords": "{Spanish keywords}",
  "howTo": {
    "title": "Cómo Usar",
    "steps": [
      {
        "title": "{Spanish Step 1}",
        "description": "{Spanish description 1}"
      },
      ...
    ]
  },
  "faq": [
    {
      "question": "{Spanish question 1}",
      "answer": "{Spanish answer 1}"
    },
    ...
  ]
}
```

### Step 7: Add Tool-Specific Common Strings (if needed)

If the tool uses any new common UI strings, add them to ALL language files:

```json
// In en.json -> common
"newString": "English value"

// In es.json -> common
"newString": "Spanish value"
```

### Step 8: Validate Translations

```bash
npm run i18n:validate
```

Ensure 100% coverage for all languages.

### Step 9: Generate Review for New Tool

Create a cross-language review for Gemini to check the new tool's translations:

```bash
npm run i18n:review:section -- --section=tools.{tool-id}
```

This creates a review at `i18n-reviews/sections/tools_{tool-id}_{date}/`

**Important**: After the tool is complete, remind the user to:
1. Copy `export.md` to Gemini Pro
2. Paste corrections to `gemini-response.json`
3. Run: `npm run i18n:review:apply:section -- --section=tools.{tool-id}`

### Step 10: Build and Test

```bash
npm run build
npm test
```

Verify:
- [ ] Tool page builds for all languages
- [ ] Tool appears in navigation
- [ ] Tool appears in homepage grid
- [ ] Tool appears in footer
- [ ] All tests pass
- [ ] Translations look correct

---

## Translation Checklist for New Tool

For each enabled language, verify these are translated:

### Per-Language Checklist:
- [ ] `tools.{tool-id}.name`
- [ ] `tools.{tool-id}.fullName`
- [ ] `tools.{tool-id}.description`
- [ ] `tools.{tool-id}.shortDescription`
- [ ] `tools.{tool-id}.metaTitle`
- [ ] `tools.{tool-id}.metaDescription`
- [ ] `tools.{tool-id}.keywords`
- [ ] `tools.{tool-id}.howTo.title`
- [ ] `tools.{tool-id}.howTo.steps` (all steps)
- [ ] `tools.{tool-id}.faq` (all Q&A items)
- [ ] Any new `common.*` strings

---

## File Locations Summary

| File | Purpose |
|------|---------|
| `src/_data/tools.json` | Tool registry |
| `src/_includes/tools/{id}.njk` | Tool UI partial |
| `src/_data/i18n/en.json` | English translations |
| `src/_data/i18n/{lang}.json` | Other language translations |
| `i18n-reviews/sections/` | Cross-language review artifacts |
| `tests/e2e/tools.spec.js` | E2E tests |

---

## i18n Review Workflow Integration

After adding all translations:

```bash
# 1. Validate coverage
npm run i18n:validate

# 2. Create cross-language review for this tool
npm run i18n:review:section -- --section=tools.{tool-id}

# 3. After Gemini review, apply corrections
npm run i18n:review:apply:section -- --section=tools.{tool-id}

# 4. Verify final result
npm run i18n:status
```

---

## Quick Reference: Current Enabled Languages

Run this to see enabled languages:
```bash
npm run i18n:status
```

All enabled languages MUST have complete tool translations before the tool is considered complete.
