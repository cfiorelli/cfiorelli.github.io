/** @type {import("@11ty/eleventy").UserConfig} */
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"assets": "assets"});
  eleventyConfig.addPassthroughCopy({"data": "data"});
  eleventyConfig.addPassthroughCopy({"about/resume.pdf": "about/resume.pdf"});
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setTemplateFormats([
    "njk",
    "md",
    "html",
    "11ty.js"
  ]);

  eleventyConfig.addGlobalData("site", {
    title: "C. Fiorelli",
    description: "Co-founder & CTO, PathReader AI. Technical PM with 10+ years shipping AI/ML products at Ai2, Google, and Microsoft. Open to advisory and consulting.",
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
