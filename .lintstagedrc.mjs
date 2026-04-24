export default {
  'packages/components/**/*.scss': [
    'stylelint --quiet-deprecation-warnings --config packages/components/stylelint.config.mjs --fix',
    'oxfmt --no-error-on-unmatched-pattern'
  ],
  'packages/components/**/*.ts': [
    'eslint --config packages/components/eslint.config.mjs --fix',
    'oxfmt --no-error-on-unmatched-pattern'
  ],
  '*.scss': [
    'stylelint --quiet-deprecation-warnings --fix',
    'oxfmt --no-error-on-unmatched-pattern'
  ],
  '!(*.scss)': 'oxfmt --no-error-on-unmatched-pattern'
};
