---
title: FAQ
layout: docs
eleventyNavigation:
  key: FAQ
  parent: Introduction
  order: 1
  icon: circle-question
---

### The font in the components doesn't match the rest of my application.

Make sure the font you use in the application has the exact same name as the font used in the theme tokens. If the names align but the fonts still don't load, confirm the font is actually loading — the components use the fonts available to the page, so load them as you normally would. Contact the team if the problem persists.

### The icons in my components are broken.

Make sure you have called the `setup()` method as described in the "Initialize the theme" step. This method also initializes the icon set, so icons won't render without it.

### How do I use the dark mode of the theme?

For themes that support dark mode, including `all.css` loads both modes and switches automatically based on the system preference. Alternatively, load `light.css` and `dark.css` yourself based on your own conditions (include `base.css` as well). You can also use the SCSS mixins (`@mixin sl-theme-base`, `@mixin sl-theme-light`, `@mixin sl-theme-dark`) to wrap the tokens with your own theme-switching selectors.

### How do I setup my Bitbucket pipeline to work with the SLDS packages?

For the Sanoma Learning Bitbucket pipelines there is a common token you can use to authenticate with the GitHub NPM registry: `${SLDESIGNSYSTEMS_GITHUB_NPM_AUTH_TOKEN}`.

### Which browsers are supported?

We support the 2 latest versions of the major browsers: Chrome, Edge, Firefox, and Safari.

### Which versions of Angular are supported?

We support the 2 latest versions of Angular. Check the Angular documentation for the currently actively supported versions.

### Do you support SSR?

Server-side rendering of web components is a hard problem, and the related web standards continue to evolve. At the moment we do not support this, but we may look at it again in the future.
