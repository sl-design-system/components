import config from '../../eslint.config.mjs';

/**
 * NOTE: All paths are relative to where eslint is run from,
 * in our case the root of the monorepo.
 */
export default [
  {
    ignores: [
      'packages/components/**/*.js',
      'packages/components/**/*.mjs',
      'packages/components/**/*.d.ts',
      'packages/components/**/*.scss.ts',
      'packages/components/shared/src/vendor/*.ts',
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
