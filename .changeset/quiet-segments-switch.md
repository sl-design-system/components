---
'@sl-design-system/segmented-control': minor
---

Add new `<sl-segmented-control>` and `<sl-segmented-control-item>` components for switching between a small set of related options.

```html
<sl-segmented-control aria-label="View">
  <sl-segmented-control-item value="list">
    <sl-icon name="far-list" slot="icon"></sl-icon>
    <sl-icon name="fas-list" slot="selected-icon"></sl-icon>
    List
  </sl-segmented-control-item>
  <sl-segmented-control-item value="grid">Grid</sl-segmented-control-item>
</sl-segmented-control>
```

- Supports `shape` (`rect`, `pill`), `size` (`md`, `lg`), `fill` (`solid`, `outline`) and `emphasis` (`subtle`, `bold`); defaults are `rect`, `md`, `solid` and `subtle`
- Each `<sl-segmented-control-item>` has a `value` and can be `disabled`; put an icon in the `icon` slot, and optionally a different icon (for example the solid variant) in the `selected-icon` slot to show when the option is selected
- `value` on the control selects an option; defaults to the first enabled option. Emits `sl-change` when the user selects another option
- Selecting an option animates the fill: the old fill shrinks and fades out, then the new fill grows in (disabled when the user prefers reduced motion)
- All options have the same width; stretch the control (for example `width: 100%`) to distribute the options evenly over the available space
- Use the `icon-only` attribute to show only the icons; the labels are then used as accessible names
- When there is not enough space for the options, the control shows an `<sl-select>` with the same options instead, and switches back as soon as the options fit again
- Style the select in that state with the `select` CSS part, for example `::part(select) { display: flex; inline-size: 100%; }` to make it fill the available width
- Accessible name via `aria-label` or `aria-labelledby`
- The selected option has `aria-current="true"`, all others `aria-current="false"`
- Single tab stop; use the left and right arrow keys to move between options
