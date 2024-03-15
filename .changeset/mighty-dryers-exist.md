---
"@sl-design-system/grid": patch
---

Fixed checkbox checked value;
When a grid includes both a selection column and a filter column, a potential issue may arise. If you select a filter and then proceed to check a checkbox in the selection column, subsequently deselecting it, the checked status of the filtered item might not be visible. However, the filtering functionality remains intact.

Fixed it by changing ?checked to .checked since it should have the same effect, as both the property and attribute control whether the checkbox is checked or not.
