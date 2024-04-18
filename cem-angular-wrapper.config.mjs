import angularWrapperPlugin from './scripts/cem-plugin-angular-wrapper.js';

export default {
  globs: ['./packages/components/**/*.ts'],
  exclude: ['./packages/components/**/*.{d,spec,stories}.ts'],
  litelement: true,
  outdir: 'test',
  packagejson: false,
  plugins: [angularWrapperPlugin({ outDir: 'packages/angular/src/wrappers/' })]
};
