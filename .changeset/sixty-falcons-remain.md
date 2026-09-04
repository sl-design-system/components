---
'@sl-design-system/shared': minor
'@sl-design-system/combobox': patch
'@sl-design-system/icon': patch
'@sl-design-system/toggle-button': patch
---

Add `isDevMode()`, available from `@sl-design-system/shared/dev-mode.js`

Returns whether the code is running in a development build. Bundlers such as Vite replace `import.meta.env.DEV` at build time; in any other environment it is simply `undefined`, so the helper is safe to call anywhere.

```ts
import { isDevMode } from '@sl-design-system/shared/dev-mode.js';

if (isDevMode()) {
  console.warn('This warning is stripped from production builds');
}
```

It replaces the inline `import.meta.env?.DEV` checks that guard developer warnings in `@sl-design-system/combobox` (conflicting `autocomplete` and `select-only` configuration), `@sl-design-system/icon` (registering an icon that is already in the registry) and `@sl-design-system/toggle-button` (missing `sl-icon` in the default slot). The behaviour of those warnings is unchanged.

Previously each of those files reached for the typing via `/// <reference types="vite/client" />`. That is not a private detail: it also declares `*.css` as an _empty_ ambient module in every TypeScript program that compiles these sources, which broke `import styles from './x.css'` for downstream consumers that do not use Vite. Typing `import.meta.env` locally in one place keeps that out of the published sources.

Note that `@sl-design-system/icon` now depends on `@sl-design-system/shared`; previously it had no dependencies of its own.
