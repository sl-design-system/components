---
'@sl-design-system/shared': minor
---

Add a new `slot.js` export with a `getSlottedText()` utility. It returns the text assigned to a
slot, with whitespace collapsed and trimmed, or `null` when the given target is not a slot. This
makes it easy to get the slotted text in a `slotchange` handler:

```ts
#onSlotChange(event: Event & { target: HTMLSlotElement }): void {
  const text = getSlottedText(event.target);
}
```
