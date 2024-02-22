---
title: Select code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Select
  key: SelectCode
---
<section>

<div class="ds-example">
  <div class="ds-example__examples-wrapper">
  <sl-select style="inline-size: 30rem;">
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

<section>

## Installation

With npm

<div class="ds-code">

  ```bash
    npm install @sl-design-system/select
  ```

</div>

With yarn

<div class="ds-code">

  ```bash
    yarn add @sl-design-system/select
  ```
</div>

</section>

{% include "../component-table.njk" %}