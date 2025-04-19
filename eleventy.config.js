const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {

    // Set directories
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/imgs");

    // Add admin directory decap
    eleventyConfig.addPassthroughCopy("src/admin");

    eleventyConfig.addCollection("galleryImages", function(collectionApi) {
        const dir = "src/imgs/gallery";
        return fs.readdirSync(dir)
          .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
          .map(file => ({
            src: `imgs/gallery/${file}`,
            alt: path.parse(file).name
          }));
      });
    return {
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site"
        },
        // Add template formats
        templateFormats: ["md", "njk", "html"],
        // Add markdown plugins
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        // Add passthrough file copy
        passthroughFileCopy: true
    };
};