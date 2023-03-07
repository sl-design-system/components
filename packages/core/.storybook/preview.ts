import 'element-internals-polyfill';
import { configureLocalization } from '@lit/localize';

const { setLocale } = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['nl'],
  loadLocale: locale => import(`../dist/components/locales/${locale}.js`)
});

export const decorators = [
  (story, { globals: { locale = 'en' } }) => {
    setLocale(locale);

    return story();
  }
];

export const globalTypes = {
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
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  options: {
    storySort: (a, b) => a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true })
  }
};

