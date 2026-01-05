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
    description: "Technical Product & Program Manager building production AI systems, computer vision products, and data platforms. 10+ years experience with Ai2, Google, Microsoft.",
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
