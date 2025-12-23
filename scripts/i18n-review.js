#!/usr/bin/env node
/**
 * Translation Review Manager - Scalable i18n Review System
 *
 * Supports:
 * - Full language reviews
 * - Section reviews (across all languages)
 * - Incremental reviews (changes only)
 * - State tracking and versioning
 *
 * Usage:
 *   # Full language review
 *   node scripts/i18n-review.js --lang=es
 *
 *   # Section review across all languages (for new tools)
 *   node scripts/i18n-review.js --section=tools.image-editor
 *
 *   # Apply corrections
 *   node scripts/i18n-review.js --lang=es --apply
 *   node scripts/i18n-review.js --section=tools.image-editor --apply
 *
 *   # Status
 *   node scripts/i18n-review.js --status
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../src/_data/i18n');
const REVIEWS_DIR = path.join(__dirname, '../i18n-reviews');
const STATE_FILE = path.join(REVIEWS_DIR, 'state.json');
const LANGUAGES_FILE = path.join(__dirname, '../src/_data/languages.json');

// ============ Utility Functions ============

function getAtPath(obj, pathStr) {
  if (!pathStr) return obj;
  return pathStr.split('.').reduce((o, k) => o?.[k], obj);
}

function setAtPath(obj, pathStr, value) {
  const keys = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
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

function getDateStamp() {
  return new Date().toISOString().split('T')[0];
}

function padVersion(num) {
  return String(num).padStart(3, '0');
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  }
  return { lastUpdated: new Date().toISOString(), languages: {}, sections: {} };
}

function saveState(state) {
  state.lastUpdated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

function getEnabledLanguages() {
  const languages = JSON.parse(fs.readFileSync(LANGUAGES_FILE, 'utf8'));
  return languages.filter(l => l.enabled && l.code !== 'en');
}

function getNextVersion(dir) {
  if (!fs.existsSync(dir)) return 1;
  const versions = fs.readdirSync(dir)
    .filter(d => d.startsWith('v'))
    .map(d => parseInt(d.split('_')[0].substring(1)))
    .filter(n => !isNaN(n));
  return versions.length > 0 ? Math.max(...versions) + 1 : 1;
}

function getLatestVersion(dir) {
  if (!fs.existsSync(dir)) return null;
  const versions = fs.readdirSync(dir).filter(d => d.startsWith('v')).sort().reverse();
  return versions.length > 0 ? versions[0] : null;
}

// ============ Language Names ============

const LANG_NAMES = {
  es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese',
  it: 'Italian', ja: 'Japanese', zh: 'Chinese', ko: 'Korean',
  ar: 'Arabic', hi: 'Hindi', ru: 'Russian', nl: 'Dutch',
  pl: 'Polish', tr: 'Turkish', vi: 'Vietnamese', th: 'Thai'
};

// ============ Export Generation ============

function generateLanguageExport(lang, section = null) {
  const langName = LANG_NAMES[lang] || lang.toUpperCase();
  const en = JSON.parse(fs.readFileSync(path.join(I18N_DIR, 'en.json'), 'utf8'));
  const target = JSON.parse(fs.readFileSync(path.join(I18N_DIR, `${lang}.json`), 'utf8'));

  const enSection = getAtPath(en, section);
  const targetSection = getAtPath(target, section);

  if (section && !enSection) {
    throw new Error(`Section "${section}" not found in en.json`);
  }

  const enFlat = flatten(enSection);
  const targetFlat = flatten(targetSection || {});

  const sectionInfo = section ? ` (Section: ${section})` : '';

  let output = `# Translation Review Request

You are reviewing ${langName} translations for OneDevKit${sectionInfo}.

## Task
Review each translation and identify issues. For problematic translations, provide:
1. Translation key
2. Issue type (accuracy, naturalness, terminology, formality, grammar)
3. Suggested correction
4. Brief explanation

## Guidelines
- **Accuracy**: Does it convey the English meaning?
- **Naturalness**: Does it sound natural to native speakers?
- **Terminology**: Are technical terms consistent?
- **Formality**: Professional but accessible?

## Rules
- Keep "OneDevKit" unchanged
- Keep placeholders like \`{year}\` unchanged
- Technical terms (JSON, Base64, UUID, JWT) can stay in English

## Output Format
Respond ONLY with a JSON array. If all correct, respond with \`[]\`.

\`\`\`json
[
  {
    "key": "full.translation.key",
    "issue": "naturalness",
    "current": "current text",
    "suggested": "improved text",
    "explanation": "why this is better"
  }
]
\`\`\`

---

# Translations

| Key | English | ${lang.toUpperCase()} |
|-----|---------|-----|
`;

  for (const key in enFlat) {
    const fullKey = section ? `${section}.${key}` : key;
    const enVal = String(enFlat[key]).replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const targetVal = targetFlat[key]
      ? String(targetFlat[key]).replace(/\|/g, '\\|').replace(/\n/g, ' ')
      : '⚠️ MISSING';
    output += `| \`${fullKey}\` | ${enVal} | ${targetVal} |\n`;
  }

  output += `\n---\n**Total:** ${Object.keys(enFlat).length} | **Generated:** ${new Date().toISOString()}\n`;
  return output;
}

function generateSectionExport(section) {
  const en = JSON.parse(fs.readFileSync(path.join(I18N_DIR, 'en.json'), 'utf8'));
  const enSection = getAtPath(en, section);

  if (!enSection) {
    throw new Error(`Section "${section}" not found in en.json`);
  }

  const enFlat = flatten(enSection);
  const languages = getEnabledLanguages();

  let output = `# Cross-Language Translation Review

Reviewing section \`${section}\` across all languages.

## Task
Review translations for consistency and quality across all languages.

## Output Format
Respond with a JSON array. Include the language code in each correction:

\`\`\`json
[
  {
    "lang": "es",
    "key": "${section}.example.key",
    "issue": "naturalness",
    "current": "current text",
    "suggested": "improved text",
    "explanation": "why"
  }
]
\`\`\`

---

# Translations

`;

  // Build header
  const langCodes = languages.map(l => l.code);
  output += `| Key | English | ${langCodes.map(c => c.toUpperCase()).join(' | ')} |\n`;
  output += `|-----|---------|${langCodes.map(() => '-----').join('|')}|\n`;

  // Load all translations
  const translations = {};
  languages.forEach(l => {
    const langPath = path.join(I18N_DIR, `${l.code}.json`);
    if (fs.existsSync(langPath)) {
      translations[l.code] = flatten(getAtPath(JSON.parse(fs.readFileSync(langPath, 'utf8')), section) || {});
    } else {
      translations[l.code] = {};
    }
  });

  // Build rows
  for (const key in enFlat) {
    const fullKey = `${section}.${key}`;
    const enVal = String(enFlat[key]).replace(/\|/g, '\\|').replace(/\n/g, ' ').substring(0, 50);
    const langVals = langCodes.map(code => {
      const val = translations[code][key];
      return val ? String(val).replace(/\|/g, '\\|').replace(/\n/g, ' ').substring(0, 50) : '⚠️';
    });
    output += `| \`${fullKey}\` | ${enVal} | ${langVals.join(' | ')} |\n`;
  }

  output += `\n---\n**Keys:** ${Object.keys(enFlat).length} | **Languages:** ${langCodes.join(', ')} | **Generated:** ${new Date().toISOString()}\n`;
  return output;
}

// ============ Apply Corrections ============

function applyCorrections(lang, corrections, versionName) {
  const translationPath = path.join(I18N_DIR, `${lang}.json`);
  const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));

  let applied = 0, skipped = 0;

  corrections.forEach(c => {
    if (!c.key || !c.suggested) {
      skipped++;
      return;
    }

    const current = getAtPath(translations, c.key);
    if (current === undefined) {
      console.warn(`⚠️  Key not found: ${c.key}`);
      skipped++;
      return;
    }

    setAtPath(translations, c.key, c.suggested);
    applied++;
    console.log(`✓ Applied: ${c.key}`);
  });

  fs.writeFileSync(translationPath, JSON.stringify(translations, null, 2) + '\n');
  return { applied, skipped, translations };
}

function generateCorrectionReport(corrections, lang, versionName) {
  const langName = LANG_NAMES[lang] || lang;

  let report = `# Correction Report

**Language:** ${langName} (${lang})
**Version:** ${versionName}
**Applied:** ${new Date().toISOString()}
**Total:** ${corrections.length}

---

`;

  if (corrections.length === 0) {
    report += `No corrections needed. All translations passed review.\n`;
    return report;
  }

  const byIssue = {};
  corrections.forEach(c => {
    const issue = c.issue || 'unspecified';
    if (!byIssue[issue]) byIssue[issue] = [];
    byIssue[issue].push(c);
  });

  report += `## By Issue Type\n\n`;
  for (const [issue, items] of Object.entries(byIssue)) {
    report += `- **${issue}**: ${items.length}\n`;
  }

  report += `\n## Changes\n\n`;
  corrections.forEach((c, i) => {
    report += `### ${i + 1}. \`${c.key}\`\n`;
    report += `**Issue:** ${c.issue || '-'}\n\n`;
    report += `**Before:** ${c.current || '-'}\n\n`;
    report += `**After:** ${c.suggested}\n\n`;
    if (c.explanation) report += `**Why:** ${c.explanation}\n\n`;
    report += `---\n\n`;
  });

  return report;
}

// ============ Commands ============

function cmdStatus() {
  const state = loadState();
  const languages = getEnabledLanguages();
  const en = JSON.parse(fs.readFileSync(path.join(I18N_DIR, 'en.json'), 'utf8'));
  const enKeys = Object.keys(flatten(en)).length;

  console.log(`\n📊 i18n Status\n`);
  console.log(`Source: en.json (${enKeys} keys)\n`);

  languages.forEach(l => {
    const langPath = path.join(I18N_DIR, `${l.code}.json`);
    if (!fs.existsSync(langPath)) {
      console.log(`❌ ${l.nativeName} (${l.code}): File missing`);
      return;
    }

    const target = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const targetKeys = Object.keys(flatten(target)).length;
    const coverage = Math.round((targetKeys / enKeys) * 100);
    const langState = state.languages[l.code] || {};
    const lastReview = langState.lastFullReview || 'never';

    const icon = coverage >= 100 ? '✅' : coverage >= 90 ? '⚠️' : '❌';
    console.log(`${icon} ${l.nativeName} (${l.code}): ${coverage}% coverage, last review: ${lastReview}`);
  });

  console.log('');
}

function cmdExportLanguage(lang, section = null) {
  const langDir = path.join(REVIEWS_DIR, lang);
  const nextVersion = getNextVersion(langDir);
  const versionName = `v${padVersion(nextVersion)}_${getDateStamp()}`;
  const versionDir = path.join(langDir, versionName);

  fs.mkdirSync(versionDir, { recursive: true });

  const exportContent = generateLanguageExport(lang, section);
  fs.writeFileSync(path.join(versionDir, 'export.md'), exportContent);
  fs.writeFileSync(path.join(versionDir, 'gemini-response.json'), `[]\n// Paste Gemini's JSON response here\n`);

  console.log(`\n✅ Review export created!\n`);
  console.log(`📁 ${versionName}`);
  console.log(`📄 ${path.join(versionDir, 'export.md')}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Copy export.md contents to Gemini Pro`);
  console.log(`   2. Save response to gemini-response.json`);
  console.log(`   3. Run: npm run i18n:review:apply -- --lang=${lang}`);
}

function cmdExportSection(section) {
  const sectionDir = path.join(REVIEWS_DIR, 'sections', `${section.replace(/\./g, '_')}_${getDateStamp()}`);

  fs.mkdirSync(sectionDir, { recursive: true });

  const exportContent = generateSectionExport(section);
  fs.writeFileSync(path.join(sectionDir, 'export.md'), exportContent);
  fs.writeFileSync(path.join(sectionDir, 'gemini-response.json'), `[]\n// Paste Gemini's JSON response here\n// Include "lang" field in each correction\n`);

  console.log(`\n✅ Section review export created!\n`);
  console.log(`📁 ${sectionDir}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Copy export.md contents to Gemini Pro`);
  console.log(`   2. Save response to gemini-response.json`);
  console.log(`   3. Run: npm run i18n:review:apply:section -- --section=${section}`);
}

function cmdApplyLanguage(lang, specificVersion = null) {
  const langDir = path.join(REVIEWS_DIR, lang);

  let versionName;
  if (specificVersion) {
    const versions = fs.readdirSync(langDir).filter(d => d.startsWith(`v${padVersion(specificVersion)}`));
    if (versions.length === 0) {
      console.error(`❌ Version ${specificVersion} not found`);
      process.exit(1);
    }
    versionName = versions[0];
  } else {
    versionName = getLatestVersion(langDir);
    if (!versionName) {
      console.error(`❌ No reviews found for ${lang}`);
      process.exit(1);
    }
  }

  const versionDir = path.join(langDir, versionName);
  const responsePath = path.join(versionDir, 'gemini-response.json');

  let content = fs.readFileSync(responsePath, 'utf8');
  content = content.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) content = jsonMatch[1];

  const corrections = JSON.parse(content.trim());

  if (corrections.length === 0) {
    console.log(`\n✅ No corrections needed!`);
    const report = `# Correction Report\n\n**Language:** ${lang}\n**Version:** ${versionName}\n\nNo corrections needed.\n`;
    fs.writeFileSync(path.join(versionDir, 'correction-report.md'), report);
    return;
  }

  const { applied, skipped } = applyCorrections(lang, corrections, versionName);
  const report = generateCorrectionReport(corrections, lang, versionName);
  fs.writeFileSync(path.join(versionDir, 'correction-report.md'), report);

  // Update state
  const state = loadState();
  if (!state.languages[lang]) state.languages[lang] = {};
  state.languages[lang].lastFullReview = versionName;
  state.languages[lang].coverage = 100;
  saveState(state);

  console.log(`\n✅ Applied ${applied} corrections (${skipped} skipped)`);
  console.log(`📄 Report: ${path.join(versionDir, 'correction-report.md')}`);
}

function cmdApplySection(section) {
  const sectionsDir = path.join(REVIEWS_DIR, 'sections');
  const sectionPrefix = section.replace(/\./g, '_');

  const dirs = fs.readdirSync(sectionsDir)
    .filter(d => d.startsWith(sectionPrefix))
    .sort()
    .reverse();

  if (dirs.length === 0) {
    console.error(`❌ No review found for section ${section}`);
    process.exit(1);
  }

  const latestDir = path.join(sectionsDir, dirs[0]);
  const responsePath = path.join(latestDir, 'gemini-response.json');

  let content = fs.readFileSync(responsePath, 'utf8');
  content = content.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) content = jsonMatch[1];

  const corrections = JSON.parse(content.trim());

  if (corrections.length === 0) {
    console.log(`\n✅ No corrections needed for section ${section}!`);
    return;
  }

  // Group by language
  const byLang = {};
  corrections.forEach(c => {
    const lang = c.lang || 'es'; // Default to es if not specified
    if (!byLang[lang]) byLang[lang] = [];
    byLang[lang].push(c);
  });

  let totalApplied = 0;
  for (const [lang, langCorrections] of Object.entries(byLang)) {
    console.log(`\nApplying ${langCorrections.length} corrections for ${lang}...`);
    const { applied } = applyCorrections(lang, langCorrections, dirs[0]);
    totalApplied += applied;
  }

  // Generate combined report
  let report = `# Section Correction Report\n\n**Section:** ${section}\n**Applied:** ${new Date().toISOString()}\n\n`;
  for (const [lang, langCorrections] of Object.entries(byLang)) {
    report += `## ${LANG_NAMES[lang] || lang} (${lang})\n\n`;
    langCorrections.forEach(c => {
      report += `- \`${c.key}\`: ${c.current} → ${c.suggested}\n`;
    });
    report += '\n';
  }
  fs.writeFileSync(path.join(latestDir, 'correction-report.md'), report);

  // Update state
  const state = loadState();
  if (!state.sections[section]) state.sections[section] = { reviewedIn: {} };
  for (const lang of Object.keys(byLang)) {
    state.sections[section].reviewedIn[lang] = dirs[0];
  }
  saveState(state);

  console.log(`\n✅ Applied ${totalApplied} total corrections across ${Object.keys(byLang).length} languages`);
}

// ============ Main ============

function main() {
  const args = process.argv.slice(2);

  const langArg = args.find(a => a.startsWith('--lang='));
  const sectionArg = args.find(a => a.startsWith('--section='));
  const versionArg = args.find(a => a.startsWith('--version='));
  const applyFlag = args.includes('--apply');
  const statusFlag = args.includes('--status');

  const lang = langArg ? langArg.split('=')[1] : null;
  const section = sectionArg ? sectionArg.split('=')[1] : null;
  const version = versionArg ? versionArg.split('=')[1] : null;

  if (statusFlag) {
    cmdStatus();
    return;
  }

  if (section && applyFlag) {
    cmdApplySection(section);
    return;
  }

  if (section) {
    cmdExportSection(section);
    return;
  }

  if (lang && applyFlag) {
    cmdApplyLanguage(lang, version);
    return;
  }

  if (lang) {
    cmdExportLanguage(lang);
    return;
  }

  console.error('Usage:');
  console.error('  npm run i18n:review -- --status                    Show status');
  console.error('  npm run i18n:review -- --lang=es                   Full language review');
  console.error('  npm run i18n:review -- --section=tools.new-tool    Section review (all langs)');
  console.error('  npm run i18n:review:apply -- --lang=es             Apply language corrections');
  console.error('  npm run i18n:review:apply -- --section=tools.x     Apply section corrections');
  process.exit(1);
}

main();
