import {
  eventPlugin,
  methodAndFieldPlugin,
  noPrivateFieldsPlugin,
  sortMembersPlugin
} from '@sl-design-system/scripts/cem-plugins.js';

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
    sortMembersPlugin()
  ]
}
