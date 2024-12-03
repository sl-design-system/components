---
title: Combobox code
tags: code
APIdescription: {
  sl-combobox: "DESCRIPTION"
}
eleventyNavigation:
  parent: Combobox
  key: ComboboxCode
---

<section>

<div class="ds-example">

<sl-combobox multiple value='["0","1"]'>
  <sl-listbox>
    <sl-option value="0">Mathematics</sl-option>
    <sl-option value="1">Geography</sl-option>
    <sl-option value="2">Physics</sl-option>
    <sl-option value="3">History</sl-option>
  </sl-listbox>
</sl-combobox>

</div>

<div class="ds-code">

  ```html
  <sl-combobox multiple value='["0","1"]'>
    <sl-listbox>
      <sl-option value="0">Mathematics</sl-option>
      <sl-option value="1">Geography</sl-option>
      <sl-option value="2">Physics</sl-option>
      <sl-option value="3">History</sl-option>
    </sl-listbox>
  </sl-combobox>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="combobox"></ds-install-info>
{% include "../component-table.njk" %}
