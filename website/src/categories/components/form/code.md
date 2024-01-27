---
title: Form code
tags: code
APIdescription: {
  sl-form: "Form component is meant as a wrapper around form fields.",
  sl-form-field: "Checkbox group component provides properties to define the experience in different use cases, and it is a kind of wrapper for multiple checkboxes."
}
eleventyNavigation:
  parent: Form
  key: FormCode
---

<section>

<div class="ds-example">

<form id="checkboxes-example" class="ds-example__code-wrapper">
  <sl-checkbox value="yes">Checkbox</sl-checkbox>
  <sl-checkbox disabled value="yes">Disabled</sl-checkbox>
  <sl-checkbox checked disabled value="yes" >Disabled checked</sl-checkbox>
  <sl-checkbox checked valid value="yes">Valid</sl-checkbox>
  <sl-checkbox checked invalid required value="yes">Invalid</sl-checkbox>
</form>

</div>

<div class="ds-code">

  ```html
  <form>
    <sl-checkbox value="yes">
      Checkbox
    </sl-checkbox>
    <sl-checkbox disabled value="yes" >
      Disabled
    </sl-checkbox>
    <sl-checkbox checked disabled value="yes">
      Disabled checked
    </sl-checkbox>
    <sl-checkbox checked valid value="yes">
      Valid
    </sl-checkbox>
    <sl-checkbox checked invalid required value="yes">
      Invalid
    </sl-checkbox>
  </form>
  ```

</div>

</section>

{% include "../component-table.njk" %}

<script>
  setTimeout(() => document.querySelector('#checkboxes-example')?.reportValidity(), 100);
</script>