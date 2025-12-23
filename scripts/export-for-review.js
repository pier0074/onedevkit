#!/usr/bin/env node
/**
 * Export translations for external review (Gemini, ChatGPT, etc.)
 *
 * Usage:
 *   node scripts/export-for-review.js --lang=es
 *   node scripts/export-for-review.js --lang=es --section=pages.about
 *   node scripts/export-for-review.js --lang=es --format=markdown
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
    const path = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

function main() {
  const args = process.argv.slice(2);
  const langArg = args.find(a => a.startsWith('--lang='));
  const sectionArg = args.find(a => a.startsWith('--section='));
  const formatArg = args.find(a => a.startsWith('--format='));

  const lang = langArg ? langArg.split('=')[1] : 'es';
  const section = sectionArg ? sectionArg.split('=')[1] : null;
  const format = formatArg ? formatArg.split('=')[1] : 'markdown';

  const en = JSON.parse(fs.readFileSync(path.join(I18N_DIR, 'en.json'), 'utf8'));
  const target = JSON.parse(fs.readFileSync(path.join(I18N_DIR, `${lang}.json`), 'utf8'));

  const enSection = getAtPath(en, section);
  const targetSection = getAtPath(target, section);

  if (!enSection) {
    console.error(`Section "${section}" not found in en.json`);
    process.exit(1);
  }

  const enFlat = flatten(enSection);
  const targetFlat = flatten(targetSection || {});

  if (format === 'markdown') {
    console.log(`# Translation Review: ${lang.toUpperCase()}${section ? ` - ${section}` : ''}\n`);
    console.log(`Review the ${lang.toUpperCase()} translations below. Check for:`);
    console.log(`- Accuracy of meaning`);
    console.log(`- Natural phrasing in target language`);
    console.log(`- Consistency of terminology`);
    console.log(`- Appropriate formality level\n`);
    console.log(`---\n`);

    for (const key in enFlat) {
      const enVal = enFlat[key];
      const targetVal = targetFlat[key];
      const fullKey = section ? `${section}.${key}` : key;

      console.log(`## \`${fullKey}\`\n`);
      console.log(`**English:** ${JSON.stringify(enVal)}\n`);
      if (targetVal) {
        console.log(`**${lang.toUpperCase()}:** ${JSON.stringify(targetVal)}\n`);
      } else {
        console.log(`**${lang.toUpperCase()}:** ⚠️ MISSING\n`);
      }
      console.log('---\n');
    }
  } else if (format === 'csv') {
    console.log('Key,English,' + lang.toUpperCase() + ',Status');
    for (const key in enFlat) {
      const enVal = JSON.stringify(enFlat[key]).replace(/"/g, '""');
      const targetVal = JSON.stringify(targetFlat[key] || '').replace(/"/g, '""');
      const status = targetFlat[key] ? 'OK' : 'MISSING';
      const fullKey = section ? `${section}.${key}` : key;
      console.log(`"${fullKey}","${enVal}","${targetVal}","${status}"`);
    }
  } else if (format === 'json') {
    const result = [];
    for (const key in enFlat) {
      result.push({
        key: section ? `${section}.${key}` : key,
        english: enFlat[key],
        [lang]: targetFlat[key] || null,
        status: targetFlat[key] ? 'translated' : 'missing'
      });
    }
    console.log(JSON.stringify(result, null, 2));
  }
}

main();
