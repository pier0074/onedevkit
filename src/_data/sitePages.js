/**
 * Generates site page × language combinations for Eleventy pagination.
 * This enables multi-language support for static pages (index, 404, about, etc.)
 */

const fs = require('fs');
const path = require('path');

module.exports = function() {
  const languagesPath = path.join(__dirname, 'languages.json');
  const languages = JSON.parse(fs.readFileSync(languagesPath, 'utf8'));

  const enabledLanguages = languages.filter(l => l.enabled);
  const defaultLang = languages.find(l => l.default) || languages[0];

  // Define site pages with their base paths
  const pageDefinitions = [
    { id: 'home', basePath: '/', template: 'home' },
    { id: '404', basePath: '/404.html', template: '404', is404: true },
    { id: 'about', basePath: '/about/', template: 'about' },
    { id: 'contact', basePath: '/contact/', template: 'contact' },
    { id: 'faq', basePath: '/faq/', template: 'faq' },
    { id: 'privacy', basePath: '/privacy/', template: 'privacy' },
    { id: 'terms', basePath: '/terms/', template: 'terms' }
  ];

  const pages = [];

  for (const pageDef of pageDefinitions) {
    for (const lang of enabledLanguages) {
      const isDefault = lang.code === defaultLang.code;

      // Calculate permalink
      let permalink;
      if (pageDef.is404) {
        // 404 pages: /404.html and /es/404.html
        permalink = isDefault ? '/404.html' : `/${lang.code}/404.html`;
      } else if (pageDef.basePath === '/') {
        // Home page: / and /es/
        permalink = isDefault ? '/' : `/${lang.code}/`;
      } else {
        // Other pages: /about/ and /es/about/
        permalink = isDefault ? pageDef.basePath : `/${lang.code}${pageDef.basePath}`;
      }

      pages.push({
        pageId: pageDef.id,
        template: pageDef.template,
        lang: lang.code,
        langInfo: lang,
        isDefaultLang: isDefault,
        permalink: permalink,
        basePath: pageDef.basePath
      });
    }
  }

  return pages;
};
