---
'@sl-design-system/dialog': major
---

Refactor dialog to better work on mobile devices:

- Add `primary-actions` and `secondary-actions` slots

This was done to make it easier to position the actions at the top of the dialog on mobile devices. On mobile, primary actions are positioned on both sides of the title, and secondary actions are positioned at the bottom of the body of the dialog. On desktop, the secondary actions are automatically positioned at the bottom left of the dialog.

This change also includes new `renderPrimaryActions()` and `renderSecondaryActions()` methods that can be overridden by developers who need to customize the rendering of the dialog.

The dialog automatically sets the `fill` property on the primary action buttons, depending on the size of the viewport.

- Make the dialog header and footer behave as sticky when scrolling

- Animate the dialog using only CSS
  - Add distinct entry and exit animations for both desktop & mobile
  - Support `<body>` entry/exit animations on mobile devices
  - Enable animations only when the `prefers-reduced-motion: no-preference` media feature is met
  - Disable exit animations when the `overlay` CSS property is not supported (Safari and Firefox at the time of writing)

- Use new contextual tokens
- Fix bug where the `keydown` event wasn't captured when emitted by light DOM elements
- Remove light DOM styling workaround, now that `::backdrop` styles are inherited
- Remove subtitle slot
