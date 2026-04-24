import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from '@sl-design-system/locales';
import { Preview } from '@storybook/angular';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { themes, updateTheme } from '../../../.storybook/themes';

// Lazy-loading map for locale modules
const locales = {
  'es-ES': () => import('@sl-design-system/locales/es-ES.js'),
  it: () => import('@sl-design-system/locales/it.js'),
  nl: () => import('@sl-design-system/locales/nl.js'),
  pl: () => import('@sl-design-system/locales/pl.js')
} as const;

const { setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: async locale => {
    const localeKey = locale as keyof typeof locales,
      loader = locales[localeKey];

    if (!loader) {
      console.warn(`Unsupported locale: ${locale}`);
      return { templates: {} };
    }
    return await loader();
  }
});

const preview: Preview = {
  decorators: [
    (story, { globals: { locale = sourceLocale } }) => {
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
          { value: 'light', icon: 'sun', title: 'Light mode' },
          { value: 'dark', icon: 'moon', title: 'Dark mode' }
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
          { value: 'es-ES', right: '🇪🇸', title: 'Español' },
          { value: 'it', right: '🇮🇹', title: 'Italiano' },
          { value: 'nl', right: '🇳🇱', title: 'Nederlands' },
          { value: 'pl', right: '🇵🇱', title: 'Polski' }
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
