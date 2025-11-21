# GitHub Copilot Instructions

We use GitHub for hosting our code and managing issues.

When using the GitHub MCP server, always limit the requests to the "sl-design-system" organization on GitHub. If not specified explicitly, use the "components" repository.

When creating a branch for a new feature or bug fix, use the following naming convention:
- For new features: `feature/<issue-number>-<description>`
- For bug fixes: `fix/<issue-number>-<description>`

## Repository structure

This repository is a monorepo containing multiple packages. The repository is structured as follows:
- /packages/angular contains the Angular bindings for the web components
- /packages/components/* contains the Lit web components
- /packages/locales contains all the translations for the web components
- /packages/themes contains the CSS themes for the different applications
- /packages/tokens contains the design tokens
- /scripts contains the build scripts and other utilities
- /tools/* contains various tools and utilities that may or may not be published as packages
- /website contains the sources for the documentation website, built with 11ty.dev

### Components

All components are located in the `/packages/components` directory. Each component has its own directory, which contains the following files:
- `index.ts`: The main entry point for the component, exporting the component class.
- `package.json`: The package manifest for the component, containing metadata and dependencies.
- `register.ts`: The file that registers the component with the global custom elements registry.
- `tsconfig.json`: The TypeScript configuration file for the component, specifying the compiler options and files to include.
- `src/`: The source directory containing the component's implementation files.

All components are built using Lit and TypeScript. All components follow the following coding conventions:
- Use JavaScript imports with `.js` extensions so the code also runs in the browser
- Use TypeScript for type annotations and interfaces
- Styling belongs in `<component-name>.scss` files which the build automatically transforms to `<component-name>scss.ts` files
- Public properties should come before public properties
- Public methods should come before private methods

### Code style

When declaring multiple constants, use a single multiline `const` statement instead of multiple separate statements:

```typescript
// ✅ Good
const foo = 'bar',
  baz = 'qux',
  another = 'value';

// ❌ Bad
const foo = 'bar';
const baz = 'qux';
const another = 'value';
```

## Tools

To build the components, use the following command from the root of the repository:
```bash
yarn build
```

To test a specific component, use the following command from the root of the repository:
```bash
vitest packages/components/<component>/src/<component>.spec.ts
```

To run linting and formatting checks, use the following command from the root of the repository:
```bash
eslint --config packages/components/eslint.config.mjs 'packages/components/<component>/**/*.ts'
```

## Tests

The tests for the components are located in the `src` directory of each component. Each component has its own test file, which follows the naming convention `<component>.spec.ts`. The tests are written using Mocha and Chai.
