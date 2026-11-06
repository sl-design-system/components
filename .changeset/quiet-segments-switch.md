---
'@sl-design-system/segmented-control': minor
---

Add new `<sl-segmented-control>` component for switching between a small set of related options.

```html
<sl-segmented-control aria-label="View" value="grid">
  <sl-segmented-control-item value="list">
    <sl-icon name="far-list" slot="icon"></sl-icon>
    <sl-icon name="fas-list" slot="selected-icon"></sl-icon>
    List
  </sl-segmented-control-item>
  <sl-segmented-control-item value="grid">Grid</sl-segmented-control-item>
</sl-segmented-control>
```

- Supports `shape` (`rect`, `pill`), `size` (`md`, `lg`), `fill` (`solid`, `outline`) and `emphasis` (`subtle`, `bold`); defaults are `rect`, `md`, `solid` and `subtle`
- Each `<sl-segmented-control-item>` has a `value`; put an icon in the `icon` slot, and a different icon (solid variant) in the `selected-icon` slot to show when the option is selected
- Set `value` on the `<sl-segmented-control>` to select the item with that value. When no value is set, the first enabled item is selected. Emits `sl-change` with the value of the item when the user selects another option
- Use `aria-disabled="true"` on an item to make it unavailable (disabled) while keeping it focusable
- All options have the same width; stretch the control (for example `width: 100%`) to distribute the options evenly over the available space
- Use the `icon-only` attribute to show only the icons; the labels are then used as accessible names (`aria-label` is added automatically to the internal button)
- When there is not enough space for the options, the control shows an `<sl-select>` with the same options instead, and switches back as soon as the options fit again
- Accessible name via `aria-label` or `aria-labelledby`
- The selected option has `aria-current="true"`, all others `aria-current="false"`
- Single tab stop: use the left and right arrow keys to move between options
