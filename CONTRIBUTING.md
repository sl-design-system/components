# Contributing

Thanks for wanting to contribute to the project!

## Getting Started

- Ensure you have the LTS version of Node.js installed (see https://nodejs.org/en/)
- Ensure if you are using Windows to use the Windows Subsystem for Linux (WSL)
- Please be respectful when communicating within the project

## Naming

This is an international project and as such everything uses the American English language.

When writing code in this project, please follow the following naming conventions:
- For NPM packages, we use the `sanomalearning` organization with the `slds-` prefix for the actual packages; for example: `@sanomalearning/slds-core`
- For web components, we use the `sl-` prefix; for example: `<sl-button>`
- All web component events use the `sl-` prefix and "dasherize" convention; for example: `sl-active-item-change`

## Branching

The main branch of the repository is called `main`. All releases are done from this branch automatically using GitHub Actions and `changesets`. If you want to work on something, please create a new branch from `main`.

When creating a branch, please prefix the branch with the type of thing you intend to work on:
- `docs/improve-button`
- `feature/my-cool-component`
- `fix/dialog-close-button`

When you finish the branch and want to get your changes merged into `main`, please create a Pull Request. After your PR has been reviewed & approved, your commits will be squashed and merged in `main` as a single commit.

When you create a PR, please make sure the PR is associated with the issue. You can do this by either typing "Fixes #123" in the body of the PR, or by manually associating an issue with a PR.

Please run `yarn changeset` locally to create an entry for `CHANGELOG.md`.

## Linting

Linting is done using `eslint` and is setup in a such a way that it should work automatically if you are using Visual Studio Code. If you are using a different development environment, it is up to you to correctly setup integration.

As part of linting, `prettier` also runs every time you save a file in vscode. This will format your code according to the project standards.

Using `husky`, whenever you create a new git commit, `lint-staged` will check if all the staged code passes the linting checks. If not, then the commit will fail. Fix the errors and try again.

## Tests

To run all the tests in the project, simply run `yarn test` from the project root.

If you want to run the tests while developing, you can go to the folder of a specific packages (`packages/core` for example) and run `yarn run wtr --watch`. This will automatically rerun the tests for that package whenever you update a file.

When you create/update a web component, please also create/update the associated unit tests.
