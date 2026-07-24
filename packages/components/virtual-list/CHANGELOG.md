# @sl-design-system/virtual-list

## 0.1.1

### Patch Changes

- [#3464](https://github.com/sl-design-system/components/pull/3464) [`31092f3`](https://github.com/sl-design-system/components/commit/31092f3f6405344998dac94b5dbd70dc917c45da) - Improved virtual list scrolling and grouped option behavior.

  - Fixed `scrollMargin` handling so automatic window-scroll offsets are not overwritten by an implicit `0`, and clearing `scrollMargin` restores automatic behavior.
  - Kept cached virtual-list measurements enabled internally for more stable rendering
  - Prevented grouped combobox headers from being matched and selected as regular options
  - Updated virtual-list and listbox stories to use deterministic `auto` scrolling and rerender selected item state correctly near the end of long lists

- Updated dependencies [[`b40a00a`](https://github.com/sl-design-system/components/commit/b40a00a7d2987aebe11982476f5dd6f158eab3b1)]:
  - @sl-design-system/shared@0.12.3

## 0.1.0

### Minor Changes

- [#3409](https://github.com/sl-design-system/components/pull/3409) [`7d96c3a`](https://github.com/sl-design-system/components/commit/7d96c3aebdc8922f0b031f2ea84aa04c12db2c59) - Migrate to TanStack Virtual for improved performance and reliability

  The virtual-list component has been refactored to use TanStack Virtual instead of the custom virtualization implementation. This provides better performance, smoother scrolling, and more reliable item measurement.

  - Migrated to TanStack Virtual for core virtualization logic
  - Added `scrollMargin` property to control scroll offset when scrolling items into view
  - Added `requestLayout()` method to trigger re-measurement of item sizes
  - Updated `VirtualListItemRenderer` type to support both Element and TemplateResult return types

### Patch Changes

- Updated dependencies [[`b19dbe7`](https://github.com/sl-design-system/components/commit/b19dbe7d6bffbf3f7e1373f4bcc5693b4352c3ba)]:
  - @sl-design-system/shared@0.12.2

## 0.0.5

### Patch Changes

- Updated dependencies [[`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538), [`dd96d1b`](https://github.com/sl-design-system/components/commit/dd96d1b88f030a7b4a81b51d77a8461b5692909c), [`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538)]:
  - @sl-design-system/shared@0.12.0

## 0.0.4

### Patch Changes

- [#2979](https://github.com/sl-design-system/components/pull/2979) [`2776c1c`](https://github.com/sl-design-system/components/commit/2776c1c90fd5f7ee4bc8aafe676f383abda3cda9) - VirtualizerController now automatically calculates and updates scrollMargin when using window scrolling, keeping the virtual list correctly positioned during layout shifts and resize events.

- Updated dependencies [[`716e305`](https://github.com/sl-design-system/components/commit/716e305a7cc5cbafb5dd97b16c9f70e4320d45e4), [`14e1286`](https://github.com/sl-design-system/components/commit/14e12869d8250c9292b15c60e69c99907277302e), [`2f8d8bf`](https://github.com/sl-design-system/components/commit/2f8d8bf32ca6e90eb9d117c1fcc434a59905769c)]:
  - @sl-design-system/shared@0.11.0

## 0.0.3

### Patch Changes

- Updated dependencies [[`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d)]:
  - @sl-design-system/shared@0.10.0

## 0.0.2

### Patch Changes

- [#2781](https://github.com/sl-design-system/components/pull/2781) [`781f288`](https://github.com/sl-design-system/components/commit/781f288265cad6b19215eb2815fc8eccef610403) - This is a new package that provides a virtual scrolling solution for rendering large lists efficiently. It includes a web component `<sl-virtual-list>` and a `VirtualizerController` for integration with LitElement.

  It is based on `@tanstack/virtual-core` and offers customizable item rendering, configurable item sizing, and gap settings.

- Updated dependencies [[`d0c4db2`](https://github.com/sl-design-system/components/commit/d0c4db220c6a5826a0c9e5bc8ab3943884dfcd9c)]:
  - @sl-design-system/shared@0.9.2
