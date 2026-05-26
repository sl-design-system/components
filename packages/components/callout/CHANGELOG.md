# @sl-design-system/callout

## 0.2.0

### Minor Changes

- [#3248](https://github.com/sl-design-system/components/pull/3248) [`fc60898`](https://github.com/sl-design-system/components/commit/fc60898ea3c7b5b234a13c6bf157e89528f3a11f) - Standardized warning and error icons:
  - Changed `warning` icons from `octagon-exclamation-solid` to `triangle-exclamation-solid` in Callout, Inline message, and Progress bar.
  - Changed `circle-exclamation-solid` to `triangle-exclamation-solid` in validation messages in the Form field.
  - Changed `error/danger` icons from `diamond-exclamation-solid` or `octagon-exclamation-solid` to the new `octagon-xmark-solid` icon in Callout, Inline message, and Progress bar. Make sure to update your theme if you update any of these components.

## 0.1.1

### Patch Changes

- Updated dependencies [[`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538), [`dd96d1b`](https://github.com/sl-design-system/components/commit/dd96d1b88f030a7b4a81b51d77a8461b5692909c), [`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538)]:
  - @sl-design-system/shared@0.12.0

## 0.1.0

### Minor Changes

- [#2982](https://github.com/sl-design-system/components/pull/2982) [`5784b96`](https://github.com/sl-design-system/components/commit/5784b9682e183391f842b10f1d194ceb137606f0) - Improved the color contrast when using links in the body of the callout. When there is global styling for links, or when links nested in other elements (`p`, `span`, etc) we advise you to use the global.css provided in your theme package, because it is impossible to style nested slotted elements from a component.

- [#2964](https://github.com/sl-design-system/components/pull/2964) [`c06bb04`](https://github.com/sl-design-system/components/commit/c06bb04cc7bd5b06247f7c24a0a80ee076614900) - Renamed Callout variant values: `positive` → `success`, `caution` → `warning`, `negative` → `danger`. The `info` variant remains unchanged.

### Patch Changes

- Updated dependencies [[`716e305`](https://github.com/sl-design-system/components/commit/716e305a7cc5cbafb5dd97b16c9f70e4320d45e4), [`330e06f`](https://github.com/sl-design-system/components/commit/330e06ff36c7a5c96cf313b60a5013d6307477c7), [`14e1286`](https://github.com/sl-design-system/components/commit/14e12869d8250c9292b15c60e69c99907277302e), [`2f8d8bf`](https://github.com/sl-design-system/components/commit/2f8d8bf32ca6e90eb9d117c1fcc434a59905769c)]:
  - @sl-design-system/shared@0.11.0
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
