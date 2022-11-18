const litPlugin = require('@lit-labs/eleventy-plugin-lit');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const markdownItAnchor = require('markdown-it-anchor');
const markdownIt = require('markdown-it');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const slugify = require('slugify');
const htmlMinifier = require('html-minifier');
const fs = require('fs');
const searchFilter = require("./src/scripts/filters/searchFilter.cjs");
const CleanCSS = require('clean-css');

// dev mode build
const DEV = process.env.NODE_ENV === 'DEV';
// where the JS files are outputted
const jsFolder = DEV ? 'lib' : 'build';
// where to output 11ty output
const outputFolder = DEV ? 'public' : 'dist';

module.exports = function(eleventyConfig) {
  eleventyConfig
    .addPassthroughCopy({ [`${jsFolder}/`]: 'js/' })
    // .addPassthroughCopy('./src/styles')
    // .addPassthroughCopy('./src')
    /*.addPassthroughCopy('./src/categories')*/;

  eleventyConfig.addPlugin(litPlugin, {
    mode: 'worker',
    // componentModules: [
    //   './src/js/demo-greeter.js',
    //   './src/js/my-element.js',
    // ],
    componentModules: [`./${jsFolder}/ssr.js`],
  });

  // add this for 11ty's --watch flag. We don't use it in this example
  eleventyConfig.addWatchTarget(`./${jsFolder}/**/*.js`);

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addFilter("search", searchFilter);

  eleventyConfig.addCollection("content", collection => {
    return [...collection.getFilteredByGlob("./src/categories/**/*.md")];
  });

  function removeExtraText(s) {
    let newStr = String(s).replace(/New\ in\ v\d+\.\d+\.\d+/, '');
    newStr = newStr.replace(/Coming\ soon\ in\ v\d+\.\d+\.\d+/, '');
    newStr = newStr.replace(/⚠️/g, '');
    newStr = newStr.replace(/[?!]/g, '');
    newStr = newStr.replace(/<[^>]*>/g, '');
    return newStr;
  }

  function markdownItSlugify(s) {
    return slugify(removeExtraText(s), { lower: true, remove: /[:’'`,]/g });
  }

  const anchor = require('markdown-it-anchor');

  let mdIt = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  })
    .disable('code')
    .use(markdownItAnchor, {
      permalink: anchor.permalink.headerLink(),
      slugify: markdownItSlugify,
      permalinkBefore: true,
      permalinkClass: 'direct-link',
      permalinkSymbol: '#',
      level: [1, 2, 3, 4],
    });

  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    files: './public/css/**/*.css',
  });

  eleventyConfig.setLibrary('md', mdIt/*markdownIt(options)*/);

  eleventyConfig.addPassthroughCopy('./src/assets');

  const NOT_FOUND_PATH = `${outputFolder}/404.html`;

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware('*', (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }

          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  /**
   * Inline the Rollup-bundled version of a JavaScript module. Path is relative
   * to ./lib or ./build.
   *
   * In dev mode, instead directly import the module, which has already been
   * symlinked directly to the TypeScript output directory.
   */
  eleventyConfig.addShortcode('inlinejs', (path) => {
    console.log('path', path);
    if (DEV) {
      return `<script type="module" src="/js/${path}"></script>`;
    }
    const script = fs.readFileSync(`${jsFolder}/${path}`, 'utf8').trim();
    return `<script type="module">${script}</script>`;
  });

  eleventyConfig.addTransform('htmlMinifier', content => {
    if (process.env.NODE_ENV === 'production') {
      return htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  /**
   * Bundle, minify, and inline a CSS file. Path is relative to ./site/css/.
   *
   * In dev mode, instead import the CSS file directly.
   */
  // eleventyConfig.addShortcode('inlinecss', (path) => {
  //   if (DEV) {
  //     return `<link rel="stylesheet" href="/css/${path}">`;
  //   }
  //   const result = new CleanCSS({ inline: ['local'] }).minify([
  //     `./src/styles/${path}`,
  //   ]);
  //   if (result.errors.length > 0 || result.warnings.length > 0) {
  //     throw new Error(
  //       `CleanCSS errors/warnings on file ${path}:\n\n${[
  //         ...result.errors,
  //         ...result.warnings,
  //       ].join('\n')}`
  //     );
  //   }
  //   return `<style>${result.styles}</style>`;
  // });

  return {
    dir: {
      input: 'src',
      output: outputFolder,
      //'public',
    },
    passthroughFileCopy: true,
  };
};
