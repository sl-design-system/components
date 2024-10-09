/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-use-logical', 'stylelint-order', 'stylelint-prettier'],
  rules: {
    'color-named': 'never',
    'color-no-hex': true,
    'no-descending-specificity': null,
    'property-no-vendor-prefix': [
      true,
      {
        // WebKit still has this property prefixed
        ignoreProperties: ['backdrop-filter']
      }
    ],
    'csstools/use-logical': 'always',
    'order/properties-alphabetical-order': true,
    'prettier/prettier': [
      true,
      {
        arrowParens: 'avoid',
        printWidth: 120,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'none',
        endOfLine: 'auto'
      }
    ]
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
