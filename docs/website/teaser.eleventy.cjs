const htmlMinifier = require('html-minifier');

// dev mode build
const DEV = process.env.NODE_ENV === 'DEV';

module.exports = function(eleventyConfig) {
  eleventyConfig
    .addPassthroughCopy({ './src/shared/assets': 'assets' })
    .addPassthroughCopy('./src/teaser/assets');

  eleventyConfig.addTransform('htmlMinifier', content => {
    if (DEV) {
      return content;
    } else {
      return htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
  });

  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    files: './dist/teaser/**/*.css',
  });
  
  return {
    dir: {
      input: 'src/teaser',
      output: 'dist/teaser',
    },
    passthroughFileCopy: true,
  };
};
