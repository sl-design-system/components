/**
 * Returns whether the code is running in a development build. Bundlers such as Vite replace
 * `import.meta.env.DEV` at build time; in any other environment it is simply undefined.
 *
 * `import.meta.env` is typed inline rather than via `/// <reference types="vite/client" />`,
 * because that would also declare `*.css` as an empty module in every program that compiles this
 * source.
 */
export const isDevMode = (): boolean =>
  !!(import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV;
