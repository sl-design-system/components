---
'@sl-design-system/time-field': patch
---

Accessibility improvements - fix focus management when the time picker dialog closes: the dialog now properly closes when focus leaves the component, Tab moves focus to the next focusable element outside the component, Shift+Tab moves focus to the clock button, and Escape or selecting a value restores focus to the text field.
