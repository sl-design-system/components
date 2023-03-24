import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import 'element-internals-polyfill';
import { configureLocalization } from '@lit/localize';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { Preview } from '@storybook/angular';;
import docJson from '../documentation.json';

setCompodocJson(docJson);

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
      storySort: (a, b) => a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true })
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    }
  }
};

export default preview;
