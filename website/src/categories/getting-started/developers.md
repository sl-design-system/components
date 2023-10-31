---
title: Developers
eleventyNavigation:
  parent: Getting Started
  key: Developers
  order: 2
---
<header class="ds-tokens__main-heading">
<div class="ds-tokens__heading-wrapper">
  <h1 class="ds-heading-1">{{title}}</h1>
  <p class="ds-tokens__heading-description">
  This guide will walk you through the process of gaining access to the private GitHub NPM repository, installing the SL Design System packages and using them in your application.
  </p>
</div>
</header>

<section class="ds-subpage-section">

<div class="ds-subpage-section__wrapper">

<section>

## Installing the SL Design System package(s)

To get started using the SL Design System, you can install it via npm. Each component and theme has its own package. So if you want to use a `button` component with the Sanoma Learning theme, you do:

<div class="ds-code">

  ```bash
  npm add @sl-design-system/button 
  ```

</div>

Before you can do this though, you first need to get access to the private GitHub NPM repository. To get access, you need to be added to the team in GitHub. Please <a href="mailto:designsystem@sanoma.com">contact a team member</a> to be added.

Once you have been added, you can follow the instructions [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages) to authenticate with the GitHub NPM registry.
</section>
<section>

## Setup a theme

To start using the SL Design System, you need to setup a theme for your application. The theme determines how your application looks. There is a theme for every major product within Sanoma Learning. You can install a theme as by installing the NPM package, in this example we use the `sanoma-learning` theme.

<div class="ds-code">

  ```bash
  npm add @sl-design-system/sanoma-learning
  ```

</div>

After installing the theme, you need to import the theme in your application. You can do this by loading the theme in your application:

<div class="ds-code">

  ```html
  <link href="@sl-design-system/sanoma-learning/all.css" rel="stylesheet">
  ```

</div>

To initialize the theme you need to run theme's `setup` function in a global JS file:
<div class="ds-code">

  ```js
  import { setup } from '@sl-design-system/sanoma-learning';

  setup();
  ```

</div>
</section>
<section>

## Start using components

To start using the button in our example, you need to import the button component in your application. You can do this by importing the button component in your main JS file:

<div class="ds-code">

  ```js
  import '@sl-design-system/button/register.js';
  ```

</div>

This will load the button component and register it as `<sl-button>`. After that you can start using the button in your application:

<div class="ds-code">

  ```html
  <sl-button>Hello world!</sl-button>
  ```
  
</div>
</section>
<section>

## Example project

To serve as an inspiration (or just something to copy-paste from) we've made an example project that uses several Design System components so you can study how they interact or have something to compare your code to if something doesn't work as expected.

You can find the [example project repository on Github](https://github.com/sl-design-system/example-design-system-lit-app)

</div>

</section>
