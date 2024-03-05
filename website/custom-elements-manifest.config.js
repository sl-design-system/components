import {
  eventPlugin,
  methodAndFieldPlugin,
  noPrivateFieldsPlugin,
  sortMembersPlugin
} from '@sl-design-system/scripts/cem-plugins.js';
import { getTsProgram, expandTypesPlugin } from "cem-plugin-expanded-types";

export default {
  globs: ['../packages/components/**/*.ts'],
  exclude: ['../packages/components/**/*.{d,spec,stories}.ts'],
  outdir: 'src/_data/custom-elements',
  litelement: true,
  plugins: [
    noPrivateFieldsPlugin(),
    eventPlugin(),
    methodAndFieldPlugin('method'),
    methodAndFieldPlugin('field'),
    sortMembersPlugin(),
    expandTypesPlugin()
  ],
  
  /** Overrides default module creation: */
  overrideModuleCreation: ({ts, globs}) => {
    const program = getTsProgram(ts, globs, "tsconfig.cem.json");
    return program.getSourceFiles().filter(sf => globs.find(glob => sf.fileName.includes(glob.replace('../',''))));
  },
}
