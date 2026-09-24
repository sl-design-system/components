# @sl-design-system/rolldown-plugin-css-sheet

## 0.0.2

### Patch Changes

- [#3661](https://github.com/sl-design-system/components/pull/3661) [`fb75897`](https://github.com/sl-design-system/components/commit/fb758975c074fd008bd275f95348e525970bb957) - Fix a crash when a `.css` import is requested from a virtual module (e.g. Storybook/Vitest browser test setup files), which surfaced as unrelated "missing export" errors

## 0.0.1

### Patch Changes

- [#3439](https://github.com/sl-design-system/components/pull/3439) [`4ff727c`](https://github.com/sl-design-system/components/commit/4ff727c778916b586d786011df46024209fa6f15) - Add a Rolldown/Vite plugin that imports `.css` files as constructable `CSSStyleSheet` instances when imported with a `type: 'css'` import attribute
