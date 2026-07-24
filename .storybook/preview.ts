// eslint-disable-next-line import/order
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { configureLocalization } from '@lit/localize';
import '@sl-design-system/announcer/register.js';
import { sourceLocale, targetLocales } from '@sl-design-system/locales';
import { type Preview } from '@storybook/web-components-vite';
import MockDate from 'mockdate';
import { type Mode, themes, updateTheme } from './themes.js';

// Load the polyfill for the Invoker API if needed
if (!('command' in HTMLButtonElement.prototype)) {
  const { apply } = await import('invokers-polyfill/fn');

  apply();
}

// Load the polyfill for the scrollend event if needed
if (!('onscrollend' in window)) {
  await import('@af-utils/scrollend-polyfill' as any);
}

// Set a fixed date in non-development environments for consistent Storybook snapshots
if (!import.meta.env?.DEV) {
  MockDate.set('2025-06-01T00:00:00Z');
}

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
  }
};

const preview: Preview = {
  decorators: [
    (story, { globals: { locale = sourceLocale } }) => {
      document.documentElement.lang = locale;

      try {
        // Try and set the @lit/localize locale; will throw an error if the
        // locale is not available. Ignore those errors since the locale can
        // still be valid for components that use the Intl APIs.
        void setLocale(locale);
      } catch {
        // empty
      }

      return story();
    },
    (story, { globals: { userGroup = 'advanced' } }) => {
      document.documentElement.setAttribute('data-User-Group', userGroup);

      return story();
    },
    (story, { globals: { mode = 'light' } }) => {
      //TODO if you remove these it takes the user preference from the system.
      // document.documentElement.style.setProperty('--color-scheme', mode);
      // document.documentElement.style.setProperty('color-scheme', mode);

      return story();
    },
    (story, { globals: { viewport } }) => {
      document.documentElement.setAttribute('data-Device', viewport.value || 'desktop');
      return story();
    }
  ],
  loaders: [
    async ({ globals: { theme = 'sanoma-learning' } }) => {
      await updateTheme(theme);
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
    userGroup: {
      name: 'Target Group',
      defaultValue: 'advanced',
      toolbar: {
        dynamicTitle: true,
        icon: 'users',
        items: ['early', 'developing', 'advanced']
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
      defaultValue: 'en-GB',
      toolbar: {
        dynamicTitle: true,
        icon: 'globe',
        items: [
          { value: 'de', right: '🇩🇪', title: 'Deutsch' },
          { value: 'en-GB', right: '🇬🇧', title: 'English (UK)' },
          { value: 'es-ES', right: '🇪🇸', title: 'Español' },
          { value: 'fr', right: '🇫🇷', title: 'Français' },
          { value: 'it', right: '🇮🇹', title: 'Italiano' },
          { value: 'nl', right: '🇳🇱', title: 'Nederlands' },
          { value: 'nl-BE', right: '🇧🇪', title: 'Nederlands (België)' },
          { value: 'no', right: '🇳🇴', title: 'Norsk' },
          { value: 'pl', right: '🇵🇱', title: 'Polski' },
          { value: 'fi', right: '🇫🇮', title: 'Suomi' },
          { value: 'sv', right: '🇸🇪', title: 'Svenska' }
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
        order: ['Welcome', 'Getting started']
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
