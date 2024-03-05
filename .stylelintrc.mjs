import config from '@sl-design-system/stylelint-config';

export default {
  ...config,
  overrides: [
    {
      files: ['packages/components/**/*.scss'],
      // customSyntax: 'postcss-lit',
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
}