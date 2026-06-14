import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import * as esbuild from 'esbuild';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, resolve } from 'node:path';
import { parse as HTMLParse } from 'node-html-parser';
import { anchorHeadingsTransformer } from './src/transformers/anchor-headings.js';
import { codeExamplesTransformer } from './src/transformers/code-examples.js';
import { highlightCodeTransformer } from './src/transformers/highlight-code.js';
import { searchPlugin } from './src/plugins/search.js';
import { getComponents, getCustomElements } from './src/utils/manifest.js';
import { markdown } from './src/utils/markdown.js';

const require = createRequire(import.meta.url);
const themePath = dirname(require.resolve('@sl-design-system/sanoma-learning/package.json'));

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  let allComponents = await getComponents(),
    customElements = await getCustomElements();

  eleventyConfig.addGlobalData('customElements', customElements);

  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });

  eleventyConfig.addPassthroughCopy({
    [join(themePath, 'light.css')]: 'theme/light.css',
    [join(themePath, 'dark.css')]: 'theme/dark.css',
    [join(themePath, 'global.css')]: 'theme/global.css',
    [join(themePath, 'fonts.css')]: 'theme/fonts.css',
    [join(themePath, 'fonts')]: 'theme/fonts'
  });

  eleventyConfig.addWatchTarget('../components/dist/**/*.js');
  eleventyConfig.addWatchTarget('./custom-elements.json');
  eleventyConfig.addWatchTarget('./src/js/{main,theme}.js');
  eleventyConfig.setWatchThrottleWaitTime(1000);

  eleventyConfig.setServerOptions({
    domDiff: false
  });

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

  const componentPageUrlMap = new Map();

  eleventyConfig.addNunjucksGlobal('getComponentPageUrl', packageName => componentPageUrlMap.get(packageName) ?? null);

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
        componentPageUrlMap.set(component.packageName, page.url);
      }

      return page;
    });
  });

  eleventyConfig.addTransform('component', function (content) {
    let doc = HTMLParse(content, { blockTextElements: { code: true } });

    const transformers = [anchorHeadingsTransformer(), codeExamplesTransformer(), highlightCodeTransformer()];

    for (const transformer of transformers) {
      transformer.call(this, doc);
    }

    return doc.toString();
  });

  // Build the client-side search index. Registered after the `component` transform
  // so headings and other content transforms are already applied.
  eleventyConfig.addPlugin(
    searchPlugin({
      selectorsToIgnore: ['doc-code-example', 'doc-page-toc', 'pre'],
      getTitle: doc => (doc.querySelector('title')?.textContent ?? '').replace(/\s*\|\s*SL Design System\s*$/, ''),
      getDescription: doc => doc.querySelector('main.content p')?.textContent ?? '',
      getContent: doc => doc.querySelector('main.content')?.textContent ?? ''
    })
  );

  eleventyConfig.on('eleventy.before', async () => {
    // Scan pages for icon names in eleventyNavigation frontmatter
    const icons = new Set(),
      files = readdirSync('src', { recursive: true });

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
      includes: '../includes',
      input: 'src/content',
      layouts: '../layouts',
      output: 'dist'
    },
    templateFormats: ['njk', 'md'],
    markdownTemplateEngine: 'njk'
  };
}
