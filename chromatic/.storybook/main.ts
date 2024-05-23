import type { StorybookConfig } from '@storybook/web-components-vite';
import { argv } from 'node:process';

const devMode = !argv.includes('build');

const config: StorybookConfig = {
  stories: [
    './stories/**/*.stories.ts',
  ],
  addons: [
    '@storybook/addon-a11y', 
    '@storybook/addon-actions', 
    '@storybook/addon-storysource',
    '@storybook/addon-themes',
    'storybook-addon-pseudo-states',
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
    { from: '../../packages/themes', to: '/themes' }
  ]
};

export default config;
