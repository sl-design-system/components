export default {
  stories: [
    "../projects/angular-app/**/*.mdx",
    "../projects/angular-app/**/*.stories.@(js|jsx|ts|tsx)",
    "../projects/core/**/*.mdx",
    "../projects/core/**/*.stories.@(js|jsx|ts|tsx)"
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
