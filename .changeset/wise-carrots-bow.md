---
'@sl-design-system/button-bar': minor
'@sl-design-system/dialog': minor
---

Refactor styling to use contextual tokens.

This also removes the CSS custom properties for the responsive behavior. It now
just sets the `flex-direction` and `align-items` directly from dialog.

```css
@media (width <= 600px) {
  sl-button-bar {
    align-items: stretch;
    flex-direction: column-reverse;
  }
}
```
