import { defineConfig } from 'tsdown';

export default defineConfig({
  workspace: '*',
  entry: ['src/index.ts', 'src/register.ts'],
  exports: {
    devExports: true,
    extensions: true
  },
  platform: 'browser',
  unbundle: true,
  sourcemap: true,
  dts: {
    tsgo: true
  },
  deps: {
    skipNodeModulesBundle: true
  }
});
