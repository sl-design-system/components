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
 - `padding` is repaced by `media-margin`.
 - `explicit-height` has been removed.
 - `height` is removed, the text (or grid in the case of subgrid) is leading, the image stretches.
 - `media-position` has been removed.

New:
 - `--sl-card-image-backdrop` is added. This sets the background-property of the backdrop.
 - The `menu-button` slot is added for buttons in the top right of the card.
 - `subgrid` is added letting you control the layout of the card by the grid of the container where the cards are placed
 - `fit-image` is added, When set the image won't be stretched and cropped to fill the whole container, but instead shown fully, with a margin around it.
   In horizontal mode this will need the card to have an explicit image size set, either by subgrid or by `--sl-card-media-size`.
 - `image-backdrop` is added, When `fit-image` is set, setting this will create a blurred copy of the image in the margin around the image.
 - `media-margin` is added. Adds a little margin around the image.
