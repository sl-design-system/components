---
'@sl-design-system/button-bar': minor
---

Refactor styling to use contextual tokens.

This also adds responsive behavior to the button-bar: when the viewport is
smaller than 600px, the buttons will stack vertically. Before, you could enable
this behavior by adding the following CSS:

```css
@media (max-width: 600px) {
  sl-button-bar {
    --sl-button-bar-vertical: var(--sl-ON);
  }
}
```

This behavior is now enabled by default.
