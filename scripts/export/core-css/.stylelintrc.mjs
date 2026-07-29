import config from '../../../.stylelintrc.mjs';

export default {
  ...config,
  rules: {
    ...config.rules,
    'color-no-hex': null // Disable hex color restriction for auto-generated token files
  }
};
