# CLAUDE.md — SL Design System Components

Sanoma Learning Design System — a Lit 3 web component library published as `@sl-design-system/*` packages.

**GitHub:** https://github.com/sl-design-system/components
**Storybook (main):** https://storybook.sanomalearning.design
**Docs (main):** https://sanomalearning.design

## Quick Reference

```bash
yarn                    # Install dependencies
yarn build              # Build everything (uses wireit for incremental builds)
yarn start --watch      # Storybook dev server on port 6006
yarn test               # Run all tests
yarn lint               # Lint code + styles
```

## Project Structure

Monorepo using **Yarn 4** workspaces + **Wireit** for build orchestration.

| Path                         | Purpose                                                                    |
| ---------------------------- | -------------------------------------------------------------------------- |
| `packages/components/*`      | Individual web components (50+)                                            |
| `packages/components/shared` | Shared utilities, controllers, mixins, decorators, events                  |
| `packages/themes/*`          | Theme packages per product                                                 |
| `packages/tokens`            | Design tokens source                                                       |
| `packages/locales`           | i18n translations (`@lit/localize`, XLIFF)                                 |
| `packages/angular`           | Angular wrapper                                                            |
| `tools/`                     | ESLint config, Stylelint config, vitest-browser-lit helper, etc.           |
| `scripts/`                   | Build scripts (build-packages, build-styles, build-themes, build-metadata) |

## Component Structure

Each component at `packages/components/<name>/` follows this pattern:

```
package.json          # @sl-design-system/<name>
index.ts              # Re-exports from ./src/<name>.js
register.ts           # Calls customElements.define('sl-<name>', ...)
src/<name>.ts         # Component class extending LitElement
src/<name>.scss       # Styles (compiled to .scss.ts)
src/<name>.spec.ts    # Tests (Vitest + Playwright browser)
src/<name>.stories.ts # Storybook stories
```

## Coding Conventions

- **Lit 3** with decorators: `@property`, `@query`, `@state`, `@event`, `@localized`
- `ScopedElementsMixin` from `@open-wc/scoped-elements` for nested component registration
- Custom element prefix: `sl-` (e.g., `<sl-button>`)
- NPM scope: `@sl-design-system/`
- Event prefix: `sl-` with dasherized names (e.g., `sl-active-item-change`)
- Private class fields use `#` prefix
- American English throughout
- SCSS per component, compiled to CSS-in-JS tagged templates
- `@internal` JSDoc tag for internal properties/methods
- Declare in `HTMLElementTagNameMap` global for type safety
- **Property/method order in component classes:**
  1. Private fields
  2. Public fields
  3. Public properties with decorators (e.g., `@property`)
  4. Lifecycle methods (`connectedCallback`, `disconnectedCallback`, `firstUpdated`, `willUpdate`, `updated`, `render`)
  5. Private event handlers (use `#onFoo(...)` naming)
  6. Private methods (use `#` prefix)
  - Within each group, sort members alphabetically

## TypeScript

- Strict mode, ES2022, ESNext target, bundler module resolution
- `experimentalDecorators: true`, `useDefineForClassFields: false`
- Each component has its own `tsconfig.json` with `composite: true`

## Testing

- **Vitest** with **Playwright** browser mode (Chromium)
- Run component tests: `vitest --project=unit` or for a specific component: `vitest packages/components/button/src/button.spec.ts`
- Custom `fixture()` helper from `@sl-design-system/vitest-browser-lit`
- Assertions: Chai with `chai-dom`, `chai-datetime`, `sinon-chai`
- Mocking: Sinon
- Test files: `packages/components/**/*.spec.ts`

## Linting & Formatting

- **ESLint 9** flat config with lit, lit-a11y, wc, typescript-eslint, prettier plugins
- **Prettier**: single quotes, 120 char width, no trailing commas, arrow parens avoid
- **Stylelint** for SCSS
- **Husky** + **lint-staged** runs on pre-commit
- Run: `yarn lint`

## Releases

- **Changesets** for versioning — run `yarn changeset` before PRs
- Branch naming: `chore/`, `docs/`, `feature/`, `fix/` prefixes
- Publishes to GitHub Packages npm registry
