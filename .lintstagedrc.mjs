export default {
  'packages/components/**/*.scss': 'stylelint --quiet-deprecation-warnings --config packages/components/stylelint.config.mjs --fix',
  'packages/components/**/*.ts': 'eslint --config packages/components/eslint.config.mjs --fix',
  '*.scss': 'stylelint --quiet-deprecation-warnings --fix',
};
