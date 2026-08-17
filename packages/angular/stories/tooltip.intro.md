Use the tooltip directive by adding `slTooltip` to a focusable element.

```html
<sl-button slTooltip="Tooltip with default styling">Default tooltip</sl-button>
```

The directive creates an `sl-tooltip` element at runtime. This element is not part of your Angular
component template, so template scoped styles might not apply to it. Use global CSS selectors to
style tooltips created by the directive.

```css
/* Global styling for all generated tooltips by directive */
sl-tooltip {
  max-inline-size: 70px;
}

/* Scoped styling for one trigger */
.styled-tooltip-trigger + sl-tooltip {
  max-inline-size: 70px;
  position-area: right;
}
```
