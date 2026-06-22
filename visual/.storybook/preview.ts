import { type Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import MockDate from 'mockdate';
import { updateTheme } from '../../.storybook/themes';

const DEFAULT_THEME = 'sanoma-learning',
  DEFAULT_MODE = 'light';

// Load the polyfill for the Invoker API if needed.
if (!('command' in HTMLButtonElement.prototype)) {
  const { apply } = await import('invokers-polyfill/fn');

  apply();
}

// Load the polyfill for the scrollend event if needed.
if (!('onscrollend' in window)) {
  await import('@af-utils/scrollend-polyfill' as any);
}

if (!import.meta.env?.DEV) {
  MockDate.set('2025-06-01T00:00:00Z');
}

// Apply the default theme before stories render to avoid unstyled first paint.
await updateTheme(DEFAULT_THEME, DEFAULT_MODE);

const preview: Preview = {
  loaders: [
    async () => {
      await updateTheme(DEFAULT_THEME, DEFAULT_MODE);
    }
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical'
      }
    },
    a11y: {
      options: {
        preload: false
      }
    }
  }
};

export default preview;
