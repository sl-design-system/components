/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-use-logical', 'stylelint-order', 'stylelint-prettier'],
  rules: {
    'no-descending-specificity': null,
    'csstools/use-logical': 'always',
    'order/properties-alphabetical-order': true,
    'prettier/prettier': true,
  },
  overrides: [
    {
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
      rules: {
        'scss/operator-no-newline-after': null
      }
    },
    {
      files: ['**/*.ts'],
      customSyntax: 'postcss-lit'
    }
  ]
};
