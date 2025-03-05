import { getTsProgram, typeParserPlugin } from "@wc-toolkit/type-parser";
import { methodAndFieldPlugin, noPrivateFieldsPlugin, sortMembersPlugin } from './scripts/cem-plugins.js';
import { eventDecoratorPlugin } from './scripts/cem-plugin-event-decorator.js';

export default {
  globs: ['packages/components/**/*.ts'],
  exclude: ['packages/components/**/*.{d,scss,spec,stories}.ts'],
  outdir: '.',
  litelement: true,
  plugins: [
    eventDecoratorPlugin(),
    noPrivateFieldsPlugin(),
    methodAndFieldPlugin('method'),
    methodAndFieldPlugin('field'),
    sortMembersPlugin(),
    typeParserPlugin()
  ],

  // Give the plugin access to the TypeScript type checker
  overrideModuleCreation({ts, globs}) {
    const program = getTsProgram(ts, globs, 'tsconfig.base.json');

    return program
      .getSourceFiles()
      .filter(sf => globs.find((glob) => sf.fileName.includes(glob)));
  }
}
