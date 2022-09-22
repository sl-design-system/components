module.exports = {
  stories: ['../dist/**/*.stories.js'],
  addons: [
    '../../../tools/storybook-addon-themes',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false
      }
    },
    '@storybook/addon-storysource'
  ],
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {}
  },
  staticDirs: [{ from: '../../tokens/src/themes', to: '/themes' }]
};
