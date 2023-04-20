import type { Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import 'element-internals-polyfill';
import { configureLocalization } from '@lit/localize';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { updateTheme, themes } from './themes.js';

const { setLocale } = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['nl'],
  loadLocale: locale => import(`../packages/locales/src/${locale}.ts`)
});

const preview: Preview = {
  decorators: [
    (story, { globals: { locale = 'en' } }) => {
      document.documentElement.lang = locale;
      setLocale(locale);

      return story();
    },
    (story, { globals: { mode = 'light', theme = 'sanoma-learning' } }) => {
      updateTheme(theme, mode);
      
      return story();
    }
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'sanoma-learning',
      toolbar: {
        dynamicTitle: true,
        icon: 'paintbrush',
        items: themes.map(({ id, name }) => ({ value: id, title: name }))
      }
    },
    mode: {
      name: 'Mode',
      description: 'Color mode',
      defaultValue: 'light',
      toolbar: {
        dynamicTitle: true,
        icon: 'mirror',
        items: [
          { value: 'light', left: '🌞', title: 'Light mode' }, 
          { value: 'dark', left: '🌛', title: 'Dark mode' },
        ],
      }
    },
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        dynamicTitle: true,
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
