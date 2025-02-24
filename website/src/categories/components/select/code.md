---
title: Select code
tags: code
APIdescription: {
  sl-select: "Select component has a range of properties, attributes etc. to define the experience in different use cases, and it can be used as the replacement of the HTML native select element."
}
eleventyNavigation:
  parent: Select
  key: SelectCode
---
<section>

<div class="ds-example">
  <div class="ds-example__examples-wrapper">
  <sl-select style="inline-size: 30rem;" aria-label="List of available subjects">
    <sl-option-group heading="Languages">
      <sl-option>English</sl-option>
      <sl-option>German</sl-option>
      <sl-option>French</sl-option>
      <sl-option>Spanish</sl-option>
      <sl-option>Chinese</sl-option>
    </sl-option-group>
    <sl-option>Music</sl-option>
    <sl-option-group heading="Science">
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
    <sl-option-group heading="Languages">
      <sl-option>English</sl-option>
      <sl-option>German</sl-option>
      ...
    </sl-option-group>
    <sl-option>Music</sl-option>
    <sl-option-group heading="Science">
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
