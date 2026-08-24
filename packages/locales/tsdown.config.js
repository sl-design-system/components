import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/locale-codes.ts',
    'es-ES': 'src/es-ES.ts',
    it: 'src/it.ts',
    nl: 'src/nl.ts',
    pl: 'src/pl.ts'
  },
  clean: false,
  dts: {
    tsgo: true
  },
  exports: {
    // The XLF translation sources are not build entries, so tsdown does not know
    // about them. Merge them in so they stay reachable as subpath exports.
    customExports: {
      './es-ES.xlf': './src/es-ES.xlf',
      './it.xlf': './src/it.xlf',
      './nl.xlf': './src/nl.xlf',
      './pl.xlf': './src/pl.xlf'
    },
    devExports: true,
    extensions: true
  },
  hash: false,
  platform: 'browser',
  sourcemap: true,
  treeshake: false,
  unbundle: true
});
