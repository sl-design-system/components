# @sl-design-system/virtual-list

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
