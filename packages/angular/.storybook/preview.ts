import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { configureLocalization } from '@lit/localize';
import * as locales from '@sl-design-system/locales';
import { Preview } from '@storybook/angular';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { themes, updateTheme } from '../../../.storybook/themes';

const { setLocale } = configureLocalization({
  sourceLocale: locales.sourceLocale,
  targetLocales: locales.targetLocales,
  loadLocale: locale => Promise.resolve(locales[locale as (typeof locales.targetLocales)[number]])
});

const preview: Preview = {
  decorators: [
    (story, { globals: { locale = locales.sourceLocale } }) => {
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
          { value: 'dark', left: '🌛', title: 'Dark mode' }
        ]
      }
    },
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
      options: INITIAL_VIEWPORTS
    }
  }
};

export default preview;
