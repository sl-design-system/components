import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type StorybookConfig } from '@storybook/angular-vite';

const packagesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Storybook consumes the design system the way an application does: through the built packages.
 * Vite does not map the `paths` from tsconfig.json the way the webpack builder did, and it only
 * rewrites the `.js` extensions the sources import each other with for files it considers project
 * source, so point every package at its output explicitly.
 */
const distAliases = (): Record<string, string> => {
  const componentsDir = join(packagesDir, 'components'),
    aliases: Record<string, string> = {
      '@sl-design-system/angular': join(packagesDir, 'angular', 'dist'),
      '@sl-design-system/locales': join(packagesDir, 'locales', 'dist')
    };

  for (const name of readdirSync(componentsDir)) {
    const dist = join(componentsDir, name, 'dist');

    if (existsSync(dist)) {
      aliases[`@sl-design-system/${name}`] = dist;
    }
  }

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
  framework: {
    name: '@storybook/angular-vite',
    // This is read from here rather than from the builder options in angular.json.
    options: { compodoc: false }
  },
  staticDirs: [
    { from: '../../themes', to: '/themes' },
    { from: '../../../.storybook/public', to: '/storybook-static' }
  ],
  docs: {
    //👇 Configure docs
    defaultName: 'Documentation',
    docsMode: false // 👈 Set to false to show both docs and canvas tabs
  },
  viteFinal: async config => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      logLevel: 'warn',
      resolve: { alias: distAliases() }
    });
  }
};

export default config;
