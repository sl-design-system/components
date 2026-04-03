---
name: changeset
description: Create a changeset for SL Design System component changes before opening a pull request. Covers bump type selection, which packages to include, and writing a clear user-facing summary.
---

# Create a changeset for: $ARGUMENTS

You are creating a changeset for the SL Design System monorepo. Every PR that changes a publishable package **must** include a changeset, otherwise the release pipeline will not version or publish the updated packages.

## When a changeset is required

Add a changeset when you change anything in a publishable package — that is, any package whose `package.json` does **not** appear in the `ignore` array of `.changeset/config.json`.

Currently ignored (never need a changeset):
- `@sl-design-system/chromatic`
- `@sl-design-system/example-data`
- `@sl-design-system/lit-examples`
- `@sl-design-system/scripts`
- `@sl-design-system/tokens`
- `@sl-design-system/website`

Everything under `packages/components/*` and `packages/themes/*` is publishable.

## Step 1: Identify affected packages

List every `@sl-design-system/*` package whose source files you changed. Check:

1. `packages/components/<name>/src/` — component TypeScript and SCSS
2. `packages/components/<name>/package.json` — dependency changes also count
3. `packages/themes/<name>/` — theme token changes
4. `packages/components/shared/` — shared utilities used by many components

Do **not** list downstream packages that you did not directly modify, even if they depend on a changed package. The release tooling handles cascading version bumps automatically via `updateInternalDependencies: "patch"` in `.changeset/config.json`.

## Step 2: Choose the bump type

Use semantic versioning rules:

| Bump | When |
|---|---|
| **patch** | Bug fix, style tweak, internal refactor, documentation update, performance improvement — no API change |
| **minor** | New feature, new property/attribute/slot/event, new component — backward compatible |
| **major** | Breaking change: renamed/removed property, changed event signature, changed slot name, changed required attribute, dropped browser support |

**When in doubt, use `patch`.** Design system components should rarely bump major.

Breaking change examples that require **major**:
- Renaming `@property() size` to `@property() buttonSize`
- Removing a previously public method
- Changing an event's detail type
- Renaming a CSS custom property or CSS part

New API examples that require **minor**:
- Adding a new `@property()`
- Adding a new slot
- Adding a new emitted event
- Exporting a new type alias

## Step 3: Write the changeset file

Run the interactive CLI:

```bash
yarn changeset
```

When prompted:
1. Select the affected packages (space to toggle, enter to confirm).
2. Choose the bump type for each package (major / minor / patch).
3. Write the summary when prompted.

This creates a file at `.changeset/<random-name>.md`. You can also write it manually (see format below).

### Manual format

```markdown
---
'@sl-design-system/<name>': <patch|minor|major>
---

<Summary sentence(s)>
```

Multiple packages in one changeset:

```markdown
---
'@sl-design-system/button': minor
'@sl-design-system/shared': patch
---

Added `shape` property to `<sl-button>` for pill-shaped buttons. Updated shared utilities to support the new shape calculation.
```

### Writing a good summary

The summary becomes the public changelog entry. Write it for **consumers** of the design system, not for internal developers:

- Start with a verb in past tense: *Added*, *Fixed*, *Changed*, *Removed*, *Improved*.
- Name the component and the specific change: `Added \`size\` property to \`<sl-skeleton>\` for controlling placeholder dimensions.`
- For bug fixes, describe what was broken and what is now correct: `Fixed \`<sl-dialog>\` not returning focus to the trigger element after closing.`
- For breaking changes, include a migration hint: `Renamed \`variant\` property to \`emphasis\` on \`<sl-badge>\`. Update usages from \`variant="bold"\` to \`emphasis="bold"\`.`

**Do not** write internal implementation notes ("refactored X", "updated Y mixin") — consumers care about observable behaviour.

## Step 4: Verify

After creating the changeset:

```bash
cat .changeset/<filename>.md   # confirm the content looks correct
git add .changeset/
```

The changeset file must be committed alongside your code changes in the same PR.

## Examples

### Bug fix (patch)

```markdown
---
'@sl-design-system/tooltip': patch
---

Fixed tooltip not repositioning when the anchor element moves within a scrolling container.
```

### New feature (minor)

```markdown
---
'@sl-design-system/button': minor
---

Added `loading` property to `<sl-button>` that shows a spinner and prevents interaction while an async action is in progress.
```

### Breaking change (major)

```markdown
---
'@sl-design-system/select': major
---

Renamed the `sl-select` event to `sl-change` to align with the rest of the form control components. Update event listeners from `@sl-select` to `@sl-change`.
```

### Multiple packages

```markdown
---
'@sl-design-system/form': minor
'@sl-design-system/checkbox': patch
'@sl-design-system/radio-group': patch
---

Added `custom-validity` attribute to form controls for setting validation messages declaratively from HTML without JavaScript.
```
