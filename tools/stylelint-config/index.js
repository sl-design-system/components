/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-use-logical', 'stylelint-order', 'stylelint-prettier'],
  rules: {
    'custom-property-pattern': [
      '((_[a-z]+)|sl)(-[a-z]+)*',
      {
        message: 'Expected --sl or --_ custom property prefix'
      }
    ],
    'no-descending-specificity': null,
    'csstools/use-logical': 'always',
    'order/properties-alphabetical-order': true,
    'prettier/prettier': true,
    'scss/operator-no-newline-after': null
  }
};
