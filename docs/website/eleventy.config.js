import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';
import { parse as HTMLParse } from 'node-html-parser';
import * as esbuild from 'esbuild';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import { codeExamplesTransformer } from './src/transformers/code-examples.js';
import { getComponents } from './src/utils/manifest.js';
import { markdown } from './src/utils/markdown.js';

const require = createRequire(import.meta.url);
const themePath = dirname(require.resolve('@sl-design-system/sanoma-learning/package.json'));

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  let allComponents = await getComponents();

  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });

  eleventyConfig.addPassthroughCopy({
    [join(themePath, 'light.css')]: 'theme/light.css',
    [join(themePath, 'dark.css')]: 'theme/dark.css',
    [join(themePath, 'global.css')]: 'theme/global.css',
    [join(themePath, 'fonts.css')]: 'theme/fonts.css',
    [join(themePath, 'fonts')]: 'theme/fonts'
  });

  eleventyConfig.addWatchTarget('../../custom-elements.json');
  eleventyConfig.addWatchTarget('../components/dist/**/*.(css|js)');
  eleventyConfig.setWatchThrottleWaitTime(10); // in milliseconds

  eleventyConfig.on('eleventy.beforeWatch', async changes => {
    let updateComponents = false;

    for (const change of changes) {
      if (change.includes('custom-elements.json') || change.includes('package.json')) {
        updateComponents = true;
        break;
      }
    }

    if (updateComponents) {
      allComponents = await getComponents();
    }
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.setLibrary('md', markdown);

  eleventyConfig.addNunjucksGlobal('getComponent', tagName => {
    const component = allComponents.find(c => c.tagName === tagName);
    if (!component) {
      throw new Error(
        `Unable to find "<${tagName}>". Make sure the file name is the same as the tag name (without prefix).`
      );
    }
    return component;
  });

  eleventyConfig.addCollection('componentPages', function (collectionApi) {
    const componentPages = collectionApi.getFilteredByGlob(
      join(eleventyConfig.directories.input, 'components/**/*.md')
    );

    return componentPages.map(page => {
      const componentName = basename(page.inputPath, '.md'),
        tagName = `sl-${componentName}`,
        component = allComponents.find(c => c.tagName === tagName);

      // Add component to the page's data
      if (component) {
        page.data.component = component;
      }

      return page;
    });
  });

  eleventyConfig.addTransform('component', function (content) {
    let doc = HTMLParse(content, { blockTextElements: { code: true } });

    const transformers = [codeExamplesTransformer()];

    for (const transformer of transformers) {
      transformer.call(this, doc);
    }

    return doc.toString();
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
      data: '../data',
      includes: '../includes',
      input: 'src/content',
      layouts: '../layouts',
      output: 'dist'
    },
    templateFormats: ['njk', 'md'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
}
