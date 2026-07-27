---
'@sl-design-system/eslint-plugin-slds': minor
---

Add accessibility lint rules for SLDS form controls.

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
- `slds/time-field-has-label`: Require an accessible label for `<sl-time-field>`.

Labels can be provided via `aria-label`, `aria-labelledby`, native `<label for="...">` association, or a labeled `<sl-form-field>` wrapper (depending on the control).
