const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // ============================================
  // Static Assets
  // ============================================

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Ignore markdown files in images folder
  eleventyConfig.ignores.add("src/images/*.md");

  // Watch for changes
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");
  eleventyConfig.addWatchTarget("src/_data/i18n/");

  // ============================================
  // i18n Data Loading
  // ============================================

  // Cache for loaded i18n files
  const i18nCache = {};

  /**
   * Load i18n file for a language (with caching)
   */
  function loadI18n(lang) {
    if (!i18nCache[lang]) {
      const filePath = path.join(__dirname, 'src', '_data', 'i18n', `${lang}.json`);
      if (fs.existsSync(filePath)) {
        i18nCache[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } else {
        // Fallback to English
        const enPath = path.join(__dirname, 'src', '_data', 'i18n', 'en.json');
        i18nCache[lang] = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      }
    }
    return i18nCache[lang];
  }

  /**
   * Get languages data
   */
  function getLanguages() {
    const filePath = path.join(__dirname, 'src', '_data', 'languages.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  /**
   * Get enabled languages
   */
  function getEnabledLanguages() {
    return getLanguages().filter(l => l.enabled);
  }

  /**
   * Get default language
   */
  function getDefaultLanguage() {
    return getLanguages().find(l => l.default) || getLanguages()[0];
  }

  // ============================================
  // i18n Filters
  // ============================================

  /**
   * Load i18n data for a language
   * Usage: {% set i18n = lang | loadI18n %}
   */
  eleventyConfig.addFilter("loadI18n", function(lang) {
    return loadI18n(lang || 'en');
  });

  /**
   * Get translation by dot-notation key path
   * Usage: {{ "nav.tools" | t(lang) }}
   * Usage: {{ "common.copy" | t(lang) }}
   */
  eleventyConfig.addFilter("t", function(key, lang = "en") {
    const i18n = loadI18n(lang);
    const result = key.split('.').reduce((obj, k) => obj?.[k], i18n);
    return result !== undefined ? result : key;
  });

  /**
   * Get tool-specific translation
   * Usage: {{ tool.id | toolT(lang, "name") }}
   * Usage: {{ tool.id | toolT(lang, "description") }}
   */
  eleventyConfig.addFilter("toolT", function(toolId, lang, field) {
    const i18n = loadI18n(lang);
    const toolI18n = i18n.tools?.[toolId];
    if (toolI18n && toolI18n[field] !== undefined) {
      return toolI18n[field];
    }
    // Fallback to English
    const enI18n = loadI18n('en');
    return enI18n.tools?.[toolId]?.[field] || '';
  });

  /**
   * Get nested tool translation (for howTo, faq, etc.)
   * Usage: {{ tool.id | toolTNested(lang, "howTo.title") }}
   */
  eleventyConfig.addFilter("toolTNested", function(toolId, lang, keyPath) {
    const i18n = loadI18n(lang);
    const toolI18n = i18n.tools?.[toolId];
    if (toolI18n) {
      const result = keyPath.split('.').reduce((obj, k) => obj?.[k], toolI18n);
      if (result !== undefined) return result;
    }
    // Fallback to English
    const enI18n = loadI18n('en');
    const enTool = enI18n.tools?.[toolId];
    return keyPath.split('.').reduce((obj, k) => obj?.[k], enTool) || '';
  });

  /**
   * Get language-aware URL
   * Usage: {{ "/tools/json-formatter/" | langUrl(lang) }}
   */
  eleventyConfig.addFilter("langUrl", function(urlPath, lang) {
    const defaultLang = getDefaultLanguage();
    if (!lang || lang === defaultLang.code) {
      return urlPath;
    }
    // Ensure path starts with /
    const normalizedPath = urlPath.startsWith('/') ? urlPath : '/' + urlPath;
    return `/${lang}${normalizedPath}`;
  });

  /**
   * Get language data by code
   * Usage: {{ lang | langData }}
   */
  eleventyConfig.addFilter("langData", function(langCode) {
    return getLanguages().find(l => l.code === langCode);
  });

  /**
   * Check if language is default
   * Usage: {% if lang | isDefaultLang %}
   */
  eleventyConfig.addFilter("isDefaultLang", function(langCode) {
    const defaultLang = getDefaultLanguage();
    return langCode === defaultLang.code;
  });

  /**
   * Strip language prefix from URL to get base path
   * Usage: {{ page.url | stripLangPrefix(lang) }}
   */
  eleventyConfig.addFilter("stripLangPrefix", function(url, lang) {
    const defaultLang = getDefaultLanguage();
    if (!lang || lang === defaultLang.code) {
      return url;
    }
    // Remove /{lang}/ prefix from URL
    const prefix = `/${lang}/`;
    if (url.startsWith(prefix)) {
      return url.slice(lang.length + 1); // Returns /rest/of/path
    }
    return url;
  });

  /**
   * Get category translation
   * Usage: {{ tool.category | categoryT(lang) }}
   */
  eleventyConfig.addFilter("categoryT", function(category, lang) {
    const i18n = loadI18n(lang);
    return i18n.categories?.[category] || category;
  });

  // ============================================
  // Existing Filters
  // ============================================

  // Find tool by ID
  eleventyConfig.addFilter("findById", function(array, id) {
    return array.find(item => item.id === id);
  });

  // Group by (for categories)
  eleventyConfig.addFilter("groupby", function(array, key) {
    const result = {};
    array.forEach(item => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
    });
    return Object.entries(result);
  });

  // ============================================
  // Shortcodes
  // ============================================

  // Current date for sitemap
  eleventyConfig.addShortcode("currentDate", () => {
    return new Date().toISOString().split('T')[0];
  });

  // Current year for copyright
  eleventyConfig.addShortcode("year", () => {
    return new Date().getFullYear().toString();
  });

  /**
   * Generate hreflang tags for SEO
   * Usage: {% hreflang "/tools/json-formatter/" %}
   */
  eleventyConfig.addShortcode("hreflang", function(pagePath) {
    const enabledLangs = getEnabledLanguages();
    const defaultLang = getDefaultLanguage();
    const siteUrl = "https://onedevkit.com";

    const tags = enabledLangs.map(lang => {
      const url = lang.default ? pagePath : `/${lang.code}${pagePath}`;
      return `<link rel="alternate" hreflang="${lang.hreflang}" href="${siteUrl}${url}" />`;
    });

    // Add x-default pointing to default language version
    tags.push(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${pagePath}" />`);

    return tags.join('\n    ');
  });

  /**
   * Generate alternate language links for Open Graph
   * Usage: {% ogAlternates "/tools/json-formatter/" %}
   */
  eleventyConfig.addShortcode("ogAlternates", function(pagePath) {
    const enabledLangs = getEnabledLanguages();
    const siteUrl = "https://onedevkit.com";

    return enabledLangs.map(lang => {
      const url = lang.default ? pagePath : `/${lang.code}${pagePath}`;
      return `<meta property="og:locale:alternate" content="${lang.locale}" />`;
    }).join('\n    ');
  });

  // ============================================
  // Global Data
  // ============================================

  // Add languages to global data
  eleventyConfig.addGlobalData("languages", () => getLanguages());
  eleventyConfig.addGlobalData("enabledLanguages", () => getEnabledLanguages());
  eleventyConfig.addGlobalData("defaultLang", () => getDefaultLanguage());

  // Current language (default for non-paginated pages)
  eleventyConfig.addGlobalData("lang", "en");

  // ============================================
  // Eleventy Configuration
  // ============================================

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
