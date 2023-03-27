import type { StorybookConfig } from '@storybook/web-components-vite';
import { argv} from 'node:process';

const devMode = !argv.includes('build');

const config: StorybookConfig = {
  stories: [
    '../stories/*.mdx',
  ],
  addons: [
    '@sanomalearning/storybook-addon-themes',
    '@storybook/addon-a11y', 
    '@storybook/addon-actions', 
    '@storybook/addon-storysource',
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
  framework: '@storybook/web-components-vite',
  refs: {
    core: {
      title: 'Core',
      url: devMode ? 'http://localhost:6007' : '/core/'
    },
    editor: {
      title: 'Editor',
      url: devMode ? 'http://localhost:6008' : '/editor/'
    },
    grid: {
      title: 'Grid',
      url: devMode ? 'http://localhost:6009' : '/grid/'
    },
    angular: {
      title: 'Angular',
      url: devMode ? 'http://localhost:6010' : '/angular/'
    }
  },
  staticDirs: [
    { from: '../../../packages/tokens/src/themes', to: '/themes' }
  ]
};

export default config;
