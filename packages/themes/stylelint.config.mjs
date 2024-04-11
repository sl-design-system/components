import config from '@sl-design-system/stylelint-config';

export default {
  ...config,
  rules: {
    ...config.rules,
    'block-no-empty': null,
    'font-family-no-missing-generic-family-keyword': null
  }
};
