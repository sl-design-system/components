import config from '../../eslint.config.js';

/**
 * NOTE: All paths are relative to where eslint is run from,
 * in our case the root of the monorepo.
 */
export default [
  {
    ignores: [
      'packages/themes/**/*.js',
      'packages/themes/**/*.d.ts',
      'packages/themes/core**/*'
    ]
  },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: 'packages/components/tsconfig.json'
      }
    }
  }
];
