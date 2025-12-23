#!/usr/bin/env node
/**
 * Apply Gemini translation corrections
 *
 * Usage:
 *   node scripts/gemini-apply.js --lang=es --corrections=corrections.json
 *   node scripts/gemini-apply.js --lang=es --corrections=corrections.json --dry-run
 *   node scripts/gemini-apply.js --lang=es --corrections=corrections.json --report
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../src/_data/i18n');

function setAtPath(obj, pathStr, value) {
  const keys = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

function getAtPath(obj, pathStr) {
  return pathStr.split('.').reduce((o, k) => o?.[k], obj);
}

function parseCorrections(input) {
  // Handle both file path and direct JSON string
  let content;
  if (fs.existsSync(input)) {
    content = fs.readFileSync(input, 'utf8');
  } else {
    content = input;
  }

  // Try to extract JSON from markdown code blocks
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    content = jsonMatch[1];
  }

  // Clean up and parse
  content = content.trim();

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse corrections JSON:', e.message);
    console.error('Content received:', content.substring(0, 500));
    process.exit(1);
  }
}

function generateReport(corrections, translations, lang) {
  let report = `# Translation Corrections Report\n\n`;
  report += `Language: ${lang.toUpperCase()}\n`;
  report += `Total corrections: ${corrections.length}\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `---\n\n`;

  const byIssue = {};
  corrections.forEach(c => {
    const issue = c.issue || 'unknown';
    if (!byIssue[issue]) byIssue[issue] = [];
    byIssue[issue].push(c);
  });

  report += `## Summary by Issue Type\n\n`;
  for (const [issue, items] of Object.entries(byIssue)) {
    report += `- **${issue}**: ${items.length} corrections\n`;
  }
  report += `\n---\n\n`;

  report += `## Detailed Corrections\n\n`;
  corrections.forEach((c, i) => {
    const current = c.current || getAtPath(translations, c.key);
    report += `### ${i + 1}. \`${c.key}\`\n\n`;
    report += `**Issue:** ${c.issue || 'unspecified'}\n\n`;
    report += `**Before:**\n> ${current}\n\n`;
    report += `**After:**\n> ${c.suggested}\n\n`;
    if (c.explanation) {
      report += `**Explanation:** ${c.explanation}\n\n`;
    }
    report += `---\n\n`;
  });

  return report;
}

function main() {
  const args = process.argv.slice(2);
  const langArg = args.find(a => a.startsWith('--lang='));
  const correctionsArg = args.find(a => a.startsWith('--corrections='));
  const dryRun = args.includes('--dry-run');
  const generateReportFlag = args.includes('--report');

  if (!langArg || !correctionsArg) {
    console.error('Usage: node scripts/gemini-apply.js --lang=es --corrections=corrections.json [--dry-run] [--report]');
    process.exit(1);
  }

  const lang = langArg.split('=')[1];
  const correctionsInput = correctionsArg.split('=')[1];

  // Load translation file
  const translationPath = path.join(I18N_DIR, `${lang}.json`);
  if (!fs.existsSync(translationPath)) {
    console.error(`Translation file not found: ${translationPath}`);
    process.exit(1);
  }

  const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
  const corrections = parseCorrections(correctionsInput);

  if (!Array.isArray(corrections)) {
    console.error('Corrections must be a JSON array');
    process.exit(1);
  }

  if (corrections.length === 0) {
    console.log('No corrections to apply - translations are perfect!');
    return;
  }

  console.log(`Found ${corrections.length} corrections to apply`);

  // Generate report if requested
  if (generateReportFlag) {
    const report = generateReport(corrections, translations, lang);
    const reportPath = path.join(__dirname, `../correction-report-${lang}.md`);
    fs.writeFileSync(reportPath, report);
    console.log(`Report saved to: ${reportPath}`);
  }

  if (dryRun) {
    console.log('\n=== DRY RUN - No changes will be made ===\n');
    corrections.forEach((c, i) => {
      const current = getAtPath(translations, c.key);
      console.log(`${i + 1}. ${c.key}`);
      console.log(`   Issue: ${c.issue || 'unspecified'}`);
      console.log(`   Current: ${current}`);
      console.log(`   Suggested: ${c.suggested}`);
      if (c.explanation) {
        console.log(`   Reason: ${c.explanation}`);
      }
      console.log('');
    });
    return;
  }

  // Apply corrections
  let applied = 0;
  let skipped = 0;

  corrections.forEach(c => {
    if (!c.key || !c.suggested) {
      console.warn(`Skipping invalid correction: ${JSON.stringify(c)}`);
      skipped++;
      return;
    }

    const current = getAtPath(translations, c.key);
    if (current === undefined) {
      console.warn(`Key not found: ${c.key}`);
      skipped++;
      return;
    }

    setAtPath(translations, c.key, c.suggested);
    applied++;
    console.log(`Applied: ${c.key}`);
  });

  // Save updated translations
  fs.writeFileSync(translationPath, JSON.stringify(translations, null, 2) + '\n');

  console.log(`\n=== Summary ===`);
  console.log(`Applied: ${applied} corrections`);
  console.log(`Skipped: ${skipped} corrections`);
  console.log(`Updated: ${translationPath}`);
}

main();
