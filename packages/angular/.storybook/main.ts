import { type StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs' // 👈 Add the docs addon
  ],
  stories: [
    '../stories/generated/*.mdx', // 👈 Auto-generated MDX files
    '../stories/*.stories.ts'
  ],
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/angular',
  staticDirs: [
    { from: '../../themes', to: '/themes' }
  ],
  docs: {
    //👇 Configure docs
    defaultName: 'Documentation',
    docsMode: false, // 👈 Set to false to show both docs and canvas tabs
  }
};

export default config;
