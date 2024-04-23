import angularWrapperPlugin from './scripts/cem-plugin-angular-wrapper.js';
import { eventDecoratorPlugin } from './scripts/cem-plugin-event-decorator.js';

export default {
  globs: ['./packages/components/**/*.ts'],
  exclude: ['./packages/components/**/*.{d,spec,stories}.ts'],
  litelement: true,
  packagejson: false,
  plugins: [
    eventDecoratorPlugin(),
    angularWrapperPlugin({ outDir: 'packages/angular/src/wrappers/' })
  ]
};
