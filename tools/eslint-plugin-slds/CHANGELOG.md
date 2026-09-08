# @sl-design-system/eslint-plugin-slds

## 0.2.0

### Minor Changes

- [#3544](https://github.com/sl-design-system/components/pull/3544) [`ac75744`](https://github.com/sl-design-system/components/commit/ac75744df5693d272123778b53bba368992dad2c) - Add accessibility lint rules for SLDS form controls.

  - `slds/checkbox-group-has-label`: Require an accessible label for `<sl-checkbox-group>`.
  - `slds/checkbox-has-label`: Require an accessible label for `<sl-checkbox>`.
  - `slds/combobox-has-label`: Require an accessible label for `<sl-combobox>`.
  - `slds/date-field-has-label`: Require an accessible label for `<sl-date-field>`.
  - `slds/number-field-has-label`: Require an accessible label for `<sl-number-field>`.
  - `slds/radio-has-label`: Require an accessible label for `<sl-radio>`.
  - `slds/radio-group-has-label`: Require an accessible label for `<sl-radio-group>`.
  - `slds/select-has-label`: Require an accessible label for `<sl-select>`.
  - `slds/switch-has-label`: Require an accessible label for `<sl-switch>`.
  - `slds/text-area-has-label`: Require an accessible label for `<sl-textarea>`.
  - `slds/text-field-has-label`: Require an accessible label for `<sl-text-field>`.
  - `slds/time-field-has-label`: Require an accessible label for `<sl-time-field>`.

  Labels can be provided via `aria-label`, `aria-labelledby`, native `<label for="...">` association, or a labeled `<sl-form-field>` wrapper (depending on the control).

- [#3368](https://github.com/sl-design-system/components/pull/3368) [`dd4b09b`](https://github.com/sl-design-system/components/commit/dd4b09bc9f93c61280ffb681e00288630c655f03) - The `button-has-label` rule has been updated to match the rewritten tooltip. An icon-only `sl-button` now counts as labelled when it has a non-empty `tooltip` attribute, or when an `<sl-tooltip for="...">` in the same template points at its id (unless that tooltip is a `type="description"`, which describes the button instead of naming it). Tooltips that are shared between multiple elements, so with a space separated list of ids in `for`, label each of those elements.

  Support for the old tooltip directive has been removed, since the directive no longer exists in `@sl-design-system/tooltip`:

  - The `mustBeAriaRelationLabel` message is gone. An icon-only button that relies on `${tooltip('...', { ariaRelation: 'label' })}` for its accessible name is now reported as `missingText`.
  - This also fixes a false negative: the directive check looked at the entire `html` template, so a single `ariaRelation: 'label'` anywhere in a template suppressed the rule for every `sl-button` in that template, including unrelated ones without an accessible name.

### Patch Changes

- [#3579](https://github.com/sl-design-system/components/pull/3579) [`8a24328`](https://github.com/sl-design-system/components/commit/8a2432811c51b1b23cc33caa2aeebf68273f6512) - Fix linting for new tooltip implementation

## 0.1.1

### Patch Changes

- [#3233](https://github.com/sl-design-system/components/pull/3233) [`79ea631`](https://github.com/sl-design-system/components/commit/79ea631dd5ac73bdaa3639a0a183866cc6670f0d) - Fixed a false positive in `slds/singleline-html-template-trimmed` where spaces between expressions in single-line `html` template literals were incorrectly reported as leading or trailing whitespace.

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
