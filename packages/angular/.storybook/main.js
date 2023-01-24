export default {
  stories: [
    "../projects/angular-app/src/**/*.mdx",
    "../projects/angular-app/src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
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
  }
};
