import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import MiniSearch from 'minisearch';
import { parse } from 'node-html-parser';

function collapseWhitespace(string) {
  return string.replace(/\s+/g, ' ').trim();
}

/**
 * Eleventy plugin that builds a MiniSearch index from the rendered HTML and
 * writes it to `search.json` in the output directory. The client-side search
 * (see the `doc-search` component) fetches this file and queries it in the browser.
 *
 * Based on the `searchPlugin` from the Web Awesome documentation.
 */
export function searchPlugin(options = {}) {
  options = {
    selectorsToIgnore: [],
    defaultIcon: 'far-file-lines',
    getTitle: doc => doc.querySelector('title')?.textContent ?? '',
    getDescription: doc => doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    getHeadings: doc =>
      [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6, doc-heading')].map(heading => heading.textContent ?? ''),
    getContent: doc => doc.querySelector('body')?.textContent ?? '',
    ...options
  };

  return function (eleventyConfig) {
    // Input paths of templates whose pages should be excluded (via `unlisted: true`).
    const excludedInputPaths = new Set();

    // Indexable pages keyed by URL. Keying by URL (rather than input path) means
    // paginated templates contribute one entry per generated page.
    const pagesToIndex = new Map();

    // [urlPrefix, icon] pairs collected from pages that define an `icon` in their
    // `eleventyNavigation` front matter (e.g. category sections). A result inherits
    // the icon of the longest matching prefix, so component pages show their category icon.
    const iconsByPrefix = [];

    eleventyConfig.addPreprocessor('exclude-unlisted-from-search', '*', function (data, content) {
      if (data.unlisted) {
        excludedInputPaths.add(data.page.inputPath);
      } else {
        excludedInputPaths.delete(data.page.inputPath);
      }

      return content;
    });

    // Collect [urlPrefix, icon] pairs from the navigation. Unlike preprocessors,
    // collection items expose both the resolved `url` and the navigation front matter.
    eleventyConfig.addCollection('searchIcons', collectionApi => {
      for (const item of collectionApi.getAll()) {
        const icon = item.data?.eleventyNavigation?.icon;

        if (icon && typeof item.url === 'string') {
          iconsByPrefix.push([item.url === '/' ? '/' : item.url.replace(/\/$/, ''), `far-${icon}`]);
        }
      }

      return [];
    });

    /** Resolves the icon for a page URL by finding the longest matching prefix. */
    function resolveIcon(url) {
      for (const [prefix, icon] of iconsByPrefix) {
        if (url === prefix || url.startsWith(`${prefix}/`)) {
          return icon;
        }
      }

      return options.defaultIcon;
    }

    // Runs after the content transforms (e.g. anchor headings), so the parsed
    // DOM matches what is served to the browser.
    eleventyConfig.addTransform('search', function (content) {
      const outputPath = this.page.outputPath;

      if (typeof outputPath !== 'string' || !outputPath.endsWith('.html') || excludedInputPaths.has(this.page.inputPath)) {
        return content;
      }

      const doc = parse(content, {
        blockTextElements: { script: false, noscript: false, style: false, pre: false, code: false }
      });

      // Drop content that shouldn't be searchable to keep the index small.
      options.selectorsToIgnore.forEach(selector => {
        doc.querySelectorAll(selector).forEach(el => el.remove());
      });

      const rawUrl = this.page.url === '/' ? '/' : this.page.url.replace(/\/$/, '');

      pagesToIndex.set(rawUrl, {
        title: collapseWhitespace(options.getTitle(doc)),
        description: collapseWhitespace(options.getDescription(doc)),
        headings: options.getHeadings(doc).map(collapseWhitespace).join(' '),
        content: collapseWhitespace(options.getContent(doc)),
        url: rawUrl
      });

      return content;
    });

    eleventyConfig.on('eleventy.after', async ({ directories }) => {
      const outputFilename = join(directories.output, 'search.json');

      // Longest prefixes first so the most specific category icon wins.
      iconsByPrefix.sort((a, b) => b[0].length - a[0].length);

      // Short field names keep the serialized index small.
      const searchIndex = new MiniSearch({ fields: ['t', 'h', 'c'], storeFields: [] });
      const map = [];

      let id = 0;
      for (const [, page] of pagesToIndex) {
        searchIndex.add({ id, t: page.title, h: page.headings, c: page.content });
        map[id] = { title: page.title, description: page.description, url: page.url, icon: resolveIcon(page.url) };
        id++;
      }

      await mkdir(dirname(outputFilename), { recursive: true });
      await writeFile(outputFilename, JSON.stringify({ searchIndex: searchIndex.toJSON(), map }), 'utf-8');
    });
  };
}
