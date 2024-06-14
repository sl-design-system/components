---
'@sl-design-system/avatar': minor
---

Simplify the avatar component:
- Replace the internal badge by slotting an `<sl-badge>` element
- Replace the badge cutout SVG logic with a CSS clip-path
- Remove the `badgeText` and `status` properties (use the `sl-badge` element instead)
- Remove the `fallback` property and add a `<slot name="fallback">` instead
