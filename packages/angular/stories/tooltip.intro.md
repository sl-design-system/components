You can use the tooltip as a directive by adding the `slTooltip` attribute to any element.

You can customize tooltip styling with CSS.

Global tooltip styling:

```css
sl-tooltip {
  max-inline-size: 200px;
  position-area: right;
}
```

Or scope styling to a specific trigger using the tooltip part:

```css
sl-button::part(tooltip) {
  max-inline-size: 200px;
  position-area: right;
}
```
