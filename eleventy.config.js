/** @type {import("@11ty/eleventy").UserConfig} */
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"assets": "assets"});
  eleventyConfig.addPassthroughCopy({"data": "data"});
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setTemplateFormats([
    "njk",
    "md",
    "html",
    "11ty.js"
  ]);

  eleventyConfig.addGlobalData("site", {
    title: "C. Fiorelli",
    description: "Chris Fiorelli, Co-founder & CTO, PathReader AI. I build the product. Previously 10+ years shipping AI/ML products at Ai2, Google, and Microsoft.",
    url: "https://cfiorelli.github.io",
    ogImage: "/assets/img/lion.png"
  });

  return {
    dir: {
      input: "src",
      includes: "templates",
      layouts: "templates",
      data: "../data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
