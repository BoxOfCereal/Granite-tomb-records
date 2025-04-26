const fs = require("fs");
const path = require("path");

const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");   

module.exports = function (eleventyConfig) {
  // Set directories
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/imgs");

  // Add admin directory decap
  eleventyConfig.addPassthroughCopy("src/admin");

  // Add gray-matter
  //decap
  const matter = require("gray-matter");

  //collections
  eleventyConfig.addCollection("posterImages", function (collectionApi) {
    const dir = "src/imgs/posters";
    return (
      fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => {
          const fullPath = path.join(dir, file);
          const fileContents = fs.readFileSync(fullPath, "utf8");
          const { data } = matter(fileContents);
          return {
            ...data,
            // Optionally, add a computed src for convenience
            src: data.image,
            file: file,
          };
        })
        // Optional: sort by order field if present
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    );
  });

  eleventyConfig.addCollection("bands", function (collectionApi) {
    const dir = "src/bands";
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const fullPath = path.join(dir, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);
        return {
          ...data,
          file: file,
        };
      });
  });

  eleventyConfig.addCollection("videos", function (collectionApi) {
    const dir = "src/videos";
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const fullPath = path.join(dir, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);
        return {
          ...data,
          file: file,
        };
      });
  });


  //performance
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // Add template formats
    templateFormats: ["md", "njk", "html"],
    // Add markdown plugins
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    // Add passthrough file copy
    passthroughFileCopy: true,
  };
};
