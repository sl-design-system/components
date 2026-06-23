---
'@sl-design-system/grid': patch
---

Accessibility improvements for row activation and selection:

- Added `aria-selected` to the active/selected row in activate and single-select modes.
- The grid now announces row activation and deactivation to screen readers.
- When you focus an already active row with the keyboard, the grid reannounces it (using `force`).

**Note:** If you use a button to trigger row activation, you should add `aria-pressed` and `aria-description` to it yourself. The grid does not set these for you. See the `'Activate'` story for an example of how to do this.
