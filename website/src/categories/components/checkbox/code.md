---
title: Checkbox code
tags: code
APIdescription: {
  sl-checkbox: "Checkbox component has a range of properties, attributes etc. to define the experience in different use cases, and it can be used as the replacement of the HTML native checkbox.",
  sl-checkbox-group: "Checkbox group component provides properties to define the experience in different use cases, and it is a kind of wrapper for multiple checkboxes."
}
eleventyNavigation:
  parent: Checkbox
  key: CheckboxCode
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

<section>

## Installation

With npm

<div class="ds-code">

  ```bash
    npm install @sl-design-system/checkbox
  ```

</div>

With yarn

<div class="ds-code">

  ```bash
    yarn add @sl-design-system/checkbox
  ```
</div>

</section>

{% include "../component-table.njk" %}

<script>
  setTimeout(() => document.querySelector('#checkboxes-example')?.reportValidity(), 100);
</script>