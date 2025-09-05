# @sl-design-system/button-bar

## 1.2.1

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb)]:
  - @sl-design-system/button@1.2.5

## 1.2.0

### Minor Changes

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

- [#1679](https://github.com/sl-design-system/components/pull/1679) [`aefe4ec`](https://github.com/sl-design-system/components/commit/aefe4ecebafaf538b9bf129f66216413173686fe) - Refactor styling to use contextual tokens.

  This also removes the CSS custom properties for the responsive behavior. It now
  just sets the `flex-direction` and `align-items` directly from dialog.

  ```css
  @media (width <= 600px) {
    sl-button-bar {
      align-items: stretch;
      flex-direction: column-reverse;
    }
  }
  ```

### Patch Changes

- Updated dependencies [[`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e)]:
  - @sl-design-system/button@1.2.0

## 1.1.0

### Minor Changes

- [#1411](https://github.com/sl-design-system/components/pull/1411) [`1ea82aa`](https://github.com/sl-design-system/components/commit/1ea82aad5579752ba52e8e6c08c97e3c14237816) - Add `size` property to button-bar for ease of use

### Patch Changes

- Updated dependencies [[`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c)]:
  - @sl-design-system/button@1.0.2

## 1.0.0

### Major Changes

- [#1336](https://github.com/sl-design-system/components/pull/1336) [`d787820`](https://github.com/sl-design-system/components/commit/d7878202384eab3f58908b1cf252851c6a3d2744) - First stable release

## 0.0.7

### Patch Changes

- [#1170](https://github.com/sl-design-system/components/pull/1170) [`39c22ca`](https://github.com/sl-design-system/components/commit/39c22cad76661ad4b1f3a8f4bc56c576c36a94be) - Added button bar component

## 0.0.6

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Clean up CSS custom properties that are public API

## 0.0.5

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

## 0.0.4

### Patch Changes

- [#937](https://github.com/sl-design-system/components/pull/937) [`e4e94cb`](https://github.com/sl-design-system/components/commit/e4e94cbae85ef09c029920db0cb0ac9c92939097) - - Make `icon-only` take nested slotted buttons into account
  - Add `--sl-button-bar-align` and `--sl-button-bar-direction` public CSS API

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

## 0.0.3

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`
