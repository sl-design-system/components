---
'@sl-design-system/card': major
---

Complete overhaul of the card component. Some slots have the same name, but a lot of the options and css-properties have changed.

Breaking:
 - `--sl-card-media-x` and `--sl-card-media-y` have been removed
 - `--sl-card-stretch-image` is removed, using the `fit-image` attribute has a similar effect.
 - `--sl-card-media-aspect-ratio` is removed. `--sl-card-media-size` is new and has a similar function.
 - `--sl-card-orientation-breakpoint` is renamed to `--sl-card-horizontal-breakpoint`.
 - The `actions` slot is no longer used for the small button at the top right, but for a big button under the body of the card.

New:
 - `--sl-card-image-backdrop` is added.
 - The `menu-button` slot is added for buttons in the top right of the card.
