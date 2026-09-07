# @sl-design-system/ellipsize-text

## 0.1.1

### Patch Changes

- [#3571](https://github.com/sl-design-system/components/pull/3571) [`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652) - Build the package with tsdown

  The build has moved from esbuild to [tsdown](https://tsdown.dev). The public API is unchanged, but the published layout is different: compiled output now lives in `dist/` instead of the package root, and the package is resolved entirely through `exports`. The `main`, `module` and `types` fields have been dropped, since `exports` already points at both the JavaScript and, alongside it, the type declarations.

  Bundlers and TypeScript setups that understand `exports` (`moduleResolution: bundler`, `node16` or `nodenext`) need no changes.

- [#3668](https://github.com/sl-design-system/components/pull/3668) [`108c0c7`](https://github.com/sl-design-system/components/commit/108c0c735a95df8659be1417fb463b02ac651fe8) - Allow ellipsized text to shrink inside flex containers so its tooltip is shown when the text overflows.

- Updated dependencies [[`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652)]:
  - @sl-design-system/tooltip@3.0.1

## 0.1.0

### Minor Changes

- [#3368](https://github.com/sl-design-system/components/pull/3368) [`dd4b09b`](https://github.com/sl-design-system/components/commit/dd4b09bc9f93c61280ffb681e00288630c655f03) - Use the new tooltip implementation

### Patch Changes

- Updated dependencies [[`dd4b09b`](https://github.com/sl-design-system/components/commit/dd4b09bc9f93c61280ffb681e00288630c655f03)]:
  - @sl-design-system/tooltip@3.0.0

## 0.0.4

### Patch Changes

- [#3448](https://github.com/sl-design-system/components/pull/3448) [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6) - Update `@open-wc/scoped-elements` due to typing fix

  This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.

- Updated dependencies [[`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6)]:
  - @sl-design-system/tooltip@2.0.1

## 0.0.3

### Patch Changes

- Updated dependencies [[`7156788`](https://github.com/sl-design-system/components/commit/71567885f818c1725916456bda135c08a8f7abef), [`53cdac2`](https://github.com/sl-design-system/components/commit/53cdac2ee98ebfe90587479a9c101c1e0d248c5b)]:
  - @sl-design-system/tooltip@2.0.0

## 0.0.2

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies []:
  - @sl-design-system/tooltip@1.1.7

## 0.0.1

### Patch Changes

- [#1567](https://github.com/sl-design-system/components/pull/1567) [`f8c6b86`](https://github.com/sl-design-system/components/commit/f8c6b8609ed138033cb76a475a9301c1a523a85a) - New utility `<sl-ellipsize-text>` component

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`3ce1a3b`](https://github.com/sl-design-system/components/commit/3ce1a3b2c7c185ae6499b7dad22056d4de96a3a0)]:
  - @sl-design-system/tooltip@1.1.1
