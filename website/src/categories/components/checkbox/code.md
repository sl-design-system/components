---
title: Checkbox code
tags: code
APIdescription: {
  sl-checkbox: "Checkbox component has a range of properties, attributes etc. to define the experience in different use cases and it can be used as the replacement of the html checkbox",
  sl-checkbox-group: "Checkbox group component has a range of properties to define the experience in different use cases and it is a kind of wrapper for multiple checkboxes."
}
eleventyNavigation:
  parent: Checkbox
  key: CheckboxCode
---

<section>
<style>
  form {
    display: flex;
    gap: 2.4rem;
  }
</style>

<div class="ds-example">

<form id="checkboxes-example">
    <sl-checkbox id="checkbox" name="checkbox" aria-label="checkbox" value="yes">Checkbox</sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" aria-label="checkbox disabled" value="yes" disabled>Disabled</sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" aria-label="checkbox disabled checked" value="yes" checked disabled>Disabled checked</sl-checkbox>
    <sl-checkbox id="checkbox-valid" name="checkbox" aria-label="checkbox valid" value="yes" valid>Valid</sl-checkbox>
    <sl-checkbox id="checkbox-invalid" name="checkbox" aria-label="checkbox invalid" value="yes" required invalid="true">Invalid</sl-checkbox>
</form>

</div>

<div class="ds-code">

  ```html
  <form id="checkboxes-example">
    <sl-checkbox id="checkbox" name="checkbox" aria-label="checkbox" value="yes">
        Checkbox
    </sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" aria-label="checkbox disabled" value="yes" disabled>
      Disabled
    </sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" aria-label="checkbox disabled checked" value="yes" checked disabled>
      Disabled checked
    </sl-checkbox>
    <sl-checkbox id="checkbox-valid" name="checkbox" aria-label="checkbox valid" value="yes" valid>
      Valid
    </sl-checkbox>
    <sl-checkbox id="checkbox-invalid" name="checkbox" aria-label="checkbox invalid" value="yes" required invalid="true">
      Invalid
    </sl-checkbox>
  </form>

  <script>
    setTimeout(() => document.querySelector('#checkboxes-example')?.reportValidity(), 100);
  </script>
  ```

</div>

</section>

{% include "../component-table.njk" %}

<script>
  setTimeout(() => document.querySelector('#checkboxes-example')?.reportValidity(), 100);
</script>