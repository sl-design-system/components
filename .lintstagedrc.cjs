module.exports = {
  '*.scss': 'stylelint --fix',
  'packages/components/**/*.ts': 'eslint --config packages/components/eslint.config.js --fix'
};
