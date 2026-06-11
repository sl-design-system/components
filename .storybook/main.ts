import { readFileSync } from 'node:fs';
import { argv } from 'node:process';
import { URL } from 'node:url';
import { type StorybookConfig } from '@storybook/web-components-vite';
import { type Plugin } from 'vite';
import { injectComponentMetadata } from './helpers.ts';

// Check if this is a CSS import with type: 'css' attribute
const cssImportRegex =
  /import\s+(\w+)\s+from\s+['"]([^'"]+\.css)['"]\s+with\s+\{\s*type:\s*['"]css['"]\s*\}/g;

// This plugin handles CSS imports with { type: 'css' } and converts them to CSSStyleSheet
const cssPlugin: Plugin = {
  name: 'css-stylesheet',
  transform(code: string, id: string) {
    if (!id.startsWith('/') || !id.includes('/examples/')) return null;

    let transformedCode = code,
      hasTransformations = false;

    transformedCode = transformedCode.replace(
      cssImportRegex,
      (_match: string, varName: string, cssPath: string) => {
        hasTransformations = true;

        const resolvedPath = new URL(cssPath, `file://${id}`).pathname;

        try {
          const cssContent = readFileSync(resolvedPath, 'utf-8');

          // Watch the .css so editing it invalidates this module and hot-reloads in dev
          // (without this, Vite caches the inlined CSS and edits don't take effect).
          this.addWatchFile(resolvedPath);

          return `
  const ${varName} = new CSSStyleSheet();
  ${varName}.replaceSync(${JSON.stringify(cssContent)});
`;
        } catch (error: unknown) {
          throw new Error(`Failed to read CSS file ${resolvedPath}: ${(error as Error).message}`);
        }
      }
    );

    return hasTransformations ? { code: transformedCode, map: null } : null;
  }
};

const devMode = !argv.includes('build');

const config: StorybookConfig = {
  stories: [
    '*.mdx',
    'stories/*.stories.ts',
    '../packages/components/**/*.stories.ts',
    '../examples/**/*.stories.ts'
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
  experimental_indexers: indexers => injectComponentMetadata(indexers),
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

    return mergeConfig(config, { logLevel: 'warn', plugins: [cssPlugin] });
  }
};

export default config;
