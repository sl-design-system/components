const litPlugin = require('@lit-labs/eleventy-plugin-lit');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownItAnchor = require("markdown-it-anchor");
const markdownIt = require("markdown-it");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const slugify = require("slugify");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(litPlugin, {
        mode: 'worker',
        componentModules: [
            './src/js/demo-greeter.js',
            './src/js/my-element.js'
        ],
    });

    module.exports = function(eleventyConfig) {
        eleventyConfig.addPlugin(syntaxHighlight);
    };

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // let markdownIt = require("markdown-it");
    // let options = {
    //     html: true,
    // };

  // const md = markdownIt();

  function removeExtraText(s) {
    let newStr = String(s).replace(/New\ in\ v\d+\.\d+\.\d+/, "");
    newStr = newStr.replace(/Coming\ soon\ in\ v\d+\.\d+\.\d+/, "");
    newStr = newStr.replace(/⚠️/g, "");
    newStr = newStr.replace(/[?!]/g, "");
    newStr = newStr.replace(/<[^>]*>/g, "");
    return newStr;
  }

  function markdownItSlugify(s) {
    return slugify(removeExtraText(s), { lower: true, remove: /[:’'`,]/g });
  }

   const anchor = require('markdown-it-anchor');

  let mdIt = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  })
    .disable('code') // disable indent -> code block
    .use(markdownItAnchor, {
      // permalink: true,
      permalink: anchor.permalink.headerLink(),
      slugify: markdownItSlugify,
      permalinkBefore: true,
      permalinkClass: "direct-link",
      permalinkSymbol: "#",
      level: [1,2,3,4]
    });

/*    .use(markdownItAnchor, {
    // level: 1,
    level: [1,2,3,4],
    // slugify: string => string,
    permalink: true,
    // renderPermalink: (slug, opts, state, permalink) => {},
    permalinkClass: 'header-anchor',
    permalinkSymbol: '#',
    permalinkBefore: false
  });*/


  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    files: './public/css/**/*.css'
  });

    eleventyConfig.setLibrary("md", mdIt/*markdownIt(options)*/);

    eleventyConfig.addPassthroughCopy('./src/assets');

  const fs = require("fs");
  const NOT_FOUND_PATH = "public/404.html";

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }

          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      }
    }
  });

    return {
        dir: {
            input: "src",
            output: "public"
        },
        passthroughFileCopy: true,
    }
};
