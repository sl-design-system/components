import { importCssSheet } from '@sl-design-system/rolldown-plugin-css-sheet';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['*/index.ts'],
  plugins: [importCssSheet],

  clean: !process.argv.includes('--watch'),
  deps: {
    skipNodeModulesBundle: true
  },
  dts: {
    tsgo: true
  },
  exports: {
    devExports: true,
    extensions: true
  },
  hash: false,
  platform: 'browser',
  sourcemap: true,
  treeshake: false,
  unbundle: true
});
