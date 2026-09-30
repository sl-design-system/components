import { argv } from 'node:process';
import { importCssSheet } from '@sl-design-system/rolldown-plugin-css-sheet';
import { type StorybookConfig } from '@storybook/web-components-vite';
import { injectComponentMetadata } from '../.storybook/helpers.ts';

/**
 * Minimal render harness for the Figma-to-code reference batch.
 *
 * Identical to `.storybook/main.ts` except that the story glob covers **only** the generated runs
 * under `examples/lit/src/_runs/`. The repository-wide Storybook also loads 33 stories that import
 * Font Awesome Pro from a private registry; without a token those fail to resolve and take the
 * whole dev server with them. None of the components the generated runs use import Font Awesome, so
 * narrowing the glob removes the dependency instead of working around it.
 *
 * See `runs/BATCH-RUNBOOK.md`.
 */
const config: StorybookConfig = {
  stories: ['../examples/lit/src/_runs/**/*.stories.ts'],
  addons: [],
  core: {
    disableTelemetry: true
  },
  experimental_indexers: indexers => injectComponentMetadata(indexers),
  framework: '@storybook/web-components-vite',
  staticDirs: [
    { from: '../packages/themes', to: '/themes' },
    { from: '../.storybook/images', to: '/images' },
    { from: '../.storybook/public', to: '/storybook-static' },
    // One agreed place for images a run exports from Figma. The pipeline has no asset step, so
    // this is usually empty and a run's `<img>` tags 404 — recorded as a Stage 4 discrepancy
    // rather than papered over with a placeholder.
    { from: '../runs/harness/assets', to: '/assets' }
  ],
  viteFinal: async config => {
    const { defaultClientConditions, mergeConfig } = await import('vite');

    return mergeConfig(config, {
      logLevel: 'warn',
      plugins: [importCssSheet()],
      resolve: {
        conditions: [
          ...(config.resolve?.conditions ?? defaultClientConditions),
          '@sl-design-system/source'
        ]
      }
    });
  }
};

export default config;
