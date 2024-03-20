import config from '../../eslint.config.mjs';

/**
 * NOTE: All paths are relative to where eslint is run from,
 * in our case the root of the monorepo.
 */
export default [
  {
    ignores: [
      'packages/checklist/**/*.js',
      'packages/checklist/**/*.d.ts',
      'packages/checklist/**/*.scss.ts'
    ]
  },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: 'packages/checklist/tsconfig.json'
      }
    }
  }
];
