import '@af-utils/scrollend-polyfill';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import '@sl-design-system/announcer/register.js';
import { type LocaleModule, configureLocalization } from '@lit/localize';
import * as locales from '@sl-design-system/locales';
import { type Preview } from '@storybook/web-components-vite';
import MockDate from 'mockdate';

import { updateTheme, themes, type Mode } from './themes.js';

// Set a fixed date in non-development environments for consistent Storybook snapshots
if (!import.meta.env?.DEV) {
  MockDate.set('2025-06-01T00:00:00Z');
}

const { setLocale } = configureLocalization({
  sourceLocale: locales.sourceLocale,
  targetLocales: locales.targetLocales,
  loadLocale: locale => Promise.resolve((locales as Record<string, unknown>)[locale] as LocaleModule)
});

const customViewports = {
  mobileSmall: {
    name: 'Mobile small',
    styles: {
      width: '320px',
      height: '480px'
    },
    type: 'mobile'
  },
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px'
    },
    type: 'mobile'
  },
  mobileLarge: {
    name: 'Mobile large',
    styles: {
      width: '425px',
      height: '750px'
    },
    type: 'mobile'
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px'
    },
    type: 'tablet'
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1280px',
      height: '800px'
    },
    type: 'desktop'
  },
};

const preview: Preview = {
  decorators: [
    (story, { globals: { locale = locales.sourceLocale } }) => {
      document.documentElement.lang = locale;
      setLocale(locale);

      return story();
    }
  ],
  loaders: [
    async ({ globals: { mode = 'light', theme = 'sanoma-learning' } }) => {
      await updateTheme(theme, mode as Mode);
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
    backgrounds: {
      values: [
        { name: 'Default', value: 'var(--sl-elevation-surface-base-default)' },
        { name: 'Raised', value: 'var(--sl-elevation-surface-raised-default)' },
        { name: 'Raised alternative', value: 'var(--sl-elevation-surface-raised-alternative)' },
        { name: 'Raised sunken', value: 'var(--sl-elevation-surface-raised-sunken)' },
        { name: 'Inverted', value: 'var(--sl-color-palette-grey-900)' }
      ],
      default: 'Default'
    },
    docs: {
      codePanel: true
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['', 'Getting started']
      }
    },
    viewport: {
      options: customViewports
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-valid-attr-value',
            selector: '*:not([aria-controls][aria-haspopup])'
          },
          {
            id: 'color-contrast',
            selector: '*:not([aria-disabled="true"], [disabled])'
          }
        ]
      },
      options: {
        preload: false
      }
    }
  }
};

export default preview;
