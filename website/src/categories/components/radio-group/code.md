---
title: Radio group code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Radio group
  key: RadioGroupCode
---

<section class="no-heading">

<div class="ds-example">

  <sl-label for="radio-group">What animal do you like best?</sl-label>
  <sl-radio-group id="radio-group">
    <sl-radio>Dog</sl-radio>
    <sl-radio>Cat</sl-radio>
    <sl-radio>Hamster</sl-radio>
  </sl-radio-group>

</div>

<div class="ds-code">

  ```html 
    <sl-radio-group>
      <sl-radio>Dog</sl-radio>
      <sl-radio>Cat</sl-radio>
      <sl-radio>Hamster</sl-radio>
    </sl-radio-group>
  ```

</div>

</section>

{%- include "../component-table.njk" -%}
