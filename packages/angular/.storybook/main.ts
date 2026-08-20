import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type StorybookConfig } from '@storybook/angular';

const packagesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * The design system packages point their exports at TypeScript sources, which the Angular webpack
 * build cannot compile from outside this project; it silently emits an empty module instead.
 * Resolve them to their built output so that side effects like the custom element registrations in
 * `register.js` actually run.
 */
const distAliases = (): Record<string, string> => {
  const componentsDir = join(packagesDir, 'components'),
    aliases: Record<string, string> = {};

  for (const name of readdirSync(componentsDir)) {
    const dist = join(componentsDir, name, 'dist');

    if (existsSync(dist)) {
      aliases[`@sl-design-system/${name}`] = dist;
    }
  }

  aliases['@sl-design-system/locales'] = join(packagesDir, 'locales', 'dist');

  return aliases;
};

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs' // 👈 Add the docs addon
  ],
  stories: [
    '../stories/*.mdx', // 👈 Higher level MDX files, hand written
    '../stories/generated/*.mdx', // 👈 Auto-generated MDX files based on stories and *.intro.md files
    '../stories/*.stories.ts'
  ],
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/angular',
  staticDirs: [
    { from: '../../themes', to: '/themes' },
    { from: '../../../.storybook/public', to: '/storybook-static' }
  ],
  docs: {
    //👇 Configure docs
    defaultName: 'Documentation',
    docsMode: false // 👈 Set to false to show both docs and canvas tabs
  },
  webpackFinal: async config => {
    config.resolve ??= {};
    config.resolve.alias = { ...config.resolve.alias, ...distAliases() };

    return config;
  }
};

export default config;
