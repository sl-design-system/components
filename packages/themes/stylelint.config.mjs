import config from '@sl-design-system/stylelint-config';

export default {
  ...config,
  rules: {
    ...config.rules,
    'block-no-empty': null,
    'color-no-hex': null,
    'custom-property-pattern': [
      'sl-[a-z][a-zA-Z]*(-[a-z][a-zA-Z]*)*',
      {
        message: 'Expected --sl custom property prefix'
      }
    ],
    'font-family-no-missing-generic-family-keyword': null
  }
};
