import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../packages/components/**/*.stories.ts'],
  addons: [
    '@sl-design-system/storybook-addon-themes',
    '@storybook/addon-a11y', 
    '@storybook/addon-actions', 
    '@storybook/addon-storysource',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        docs: false
      }
    }
  ],
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/web-components-vite',
  docs: {
    autodocs: false
  },
  staticDirs: [
    { from: '../packages/themes', to: '/themes' }
  ]
};

export default config;
