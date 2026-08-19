---
'@sl-design-system/popover': minor
---

The popover is now positioned with CSS anchor positioning instead of floating-ui. This removes the
per-frame repositioning loop; the browser keeps the popover in place and flips it to the opposite
side when there is not enough room.

The `position` property is unchanged and is now reflected as an attribute, so all twelve positions
can be styled from CSS. Two things moved from JavaScript to CSS custom properties on the host:

| Was                      | Is now               | Default |
| ------------------------ | -------------------- | ------- |
| `Popover.offset`         | `--_offset`          | 12px    |
| `Popover.arrowPadding`   | `--_arrow-padding`   | 16px    |
| `Popover.viewportMargin` | `--_viewport-margin` | 8px     |

`--_offset` is the gap between the anchor and the popover; the space the arrow needs is reserved on
top of it, on the side facing the anchor, so the arrow no longer sits in that gap.

The popover no longer slides along its anchor to stay in view; it flips instead. In the rare case
where the browser has to push a popover back into the viewport, the arrow still points at the
anchor.

You can now also set up the anchor entirely from CSS, which is useful when the anchor lives in the
same shadow root as the popover:

```css
button {
  anchor-name: --my-anchor;
}

sl-popover {
  position-anchor: --my-anchor;
}
```
