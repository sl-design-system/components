import type { Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import 'element-internals-polyfill';
import { configureLocalization } from '@lit/localize';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { updateTheme, themes } from '../../.storybook/themes';

const { setLocale } = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['nl'],
  loadLocale: locale => import(`../packages/locales/src/${locale}.ts`)
});

const preview: Preview = {
  decorators: [

    (story, { globals: { mode = 'light', theme = 'sanoma-learning' } }) => {
      updateTheme(theme, mode);
      
      return story();
    }
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical'
      }
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    }
  }
};

export default preview;
