---
'@sl-design-system/eslint-plugin-slds': minor
---

The `button-has-label` rule has been updated to match the rewritten tooltip. An icon-only `sl-button` now counts as labelled when it has a non-empty `tooltip` attribute, or when an `<sl-tooltip for="...">` in the same template points at its id (unless that tooltip is a `type="description"`, which describes the button instead of naming it). Tooltips that are shared between multiple elements, so with a space separated list of ids in `for`, label each of those elements.

Support for the old tooltip directive has been removed, since the directive no longer exists in `@sl-design-system/tooltip`:

- The `mustBeAriaRelationLabel` message is gone. An icon-only button that relies on `${tooltip('...', { ariaRelation: 'label' })}` for its accessible name is now reported as `missingText`.
- This also fixes a false negative: the directive check looked at the entire `html` template, so a single `ariaRelation: 'label'` anywhere in a template suppressed the rule for every `sl-button` in that template, including unrelated ones without an accessible name.
