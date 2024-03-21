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

## Steps

Please follow the steps below when first getting started:
1. [Make sure you have access](#make-sure-you-have-access)
2. [Installing the SL Design System package(s)](#installing-the-sl-design-system-package(s))
3. [Setup a theme](#setup-a-theme)
4. [Add polyfills](#add-polyfills)
5. [Start using components](#start-using-components)

</section>

<section>

## Make sure you have access

Even though the SL Design System is open source, the packages are not publicly available. That is why you need to get access to the GitHub npm packages in order to install them locally. First the SL Design System team needs to add you to the list of users who can access the packages. To be added, you need to provide your @sanoma.com (or other company) email address to us in [our Slack channel](https://sanoma.slack.com/archives/C03SA9HUUA3) or you can <a href="mailto:designsystem@sanoma.com">send us an email</a>.
You don't have to create a new, separate GitHub account with your Sanoma Learning email address if you have an existing GitHub account and want to use that. Just add your @sanoma.com email address to the list of email addresses in GitHub.

Once you are added you need to [create a *classic* personal access token on GitHub](https://docs.GitHub.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic). Make sure that this token has at least the `read_packages` privilege. This newly created token needs to be added to the `.npmrc` file in your home directory, along with a reference to where the `@sl-design-system` packages can be found:

<div class="ds-code">

  ```txt
  //npm.pkg.github.com/:_authToken=<token you just generated>

  @sl-design-system:registry=https://npm.pkg.github.com
  ```

</div>

Make sure you add the token to `~/.npmrc`, the file in your home directory, not in a project folder. That way you don't run the risk of accidentally committing and pushing your secret token.

</section>
<section>

## Installing the SL Design System package(s)

To get started using the SL Design System, you can install it via npm. Each component and theme has its own package.

Some packages have 3rd party dependencies that need to be installed as well. Some of these dependencies may already be used in your own application. To make sure that those dependencies are not installed twice, they are marked as `peerDependencies` in the `package.json` of the SLDS packages. This means that you need to install them yourself. For example, the `@sl-design-system/badge` package has `lit` as a peer dependency. If you are using `lit` in your application, you don't need to install it again. If you are not using `lit` yet, you need to install it. Your package manager will warn you if you haven't installed these peer dependencies yet.

So if you want to use a `button` component with the Sanoma Learning theme, you do:

<div class="ds-code">

  ```bash
  npm add @sl-design-system/button
  ```

</div>

Or if you use `yarn`:

<div class="ds-code">

  ```bash
  yarn add @sl-design-system/button
  ```

</div>

</section>

<section>

## Setup a theme

To start using the SL Design System, you need to setup a theme for your application. The theme determines how your application looks. There is a theme for every major product within Sanoma Learning.

Please note that the webfonts of your application are not a part of the theme. There are different ways of loading the fonts an application uses. If is up to you to load the webfonts in your application.

You can install a theme as by installing the NPM package, in this example we use the `sanoma-learning` theme.

<div class="ds-code">

  ```bash
  npm add @sl-design-system/sanoma-learning
  ```

</div>

Or if you use `yarn`:

<div class="ds-code">

  ```bash
  yarn add @sl-design-system/sanoma-learning
  ```

</div>

After installing the theme, you need to import the theme in your application. How you do this depends on the framework you are using.

The simplest way to include the theme is by including the theme stylesheet in your HTML:

<div class="ds-code">

```html
<link href="./node_modules/@sl-design-system/sanoma-learning/all.css" rel="stylesheet">
```

</div>

If you are working in an Angular application you can do this by adding the theme stylesheet in your `angular.json`, as explained [in the official Angular documentation](https://angular.io/guide/workspace-config#styles-and-scripts-configuration).

When your theme doesn't support dark mode yet (check with your teams designer or with the SLDS team) you should use `base.css` and `light.css` instead of `all.css`

To initialize the theme you need to run theme's `setup` function in a global JS file:

<div class="ds-code">

  ```js
  import { setup } from '@sl-design-system/sanoma-learning';

  setup();
  ```

</div>

When you're using Angular this can be done in `main.ts` in the root folder of your application for example.

</section>

<section>

## Add polyfills

The SL Design System tries to use modern web standards as much as possible. This means that some of the components might not work in older browsers. To make sure the components work in older browsers you need to add polyfills.

Make sure you include the polyfills before you include the SLDS components. This is because the polyfills need to be loaded before the components are loaded.

The following web standards require polyfills at this time:
- [Popover](https://caniuse.com/mdn-api_htmlelement_popover)
- [Scoped Custom Element Registry](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md)

To use these polyfills, you need to install the following packages:
- `@oddbird/popover-polyfill`
- `@webcomponents/scoped-custom-element-registry`

Once installed you need to import the polyfills in your application. You can do this by importing the polyfills in your main JS file:

```js
import '@oddbird/popover-polyfill';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
```

Another option is to include them in your HTML:

```html
<script src="./node_modules/@oddbird/popover-polyfill/dist/popover.min.js"></script>
<script src="./node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
```

</section>

<section>

## Start using components

To start using the button in our example, you need to import the button component in your application. You can do this by importing the button component in your main JS file:

```js
import '@sl-design-system/button/register.js';
```

This will load the button component and register it as `<sl-button>`. After that you can start using the button in your application:

```html
<sl-button>Hello world!</sl-button>
```

If you encounter errors compiling because Angular doesn't recognize the SLDS components as valid tags you can add `CUSTOM_ELEMENTS_SCHEMA`. We are still thinking about a solution to wrap our components with an Angular shell so this step is no longer necessary.

</section>

<section>

## Example project

To serve as an inspiration (or just something to copy-paste from) we've made some example projects that uses several Design System components so you can study how they interact or have something to compare your code to if something doesn't work as expected.

You can find the [Angular example project repository on GitHub](https://GitHub.com/sl-design-system/angular-demo)

You can find the [Lit example project repository on GitHub](https://GitHub.com/sl-design-system/example-design-system-lit-app)

</section>

<section>

## Troubleshooting and FAQ

### The font in the components doesn't match the rest of my application.

Make sure the font you use in the application has the exact same name as the font used in the theme tokens. We took a survey on which themes use which font, so in theory it should work out of the box. If that is not the case change the name of your font family name in your app.
Because the font name in the token needs to match the name of the font used in Figma we are a little less flexible.
If the names match but the font still doesn't load check if the font is actually loaded. The components use the font available in the app, so if you need to add fonts do this like you normally would.
When you still encounter problems with the loading and using of your fonts you can reach out to us.

### The icons in my components are broken.

Please make sure you have added the `setup()` method as described in the [Setup a theme](#setup-a-theme) section. This method also initializes the icon set.

### How do I use the dark mode of the theme?

This only applies to themes that support dark mode.
When you include the `all.css` file both light and dark mode are included and triggered by the system or browser preference (using `@media (prefers-color-scheme: dark)`). If you want to control the use of the light and dark mode you can load the `light.css` and `dark.css` based on the condition you want. Don't forget to also include `base.css` in addition to the light and dark file. You won't need `all.css` when using the separate files.

Another option is not to directly include the css files, but use the SCSS mixins we provide: `@mixin sl-theme-base`, `@mixin sl-theme-light` and `@mixin sl-theme-dark` in their respective `.scss` files in the theme. Those mixins print the list of tokens so you can wrap the tokens with whatever selector you want to achieve the theme switching.

### How do I setup my Bitbucket pipeline to work with the SLDS packages?

For the Sanoma Learning Bitbucket pipelines, there is a common token that you can use to authenticate with the GitHub NPM registry. For your projects' `.npmrc` you can use the following line to authenticate with the GitHub NPM registry:

```
//npm.pkg.github.com/:_authToken=${SLDESIGNSYSTEMS_GITHUB_NPM_AUTH_TOKEN}
```

### Which browsers are supported?

We support the 2 latest versions of the major browsers Chrome, Edge, Firefox and Safari. For example if the latest version is Chrome 100, we support Chrome 100 and 99.

### Which versions of Angular are supported?

We support the 2 latest versions of Angular. You can find these version in [the documentation on Angular.io](https://angular.io/guide/releases#actively-supported-versions).

### Do you support SSR?

Server-side rendered web components is a hard problem and the web standards related to this continue to evolve. At the moment we do not support this, but we may look at this again in the future.

</section>
