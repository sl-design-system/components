# Sanoma Learning Design System

A design system with web components for the various products of Sanoma Learning.

## Getting started

- Ensure you have the LTS version of Node.js installed (see https://nodejs.org/en/)
- Ensure if you are using Windows to use the Windows Subsystem for Linux (WSL)
- Run `yarn` in the root of the project for all the dependencies to download & install

### Local development

To launch a local version of the Storybook deploy (runs all storybooks at the same time):
- `yarn start --watch`

You don't need to run a separate `yarn build --watch` to build the components separately.

### Website

To run the documentation website locally, run `yarn workspace @sl-design-system/website start:site` from the project root.
