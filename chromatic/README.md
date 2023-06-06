# Sanoma Learning Design System Chromatic

Chromatic automatically preforms visual tests for all pages in Storybook
For all themes there are separate pages that are compliled of all the "All" stories in the components

### Local development

To launch a local version of the theme Storybook:
- `yarn workspace @sl-design-system/chromatic start`

You don't need to run a separarate `yarn build --watch` to build the components separately

### Chromatic action

As soon as you make a pull request that is ready for review (so not "draft") the actions will run and storybook will be deployed and tested
