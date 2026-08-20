import { importCssSheet } from '@sl-design-system/rolldown-plugin-css-sheet';
import { type StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['./stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
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
  staticDirs: [
    { from: '../../packages/themes', to: '/themes' },
    { from: '../../.storybook/images', to: '/images' }
  ],
  viteFinal: async config => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, { logLevel: 'warn', plugins: [importCssSheet()] });
  }
};

export default config;
