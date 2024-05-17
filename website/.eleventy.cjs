const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const markdownItAnchor = require('markdown-it-anchor');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const slugify = require('slugify');
const htmlMinifier = require('html-minifier');
const fs = require('fs');
const searchFilter = require("./src/scripts/filters/searchFilter.cjs");
const anchor = require('markdown-it-anchor');
const { customElementsManifestToMarkdown } = require('@custom-elements-manifest/to-markdown');
const image = require("@11ty/eleventy-img");

const jsFolder = 'build';
const outputFolder = 'dist';

module.exports = function(eleventyConfig) {
  eleventyConfig
    .addPassthroughCopy({ [`${jsFolder}`]: 'js/' });

  eleventyConfig.addWatchTarget(`./${jsFolder}/**/*.js`);

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addFilter('search', searchFilter);

  eleventyConfig.addFilter('nl2br', function(str) {
    return str.replace(/\r|\n|\r\n/g, '<br />')
  });

  eleventyConfig.addFilter('debug', function (value) {
    return JSON.stringify(value, null, 2);
  });

  eleventyConfig.addLiquidFilter("tokenName",  function(value) {
    const newValue = value?.replace(/([A-Z])/g, '.$1').trim();

    return `--sl-${newValue?.replaceAll('.', '-')}`;
  });

  eleventyConfig.addLiquidFilter("tokenDescription",  function(value) {
    const newValue = value?.replace(/([A-Z])/g, '.$1').trim();

    return newValue?.replaceAll('.', ' ');
  });

  eleventyConfig.addLiquidFilter("hasNoUnit",  function(value) {
    const lastCharacter = (value.toString())?.slice(-1);

    return /[0-9]/.test(lastCharacter);
  });

  eleventyConfig.addLiquidFilter("notContainsIconValue",  function (value) {
    return value?.indexOf('icon') === -1;
  });

  eleventyConfig.addLiquidFilter("fontWeight",  function (value) {
    if (!value) {
      return;
    }

    let weight;
    switch(value) {
      case "Regular":
        weight = "400";
        break;
      case "SemiBold":
        weight = "600";
        break;
      case "DemiBold":
        weight = "600";
        break;
      case "Bold":
        weight = "700";
        break;
      default:
        weight = value;
    }

    return weight;
  });

  eleventyConfig.addLiquidFilter('svgImage', async function(src) {
    let metadata = await image(`./src/assets/images/${src}`, {
      formats: ['svg'],
      dryRun: true
    });

    return metadata.svg[0].buffer.toString();
  });

  eleventyConfig.addCollection('content', collection => {
    return [...collection.getFilteredByGlob('./src/categories/**/*.md')];
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
    breaks: false,
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
    files: './public/styles/**/*.css',
  });

  eleventyConfig.setLibrary('md', mdIt);

  eleventyConfig
    .addPassthroughCopy('./src/assets')
    .addPassthroughCopy({ './../packages/themes/sanoma-learning': `styles/slds-sanoma-learning` });

  const NOT_FOUND_PATH = `${outputFolder}/404.html`;

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware('*', (_, res) => {
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
    if (process.env.NODE_ENV === 'production') {
      const script = fs.readFileSync(`${jsFolder}/${path}`, 'utf8').trim();

      return `<script type="module">${script}</script>`;
    } else {
      return `<script type="module" src="/js/${path}"></script>`;
    }
  });

  eleventyConfig.addTransform('htmlMinifier', content => {
    if (process.env.NODE_ENV === 'production') {
      return htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    } else {
      return content;
    }
  });

  const customElementsPath = './src/_data/custom-elements';
  const manifest = fs.readFileSync(`${customElementsPath}/custom-elements.json`, 'utf-8');
  const markdown = customElementsManifestToMarkdown(JSON.parse(manifest));

  fs.writeFileSync(`${customElementsPath}/custom-elements.md`, markdown);

  return {
    dir: {
      input: 'src',
      output: `${outputFolder}`,
      data: '_data',
    },
    passthroughFileCopy: true,
    templateFormats: ["html", "njk", "md", "11ty.js"],
  };
};
