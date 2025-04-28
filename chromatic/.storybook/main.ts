import { type StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: [
    './stories/**/*.stories.ts',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
    'storybook-addon-pseudo-states'
  ],
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/web-components-vite',
  staticDirs: [
    { from: '../../packages/themes', to: '/themes' }
  ],
  viteFinal: async config => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, { logLevel: 'warn' });
  }
};

export default config;
