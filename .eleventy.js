module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Ignore markdown files in images folder
  eleventyConfig.ignores.add("src/images/*.md");

  // Watch for changes in CSS/JS
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // Custom filter to find tool by ID
  eleventyConfig.addFilter("findById", function(array, id) {
    return array.find(item => item.id === id);
  });

  // Get current date for sitemap
  eleventyConfig.addShortcode("currentDate", () => {
    return new Date().toISOString().split('T')[0];
  });

  // Get current year for copyright
  eleventyConfig.addShortcode("year", () => {
    return new Date().getFullYear().toString();
  });

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
