---
name: changeset
description: 'Create a changeset for the changes in a branch. Use when: the user asks to create a changeset, add a changeset, generate a changeset, or write release notes for changed packages.'
---

# Create Changeset

## Purpose

Create a changeset file for the changes on the current branch compared to the `main` branch. Changesets are used by `@changesets/cli` to version packages and generate changelogs in this monorepo.

## When to Use

- When the user asks to create, add, or generate a changeset
- When the user asks to write release notes for changes
- After completing a feature or bug fix that needs a version bump

## When Not to Use

- Do not use if there are no changes to _published_ packages (e.g. only changes to root config files, scripts, tools)

## Procedure

### 1. Determine Changed Packages

Use the terminal to get the list of changed files compared to `main`:

```bash
git diff --name-only main...HEAD
```

Map each changed file to its package by looking at the closest `package.json` in the directory hierarchy. For example:

- `packages/angular/` → `@sl-design-system/angular`
- `packages/components/<name>/` → `@sl-design-system/<name>`
- `packages/locales/` → `@sl-design-system/locales`
- `packages/themes/<name>` → `@sl-design-system/<name>`
- `tools/eslint-config/` → `@sl-design-system/eslint-config`

### 2. Filter Out Ignored Packages

The following packages are **excluded** from changesets (configured in `.changeset/config.json`):

- `@sl-design-system/chromatic`
- `@sl-design-system/example-data`
- `@sl-design-system/lit-examples`
- `@sl-design-system/scripts`
- `@sl-design-system/tokens`
- `@sl-design-system/website`

Also exclude changes to files outside of packages (e.g. root config files, scripts, tools).

If no packages remain after filtering, inform the user that no changeset is needed.

### 3. Determine number of changesets needed

Changesets can include multiple packages with different bump types, but if there are many unrelated changes it may be better to create multiple changesets. Prompt the user if they want to create one changeset for all changes or separate changesets for different groups of changes, unless it's obvious.

### 4. Determine the Bump Type

Summarize the changes found and prompt the user what kind of version bump is appropriate, unless the context makes it obvious:

- **patch**: Bug fixes, minor improvements, documentation updates, accessibility improvements
- **minor**: New features, new components, new public API methods/properties
- **major**: Breaking changes (removed/renamed public API, changed behavior)

Different packages in the same changeset can have different bump types.

### 5. Write the Summary

Write a clear, concise summary of the changes. Follow these guidelines:

- First line: Brief one-line description of the change
- Additional lines (optional): More detail if the change is complex
- Write from the user's perspective (what changed, not how it was implemented)
- Use imperative mood ("Add support for..." not "Added support for...")

Study the git diff (use `git diff main...HEAD`) to understand the actual changes and write an accurate summary.

#### Examples

Simple patch:

```
Fix field not growing when it has an explicit width
```

Feature with description:

```
Add `getSelectedItems()` method to ArrayListDataSource

This is a utility method that will return the raw data objects of all currently selected items.
```

Accessibility improvement:

```
Accessibility improvements:
- Moved the clear button from `sl-select-button` to `sl-select`, the clear button is now focusable on its own,
- Added `aria-keyshortcuts` attribute to announce Backspace/Delete shortcuts to assistive technology.
```

### 5. Generate the Changeset File

Create the changeset file at `.changeset/<random-name>.md` with this format:

```markdown
---
'<package-name>': <bump-type>
---

<summary>
```

For the filename, generate a random name using the pattern `<adjective>-<noun>-<verb>` (all lowercase, separated by hyphens). Examples: `eighty-bats-camp`, `spotty-trams-rush`, `smooth-eggs-follow`. Keep iterating until you find a name that doesn't already exist in the `.changeset` directory.

#### Multiple packages example:

```markdown
---
'@sl-design-system/button': minor
'@sl-design-system/shared': patch
---

Add support for the invoker API in button components
```

### 6. Confirm with the User

After creating the changeset, show the user:

- Which packages are included
- The bump type for each
- The summary text

Prompt if they want to adjust anything (yes/no).
