import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import markdownItAnchor from 'markdown-it-anchor';

const require = createRequire(import.meta.url);
const themePath = dirname(require.resolve('@sl-design-system/sanoma-learning/package.json'));

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.amendLibrary('md', mdLib => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
      level: [2, 3]
    });
  });

  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });

  eleventyConfig.addPassthroughCopy({
    [join(themePath, 'light.css')]: 'theme/light.css',
    [join(themePath, 'global.css')]: 'theme/global.css',
    [join(themePath, 'fonts.css')]: 'theme/fonts.css',
    [join(themePath, 'fonts')]: 'theme/fonts'
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data'
    },
    templateFormats: ['njk', 'md'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
}
