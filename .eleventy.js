module.exports = function(eleventyConfig) {
    // Set directories
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