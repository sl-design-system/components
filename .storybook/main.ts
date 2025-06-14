import { type StorybookConfig } from '@storybook/web-components-vite';
import { argv } from 'node:process';

const devMode = !argv.includes('build');

const config: StorybookConfig = {
  stories: [
    '*.mdx',
    'stories/*.stories.ts',
    '../packages/{checklist,components}/**/*.stories.ts'
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/web-components-vite',
  refs: {
    angular: {
      title: 'Angular',
      url: devMode ? 'http://localhost:6007' : '/angular/'
    }
  },
  staticDirs: [
    { from: '../node_modules/emojibase-data', to: '/emoji' },
    { from: '../packages/themes', to: '/themes' },
    { from: './images', to: '/images' }
  ],
  viteFinal: async config => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, { logLevel: 'warn' });
  }
};

export default config;
