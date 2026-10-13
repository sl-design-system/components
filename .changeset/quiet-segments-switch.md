---
'@sl-design-system/segmented-control': minor
---

Add new `<sl-segmented-control>` component: an unordered list of buttons for switching between a small set of related options.

- Supports `shape` (`rect`, `pill`), `size` (`md`, `lg`), `fill` (`solid`, `outline`) and `emphasis` (`subtle`, `bold`); defaults are `rect`, `md`, `solid` and `subtle`
- All options have the same width; stretch the control (for example `width: 100%`) to distribute the options evenly over the available space
- Use the `icon-only` attribute to show only the icons; the labels are then used as accessible names
- When there is not enough space for the buttons, the control shows an `<sl-select>` with the same options instead, and switches back as soon as the buttons fit again
- Style the select in that state with the `select` CSS part, for example `::part(select) { display: flex; inline-size: 100%; }` to make it fill the available width
- Accessible name via `aria-label` or `aria-labelledby`
- The selected option has `aria-current="true"`, all others `aria-current="false"`
- Single tab stop; use the left and right arrow keys to move between options
