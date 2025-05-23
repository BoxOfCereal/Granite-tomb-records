const fs = require("fs");
const path = require("path");

const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  // Set directories
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/imgs");

  // Add admin directory decap
  eleventyConfig.addPassthroughCopy("src/admin");

  // Passthrough file copy for robots.txt and other static files
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Add gray-matter
  //decap
  const matter = require("gray-matter");

  // Add date filter
  eleventyConfig.addFilter("date", function(dateString, format) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  });

  //collections
  // eleventyConfig.addCollection("posterImages", function (collectionApi) {
  //   const dir = "src/imgs/posters";
  //   return (
  //     fs
  //       .readdirSync(dir)
  //       .filter((file) => file.endsWith(".md"))
  //       .map((file) => {
  //         const fullPath = path.join(dir, file);
  //         const fileContents = fs.readFileSync(fullPath, "utf8");
  //         const { data } = matter(fileContents);
  //         return {
  //           ...data,
  //           // Optionally, add a computed src for convenience
  //           src: data.image,
  //           file: file,
  //         };
  //       })
  //       // Optional: sort by order field if present
  //       .sort((a, b) => (a.order || 0) - (b.order || 0))
  //   );
  // });

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

  eleventyConfig.addCollection("shows", function (collectionApi) {
    const dir = "src/shows";
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const fullPath = path.join(dir, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);
        return {
          ...data,
          body: data.body,
          event_url: data.event_url,
          tickets: data.tickets,
          file: file,
          url: `/shows/${file.replace(/\.md$/, '')}/`,
          date: data.date ? new Date(data.date) : null
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

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // output image formats
    formats: ["avif", "svg", "webp", "jpeg"],

    // output image widths
    widths: ["auto", 200, 400],

    //I think this is supposed toskip over SVG's however my mainhero element is in SVG
    svgShortCircuit: true,

    // optional, attributes assigned on <img> nodes override these values
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  //filters
  eleventyConfig.addFilter("unique", (value) => Array.from(new Set(value)));

  eleventyConfig.addFilter("map", function (arr, { attribute }) {
    if (!Array.isArray(arr)) return [];
    console.log(attribute);
    arr.map((item) => {
      console.log(item[attribute]);
    });
    return arr.map((item) => item[attribute]);
  });

  eleventyConfig.addFilter("sort", function (arr, prop) {
    if (!Array.isArray(arr)) return [];
    return arr.sort((a, b) => a[prop] - b[prop]);
  });

  eleventyConfig.addNunjucksFilter("slice", function (arr, start, end) {
    if (!Array.isArray(arr)) return [];
    return arr.slice(start, end);
  });


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
