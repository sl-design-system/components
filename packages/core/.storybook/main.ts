import type { StorybookConfig } from '@storybook/web-components-webpack5';

const config: StorybookConfig = {
  stories: ['../dist/components/**/*.stories.js'],
  addons: [
    '../../../tools/storybook-addon-themes',
    '@storybook/addon-links', 
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false
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
  docs: {
    autodocs: false
  },
  staticDirs: [
    { from: '../src', to: '/src' },
    { from: '../../tokens/src/themes', to: '/themes' }
  ]
};

export default config;
