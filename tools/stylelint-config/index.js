/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-use-logical', 'stylelint-order', 'stylelint-prettier'],
  rules: {
    'no-descending-specificity': null,
    'csstools/use-logical': 'always',
    'order/properties-alphabetical-order': true,
    'prettier/prettier': true,
    'scss/operator-no-newline-after': null
  },
  overrides: [
    {
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss']
    },
    {
      files: ['**/*.ts'],
      customSyntax: 'postcss-lit'
    }
  ]
};
