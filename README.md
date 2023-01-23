# Sanoma Learning Design System

A design system with web components for the various products of Sanoma Learning.

## Getting started

- Ensure you have the LTS version of Node.js installed (see https://nodejs.org/en/)
- Ensure if you are using Windows to use the Windows Subsystem for Linux (WSL)
- Run `yarn` in the root of the project for all the dependencies to download & install

### Local development

Run `yarn build --watch` from the project root to build all the packages. 

Each child package has its own Storybook instance that you can run while developing:
- `yarn workspace @sanomalearning/slds-core storybook`
- `yarn workspace @sanomalearning/slds-editor storybook`
- `yarn workspace @sanomalearning/slds-grid storybook`

### Website

To run the documentation website locally, run `yarn workspace @sanomalearning/slds-docs start:site` from the project root.
