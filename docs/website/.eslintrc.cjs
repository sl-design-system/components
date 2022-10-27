module.exports = {
  root: true,
  parser: 'espree',
    'env': {
        'browser': true,
        'es2021': true
    },
  parserOptions: {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  plugins: ['unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    'no-duplicate-imports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off'
  }
}
