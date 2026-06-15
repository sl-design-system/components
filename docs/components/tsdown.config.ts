import { importCssSheet } from '@magister/rolldown-plugin-css-sheet';
import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: !process.argv.includes('--watch'),
  deps: {
    onlyBundle: false
  },
  dts: {
    tsgo: true
  },
  entry: [
    'src/code/code.ts',
    'src/code-block/code-block.ts',
    'src/code-example/code-example.ts',
    'src/command-palette/command-palette.ts',
    'src/copy-button/copy-button.ts',
    'src/heading/heading.ts',
    'src/install-info/install-info.ts',
    'src/open-issue-count/open-issue-count.ts',
    'src/page-toc/page-toc.ts',
    'src/search/search.ts',
    'src/sidebar/sidebar.ts',
    'src/site-nav/nav-group.ts',
    'src/site-nav/nav-item.ts',
    'src/site-nav/site-nav.ts',
    'src/theme-switch/theme-switch.ts'
  ],
  exports: {
    customExports(exports) {
      return Object.fromEntries(
        Object.entries(exports).map(([key, value]) => {
          // Skip the root export and keys that already have a file extension (e.g. './foo.js')
          if (key === '.' || /\.[^/]+$/.test(key)) {
            return [key, value];
          }

          return [`${key}.js`, value];
        })
      );
    }
  },
  hash: false,
  platform: 'browser',
  plugins: [importCssSheet()]
});
