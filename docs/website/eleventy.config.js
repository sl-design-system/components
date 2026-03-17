import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import * as esbuild from 'esbuild';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import markdownItAnchor from 'markdown-it-anchor';

const require = createRequire(import.meta.url);
const themePath = dirname(require.resolve('@sl-design-system/sanoma-learning/package.json'));

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.amendLibrary('md', mdLib => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
      level: [2, 3]
    });
  });

  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });

  eleventyConfig.addWatchTarget('../components/dist/**/*.(css|js)');

  eleventyConfig.addPassthroughCopy({
    [join(themePath, 'light.css')]: 'theme/light.css',
    [join(themePath, 'global.css')]: 'theme/global.css',
    [join(themePath, 'fonts.css')]: 'theme/fonts.css',
    [join(themePath, 'fonts')]: 'theme/fonts'
  });

  eleventyConfig.on('eleventy.before', async () => {
    await esbuild.build({
      entryPoints: ['src/js/main.js'],
      bundle: true,
      format: 'esm',
      outdir: 'dist/js',
      supported: { decorators: false }
    });
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
