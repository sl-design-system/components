module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  plugins: [
    'stylelint-prettier'
  ],
  rules: {
    'prettier/prettier': true,
    'function-parentheses-space-inside': 'never-single-line',
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }],
    'max-nesting-depth': [1, { ignore: ['pseudo-classes'], ignoreAtRules: ['include'] }],
    'selector-attribute-quotes': ['always'],
    'selector-no-qualifying-type': [true, { ignore: ['attribute', 'class' ] }]
  }
};
