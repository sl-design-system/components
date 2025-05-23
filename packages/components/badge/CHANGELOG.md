# @sl-design-system/badge

## 1.1.2

### Patch Changes

- [#1953](https://github.com/sl-design-system/components/pull/1953) [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8) - Removed `--sl-icon-container-size`; the container now always has the same size as the icon. Use margin or an extra wrapper to create extra space around the icon when necessary.

## 1.1.1

### Patch Changes

- [#1933](https://github.com/sl-design-system/components/pull/1933) [`6072e05`](https://github.com/sl-design-system/components/commit/6072e05d3d8e2c928608071fcbd4cf6f21daf70c) - Fixed horizontal alignment.

## 1.1.0

### Minor Changes

- [#1812](https://github.com/sl-design-system/components/pull/1812) [`9b639ea`](https://github.com/sl-design-system/components/commit/9b639eacedd763e9eac4d50eb570736a1bd7dfee) - Design tweaks:

  - Do not uppercase all the text
  - Make the `lg` version `24px` tall
  - Use different padding depending on the size

- [#1712](https://github.com/sl-design-system/components/pull/1712) [`752b27e`](https://github.com/sl-design-system/components/commit/752b27e1ed16550c44680c67b011ef5505c83776) - Add new `color` property and deprecate the `variant` property

  This change introduces a new `color` property to the `Badge` component. This better
  matches how the badge component is used. The `variant` property is now deprecated and
  will be removed in the next major version.

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

## 1.0.0

### Major Changes

- [#1336](https://github.com/sl-design-system/components/pull/1336) [`d787820`](https://github.com/sl-design-system/components/commit/d7878202384eab3f58908b1cf252851c6a3d2744) - First stable release

### Patch Changes

- [#1323](https://github.com/sl-design-system/components/pull/1323) [`7053c6b`](https://github.com/sl-design-system/components/commit/7053c6b766a6254d852c2bba52ee4fc0a5020f4a) - Various improvements:
  - Add new `emphasis` property with `subtle` (default) and `bold` values
  - Reduce sizes to `sm`, `md` (default) and `lg`, with `sm` only meant to be used in combination with the avatar component
  - Add padding around the icon
  - Make the badge round based on the content (icon only, or only 1 character)

## 0.0.6

### Patch Changes

- [#1243](https://github.com/sl-design-system/components/pull/1243) [`6dbe047`](https://github.com/sl-design-system/components/commit/6dbe047d690a069a16c1d96172accce6fa2980cb) - Fix missing `d.ts` files

## 0.0.5

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

## 0.0.4

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

## 0.0.3

### Patch Changes

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

## 0.0.2

### Patch Changes

- [#792](https://github.com/sl-design-system/components/pull/792) [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f) - Added badge component, added smaller icon.
