---
title: Welcome to the Sanoma Learning Design System
layout: base.njk
eleventyNavigation:
  key: Pages
---

<style>
.collections {
  border-radius: 3px;
  width: 50%;
  padding: 16px 0;
  box-shadow: 0 0 0 1px lightgray,0 1px 5px rgba(12, 12, 12, 0.05),0 0 40px rgba(12, 12, 12, 0.015);
}

ul {
  list-style: none;
}
</style>

[//]: # (** &#40;Left for the future use&#41;)

[//]: # (<div class="collections">)

[//]: # ({% for category in collections.categories %})

[//]: # (- [ {{ category.data.title }} ]&#40; {{ category.url }} &#41;)

[//]: # ({% endfor %})

[//]: # (</div>)


[//]: # (### Not SSR:)

[//]: # (<ds-test-element></ds-test-element>)

[//]: # ()
[//]: # (### SSR:)

[//]: # (<is-land on:interaction="pointerenter" import="/js/components/test-component.js">)

[//]: # (<ds-test-element count="10"></ds-test-element>)

[//]: # (</is-land>)

[//]: # ()
[//]: # (### SSR:)

[//]: # (<is-land on:interaction="pointerenter" import="/js/components/my-counter.js">)

[//]: # (<my-counter></my-counter>)

[//]: # (</is-land>)

[//]: # ()
[//]: # (### not SSR:)

[//]: # (<my-counter></my-counter>)

<section class="ds-explore">

## Explore

<div class="ds-explore-wrapper">

<div class="ds-explore__components">

<div class="ds-explore__components-image"></div>

### Components

Sanoma Learning’s UI components are built to best practices to ensure usability, performance and accessibility.

</div>

<div class="ds-explore__design-tokens">

<div class="ds-explore__design-tokens-image"></div>

### Design tokens

Tokens are platform-agnostic variables that represent the look and feel of our brands.

</div>

<div class="ds-explore__guidelines">

<div class="ds-explore__guidelines-image"></div>

### Guidelines

Practical guides to get started with designing and developing experiences with Sanoma Learning’s Design System.

</div>

</div>

</section>