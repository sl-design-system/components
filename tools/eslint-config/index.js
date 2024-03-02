import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import chaiExpect from 'eslint-plugin-chai-expect';
import chaiFriendly from 'eslint-plugin-chai-friendly';
import importPlugin from 'eslint-plugin-import';
import lit from 'eslint-plugin-lit';
import mocha from 'eslint-plugin-mocha';
import prettier from 'eslint-plugin-prettier/recommended';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';
import wc from 'eslint-plugin-wc';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true
      }
    }
  },
  prettier,
  {
    plugins: {
      import: importPlugin,
      mocha,
      storybook,
      '@stylistic/js': stylisticJs,
      'chai-expect': chaiExpect,
      'chai-friendly': chaiFriendly,
      'unused-imports': unusedImports
    }
  },
  {
    plugins: { wc },
    rules: wc.configs.recommended.rules
  },
  {
    plugins: { lit },
    rules: {
      ...lit.configs.all.rules,
      // https://github.com/43081j/eslint-plugin-lit/issues/189
      'lit/no-template-arrow': 'off',
      'lit/no-template-map': 'off'
    }
  },
  {
    files: ['**/*.ts'],
    rules: {
      'no-fallthrough': [
        'error',
        {
          commentPattern: 'Break[\\s\\w]*omitted'
        }
      ],
      'no-return-await': 'off',
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true
        }
      ],
      '@stylistic/js/quotes': ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi' },
          singleline: { delimiter: 'semi', requireLast: false }
        }
      ],
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/semi': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      // https://github.com/43081j/eslint-plugin-lit/issues/188
      '@typescript-eslint/unbound-method': 'off',
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import/no-duplicates': [
        'error',
        {
          'prefer-inline': true
        }
      ],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          warnOnUnassignedImports: true
        }
      ],
      'n/no-callback-literal': 'off',
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          printWidth: 120,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'none',
          endOfLine: 'auto'
        }
      ],
      'unused-imports/no-unused-imports': 'error'
    }
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      ...chaiExpect.configs.recommended.rules,
      ...chaiFriendly.configs.recommended.rules,
      ...mocha.configs.recommended.rules,
      /**
       * The no-floating-promises rule generates false positives with
       * chai-as-promised and the expect() method in tests.
       */
      '@typescript-eslint/no-floating-promises': 'off',
      // Make sure we don't commit `it.only(...)` tests
      'mocha/no-exclusive-tests': 'error',
      // We use arrow functions by default
      'mocha/no-mocha-arrows': 'off',
      // With setup() functions inside a beforeEach, this triggers
      'mocha/no-nested-tests': 'off',
      // We use dynamically generated tests, so this generates false positives
      'mocha/no-setup-in-describe': 'off',
      // Make sure all tests start with `it('should ...`
      'mocha/valid-test-description': [
        'warn',
        {
          pattern: '^should',
          testNames: ['it']
        }
      ]
    }
  },
  {
    files: ['**/*.stories.ts'],
    rules: {
      ...storybook.configs.recommended.overrides[0].rules,
      // Within stories, we regularly have inline styles
      'lit/prefer-static-styles': 'off'
    }
  }
);
