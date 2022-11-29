# Sanoma Learning Design System contributing guide

We would like to welcome all contributors.

These are the basic contributing rules:
- New branch should be created from the `main` branch
- Branch naming: `feature/[#issueNumber]-...-...` or `fix/[#issueNumber]-...-...`, eg `feature/[#21]-button-component`
- Please use English for naming 🙂
- Every component should have prefix `sl-` eg. `sl-button`
- Please add unit tests for your changes
- Commit message with scope (eg. core, storybook, website, tokens) for instance:
    `(core): add button component`
- Before creating PR – the newest version of `main` branch should be merged into feature branch and all conflicts should be resolved
- Squash before merge
- Pull request naming - eg `Task_number – (scope): description` ->
  `#56 – (website): documentation setup` or something like that?
- Not merging PR without code review