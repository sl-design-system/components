import config from '../../eslint.config.mjs';

/** NOTE: All paths are relative to where eslint is run from, in our case the root of the monorepo. */
export default [
  {
    ignores: [
      '**/*.[json|md]',
      'packages/components/**/*.d.ts',
      'packages/components/**/*.scss.ts',
      'packages/components/shared/src/vendor/*.ts'
    ]
  },
  ...config,
  {
    files: ['packages/components/**/*.spec.ts'],
    rules: {
      'slds/button-has-label': 'off',
      'slds/checkbox-group-has-label': 'off',
      'slds/checkbox-has-label': 'off',
      'slds/combobox-has-label': 'off',
      'slds/date-field-has-label': 'off',
      'slds/multiline-html-template': 'off',
      'slds/number-field-has-label': 'off',
      'slds/radio-has-label': 'off',
      'slds/radio-group-has-label': 'off',
      'slds/select-has-label': 'off',
      'slds/singleline-html-template-trimmed': 'off',
      'slds/switch-has-label': 'off',
      'slds/text-area-has-label': 'off',
      'slds/text-field-has-label': 'off',
      'slds/time-field-has-label': 'off'
    }
  }
];
