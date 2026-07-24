# @sl-design-system/infotip

## 0.1.0

### Minor Changes

- [#3461](https://github.com/sl-design-system/components/pull/3461) [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340) - Add infotip support to checkbox, radio, and switch components

  Form controls now support an optional infotip slot that displays contextual help using the infotip component. The infotip automatically:

  - Sizes itself appropriately (sm) for form controls
  - Inherits the form control's label as its `describes` attribute if not explicitly set
  - Positions itself alongside the form control without interfering with clicks or keyboard interactions

### Patch Changes

- Updated dependencies [[`ab43bd7`](https://github.com/sl-design-system/components/commit/ab43bd715bfb51b1a007bf2acb87e7061ae8ad19), [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340)]:
  - @sl-design-system/icon@1.4.3

## 0.0.2

### Patch Changes

- [#3448](https://github.com/sl-design-system/components/pull/3448) [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6) - Update `@open-wc/scoped-elements` due to typing fix

  This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.

- Updated dependencies [[`7f08962`](https://github.com/sl-design-system/components/commit/7f08962d1e7313a87b58729d64c88e283c686e68)]:
  - @sl-design-system/button@2.1.1

## 0.0.1

### Patch Changes

- [#3197](https://github.com/sl-design-system/components/pull/3197) [`40304dd`](https://github.com/sl-design-system/components/commit/40304ddcd4d74cf94a51ada5729a31ff05437f5e) - New `sl-infotip` component — an info icon button that reveals contextual content in a popover. Designed to be placed in the `infotip` slot of `<sl-label>`, it automatically links its content to the associated form control's native input via `aria-describedby`, so screen readers announce the infotip content when the input receives focus.

- Updated dependencies [[`cf96680`](https://github.com/sl-design-system/components/commit/cf966804d9b39e98af54dbd6331c6a269e2da333)]:
  - @sl-design-system/button@2.0.1
