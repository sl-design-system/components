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

## Make sure you have access

Even though the SL Design System is open source, the packages are not. That is why you need to get access to the npm packages in order to install them locally. First the SL Design System need to add you to the list of users who can access the packages. To be added to that list you can <a href="mailto:designsystem@sanoma.com">send us an email</a> or reach out to us in our Slack channel.

Once you are added you need to [create up a personal access token (classic) on Github](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic). This newly created token needs to be added to your .npmrc file, along with a reference to where the `@sl-design-system` packages can be found:
<div class="ds-code">

  ```bash
  //npm.pkg.github.com/:_authToken=<token you just generated>
  @sl-design-system:registry=https://npm.pkg.github.com
  ```

</div>
</section>
<section>

## Installing the SL Design System package(s)

To get started using the SL Design System, you can install it via npm. Each component and theme has its own package. So if you want to use a `button` component with the Sanoma Learning theme, you do:

<div class="ds-code">

  ```bash
  npm add @sl-design-system/button 
  ```

</div>
</section>
<section>

## Setup a theme

To start using the SL Design System, you need to setup a theme for your application. The theme determines how your application looks. There is a theme for every major product within Sanoma Learning. You can install a theme as by installing the NPM package, in this example we use the `sanoma-learning` theme.

<div class="ds-code">

  ```bash
  npm add @sl-design-system/sanoma-learning
  ```

</div>

After installing the theme, you need to import the theme in your application. You can do this by loading the theme in your application in your angular.json, in all the places where you include your other css files:

<div class="ds-code">

  ```json
   './node_modules/@sl-design-system/sanoma-learning/all.css'
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
