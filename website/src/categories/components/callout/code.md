---
title: Callout code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Callout
  key: CalloutCode
---
<style>
.ds-example sl-callout .content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ds-example sl-callout sl-button {
  align-self: flex-start;
}
.ds-example sl-callout a {
  color: var(--sl-color-component-link-idle, var(--sl-color-link-idle));
}
.title {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  font-family: inherit;
  margin: 0;
}
</style>
<section class="no-heading">
<div class="ds-example">
  <sl-callout density="relaxed" variant="caution">
    <h2 class="title" slot="title">New learning module available</h2>
    <div class="content">
      Your teacher has added a new module: <a href="javascript:void(0)">Introduction to Fractions</a> Complete it before the end of the week to stay on track.
      <sl-button class="callout-button" fill="outline" variant="warning">Start module</sl-button>
    </div>
  </sl-callout>
</div>

<div class="ds-code">

  ```html
  <sl-callout density="relaxed" variant="caution">
    <h2 slot="title">New learning module available</h2>
    <div class="content">
      Your teacher has added a new module:
      <a href="/introduction-to-fractions">Introduction to Fractions</a>.
      Complete it before the end of the week to stay on track.
      <sl-button fill="outline" variant="warning">
        Start module
      </sl-button>
    </div>
  </sl-callout>
  ```

</div>
</section>

<ds-install-info link-in-navigation package="callout"></ds-install-info>

<section>

## Link styling

If your application has global link styles, or if links are nested inside other elements (like `<p>`, `<span>`, or `<div>`), we recommend using the `global.css` file from your theme package. The component cannot style nested slotted elements, so `global.css` makes sure links always look correct.

</section>

{% include "../component-table.njk" %}
