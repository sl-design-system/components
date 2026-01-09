---
title: Breadcrumbs code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Breadcrumbs
  key: BreadcrumbsCode
---
<section class="no-heading">

<div class="ds-example">
<sl-breadcrumbs>
  <a href="javascript:void(0)">Learning and Teaching</a>
  <a href="javascript:void(0)">Pupils</a>
  <a href="javascript:void(0)">Class Pages</a>
  <a href="javascript:void(0)">Year 1</a>
  <a href="javascript:void(0)">Learning Materials</a>
</sl-breadcrumbs>
</div>

<div class="ds-code">

  ```html
    <sl-breadcrumbs>
      <a href="...">Learning and Teaching</a>
      <a href="...">Pupils</a>
      ...
      <a href="...">Learning Materials</a>
    </sl-breadcrumbs>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="breadcrumbs"></ds-install-info>
<section>

  ## Breadcrumb items
  
  When using the breadcrumb component in combination with routing technology from your framework it could be that you can't use `a` tags with an `href` property. In that case you can use the breadcrumb item component. Those are read and handled the same way as `a` tags, so they appear in the menu when the breadcrumbs are collapsed and styled the same as regular links.

  For example:
  <div class="ds-code">

  ```html
    <sl-breadcrumbs>
      <sl-breadcrumb-item navigateTo="learning-teaching">Learning and Teaching</sl-breadcrumb-item>
      <sl-breadcrumb-item navigateTo="pupils">Pupils</sl-breadcrumb-item>
      ...
      <sl-breadcrumb-item navigateTo="learning-materials">Learning Materials</sl-breadcrumb-item>
    </sl-breadcrumbs>
  ```
  </div>
</section>
{% include "../component-table.njk" %}
