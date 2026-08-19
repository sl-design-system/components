---
'@sl-design-system/popover': minor
---

The popover now positions itself against the element that invoked it. When a popover is opened by
an invoker — either via the `popovertarget` attribute or by passing a `source` to `showPopover()`
or `togglePopover()` — that element becomes the popover's anchor:

```js
popover.showPopover({ source: button });
```

When there is no invoker, the anchor is left untouched, so popovers using the `anchor` attribute or
the `anchorElement` property keep working as before.
