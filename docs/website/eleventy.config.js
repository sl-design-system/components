import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  eleventyConfig.addWatchTarget('../components/dist/**/*.(css|js)');

  eleventyConfig.addPassthroughCopy({
    [join(themePath, 'light.css')]: 'theme/light.css',
    [join(themePath, 'dark.css')]: 'theme/dark.css',
    [join(themePath, 'global.css')]: 'theme/global.css',
    [join(themePath, 'fonts.css')]: 'theme/fonts.css',
    [join(themePath, 'fonts')]: 'theme/fonts'
  });

  eleventyConfig.on('eleventy.before', async () => {
    // Scan pages for icon names in eleventyNavigation frontmatter
    const icons = new Set();
    const files = readdirSync('src', { recursive: true });

    for (const file of files) {
      if (typeof file !== 'string' || !file.endsWith('.md')) continue;

      const content = readFileSync(join('src', file), 'utf-8'),
        frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/),
        iconMatch = frontmatterMatch?.[1].match(/^\s+icon:\s*(\S+)/m);

      if (iconMatch) {
        icons.add(iconMatch[1]);
      }
    }

    // Generate icon registration module
    let iconsJs = '// Auto-generated from page frontmatter icons\n';

    if (icons.size > 0) {
      const importNames = [...icons].map(
        name =>
          'fa' +
          name
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')
      );

      iconsJs += `import { ${importNames.join(', ')} } from '@fortawesome/pro-regular-svg-icons';\n`;
      iconsJs += `import { Icon } from '@sl-design-system/icon';\n\n`;
      iconsJs += `Icon.register(${importNames.join(', ')});\n`;
    }

    writeFileSync('src/js/icons.js', iconsJs);

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
