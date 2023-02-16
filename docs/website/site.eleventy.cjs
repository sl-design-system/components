const litPlugin = require('@lit-labs/eleventy-plugin-lit');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const markdownItAnchor = require('markdown-it-anchor');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const slugify = require('slugify');
const htmlMinifier = require('html-minifier');
const fs = require('fs');
const searchFilter = require("./src/site/scripts/filters/searchFilter.cjs");
const anchor = require('markdown-it-anchor');
const { customElementsManifestToMarkdown } = require('@custom-elements-manifest/to-markdown');

const DEV = process.env.NODE_ENV === 'DEV';
const jsFolder = DEV ? 'lib' : 'build';
const outputFolder = DEV ? 'public' : 'dist';

module.exports = function(eleventyConfig) {
  eleventyConfig
    .addPassthroughCopy({ [`${jsFolder}/site`]: 'js/' });

  eleventyConfig.addPlugin(litPlugin, {
    mode: 'worker',
    componentModules: [`./${jsFolder}/site/ssr.js`],
  });

  eleventyConfig.addWatchTarget(`./${jsFolder}/**/*.js`);

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addFilter('search', searchFilter);

  eleventyConfig.addCollection('content', collection => {
    return [...collection.getFilteredByGlob('./src/site/categories/**/*.md')];
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
    })
    .use(markdownItAttrs);

  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    files: './public/site/styles/**/*.css',
  });

  eleventyConfig.setLibrary('md', mdIt);

  eleventyConfig
    .addPassthroughCopy({ './src/shared/assets': 'assets' })
    .addPassthroughCopy('./src/site/assets')
    .addPassthroughCopy({ './../../packages/tokens/src/themes/sanoma-learning': `styles/slds-sanoma-learning` });

  const NOT_FOUND_PATH = `${outputFolder}/site/404.html`;

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

  eleventyConfig.setBrowserSyncConfig({
    middleware: [
      function (req, res, next) {
        if (/^[^.]+$/.test(req.url)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
        next();
      }
    ]
  });

  eleventyConfig.addShortcode('inlinejs', (path) => {
    if (DEV) {
      return `<script type="module" src="/js/${path}"></script>`;
    }
    const script = fs.readFileSync(`${jsFolder}/site/${path}`, 'utf8').trim();
    return `<script type="module">${script}</script>`;
  });

  eleventyConfig.addTransform('htmlMinifier', content => {
    if (process.env.NODE_ENV !== 'DEV') {
      return htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }

    return content;
  });

  const manifest = fs.readFileSync(`${outputFolder}/site/_data/custom-elements/custom-elements.json`, 'utf-8');
  // manifest.toJSON();
  const markdown = customElementsManifestToMarkdown(JSON.parse(manifest));

  fs.writeFileSync(`${outputFolder}/site/_data/custom-elements/custom-elements.md`, markdown);

  return {
    dir: {
      input: 'src/site',
      output: `${outputFolder}/site`,
    },
    passthroughFileCopy: true,
  };
};
