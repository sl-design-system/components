---
title: Select code
tags: code
APIdescription: {
  sl-select: "Select component has a range of properties, attributes etc. to define the experience in different use cases, and it can be used as the replacement of the HTML native select element.",
  sl-select-option: "Select option component offers settings for various scenarios, and it is a part of the select component representing each selectable element.",
  sl-select-option-group: "Select option group component provides properties to define the experience in different use cases, and it is a kind of wrapper for multiple select options, can be used optionally to improve readability."
}
eleventyNavigation:
  parent: Select
  key: SelectCode
---
<section>

<div class="ds-example">
  <div class="ds-example__examples-wrapper">
  <sl-select style="inline-size: 30rem;" aria-label="List of available subjects">
    <sl-select-option-group heading="Languages">
      <sl-select-option>English</sl-select-option>
      <sl-select-option>German</sl-select-option>
      <sl-select-option>French</sl-select-option>
      <sl-select-option>Spanish</sl-select-option>
      <sl-select-option>Chinese</sl-select-option>
    </sl-select-option-group>
    <sl-select-option>Music</sl-select-option>
    <sl-select-option-group heading="Science">
      <sl-select-option>Biology</sl-select-option>
      <sl-select-option>Chemistry</sl-select-option>
      <sl-select-option>Physics</sl-select-option>
      <sl-select-option>Computer Science</sl-select-option>
    </sl-select-option-group>
  </sl-select>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-select>
    <sl-select-option-group heading="Languages">
      <sl-select-option>English</sl-select-option>
      <sl-select-option>German</sl-select-option>
      ...
    </sl-select-option-group>
    <sl-select-option>Music</sl-select-option>
    <sl-select-option-group heading="Science">
      <sl-select-option>Biology</sl-select-option>
      <sl-select-option>Chemistry</sl-select-option>
      ...
    </sl-select-option-group>
  </sl-select>
  ```

</div>

</section>

<ds-install-info package="select"></ds-install-info>

{% include "../component-table.njk" %}
