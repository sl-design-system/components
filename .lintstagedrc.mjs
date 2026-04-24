export default {
  'packages/components/**/*.scss': [
    'stylelint --quiet-deprecation-warnings --config packages/components/stylelint.config.mjs --fix',
    'oxfmt'
  ],
  'packages/components/**/*.ts': [
    'eslint --config packages/components/eslint.config.mjs --fix',
    'oxfmt'
  ],
  '*.scss': ['stylelint --quiet-deprecation-warnings --fix', 'oxfmt'],
  '!(*.scss)': 'oxfmt'
};
