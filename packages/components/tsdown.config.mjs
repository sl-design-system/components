import { importCssSheet } from '@sl-design-system/rolldown-plugin-css-sheet';
import { globSync } from 'node:fs';
import { dirname } from 'node:path';
import { defineConfig } from 'tsdown';

export default defineConfig({
  workspace: globSync('*/package.json', { cwd: new URL('.', import.meta.url) }).map(dirname),
  entry: ['src/index.ts', 'src/register.ts'],
  plugins: [importCssSheet()],

  clean: !process.argv.includes('--watch'),
  deps: {
    neverBundle: true
  },
  dts: {
    tsgo: true
  },
  exports: {
    devExports: '@sl-design-system/source',
    extensions: true
  },
  hash: false,
  platform: 'browser',
  sourcemap: true,
  treeshake: false,
  unbundle: true
});
