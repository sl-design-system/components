export default {
  stories: ['../dist/components/**/*.stories.js'],
  addons: [
    '../../../tools/storybook-addon-themes',
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
  core: {
    disableTelemetry: true
  },
  staticDirs: [{ from: '../../tokens/src/themes', to: '/themes' }]
};
