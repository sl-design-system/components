import { setCustomElementsManifest, type Preview } from '@storybook/web-components';
import '@oddbird/popover-polyfill';
import { getComponentByTagName, getComponentPublicProperties, removeQuotes } from '@wc-toolkit/cem-utilities';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import '@sl-design-system/announcer/register.js';
import { configureLocalization } from '@lit/localize';
import * as locales from '@sl-design-system/locales';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import customElements from '../custom-elements.json';
import { updateTheme, themes } from './themes.js';

setCustomElementsManifest(customElements);

const { setLocale } = configureLocalization({
  sourceLocale: locales.sourceLocale,
  targetLocales: locales.targetLocales,
  loadLocale: locale => Promise.resolve(locales[locale])
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
    backgrounds: {
      values: [
        { name: 'Default', value: 'var(--sl-elevation-surface-base-default)' },
        { name: 'Raised', value: 'var(--sl-elevation-surface-raised-default)' },
        { name: 'Raised alternative', value: 'var(--sl-elevation-surface-raised-alternative)' },
        { name: 'Raised sunken', value: 'var(--sl-elevation-surface-raised-sunken)' },
        { name: 'Inverted', value: 'var(--sl-color-palette-grey-900)' },
      ],
      default: 'Default'
    },
    controls: {
      exclude: /^#/,
      expanded: true
    },
    docs: {
      extractArgTypes: (tagName: string) => {
        const component = getComponentByTagName(customElements, tagName);
        if (!component) {
          return undefined;
        }

        const properties = getComponentPublicProperties(component);

        return properties
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(property => {
            console.log(property);

            const { name, description, type, default: defaultValue, parsedType } = property;

            let
              control = 'object',
              options: any[] | undefined = undefined,
              required = false,
              sbType = type?.text;

            if (sbType?.endsWith(' | undefined')) {
              sbType = sbType.replace(' | undefined', '');
            } else {
              required = true;
            }

            if (type?.text === 'boolean | undefined') {
              control = 'boolean';
            } else if (type?.text === 'string | undefined') {
              control = 'text';
            }

            if ((parsedType as { text: string })?.text) {
              const types = (parsedType as { text: string }).text
                .split(' | ')
                .filter(type => type !== 'undefined')
                .map(type => removeQuotes(type));

              control = types.length > 3 ? 'select' : 'inline-radio';
              options = types;
            }

            return {
              name,
              description,
              required,
              control: {
                type: control
              },
              options,
              defaultValue: '',
              type: { name: sbType },
              table: {
                category: 'Properties',
                defaultValue: {
                  summary: defaultValue
                }
              }
            };
          })
          .reduce((acc, property) => {
            acc[property.name] = property;
            return acc;
          }, {});
      }
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['', 'Getting started']
      }
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    }
  }
};

export default preview;
