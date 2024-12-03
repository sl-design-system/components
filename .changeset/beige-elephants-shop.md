---
'@sl-design-system/button': minor
---

Button improvements:
- Added a new `shape` property that defaults to `square` but also accepts `pill` for rounded corners
- Removed default values of `fill`, `size`, `type` and `variant` properties
- Replaced `default` variant with `secondary` variant. `secondary` is also the new default variant
- Only enable animations when `prefers-reduced-motion` is not set
- Refactor styling to use the new contextual tokens

The above changes do not change the behavior of the component.