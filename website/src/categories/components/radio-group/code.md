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

  <sl-form-field label="Which animal do you like best?">
    <sl-radio-group value="cat">
      <sl-radio value="dog">Dog</sl-radio>
      <sl-radio value="cat">Cat</sl-radio>
      <sl-radio value="hamster">Hamster</sl-radio>
    </sl-radio-group> 
  </sl-form-field>

</div>

<div class="ds-code">

  ```html 
  <sl-form-field label="Which animal do you like best?">
    <sl-radio-group value="cat">
      <sl-radio value="dog">Dog</sl-radio>
      <sl-radio value="cat">Cat</sl-radio>
      <sl-radio value="hamster">Hamster</sl-radio>
    </sl-radio-group> 
  </sl-form-field>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="radio-group"></ds-install-info>
{%- include "../component-table.njk" -%}
