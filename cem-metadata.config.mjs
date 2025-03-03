import { getTsProgram, typeParserPlugin } from "@wc-toolkit/type-parser";
import { methodAndFieldPlugin, noPrivateFieldsPlugin, sortMembersPlugin } from './scripts/cem-plugins.js';
import { eventDecoratorPlugin } from './scripts/cem-plugin-event-decorator.js';

export default {
  globs: ['packages/components/accordion/src/accordion.ts'],
  exclude: ['packages/components/**/*.{d,scss,spec,stories}.ts'],
  outdir: '.',
  litelement: true,
  plugins: [
    eventDecoratorPlugin(),
    noPrivateFieldsPlugin(),
    methodAndFieldPlugin('method'),
    methodAndFieldPlugin('field'),
    sortMembersPlugin(),
    typeParserPlugin({ debug: true })
  ],

  // Give the plugin access to the TypeScript type checker
  overrideModuleCreation({ts, globs}) {
    console.log(globs);

    const program = getTsProgram(ts, globs, 'tsconfig.base.json');

    return program
      .getSourceFiles()
      // .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
      .filter(sf => globs.find(glob => sf.fileName.includes(glob.replace('../',''))))
      .map(sf => {
        console.log(sf.fileName);
        return sf;
      })
  },

  /** Overrides default module creation: */
  // overrideModuleCreation: ({ ts, globs }) => {
    //   const program = getTsProgram(ts, globs, 'tsconfig.cem.json');

    //   return program.getSourceFiles()
    //     .filter(sf => globs.find(glob => sf.fileName.includes(glob.replace('../',''))));
  // }
}
