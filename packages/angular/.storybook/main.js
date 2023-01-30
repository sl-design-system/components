export default {
  stories: [
    "../projects/angular-core/**/*.mdx",
    "../projects/angular-core/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    '../../../tools/storybook-addon-themes',
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: {
    "name": "@storybook/angular",
    "options": {}
  },
  docs: {
    "autodocs": "tag"
  },
  staticDirs: [{ from: '../../tokens/src/themes', to: '/themes' }]
};
