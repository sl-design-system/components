import type { Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import 'element-internals-polyfill';
import { configureLocalization } from '@lit/localize';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const { setLocale } = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['nl'],
  loadLocale: locale => import(`../src/locales/${locale}.ts`)
});

const preview: Preview = {
  decorators: [
    (story, { globals: { locale = 'en' } }) => {
      document.documentElement.lang = locale;
      setLocale(locale);

      return story();
    }
  ],
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', right: '🇺🇸', title: 'English' },
          { value: 'nl', right: '🇳🇱', title: 'Nederlands' }
        ]
      }
    }
  },
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
