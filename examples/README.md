# Examples

This workspace contains standalone examples demonstrating how to use the SL Design System components.

## Setup

The examples workspace is a private package (not published) and lives at `/examples` in the monorepo root. It is registered as a Yarn workspace alongside the other packages.

### Dependencies

The following dev dependencies are available in this workspace:

| Package      | Purpose                                       |
| ------------ | --------------------------------------------- |
| `lit`        | Lit library for building web components       |
| `tsdown`     | TypeScript bundler used to build the examples |
| `typescript` | TypeScript compiler                           |

## Structure

```
examples/
├── lit/             # Examples using the Lit integration
├── package.json     # Workspace package manifest (private, not published)
└── README.md        # This file
```

## Building

From this directory:

```bash
yarn build
```

Or from the monorepo root:

```bash
yarn workspace @sl-design-system/examples build
```

## Adding a new example

1. Create a new subdirectory under `examples/`.
2. Add a `package.json` to the new directory and register it as a workspace in the root `package.json` if it needs its own dependencies.
3. Implement your example using Lit and TypeScript. Import components from `@sl-design-system/*` packages.
