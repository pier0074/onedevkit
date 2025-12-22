/**
 * Generate all tool × language combinations for pagination
 * This enables multi-language tool pages without duplicating templates
 *
 * Output: Array of page objects, each containing:
 * - tool: The tool data from tools.json
 * - lang: Language code (e.g., "en", "es")
 * - langInfo: Full language object from languages.json
 * - isDefaultLang: Boolean indicating if this is the default language
 * - permalink: The URL path for this page
 * - basePath: The base path without language prefix (for hreflang)
 */
const fs = require('fs');
const path = require('path');

module.exports = function() {
  // Load tools data
  const toolsPath = path.join(__dirname, 'tools.json');
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

  // Load languages data
  const languagesPath = path.join(__dirname, 'languages.json');
  const languages = JSON.parse(fs.readFileSync(languagesPath, 'utf8'));

  // Get enabled languages
  const enabledLanguages = languages.filter(l => l.enabled);
  const defaultLang = languages.find(l => l.default) || languages[0];

  // Generate all combinations
  const pages = [];

  for (const tool of tools) {
    for (const lang of enabledLanguages) {
      const isDefault = lang.code === defaultLang.code;

      pages.push({
        tool: tool,
        lang: lang.code,
        langInfo: lang,
        isDefaultLang: isDefault,
        // URL: default lang = /tools/{id}/, other langs = /{lang}/tools/{id}/
        permalink: isDefault
          ? `/tools/${tool.id}/`
          : `/${lang.code}/tools/${tool.id}/`,
        // Base path for hreflang (without lang prefix)
        basePath: `/tools/${tool.id}/`
      });
    }
  }

  return pages;
};
