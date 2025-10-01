# @sl-design-system/eslint-plugin-slds

## 0.1.0

### Minor Changes

- [#2647](https://github.com/sl-design-system/components/pull/2647) [`d3b9d45`](https://github.com/sl-design-system/components/commit/d3b9d4512e33dbf10a2aa28efc94a54b93002285) - Improved 'button-has-label' rule: it now also accepts the tooltip directive when `ariaRelation: 'label'` is set.

## 0.0.1

### Patch Changes

- [#1995](https://github.com/sl-design-system/components/pull/1995) [`56a1e74`](https://github.com/sl-design-system/components/commit/56a1e74af0c814f8138301238e65b75f231a6330) - Created new eslint plugin with 3 rules:
  - `slds/button-has-label` which ensures that all buttons have a label
  - `slds/multiline-html-template` which will ensure that multiline html templates have a newline after the opening backtick and a newline before the closing backtick; this helps prettier to format the code correctly
  - `slds/singleline-html-template-trimmed` which will trim leading and trailing whitespace from singleline html templates; sometimes prettier will collapse multiline html templates into a single line, but won't trim the leading/trailing whitespace

  These rules have also been added to the `@sl-design-system/eslint-config` package.
