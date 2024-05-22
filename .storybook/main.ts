import { type StorybookConfig } from '@storybook/web-components-vite';
import turbosnap from "vite-plugin-turbosnap";
import { argv } from 'node:process';

const devMode = !argv.includes('build');

const config: StorybookConfig = {
  stories: [
    '*.mdx',
    '../packages/{checklist,components}/**/*.stories.ts'
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-storysource',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        // docs: false
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
  refs: {
    angular: {
      title: 'Angular',
      url: devMode ? 'http://localhost:6007' : '/angular/'
    }
  },
  staticDirs: [
    { from: '../packages/themes', to: '/themes' }
  ],
  viteFinal: async (config, { configType }) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, { 
      logLevel: 'warn',
      plugins:
      configType === "PRODUCTION"
        ? [
            turbosnap({
              // This should be the base path of your storybook.  In monorepos, you may only need process.cwd().
              rootDir: config.root ?? process.cwd(),
            }),
          ]
        : []
    });
  }
};

export default config;
