#!/usr/bin/env node
/**
 * Translation Review Manager
 *
 * Handles the complete Gemini review workflow with versioning and traceability.
 *
 * Usage:
 *   node scripts/i18n-review.js --lang=es                    # Create new review export
 *   node scripts/i18n-review.js --lang=es --apply            # Apply latest corrections
 *   node scripts/i18n-review.js --lang=es --apply --version=001  # Apply specific version
 *   node scripts/i18n-review.js --lang=es --status           # Show review status
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../src/_data/i18n');
const REVIEWS_DIR = path.join(__dirname, '../i18n-reviews');

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

function getNextVersion(langDir) {
  if (!fs.existsSync(langDir)) {
    return 1;
  }
  const versions = fs.readdirSync(langDir)
    .filter(d => d.startsWith('v'))
    .map(d => parseInt(d.split('_')[0].substring(1)))
    .filter(n => !isNaN(n));

  return versions.length > 0 ? Math.max(...versions) + 1 : 1;
}

function getLatestVersion(langDir) {
  if (!fs.existsSync(langDir)) {
    return null;
  }
  const versions = fs.readdirSync(langDir)
    .filter(d => d.startsWith('v'))
    .sort()
    .reverse();

  return versions.length > 0 ? versions[0] : null;
}

function padVersion(num) {
  return String(num).padStart(3, '0');
}

// ============ Language Names ============

const LANG_NAMES = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  it: 'Italian',
  ja: 'Japanese',
  zh: 'Chinese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi',
  ru: 'Russian',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai'
};

// ============ Export Generation ============

function generateExport(lang) {
  const langName = LANG_NAMES[lang] || lang.toUpperCase();

  const en = JSON.parse(fs.readFileSync(path.join(I18N_DIR, 'en.json'), 'utf8'));
  const target = JSON.parse(fs.readFileSync(path.join(I18N_DIR, `${lang}.json`), 'utf8'));

  const enFlat = flatten(en);
  const targetFlat = flatten(target);

  let output = `# Translation Review Request

You are reviewing ${langName} translations for OneDevKit, a developer tools website.

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

| Key | English | ${lang.toUpperCase()} |
|-----|---------|-----|
`;

  for (const key in enFlat) {
    const enVal = enFlat[key];
    const targetVal = targetFlat[key];
    const enEscaped = String(enVal).replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const targetEscaped = targetVal
      ? String(targetVal).replace(/\|/g, '\\|').replace(/\n/g, ' ')
      : '⚠️ MISSING';
    output += `| \`${key}\` | ${enEscaped} | ${targetEscaped} |\n`;
  }

  output += `\n---\n\n`;
  output += `**Total translations:** ${Object.keys(enFlat).length}\n`;
  output += `**Generated:** ${new Date().toISOString()}\n`;

  return output;
}

// ============ Correction Report ============

function generateCorrectionReport(corrections, translations, lang, version) {
  const langName = LANG_NAMES[lang] || lang.toUpperCase();

  let report = `# Translation Correction Report

**Language:** ${langName} (${lang})
**Version:** ${version}
**Applied:** ${new Date().toISOString()}
**Total Corrections:** ${corrections.length}

---

## Summary by Issue Type

`;

  const byIssue = {};
  corrections.forEach(c => {
    const issue = c.issue || 'unspecified';
    if (!byIssue[issue]) byIssue[issue] = [];
    byIssue[issue].push(c);
  });

  for (const [issue, items] of Object.entries(byIssue)) {
    report += `- **${issue}**: ${items.length} correction${items.length > 1 ? 's' : ''}\n`;
  }

  report += `\n---\n\n## Detailed Changes\n\n`;

  corrections.forEach((c, i) => {
    const current = c.current || getAtPath(translations, c.key);
    report += `### ${i + 1}. \`${c.key}\`\n\n`;
    report += `**Issue:** ${c.issue || 'unspecified'}\n\n`;
    report += `**Before:**\n\`\`\`\n${current}\n\`\`\`\n\n`;
    report += `**After:**\n\`\`\`\n${c.suggested}\n\`\`\`\n\n`;
    if (c.explanation) {
      report += `**Reason:** ${c.explanation}\n\n`;
    }
    report += `---\n\n`;
  });

  return report;
}

// ============ Commands ============

function cmdExport(lang) {
  const langDir = path.join(REVIEWS_DIR, lang);
  const nextVersion = getNextVersion(langDir);
  const versionName = `v${padVersion(nextVersion)}_${getDateStamp()}`;
  const versionDir = path.join(langDir, versionName);

  // Create directories
  fs.mkdirSync(versionDir, { recursive: true });

  // Generate and save export
  const exportContent = generateExport(lang);
  const exportPath = path.join(versionDir, 'export.md');
  fs.writeFileSync(exportPath, exportContent);

  // Create placeholder for gemini response
  const responsePath = path.join(versionDir, 'gemini-response.json');
  fs.writeFileSync(responsePath, `[]

// Instructions:
// 1. Copy the contents of export.md to Gemini Pro
// 2. Replace this file with Gemini's JSON response
// 3. Run: npm run i18n:review:apply -- --lang=${lang}
`);

  console.log(`\n✅ Review export created!\n`);
  console.log(`📁 Version: ${versionName}`);
  console.log(`📄 Export: ${exportPath}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Copy contents of export.md to Gemini Pro`);
  console.log(`   2. Save Gemini's JSON response to gemini-response.json`);
  console.log(`   3. Run: npm run i18n:review:apply -- --lang=${lang}`);
}

function cmdApply(lang, specificVersion) {
  const langDir = path.join(REVIEWS_DIR, lang);

  let versionName;
  if (specificVersion) {
    // Find version matching the number
    const versions = fs.readdirSync(langDir).filter(d => d.startsWith(`v${padVersion(specificVersion)}`));
    if (versions.length === 0) {
      console.error(`❌ Version ${specificVersion} not found for ${lang}`);
      process.exit(1);
    }
    versionName = versions[0];
  } else {
    versionName = getLatestVersion(langDir);
    if (!versionName) {
      console.error(`❌ No review versions found for ${lang}`);
      console.error(`   Run: npm run i18n:review -- --lang=${lang}`);
      process.exit(1);
    }
  }

  const versionDir = path.join(langDir, versionName);
  const responsePath = path.join(versionDir, 'gemini-response.json');
  const reportPath = path.join(versionDir, 'correction-report.md');

  if (!fs.existsSync(responsePath)) {
    console.error(`❌ No gemini-response.json found in ${versionName}`);
    process.exit(1);
  }

  // Parse corrections
  let content = fs.readFileSync(responsePath, 'utf8');

  // Remove comments (lines starting with //)
  content = content.split('\n').filter(line => !line.trim().startsWith('//')).join('\n');

  // Extract JSON from markdown code blocks if present
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    content = jsonMatch[1];
  }

  let corrections;
  try {
    corrections = JSON.parse(content.trim());
  } catch (e) {
    console.error(`❌ Failed to parse gemini-response.json: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(corrections)) {
    console.error(`❌ Corrections must be a JSON array`);
    process.exit(1);
  }

  if (corrections.length === 0) {
    console.log(`\n✅ No corrections needed - translations are perfect!`);

    // Create empty report
    const report = `# Translation Correction Report

**Language:** ${LANG_NAMES[lang] || lang} (${lang})
**Version:** ${versionName}
**Applied:** ${new Date().toISOString()}

---

## Result

No corrections were needed. All translations passed Gemini's review.
`;
    fs.writeFileSync(reportPath, report);
    console.log(`📄 Report saved: ${reportPath}`);
    return;
  }

  // Load translations
  const translationPath = path.join(I18N_DIR, `${lang}.json`);
  const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));

  // Apply corrections
  let applied = 0;
  let skipped = 0;

  corrections.forEach(c => {
    if (!c.key || !c.suggested) {
      console.warn(`⚠️  Skipping invalid correction: ${JSON.stringify(c)}`);
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

  // Save updated translations
  fs.writeFileSync(translationPath, JSON.stringify(translations, null, 2) + '\n');

  // Generate and save report
  const report = generateCorrectionReport(corrections, translations, lang, versionName);
  fs.writeFileSync(reportPath, report);

  console.log(`\n✅ Corrections applied!`);
  console.log(`   Applied: ${applied}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`📄 Report: ${reportPath}`);
  console.log(`📄 Updated: ${translationPath}`);
}

function cmdStatus(lang) {
  const langDir = path.join(REVIEWS_DIR, lang);

  if (!fs.existsSync(langDir)) {
    console.log(`\n📊 Status for ${lang}: No reviews yet`);
    console.log(`   Run: npm run i18n:review -- --lang=${lang}`);
    return;
  }

  const versions = fs.readdirSync(langDir)
    .filter(d => d.startsWith('v'))
    .sort();

  console.log(`\n📊 Review history for ${LANG_NAMES[lang] || lang} (${lang}):\n`);

  versions.forEach(v => {
    const vDir = path.join(langDir, v);
    const hasExport = fs.existsSync(path.join(vDir, 'export.md'));
    const hasResponse = fs.existsSync(path.join(vDir, 'gemini-response.json'));
    const hasReport = fs.existsSync(path.join(vDir, 'correction-report.md'));

    // Check if response has actual content
    let responseStatus = '⬜';
    if (hasResponse) {
      const content = fs.readFileSync(path.join(vDir, 'gemini-response.json'), 'utf8');
      if (content.includes('Instructions:')) {
        responseStatus = '⬜ (pending)';
      } else {
        responseStatus = '✅';
      }
    }

    console.log(`  ${v}`);
    console.log(`    Export:   ${hasExport ? '✅' : '⬜'}`);
    console.log(`    Response: ${responseStatus}`);
    console.log(`    Report:   ${hasReport ? '✅' : '⬜'}`);
    console.log('');
  });
}

// ============ Main ============

function main() {
  const args = process.argv.slice(2);

  const langArg = args.find(a => a.startsWith('--lang='));
  const versionArg = args.find(a => a.startsWith('--version='));
  const applyFlag = args.includes('--apply');
  const statusFlag = args.includes('--status');

  if (!langArg) {
    console.error('Usage:');
    console.error('  npm run i18n:review -- --lang=es           Create new review export');
    console.error('  npm run i18n:review:apply -- --lang=es     Apply latest corrections');
    console.error('  npm run i18n:review -- --lang=es --status  Show review history');
    process.exit(1);
  }

  const lang = langArg.split('=')[1];
  const version = versionArg ? versionArg.split('=')[1] : null;

  // Verify language file exists
  if (!fs.existsSync(path.join(I18N_DIR, `${lang}.json`))) {
    console.error(`❌ Language file not found: ${lang}.json`);
    process.exit(1);
  }

  if (statusFlag) {
    cmdStatus(lang);
  } else if (applyFlag) {
    cmdApply(lang, version);
  } else {
    cmdExport(lang);
  }
}

main();
