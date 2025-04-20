# Notes

## example configs
https://github.com/decaporg/decap-cms/blob/main/dev-test/config.yml


## boilerplate 
https://github.com/ixartz/Eleventy-Starter-Boilerplate

### TODO
Get the boiler pulley going, get the decap bridge, then put the custom site inwell I'm gonna take me a couple weeks
## Setup

npm install @11ty/eleventy

## Server
npx @11ty/eleventy --serve

## Auth
### Decap Bridge
https://github.com/decaporg/decap-cms/discussions/7419#discussioncomment-12630236
https://decapbridge.com/

#### problems
##### yml 404
I was getting a 404 from my yaml file but it needs to be YML as per the decap spec.

## Images not showing up in the build

I am using 11ty to generate a static website and none of the images are showing up in the Kinsta build. However, the images *do* show up in the local build, and when I build them on netlify. 

I am using these build settings for Kinsta:

### kinsta
#### kinsta url
https://granite-tomb-records-2pjy7.kinsta.page/
#### Build settings

- command: npx @11ty/eleventy
- Node version: 20
- Root directory: src
- Publish directory: _site

That produced the following logs:

#### Build logs
```
...
Apr 18 20:19:36 🛠️ Running build command: npx @11ty/eleventy 
Apr 18 20:19:36 
Apr 18 20:19:37 [11ty] Writing ./_site/admin/index.html from ./admin/index.html (liquid)
Apr 18 20:19:37 [11ty] Writing ./_site/index.html from ./index.md (liquid)
Apr 18 20:19:37 [11ty] Wrote 2 files in 0.14 seconds (v3.0.0)
Apr 18 20:19:37 
Apr 18 20:19:37 ✅ Build command succeeded
Apr 18 20:19:37 
Apr 18 20:19:38 🚀 Publishing '_site' directory...
...
```


### netlify
#### netlify url
https://6802eea2e1fb3b4fa5036609--papaya-choux-523d7b.netlify.app/
#### netlify build output
```
...
8:31:05 PM: $ npx @11ty/eleventy
8:31:06 PM: [11ty] Writing ./_site/admin/index.html from ./src/admin/index.html (njk)
8:31:06 PM: [11ty] Writing ./_site/index.html from ./src/index.md (njk)
8:31:06 PM: [11ty] Copied 7 Wrote 2 files in 0.13 seconds (v3.0.0)
8:31:06 PM: ​
8:31:06 PM: (build.command completed in 731ms)
8:31:06 PM: ​
8:31:07 PM: (Netlify Build completed in 1.2s)
...
```

### My guess
In the build logs for netlify I can see that files are being copied And the `njk` files are being built. However, in the Kinsta build logs, `liquid` files are being built, but in my configuration, I have set the template formats to `md`, `njk`, and `html`.

This leads me to think that my configuration file is not being read by Kinsta.

I have tried to run `npx @11ty/eleventy --config=eleventy.config.js` and `npx @11ty/eleventy --config=./eleventy.config.js` but both deploys failed with a file not found error.



### eleventy config
```js
// eleventy.config.js  <-Located at the root of the project
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {

    // Set directories
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/imgs");

    // Add admin directory decap
    eleventyConfig.addPassthroughCopy("admin");

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
```



