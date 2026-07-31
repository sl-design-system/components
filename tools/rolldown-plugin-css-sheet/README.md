# @sl-design-system/rolldown-plugin-css-sheet

This package provides a [Rolldown](https://rolldown.rs)/[Vite](https://vite.dev) plugin that imports `.css` files as constructable [`CSSStyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet) instances when they are imported with a `type: 'css'` import attribute.

This lets you author component styles in plain `.css` files and consume them directly as adoptable stylesheets, for example with Lit:

```ts
import styles from './my-component.css' with { type: 'css' };

export class MyComponent extends LitElement {
  static styles = styles;
}
```

The CSS file is turned into a module whose default export is a `CSSStyleSheet`:

```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(/* contents of the .css file */);
export default sheet;
```

## Usage

Add the plugin to your Rolldown, `tsdown`, or Vite configuration:

```js
import { importCssSheet } from '@sl-design-system/rolldown-plugin-css-sheet';

export default {
  plugins: [importCssSheet()]
};
```

Only `.css` imports that use the `with { type: 'css' }` attribute are handled; all other CSS imports are left untouched.

## How it works

- It resolves each matching `.css` import to a stable virtual module via `resolveId`, using the bundler's own resolver so aliases and bare specifiers work.
- The same file always maps to the same virtual module, so a stylesheet imported from multiple places is shared rather than duplicated.
- The real file is registered with `addWatchFile`, so editing the `.css` triggers a rebuild/HMR in watch mode.
- A `type: 'css'` import attribute is detected directly (Rolldown/`tsdown`); for Vite, the importing file is scanned as a fallback.
