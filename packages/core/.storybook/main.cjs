module.exports = {
  "stories": [
    "../dist/**/*.stories.js"
  ],
  "addons": [
    '../../../tools/storybook-addon-themes',
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": {
    "name": "@storybook/web-components-webpack5",
    "options": {}
  },
  "staticDirs": [{ from: '../../tokens/src/themes', to: '/themes' }]
}