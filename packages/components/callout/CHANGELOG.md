# @sl-design-system/callout

## 0.1.0

### Minor Changes

- [#2982](https://github.com/sl-design-system/components/pull/2982) [`5784b96`](https://github.com/sl-design-system/components/commit/5784b9682e183391f842b10f1d194ceb137606f0) - Improved the color contrast when using links in the body of the callout. When there is global styling for links, or when links nested in other elements (`p`, `span`, etc) we advise you to use the global.css provided in your theme package, because it is impossible to style nested slotted elements from a component.

### Patch Changes

- Updated dependencies [[`330e06f`](https://github.com/sl-design-system/components/commit/330e06ff36c7a5c96cf313b60a5013d6307477c7)]:
  - @sl-design-system/icon@1.4.2

## 0.0.3

### Patch Changes

- Updated dependencies [[`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d)]:
  - @sl-design-system/shared@0.10.0

## 0.0.2

### Patch Changes

- [#2842](https://github.com/sl-design-system/components/pull/2842) [`be3b2b8`](https://github.com/sl-design-system/components/commit/be3b2b8e80cb0248f445f5a865f373f6523d2457) - New `callout` component, visually similar to the `inline-message` but with a different purpose:
  it can be used to provide additional, non-interrupting information and may include actions (e.g. buttons).
  It must not be shown/hidden dynamically in response to user actions (unlike the `inline-message`).
  There is no ARIA role on this component as it is not meant to interrupt the user (no live region).
- Updated dependencies [[`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`d807cb2`](https://github.com/sl-design-system/components/commit/d807cb22702dc5ac1399cf0528f9ceeeb1f09f60)]:
  - @sl-design-system/icon@1.4.1
