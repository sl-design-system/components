const path = require('path');
module.exports = {
  "stories": [
    // "../src/**/*.stories.mdx",
    // "../src/**/*.stories.@(js|jsx|ts|tsx)"
    "../dist/**/*.stories.js"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": {
    "name": "@storybook/web-components-webpack5",
    "options": {}
  }
}