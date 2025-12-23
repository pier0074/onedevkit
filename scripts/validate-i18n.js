#!/usr/bin/env node
/**
 * i18n Validation Script
 *
 * Compares all language files against en.json (source of truth)
 * Reports missing translations and structure mismatches
 *
 * Usage: node scripts/validate-i18n.js [--fix] [--lang=es]
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../src/_data/i18n');
const LANGUAGES_FILE = path.join(__dirname, '../src/_data/languages.json');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

/**
 * Get all leaf paths from an object (dot notation)
 */
function getAllPaths(obj, prefix = '') {
  const paths = [];

  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      paths.push(...getAllPaths(value, fullPath));
    } else {
      paths.push({ path: fullPath, value, isArray: Array.isArray(value) });
    }
  }

  return paths;
}

/**
 * Get value at path from object
 */
function getAtPath(obj, pathStr) {
  return pathStr.split('.').reduce((o, k) => o?.[k], obj);
}

/**
 * Set value at path in object (creates nested objects as needed)
 */
function setAtPath(obj, pathStr, value) {
  const keys = pathStr.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Validate a language file against English
 */
function validateLanguage(langCode, enData, langData) {
  const enPaths = getAllPaths(enData);
  const langPaths = getAllPaths(langData);
  const langPathSet = new Set(langPaths.map(p => p.path));

  const missing = [];
  const extra = [];
  const typeMismatch = [];

  // Find missing translations
  for (const { path, value, isArray } of enPaths) {
    if (!langPathSet.has(path)) {
      missing.push({ path, enValue: value, isArray });
    } else {
      // Check type mismatch
      const langValue = getAtPath(langData, path);
      const enIsArray = Array.isArray(value);
      const langIsArray = Array.isArray(langValue);

      if (enIsArray !== langIsArray) {
        typeMismatch.push({ path, enType: enIsArray ? 'array' : typeof value, langType: langIsArray ? 'array' : typeof langValue });
      }
    }
  }

  // Find extra translations (not in English)
  const enPathSet = new Set(enPaths.map(p => p.path));
  for (const { path } of langPaths) {
    if (!enPathSet.has(path)) {
      extra.push({ path });
    }
  }

  return { missing, extra, typeMismatch, total: enPaths.length, translated: enPaths.length - missing.length };
}

/**
 * Generate template for missing translations
 */
function generateMissingTemplate(missing, enData) {
  const template = {};

  for (const { path, enValue } of missing) {
    // Mark as TODO with English value for reference
    const todoValue = Array.isArray(enValue)
      ? enValue.map(item => typeof item === 'object' ? { ...item, _TODO: 'TRANSLATE' } : `TODO: ${item}`)
      : `TODO: ${enValue}`;
    setAtPath(template, path, todoValue);
  }

  return template;
}

/**
 * Main validation function
 */
function main() {
  const args = process.argv.slice(2);
  const fixMode = args.includes('--fix');
  const langArg = args.find(a => a.startsWith('--lang='));
  const specificLang = langArg ? langArg.split('=')[1] : null;
  const jsonOutput = args.includes('--json');

  // Load English as source of truth
  const enPath = path.join(I18N_DIR, 'en.json');
  if (!fs.existsSync(enPath)) {
    console.error(`${colors.red}Error: en.json not found${colors.reset}`);
    process.exit(1);
  }
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  // Load languages config
  const languages = JSON.parse(fs.readFileSync(LANGUAGES_FILE, 'utf8'));
  const enabledLangs = languages.filter(l => l.enabled && l.code !== 'en');

  // Filter to specific language if requested
  const langsToCheck = specificLang
    ? enabledLangs.filter(l => l.code === specificLang)
    : enabledLangs;

  if (langsToCheck.length === 0) {
    console.log(`${colors.yellow}No languages to validate${colors.reset}`);
    process.exit(0);
  }

  const results = {};
  let hasErrors = false;

  console.log(`\n${colors.cyan}=== i18n Validation Report ===${colors.reset}\n`);
  console.log(`Source of truth: ${colors.blue}en.json${colors.reset}`);
  console.log(`Languages to check: ${langsToCheck.map(l => l.code).join(', ')}\n`);

  for (const lang of langsToCheck) {
    const langPath = path.join(I18N_DIR, `${lang.code}.json`);

    if (!fs.existsSync(langPath)) {
      console.log(`${colors.red}[${lang.code}] File not found: ${lang.code}.json${colors.reset}`);
      hasErrors = true;
      continue;
    }

    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const result = validateLanguage(lang.code, enData, langData);
    results[lang.code] = result;

    const coverage = ((result.translated / result.total) * 100).toFixed(1);
    const status = result.missing.length === 0 ? colors.green + '✓' : colors.red + '✗';

    console.log(`${status} ${colors.reset}${lang.nativeName} (${lang.code}): ${coverage}% coverage (${result.translated}/${result.total})`);

    if (result.missing.length > 0) {
      hasErrors = true;
      console.log(`  ${colors.yellow}Missing: ${result.missing.length} translations${colors.reset}`);

      // Group by top-level section
      const bySection = {};
      for (const { path } of result.missing) {
        const section = path.split('.')[0];
        bySection[section] = (bySection[section] || 0) + 1;
      }

      for (const [section, count] of Object.entries(bySection)) {
        console.log(`    ${colors.dim}- ${section}: ${count} missing${colors.reset}`);
      }

      // Show first 5 missing paths as examples
      if (!jsonOutput) {
        console.log(`  ${colors.dim}Examples:${colors.reset}`);
        result.missing.slice(0, 5).forEach(({ path }) => {
          console.log(`    ${colors.dim}- ${path}${colors.reset}`);
        });
        if (result.missing.length > 5) {
          console.log(`    ${colors.dim}... and ${result.missing.length - 5} more${colors.reset}`);
        }
      }
    }

    if (result.extra.length > 0) {
      console.log(`  ${colors.blue}Extra keys: ${result.extra.length} (not in en.json)${colors.reset}`);
    }

    if (result.typeMismatch.length > 0) {
      console.log(`  ${colors.yellow}Type mismatches: ${result.typeMismatch.length}${colors.reset}`);
    }

    // Fix mode: generate template file
    if (fixMode && result.missing.length > 0) {
      const template = generateMissingTemplate(result.missing, enData);
      const templatePath = path.join(I18N_DIR, `${lang.code}.missing.json`);
      fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
      console.log(`  ${colors.green}Generated: ${lang.code}.missing.json${colors.reset}`);
    }

    console.log('');
  }

  // Summary
  console.log(`${colors.cyan}=== Summary ===${colors.reset}`);
  const totalMissing = Object.values(results).reduce((sum, r) => sum + r.missing.length, 0);

  if (totalMissing === 0) {
    console.log(`${colors.green}All translations complete!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Total missing translations: ${totalMissing}${colors.reset}`);
    console.log(`\nRun with ${colors.blue}--fix${colors.reset} to generate template files for missing translations.`);
  }

  // JSON output mode
  if (jsonOutput) {
    console.log('\n--- JSON Output ---');
    console.log(JSON.stringify(results, null, 2));
  }

  process.exit(hasErrors ? 1 : 0);
}

main();
