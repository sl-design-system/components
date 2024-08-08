---
title: Tag code
tags: code
APIdescription: {
  sl-tag: "Tag has a range of properties to define the experience in different use cases.",
  sl-tag-list: "Tag list component provides properties to define the experience in different use cases, and it is a kind of wrapper for multiple tags."
}
eleventyNavigation:
  parent: Tag
  key: TagCode
---
<style>
.ds-example__tag-list {
  inline-size: 400px;
}
</style>
<section>

<div class="ds-example">
  <div class="ds-example__tag-list">
  <sl-tag-list stacked>
    <sl-tag label="Mathematics" removable></sl-tag>
    <sl-tag label="Geography" removable></sl-tag>
    <sl-tag label="Physics" removable></sl-tag>
    <sl-tag label="Biology" removable></sl-tag>
    <sl-tag label="Chemistry" removable></sl-tag>
    <sl-tag label="Computer Science" removable></sl-tag>
    <sl-tag label="English" removable></sl-tag>
  </sl-tag-list>
  </div>
</div>

<div class="ds-code">

  ```html
    <sl-tag-list stacked>
      <sl-tag label="Mathematics" removable></sl-tag>
      ...
      <sl-tag label="English" removable></sl-tag>
    </sl-tag-list>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="tag"></ds-install-info>
{% include "../component-table.njk" %}
