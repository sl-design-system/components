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
  We actively support the latest versions of all components.
  </p>
</div>
</header>

<section class="ds-subpage-section">

<div class="ds-subpage-section__wrapper">

<section>

## Continuous release process

The SL Design System uses a continuous release process. This means that every sprint we may release new versions of specific components. There is no predefined moment within a sprint when a release happens. The moment of release can depend on multiple things:

- Is there an urgent bug fix that needs to ship?
- Are there new features we want to make available to users?
- Do we have a collection of changes ready for release, and we prefer to deploy them together?

</section>

<section>

## Component distribution

Each component is distributed as its own NPM package. However, certain components that are closely related (e.g., checkbox and checkbox-group) may be bundled together in a single package.

</section>

<section>

## Semantic versioning

We adhere to the [Semantic Versioning](https://semver.org/) protocol, so a release can include major (breaking) changes, minor changes (new features), or patch changes (typically bug fixes).

</section>

<section>

## Handling dependencies

A package may have dependencies on other SLDS packages. In some cases, you may be able to update a component to a newer version while keeping the dependency versions unchanged. In other cases, upgrading a component may require updates to its dependencies as well. These relationships are managed in the `package.json` file.

Importantly, there is no overarching SLDS version, like "SLDS version 1.0.". Instead, the system consists of multiple NPM packages, each with its own versioning. The major versions of these packages do not need to match. For example, you could have checkbox version `1.0.3` alongside button version `2.1.2`.

</section>

<section>

## Breaking changes

This versioning approach also affects how we handle support: each package/component is shipped independently. A new major release could involve something as minor as renaming a CSS class within the component. While "major" indicates a breaking change, it doesn't necessarily mean a significant overhaul. Typically, upgrading to a new major version requires minimal effort.

Some packages have more far-reaching impacts when updated. For example, the `@sl-design-system/form` package contains the foundational elements for all form controls. If this package undergoes a major release, you will likely need to upgrade the form controls you're using as well. This information will be clearly indicated in the `package.json` files of each affected package.

All the changes to a component are listed in the `CHANGELOG.md` file within the [GitHub repository](https://github.com/sl-design-system/components). Before upgrading to a new (major) version, please check the changes in that file, so you know what to expect.

In summary, we actively support the latest versions of all components. However, if there's a valid reason to support older versions, we will evaluate those cases individually.

</section>

</div>

</section>
