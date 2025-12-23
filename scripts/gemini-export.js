#!/usr/bin/env node
/**
 * Export translations for Gemini Pro review with embedded prompt
 *
 * Usage:
 *   node scripts/gemini-export.js --lang=es
 *   node scripts/gemini-export.js --lang=es --output=review.md
 *   node scripts/gemini-export.js --lang=es --section=tools
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../src/_data/i18n');

function getAtPath(obj, pathStr) {
  if (!pathStr) return obj;
  return pathStr.split('.').reduce((o, k) => o?.[k], obj);
}

function flatten(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    const keyPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, keyPath));
    } else {
      result[keyPath] = value;
    }
  }
  return result;
}

function generateGeminiPrompt(lang, section) {
  const langNames = {
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    pt: 'Portuguese',
    it: 'Italian',
    ja: 'Japanese',
    zh: 'Chinese',
    ko: 'Korean',
    ar: 'Arabic',
    hi: 'Hindi'
  };

  const langName = langNames[lang] || lang.toUpperCase();
  const sectionInfo = section ? ` (Section: ${section})` : '';

  return `# Translation Review Request

You are reviewing ${langName} translations for OneDevKit, a developer tools website${sectionInfo}.

## Your Task

Review each translation below and identify any issues. For each problematic translation, provide:
1. The translation key
2. The issue type (accuracy, naturalness, terminology, formality, grammar)
3. Your suggested correction
4. Brief explanation

## Guidelines

- **Accuracy**: Does the translation accurately convey the English meaning?
- **Naturalness**: Does it sound natural to native ${langName} speakers?
- **Terminology**: Are technical terms translated consistently and correctly?
- **Formality**: Is the formality level appropriate (professional but accessible)?
- **Grammar**: Is the grammar correct?

## Important Notes

- Keep brand names "OneDevKit" unchanged
- Keep placeholders like \`{year}\`, \`{value}\` unchanged
- Technical terms (JSON, Base64, UUID, JWT, etc.) can stay in English
- URLs and code examples should not be translated

## Output Format

Please respond ONLY with a JSON array of corrections. If everything is correct, respond with an empty array \`[]\`.

\`\`\`json
[
  {
    "key": "tools.json-formatter.description",
    "issue": "naturalness",
    "current": "current translation text",
    "suggested": "improved translation text",
    "explanation": "Brief explanation of why this change improves the translation"
  }
]
\`\`\`

---

# Translations to Review

`;
}

function main() {
  const args = process.argv.slice(2);
  const langArg = args.find(a => a.startsWith('--lang='));
  const sectionArg = args.find(a => a.startsWith('--section='));
  const outputArg = args.find(a => a.startsWith('--output='));

  const lang = langArg ? langArg.split('=')[1] : 'es';
  const section = sectionArg ? sectionArg.split('=')[1] : null;
  const outputFile = outputArg ? outputArg.split('=')[1] : null;

  // Load translation files
  const en = JSON.parse(fs.readFileSync(path.join(I18N_DIR, 'en.json'), 'utf8'));
  const target = JSON.parse(fs.readFileSync(path.join(I18N_DIR, `${lang}.json`), 'utf8'));

  const enSection = getAtPath(en, section);
  const targetSection = getAtPath(target, section);

  if (section && !enSection) {
    console.error(`Section "${section}" not found in en.json`);
    process.exit(1);
  }

  const enFlat = flatten(enSection);
  const targetFlat = flatten(targetSection || {});

  // Generate output
  let output = generateGeminiPrompt(lang, section);

  output += `| Key | English | ${lang.toUpperCase()} |\n`;
  output += `|-----|---------|-----|\n`;

  for (const key in enFlat) {
    const enVal = enFlat[key];
    const targetVal = targetFlat[key];
    const fullKey = section ? `${section}.${key}` : key;

    // Escape pipes in values for markdown table
    const enEscaped = String(enVal).replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const targetEscaped = targetVal ? String(targetVal).replace(/\|/g, '\\|').replace(/\n/g, ' ') : '⚠️ MISSING';

    output += `| \`${fullKey}\` | ${enEscaped} | ${targetEscaped} |\n`;
  }

  output += `\n---\n\nTotal translations: ${Object.keys(enFlat).length}\n`;

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`Export saved to: ${outputFile}`);
    console.log(`Total translations: ${Object.keys(enFlat).length}`);
  } else {
    console.log(output);
  }
}

main();
