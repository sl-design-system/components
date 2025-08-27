---
title: Tree code
tags: code
APIdescription: {
  sl-tree: "Tree has a range of properties to define the experience in different use cases.",
  sl-tree-node: "Tree list component provides properties to define the experience in different use cases, and it is a kind of wrapper for multiple tags."
}
eleventyNavigation:
  parent: Tree
  key: TreeCode
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
    <sl-tag removable>Mathematics</sl-tag>
    <sl-tag removable>Geography</sl-tag>
    <sl-tag removable>Physics</sl-tag>
    <sl-tag removable>Biology</sl-tag>
    <sl-tag removable>Chemistry</sl-tag>
    <sl-tag removable>Computer Science</sl-tag>
    <sl-tag removable>English</sl-tag>
  </sl-tag-list>
  </div>
</div>

<div class="ds-code">

  ```html
    <sl-tag-list stacked>
      <sl-tag removable>Mathematics</sl-tag>
      ...
      <sl-tag removable>English</sl-tag>
    </sl-tag-list>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="tree"></ds-install-info>
{% include "../component-table.njk" %}
