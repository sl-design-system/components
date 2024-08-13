---
title: Release process
eleventyNavigation:
  parent: Guidelines
  key: Release process
---

<header class="ds-tokens__main-heading">
<div class="ds-tokens__heading-wrapper">
  <h1 class="ds-heading-1">{{title}}</h1>
  <p class="ds-tokens__heading-description">
  This describes the release process for the design system.
  </p>
</div>
</header>

<section class="ds-subpage-section">

The SL Design System uses a continuous release process. This means that every sprint we may release new versions of specific components. There is no predefined moment within a sprint when a release happens. The moment of release can depend on multiple things:

- Is there an urgent bug fix that needs to be shipped?
- Are there features we want to make available to users?
- Do we have a bunch of changes ready to be released and we want to release them all together?

Every component ships in its own NPM package. Certain exceptions are components that are closely related to each other (checkbox and checkbox group for example).

Every component follows the [Semantic Versioning](https://semver.org/) process, meaning a release can contain *major* (breaking) changes, *minor* changes (new features) or *patch* changes (usually bug fixes).

A package can have dependencies on other SLDS packages. Sometimes you may be able to use a newer version of a component, while keeping the version of the dependencies the same. Other times, a newer component version also requires updates to its dependencies. All this is handled in the `package.json` file.

Aside from these dependencies, there is no SLDS release as a whole. There is no “SLDS version 1.0”. Instead there are a bunch of NPM packages, each having its own version. The major versions of these packages also don’t have to match. For example: you could have a checkbox version 1.0.3 and a button 2.1.2.

This also means that support works differently: we ship each package/component on its own. A new major could mean something as small as changing the CSS part name within the component. Major just means it’s a breaking change. It doesn’t mean a lot has actually changed. Usually that also means that upgrading to a new major version is not a lot of effort.

Changes to some packages are more impactful. One example of this is the `@sl-design-system/form` package. This contains the building blocks for all form controls. If, at some point, this package gets a new major release, you most likely also have to upgrade the form controls you are using. But that will also be specified in the `package.json` files of each package.

All the changes to a component are listed in the `CHANGELOG.md` file within the [GitHub repository](https://github.com/sl-design-system/components). Before upgrading to a new (major) version, please check the changes in that file, so you know what to expect.

Bottom line: we actively support the latest versions of components. If however there is a valid reason to support older versions, we will evaluate that on a case-by-case basis.

</section>
