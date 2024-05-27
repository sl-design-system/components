# @sl-design-system/angular

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Minor Changes

- [#1248](https://github.com/sl-design-system/components/pull/1248) [`fdf9a90`](https://github.com/sl-design-system/components/commit/fdf9a90e4621fb9c865ee307b9abd29ff03722ca) - Rename `<sl-textarea>` to `<sl-text-area>` to match `<sl-text-field>`

## 0.2.0

### Minor Changes

- [#1210](https://github.com/sl-design-system/components/pull/1210) [`c3c9de6`](https://github.com/sl-design-system/components/commit/c3c9de6590f5abd1d8010186df127a665ee303b5) - Various improvements:

  - Remove the `FormsModule` and make all form directives standalone

  This is a breaking change and the reason for the minor version bump. If you are using the `FormsModule` in
  your Angular app, you will need to remove it and import the form directives you are using individually.

  - Generate Angular wrappers for all public web components

  This will make it easier to use the components in Angular apps. You only need to import a specific component
  to be able to get Angular bindings and type safety. This also removes the need for specifying the `CUSTOM_ELEMENTS_SCHEMA`
  everywhere.

  - Add `slTooltip` directive for ease-of-use in Angular

  This is syntactic sugar for the `sl-tooltip` web component. It allows you to use the `slTooltip` directive on any
  element by passing in the tooltip content as an input.

## 0.1.7

### Patch Changes

- [#1185](https://github.com/sl-design-system/components/pull/1185) [`d377313`](https://github.com/sl-design-system/components/commit/d377313f5e5a9c3b3931732a5aa0f598ceabb29d) - Update dependencies

- [#1194](https://github.com/sl-design-system/components/pull/1194) [`244d50f`](https://github.com/sl-design-system/components/commit/244d50f46ee4c87aab26e167c8ca5b200c1d30c2) - Fix missing dependencies on web components

## 0.1.6

### Patch Changes

- [#1078](https://github.com/sl-design-system/components/pull/1078) [`c682819`](https://github.com/sl-design-system/components/commit/c68281990d696106c99df9aed579ab316e6c7ec9) - Updated Angular peerDependencies

## 0.1.5

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Bump dependencies

## 0.1.4

### Patch Changes

- [#937](https://github.com/sl-design-system/components/pull/937) [`e4e94cb`](https://github.com/sl-design-system/components/commit/e4e94cbae85ef09c029920db0cb0ac9c92939097) - Bump minor angular version

## 0.1.3

### Patch Changes

- [#900](https://github.com/sl-design-system/components/pull/900) [`cf53c91`](https://github.com/sl-design-system/components/commit/cf53c91431aa014d9345a99a8c2a5f803d2c0f10) - Fix version not updating during release

## 0.1.2

### Patch Changes

- [#898](https://github.com/sl-design-system/components/pull/898) [`d572bb6`](https://github.com/sl-design-system/components/commit/d572bb663a2225608e435638b23047b6750fbd2f) - Bump version to fix release process

## 0.1.1

### Patch Changes

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Add form control directives for select and switch

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Refactor project setup
