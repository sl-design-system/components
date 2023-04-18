import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../projects/angular-core/**/*.stories.ts'
  ],
  addons: [
    '@sl-design-system/storybook-addon-themes',
    '@storybook/addon-a11y', 
    '@storybook/addon-actions', 
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false
      }
    }
  ],
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/angular',
  staticDirs: [
    { from: '../../themes', to: '/themes' }
  ]
};

export default config;
