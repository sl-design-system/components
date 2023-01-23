export default {
  stories: ['../dist/components/**/*.stories.js'],
  addons: [
    '../../../tools/storybook-addon-themes',
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
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
  staticDirs: [
    { from: '../src', to: '/src' },
    { from: '../../tokens/src/themes', to: '/themes' }
  ]
};
