---
title: For developers
layout: docs
eleventyNavigation:
  key: For developers
  parent: Getting started
  order: 1
---

The Sanoma Learning Design System (SLDS) provides a collection of framework-agnostic web components and matching themes for building applications. Because the components are built on web standards, they work in any modern framework — or with no framework at all. This guide walks you through gaining access to the packages, installing them, and getting your first component rendering on screen.

## Access to packages

The packages are published to a private registry, so before you can install anything you need to be granted access. SLDS packages are available through two channels, depending on where you work:

- **Nexus Server**: This is the route for Sanoma Learning product teams, where the packages are mirrored internally. Contact TechOps for the access details and registry configuration.
- **GitHub Packages**: For everyone else, the design system team has to add your account to the organization before you can pull packages. Reach out via their Slack channel or email designsystem@sanoma.com with your company email address, and mention which product you're working on so they can grant the right access.

Once your account has been approved, you authenticate with the GitHub NPM registry using a personal access token. Generate a token with the `read_packages` permission and add it to your `~/.npmrc`, along with the registry mapping for the `@sl-design-system` scope so npm knows where to look for these packages:

```
//npm.pkg.github.com/:_authToken=<your_token>
@sl-design-system:registry=https://npm.pkg.github.com
```

## Installation steps

With access in place, you can install the packages and wire up a theme. The steps below take you from an empty project to a working component.

1. **Install the components and a theme** via npm. Each component lives in its own package, so you only install what you actually use. A theme package (for example, Sanoma Learning) supplies the design tokens, fonts hooks, and icon set the components rely on:

   ```bash
   npm add @sl-design-system/button @sl-design-system/sanoma-learning
   ```

2. **Import the theme stylesheet** in your HTML. This loads the CSS custom properties (design tokens) that give the components their look and feel:

   ```html
   <link href="./node_modules/@sl-design-system/sanoma-learning/light.css" rel="stylesheet">
   ```

3. **Initialize the theme** in your JavaScript. Calling `setup()` registers the theme and initializes the icon set, so this step is required for icons to render correctly:

   ```javascript
   import { setup } from '@sl-design-system/sanoma-learning';

   setup();
   ```

4. **Install the polyfills.** The components depend on two browser features that aren't yet available everywhere: scoped custom element registries (which let components register their own internal elements without polluting the global registry or clashing with other libraries) and the invoker commands API (which powers declarative interactions such as buttons opening dialogs). The polyfills fill these gaps so the components behave consistently across all supported browsers:

   ```bash
   npm add @webcomponents/scoped-custom-element-registry invokers-polyfill
   ```

5. **Import the polyfills** before any components, so the features are in place by the time the components load:

   ```javascript
   import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
   import 'invokers-polyfill';
   ```

6. **Register the components** you want to use. Importing a component's `register.js` defines its custom element with the browser:

   ```javascript
   import '@sl-design-system/button/register.js';
   ```

7. **Use them in your markup** like any other HTML element:

   ```html
   <sl-button>Hello world!</sl-button>
   ```

## Key configuration notes

A few details are worth keeping in mind as you integrate the components into a real project:

- **Peer dependencies** are not installed automatically and must be added separately. Check the warnings npm prints during installation to see what each package expects.
- **Fonts** are intentionally not bundled with the design system. Load them through your application's normal font-loading process, making sure the font names match the names used in the theme tokens.
- **Dark mode** can be enabled either by loading `dark.css` alongside the base styles, or by controlling theme switching yourself through the provided SCSS mixins.
- **Angular** projects that report template validation errors for the custom elements should add `CUSTOM_ELEMENTS_SCHEMA` to the relevant module or component.
- **Deprecated tokens**: if you depend on tokens that have since been deprecated, the `light-deprecated.css` and `dark-deprecated.css` stylesheets keep them available while you migrate.

## Browser & framework support

The design system targets modern, evergreen environments:

- **Browsers**: the latest 2 versions of Chrome, Edge, Firefox, and Safari.
- **Angular**: the latest 2 supported versions.
- **SSR**: server-side rendering of the web components is not currently supported.

## Resources

To see a full integration in context, take a look at the example apps:

- [Angular example](https://github.com/sl-design-system/angular-demo)
- [Lit example](https://github.com/sl-design-system/example-design-system-lit-app)
