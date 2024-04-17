import config from '@sl-design-system/stylelint-config';

export default {
  ignoreFiles: [
    '**/*.js',
    '**/*.json',
    '**/*.map',
    '**/*.mjs',
    '**/*.md',
    '**/*.ts',
    '**/*.tsbuildinfo'
  ],
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.scss'],
      rules: {
        'custom-property-pattern': [
          '((_[a-z]+)|sl)(-[a-z]+)*',
          {
            message: 'Expected --sl or --_ custom property prefix'
          }
        ]
      }
    }
  ]
};
