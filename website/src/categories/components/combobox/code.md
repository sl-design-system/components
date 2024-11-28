---
title: Combobox code
tags: code
APIdescription: {
  sl-menu: "DESCRIPTION",
  sl-menu-item: "DESCRIPTION"
}
eleventyNavigation:
  parent: Combobox
  key: ComboboxCode
---

<section>

<div class="ds-example">

<form id="checkboxes-example" class="ds-example__code-wrapper">
  <sl-checkbox value="yes">Checkbox</sl-checkbox>
  <sl-checkbox disabled value="yes">Disabled</sl-checkbox>
  <sl-checkbox checked disabled value="yes" >Disabled checked</sl-checkbox>
  <sl-checkbox show-validity="valid" checked valid value="yes">Valid</sl-checkbox>
  <sl-checkbox show-validity="invalid" checked invalid required value="yes">Invalid</sl-checkbox>
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
    <sl-checkbox show-validity="valid" checked valid value="yes">
      Valid
    </sl-checkbox>
    <sl-checkbox show-validity="invalid" checked invalid required value="yes">
      Invalid
    </sl-checkbox>
  </form>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="checkbox"></ds-install-info>
{% include "../component-table.njk" %}

<script>
  setTimeout(() => document.querySelector('#checkboxes-example')?.reportValidity(), 100);
</script>
