---
title: Select code
tags: code
APIdescription: {
  sl-select: "Select component has a range of properties, attributes etc. to define the experience in different use cases, and it can be used as the replacement of the HTML native select element.",
  sl-listbox: "Listbox is a reusable container component for a list of options, used internally by Select component (and a few other components).",
  sl-option: "Option represents a single option in a list of options, used internally by components like Select and Listbox.",
}
eleventyNavigation:
  parent: Select
  key: SelectCode
---
<section>

<div class="ds-example">
  <div class="ds-example__examples-wrapper">
  <sl-select style="inline-size: 30rem;" aria-label="List of available subjects">
    <sl-option-group label="Languages">
      <sl-option>English</sl-option>
      <sl-option>German</sl-option>
      <sl-option>French</sl-option>
      <sl-option>Spanish</sl-option>
      <sl-option>Chinese</sl-option>
    </sl-option-group>
    <sl-option>Music</sl-option>
    <sl-option-group label="Science">
      <sl-option>Biology</sl-option>
      <sl-option>Chemistry</sl-option>
      <sl-option>Physics</sl-option>
      <sl-option>Computer Science</sl-option>
    </sl-option-group>
  </sl-select>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-select>
    <sl-option-group label="Languages">
      <sl-option>English</sl-option>
      <sl-option>German</sl-option>
      ...
    </sl-option-group>
    <sl-option>Music</sl-option>
    <sl-option-group label="Science">
      <sl-option>Biology</sl-option>
      <sl-option>Chemistry</sl-option>
      ...
    </sl-option-group>
  </sl-select>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="select"></ds-install-info>
{% include "../component-table.njk" %}
