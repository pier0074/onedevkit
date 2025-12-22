# OneDevKit i18n Architecture

## Design Principles

1. **Single Source of Truth** - Tool logic defined once
2. **Separation of Concerns** - Code vs. translations vs. content
3. **Additive Only** - New tool = 1 file, new language = 1 JSON
4. **SEO Native** - hreflang, per-language sitemaps built-in

---

## Directory Structure

```
src/
├── _data/
│   ├── tools.json              # Tool definitions (language-agnostic)
│   ├── languages.json          # Supported languages list
│   ├── site.json               # Site config
│   └── i18n/
│       ├── en.json             # English translations
│       ├── es.json             # Spanish translations
│       ├── hi.json             # Hindi translations
│       └── ...
│
├── _includes/
│   ├── layouts/
│   │   ├── base.njk            # Base with hreflang injection
│   │   ├── tool.njk            # Tool layout (language-aware)
│   │   └── page.njk            # Static page layout
│   └── partials/
│       ├── header.njk          # Nav with language switcher
│       ├── footer.njk
│       ├── lang-switcher.njk   # Language dropdown
│       └── tool-content.njk    # Reusable tool sections
│
├── js/                         # Tool JavaScript (language-agnostic)
│   ├── common.js
│   ├── json-formatter.js
│   └── ...
│
├── css/
│   └── style.css               # Includes RTL support
│
├── _generated/                 # Auto-generated pages (gitignored)
│   └── (pagination output)
│
└── _templates/                 # Source templates for pagination
    ├── tool.njk                # Generates all /[lang]/tools/[id]/
    ├── homepage.njk            # Generates all /[lang]/
    └── page.njk                # Generates all /[lang]/[page]/
```

---

## Core Data Files

### 1. tools.json (Language-Agnostic)

```json
[
  {
    "id": "json-formatter",
    "category": "code-tools",
    "icon": "<path .../>",
    "js": "json-formatter.js",
    "hasHowTo": true,
    "hasFAQ": true,
    "priority": 0.9
  },
  {
    "id": "image-compressor",
    "category": "image-tools",
    "icon": "<path .../>",
    "js": "image-compressor.js",
    "hasHowTo": true,
    "hasFAQ": true,
    "priority": 0.95
  }
]
```

**Note:** No text content here - just structural data.

---

### 2. languages.json

```json
[
  {
    "code": "en",
    "name": "English",
    "nativeName": "English",
    "dir": "ltr",
    "locale": "en_US",
    "default": true,
    "enabled": true
  },
  {
    "code": "es",
    "name": "Spanish",
    "nativeName": "Español",
    "dir": "ltr",
    "locale": "es_ES",
    "default": false,
    "enabled": true
  },
  {
    "code": "hi",
    "name": "Hindi",
    "nativeName": "हिन्दी",
    "dir": "ltr",
    "locale": "hi_IN",
    "default": false,
    "enabled": true
  },
  {
    "code": "ar",
    "name": "Arabic",
    "nativeName": "العربية",
    "dir": "rtl",
    "locale": "ar_SA",
    "default": false,
    "enabled": false
  }
]
```

---

### 3. i18n/en.json (English - Source of Truth)

```json
{
  "site": {
    "name": "OneDevKit",
    "tagline": "Free Online Developer Tools",
    "description": "A collection of free, privacy-focused developer tools."
  },

  "nav": {
    "tools": "Tools",
    "about": "About",
    "contact": "Contact",
    "language": "Language"
  },

  "common": {
    "copy": "Copy",
    "copied": "Copied!",
    "download": "Download",
    "clear": "Clear",
    "reset": "Reset",
    "upload": "Upload",
    "dragDrop": "Drag & drop or click to upload",
    "processing": "Processing...",
    "error": "Error",
    "success": "Success"
  },

  "categories": {
    "code-tools": "Code Tools",
    "generators": "Generators",
    "text-data": "Text & Data",
    "image-tools": "Image Tools"
  },

  "tools": {
    "json-formatter": {
      "name": "JSON Formatter",
      "fullName": "JSON Formatter & Validator",
      "description": "Format, validate, and beautify JSON data instantly.",
      "metaDescription": "Free online JSON formatter and validator. Beautify, minify, and validate JSON with syntax highlighting. No signup required.",
      "keywords": "json formatter, json validator, json beautifier, format json online",
      "howTo": {
        "title": "How to Use",
        "steps": [
          {"title": "Paste JSON", "description": "Paste your JSON data in the input area"},
          {"title": "Format", "description": "Click Format to beautify your JSON"},
          {"title": "Copy", "description": "Copy the formatted result"}
        ]
      },
      "faq": [
        {
          "question": "Is this JSON formatter free?",
          "answer": "Yes, completely free with no signup required."
        },
        {
          "question": "Is my data secure?",
          "answer": "Yes, all processing happens in your browser. No data is sent to servers."
        }
      ],
      "ui": {
        "inputPlaceholder": "Paste your JSON here...",
        "formatBtn": "Format",
        "minifyBtn": "Minify",
        "validateBtn": "Validate"
      }
    },

    "image-compressor": {
      "name": "Image Compressor",
      "fullName": "Image Compressor to Specific KB",
      "description": "Compress images to exact file size (20KB, 50KB, 100KB).",
      "metaDescription": "Compress images to exact KB size. Perfect for passport photos, job applications, and government forms. Free, private, no upload.",
      "keywords": "compress image to 20kb, image compressor, reduce image size",
      "howTo": {
        "title": "How to Use",
        "steps": [
          {"title": "Upload Image", "description": "Click or drag to upload your image"},
          {"title": "Select Size", "description": "Choose target size: 20KB, 50KB, 100KB, or custom"},
          {"title": "Download", "description": "Download your compressed image"}
        ]
      },
      "faq": [
        {
          "question": "How small can I compress an image?",
          "answer": "You can compress to as low as 10KB, depending on image complexity."
        }
      ],
      "ui": {
        "targetSize": "Target Size",
        "currentSize": "Current Size",
        "quality": "Quality"
      }
    }
  },

  "pages": {
    "about": {
      "title": "About OneDevKit",
      "metaDescription": "Learn about OneDevKit - free, privacy-focused developer tools.",
      "content": "OneDevKit provides free online tools for developers..."
    },
    "contact": {
      "title": "Contact Us",
      "metaDescription": "Get in touch with the OneDevKit team."
    }
  },

  "footer": {
    "copyright": "© {year} OneDevKit. All rights reserved.",
    "disclaimer": "Tools provided \"as is\" without warranty."
  }
}
```

---

### 4. i18n/es.json (Spanish Translation)

```json
{
  "site": {
    "name": "OneDevKit",
    "tagline": "Herramientas de Desarrollo Gratuitas",
    "description": "Una colección de herramientas gratuitas para desarrolladores."
  },

  "nav": {
    "tools": "Herramientas",
    "about": "Acerca de",
    "contact": "Contacto",
    "language": "Idioma"
  },

  "common": {
    "copy": "Copiar",
    "copied": "¡Copiado!",
    "download": "Descargar",
    "clear": "Limpiar",
    "reset": "Reiniciar",
    "upload": "Subir",
    "dragDrop": "Arrastra y suelta o haz clic para subir",
    "processing": "Procesando...",
    "error": "Error",
    "success": "Éxito"
  },

  "categories": {
    "code-tools": "Herramientas de Código",
    "generators": "Generadores",
    "text-data": "Texto y Datos",
    "image-tools": "Herramientas de Imagen"
  },

  "tools": {
    "json-formatter": {
      "name": "Formateador JSON",
      "fullName": "Formateador y Validador JSON",
      "description": "Formatea, valida y embellece datos JSON al instante.",
      "metaDescription": "Formateador JSON online gratis. Embellece, minifica y valida JSON con resaltado de sintaxis. Sin registro.",
      "keywords": "formateador json, validador json, formatear json online",
      "howTo": {
        "title": "Cómo Usar",
        "steps": [
          {"title": "Pegar JSON", "description": "Pega tus datos JSON en el área de entrada"},
          {"title": "Formatear", "description": "Haz clic en Formatear para embellecer tu JSON"},
          {"title": "Copiar", "description": "Copia el resultado formateado"}
        ]
      },
      "faq": [
        {
          "question": "¿Este formateador JSON es gratis?",
          "answer": "Sí, completamente gratis sin necesidad de registro."
        },
        {
          "question": "¿Mis datos están seguros?",
          "answer": "Sí, todo el procesamiento ocurre en tu navegador. No se envían datos a servidores."
        }
      ],
      "ui": {
        "inputPlaceholder": "Pega tu JSON aquí...",
        "formatBtn": "Formatear",
        "minifyBtn": "Minificar",
        "validateBtn": "Validar"
      }
    }
  }
}
```

---

## Eleventy Configuration

### .eleventy.js

```javascript
const languages = require('./src/_data/languages.json');
const tools = require('./src/_data/tools.json');

module.exports = function(eleventyConfig) {

  // ============================================
  // i18n Helper Filters
  // ============================================

  /**
   * Get translation by key path
   * Usage: {{ "nav.tools" | t(lang) }}
   */
  eleventyConfig.addFilter("t", function(key, lang = "en") {
    const i18n = require(`./src/_data/i18n/${lang}.json`);
    return key.split('.').reduce((obj, k) => obj?.[k], i18n) || key;
  });

  /**
   * Get tool translation
   * Usage: {{ tool | toolT(lang, "name") }}
   */
  eleventyConfig.addFilter("toolT", function(tool, lang, field) {
    const i18n = require(`./src/_data/i18n/${lang}.json`);
    return i18n.tools?.[tool.id]?.[field] || tool[field] || "";
  });

  /**
   * Get language data
   */
  eleventyConfig.addFilter("langData", function(langCode) {
    return languages.find(l => l.code === langCode);
  });

  /**
   * Build URL for language
   * Usage: {{ "/tools/json-formatter/" | langUrl(lang) }}
   */
  eleventyConfig.addFilter("langUrl", function(path, lang) {
    if (lang === "en") return path;
    return `/${lang}${path}`;
  });

  /**
   * Get alternate URLs for hreflang
   */
  eleventyConfig.addFilter("alternateUrls", function(path) {
    const enabledLangs = languages.filter(l => l.enabled);
    return enabledLangs.map(lang => ({
      lang: lang.code,
      url: lang.default ? path : `/${lang.code}${path}`
    }));
  });

  // ============================================
  // Collections for Pagination
  // ============================================

  /**
   * Generate all tool page combinations (lang × tool)
   */
  eleventyConfig.addCollection("toolPages", function() {
    const enabledLangs = languages.filter(l => l.enabled);
    const pages = [];

    for (const lang of enabledLangs) {
      for (const tool of tools) {
        pages.push({
          lang: lang.code,
          langData: lang,
          tool: tool,
          permalink: lang.default
            ? `/tools/${tool.id}/`
            : `/${lang.code}/tools/${tool.id}/`
        });
      }
    }

    return pages;
  });

  /**
   * Generate homepage for each language
   */
  eleventyConfig.addCollection("homepages", function() {
    return languages.filter(l => l.enabled).map(lang => ({
      lang: lang.code,
      langData: lang,
      permalink: lang.default ? "/" : `/${lang.code}/`
    }));
  });

  // ============================================
  // Shortcodes
  // ============================================

  /**
   * hreflang tags for SEO
   */
  eleventyConfig.addShortcode("hreflangTags", function(path) {
    const enabledLangs = languages.filter(l => l.enabled);
    return enabledLangs.map(lang => {
      const url = lang.default ? path : `/${lang.code}${path}`;
      return `<link rel="alternate" hreflang="${lang.code}" href="https://onedevkit.com${url}" />`;
    }).join('\n    ') + `\n    <link rel="alternate" hreflang="x-default" href="https://onedevkit.com${path}" />`;
  });

  // ... rest of config
};
```

---

## Template Examples

### Tool Page Template (Pagination-Based)

**src/_templates/tool-page.njk**

```nunjucks
---
pagination:
  data: collections.toolPages
  size: 1
  alias: item
permalink: "{{ item.permalink }}"
eleventyComputed:
  lang: "{{ item.lang }}"
  tool: "{{ item.tool }}"
  langData: "{{ item.langData }}"
---
{% set i18n = item.lang | loadI18n %}
{% set toolI18n = i18n.tools[item.tool.id] %}

<!DOCTYPE html>
<html lang="{{ item.lang }}" dir="{{ item.langData.dir }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>{{ toolI18n.fullName }} | {{ i18n.site.name }}</title>
  <meta name="description" content="{{ toolI18n.metaDescription }}">
  <meta name="keywords" content="{{ toolI18n.keywords }}">

  <link rel="canonical" href="https://onedevkit.com{{ item.permalink }}">

  <!-- hreflang tags -->
  {% hreflangTags "/tools/" + item.tool.id + "/" %}

  <!-- Open Graph -->
  <meta property="og:title" content="{{ toolI18n.fullName }}">
  <meta property="og:description" content="{{ toolI18n.metaDescription }}">
  <meta property="og:locale" content="{{ item.langData.locale }}">

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "{{ toolI18n.fullName }}",
    "description": "{{ toolI18n.description }}",
    "url": "https://onedevkit.com{{ item.permalink }}",
    "inLanguage": "{{ item.lang }}",
    "applicationCategory": "DeveloperApplication"
  }
  </script>

  {% if toolI18n.faq %}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {% for faq in toolI18n.faq %}
      {
        "@type": "Question",
        "name": "{{ faq.question }}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "{{ faq.answer }}"
        }
      }{% if not loop.last %},{% endif %}
      {% endfor %}
    ]
  }
  </script>
  {% endif %}

  <link rel="stylesheet" href="/css/style.css">
</head>
<body data-lang="{{ item.lang }}">

  {% include "partials/header.njk" %}

  <main>
    <h1>{{ toolI18n.fullName }}</h1>
    <p>{{ toolI18n.description }}</p>

    <!-- Tool UI (language-aware placeholders) -->
    <div class="tool-container" data-tool="{{ item.tool.id }}">
      {% include "tools/" + item.tool.id + ".njk" %}
    </div>

    <!-- How To Section -->
    {% if toolI18n.howTo %}
    <section class="how-to">
      <h2>{{ toolI18n.howTo.title }}</h2>
      <div class="steps">
        {% for step in toolI18n.howTo.steps %}
        <div class="step">
          <div class="step-number">{{ loop.index }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
        {% endfor %}
      </div>
    </section>
    {% endif %}

    <!-- FAQ Section -->
    {% if toolI18n.faq %}
    <section class="faq">
      <h2>{{ i18n.common.faq or "FAQ" }}</h2>
      {% for faq in toolI18n.faq %}
      <details class="faq-item">
        <summary>{{ faq.question }}</summary>
        <p>{{ faq.answer }}</p>
      </details>
      {% endfor %}
    </section>
    {% endif %}

  </main>

  {% include "partials/footer.njk" %}

  <script src="/js/common.js"></script>
  <script src="/js/{{ item.tool.js }}"></script>
</body>
</html>
```

---

### Language Switcher Partial

**src/_includes/partials/lang-switcher.njk**

```nunjucks
{% set enabledLanguages = languages | selectattr("enabled") %}
{% set currentLang = lang or "en" %}
{% set currentPath = page.url | replace("/" + currentLang, "") | replace("//", "/") %}

<div class="lang-switcher">
  <button class="lang-toggle" aria-expanded="false" aria-haspopup="true">
    <span class="lang-current">{{ currentLang | upper }}</span>
    <svg><!-- dropdown icon --></svg>
  </button>
  <ul class="lang-menu" role="menu">
    {% for language in enabledLanguages %}
    <li role="none">
      <a href="{{ currentPath | langUrl(language.code) }}"
         role="menuitem"
         lang="{{ language.code }}"
         {% if language.code == currentLang %}aria-current="true"{% endif %}>
        {{ language.nativeName }}
      </a>
    </li>
    {% endfor %}
  </ul>
</div>
```

---

## Adding New Content

### Adding a New Tool

**1. Add to tools.json:**
```json
{
  "id": "yaml-validator",
  "category": "code-tools",
  "icon": "<path .../>",
  "js": "yaml-validator.js",
  "hasHowTo": true,
  "hasFAQ": true,
  "priority": 0.9
}
```

**2. Add translations to each i18n file:**
```json
// i18n/en.json
"yaml-validator": {
  "name": "YAML Validator",
  "fullName": "YAML Validator & Formatter",
  "description": "...",
  // ...
}

// i18n/es.json
"yaml-validator": {
  "name": "Validador YAML",
  "fullName": "Validador y Formateador YAML",
  "description": "...",
  // ...
}
```

**3. Create JavaScript:** `src/js/yaml-validator.js`

**4. Create tool partial:** `src/_includes/tools/yaml-validator.njk`

**That's it!** The tool is now available in all enabled languages.

---

### Adding a New Language

**1. Add to languages.json:**
```json
{
  "code": "fr",
  "name": "French",
  "nativeName": "Français",
  "dir": "ltr",
  "locale": "fr_FR",
  "default": false,
  "enabled": true
}
```

**2. Create i18n/fr.json** (translate from en.json)

**3. Run build** - All pages auto-generate for French!

---

## URL Structure

| Language | Homepage | Tool Page |
|----------|----------|-----------|
| English (default) | `/` | `/tools/json-formatter/` |
| Spanish | `/es/` | `/es/tools/json-formatter/` |
| Hindi | `/hi/` | `/hi/tools/json-formatter/` |
| French | `/fr/` | `/fr/tools/json-formatter/` |

---

## SEO Output

### Generated hreflang tags

```html
<link rel="alternate" hreflang="en" href="https://onedevkit.com/tools/json-formatter/" />
<link rel="alternate" hreflang="es" href="https://onedevkit.com/es/tools/json-formatter/" />
<link rel="alternate" hreflang="hi" href="https://onedevkit.com/hi/tools/json-formatter/" />
<link rel="alternate" hreflang="x-default" href="https://onedevkit.com/tools/json-formatter/" />
```

### Generated Sitemaps

**sitemap.xml** (index):
```xml
<sitemapindex>
  <sitemap><loc>https://onedevkit.com/sitemap-en.xml</loc></sitemap>
  <sitemap><loc>https://onedevkit.com/sitemap-es.xml</loc></sitemap>
  <sitemap><loc>https://onedevkit.com/sitemap-hi.xml</loc></sitemap>
</sitemapindex>
```

---

## Build Commands

```bash
# Build all languages
npm run build

# Build specific language (faster dev)
LANG=en npm run build

# Dev with hot reload
npm run dev

# Dev single language
LANG=es npm run dev
```

---

## File Count Comparison

### Before i18n (Current)
- 19 tool templates
- 1 homepage
- 5 static pages
- **Total: ~25 templates**

### After i18n (10 Languages)
- 1 tool template (generates 190 pages)
- 1 homepage template (generates 10 pages)
- 1 page template (generates 50 pages)
- 10 i18n JSON files
- **Total: ~13 templates + 10 JSON files**

**Generated output: 250+ pages from ~23 source files!**

---

## Summary

| Aspect | Approach |
|--------|----------|
| Tool definitions | `tools.json` (language-agnostic) |
| Translations | `i18n/{lang}.json` per language |
| Page generation | Eleventy pagination over lang × tool |
| URL structure | `/` for default, `/{lang}/` for others |
| hreflang | Auto-generated shortcode |
| RTL support | `dir` attribute from `languages.json` |
| Adding tool | 1 JSON entry + 1 JS file + 1 partial |
| Adding language | 1 JSON file |

This architecture scales to 100 tools × 20 languages without code duplication.
