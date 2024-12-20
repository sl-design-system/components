import { type StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../stories/*.stories.ts'
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
