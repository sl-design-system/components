---
title: Radio group code
tags: code
APIdescription: {
  sl-radio-group: "Radio group is the wrapper for the radiobuttons that represent the options for one value in your form. Per radio-group you can only check one radio button.",
  sl-radio: "The radio button is a single button that can either be selected or deselected (by picking another option in the same radio-group)."
}
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
