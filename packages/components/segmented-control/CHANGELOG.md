# @sl-design-system/segmented-control

## 0.1.0

### Minor Changes

- [#3789](https://github.com/sl-design-system/components/pull/3789) [`55e7c0c`](https://github.com/sl-design-system/components/commit/55e7c0cf83eb6733a9663a9c89ce8c07b251ad27) - Add new `<sl-segmented-control>` component for switching between a small set of related options.

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
  - Each `<sl-segmented-control-item>` has a `value` that identifies the option
  - Set `value` on the `<sl-segmented-control>` to select the item with that value. When no value is set, the first enabled item is selected. Emits `sl-change` with the value of the item when the user selects another option
  - Use `aria-disabled="true"` on an item to make it unavailable (disabled) while keeping it focusable
  - All options have the same width; stretch the control (for example `width: 100%`) to distribute the options evenly over the available space
  - To show an icon, with the label or on its own (see `icon-only`), put it in the `icon` slot of an item. Add a different icon (solid variant) in the `selected-icon` slot, which is shown instead when the option is selected
  - Use the `icon-only` attribute to show only the icons; the labels are then used as accessible names (`aria-label` is added automatically to the internal button)
  - When there is not enough space for the options, the control shows an `<sl-select>` with the same options instead, and switches back as soon as the options fit again
  - Accessible name via `aria-label` or `aria-labelledby`
  - The selected option has `aria-current="true"`, all others `aria-current="false"`
  - Single tab stop: use the left and right arrow keys to move between options

### Patch Changes

- Updated dependencies [[`d7f73ee`](https://github.com/sl-design-system/components/commit/d7f73ee60cb1c85667aed63a3484a80a838d9e4c), [`196ef77`](https://github.com/sl-design-system/components/commit/196ef77d942f737c1fb432bdc6242dd3e84e51b0)]:
  - @sl-design-system/shared@0.14.2
