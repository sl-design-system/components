---
'@sl-design-system/tool-bar': minor
---

Toolbar improvements:

- Child buttons and menu-buttons inherit `fill`, and get `variant="inverted"` when the toolbar is `inverted`.
- Buttons and menu-buttons inside the toolbar can now have different variants and fills mixed together.

**Backwards compatibility:**
Buttons and menu-buttons used in the toolbar that already have an explicit `fill` or `variant` attribute set will keep their own value — the toolbar only propagates these attributes to elements that don't have them set explicitly.
Please check the updated Storybook examples for guidance on how to use the new features and updated [toolbar documentation](https://sanomalearning.design/categories/components/tool-bar/code/#fill-inheritance-and-variants).
