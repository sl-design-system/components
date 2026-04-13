import { type StorybookConfig } from '@storybook/web-components-vite';
import { argv } from 'node:process';
import { injectComponentMetadata } from './helpers.ts';

const devMode = !argv.includes('build');

const config: StorybookConfig = {
  stories: [
    '*.mdx',
    'stories/*.stories.ts',
    '../packages/{checklist,components}/**/*.stories.ts'
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    'storybook-addon-tag-badges'
  ],
  core: {
    disableTelemetry: true
  },
  experimental_indexers: async indexers => injectComponentMetadata(indexers),
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
    { from: './images', to: '/images' },
    { from: './public', to: '/storybook-static' }
  ],
  viteFinal: async config => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, { logLevel: 'warn' });
  }
};

export default config;
