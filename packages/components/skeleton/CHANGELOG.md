# @sl-design-system/skeleton

## 1.1.2

### Patch Changes

- [#3694](https://github.com/sl-design-system/components/pull/3694) [`9417d4a`](https://github.com/sl-design-system/components/commit/9417d4ab0e2f0a2df800db4be713bc4cb7c299c3) - Fix published imports to resolve built JavaScript and type declarations by default, while preserving local source imports through a custom export condition.

## 1.1.1

### Patch Changes

- [#3571](https://github.com/sl-design-system/components/pull/3571) [`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652) - Build the package with tsdown

  The build has moved from esbuild to [tsdown](https://tsdown.dev). The public API is unchanged, but the published layout is different: compiled output now lives in `dist/` instead of the package root, and the package is resolved entirely through `exports`. The `main`, `module` and `types` fields have been dropped, since `exports` already points at both the JavaScript and, alongside it, the type declarations.

  Bundlers and TypeScript setups that understand `exports` (`moduleResolution: bundler`, `node16` or `nodenext`) need no changes.

## 1.1.0

### Minor Changes

- [#2606](https://github.com/sl-design-system/components/pull/2606) [`be15fea`](https://github.com/sl-design-system/components/commit/be15fea3b0c41f30a50f43c28c8cac439797b6be) - Refactor component to use contextual tokens

## 1.0.1

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

## 0.2.3

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

## 0.2.2

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

## 0.2.1

### Patch Changes

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

## 0.2.0

### Minor Changes

- [#829](https://github.com/sl-design-system/components/pull/829) [`413a781`](https://github.com/sl-design-system/components/commit/413a781dac32f0618535e50e443f53e5ed957410) - Added skeleton component

## 0.1.1

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

## 0.1.0

### Minor Changes

- [#542](https://github.com/sl-design-system/components/pull/542) [`764a3b1`](https://github.com/sl-design-system/components/commit/764a3b17ed7143decda4f29fb0bae3fbfeef0ea0) - Add skeleton component
