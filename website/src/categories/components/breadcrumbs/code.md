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
<sl-breadcrumbs homeUrl="/">
  <a href="javascript:void(0)">Lorem</a>
  <a href="javascript:void(0)">Ipsum</a>
  <a href="javascript:void(0)">Dolor</a>
  <a href="javascript:void(0)">Sit</a>
  <a href="javascript:void(0)">Amet</a>
  <a href="javascript:void(0)">Foo</a>
  <a href="javascript:void(0)">Bar</a>
</sl-breadcrumbs>
</div>

<div class="ds-code">

  ```html
    <sl-breadcrumbs homeUrl="/">
      <a href="...">Lorem</a>
      <a href="...">Ipsum</a>
      <a href="...">Dolor</a>
      <a href="...">Sit</a>
      <a href="...">...</a>
      ...
    </sl-breadcrumbs>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="breadcrumbs"></ds-install-info>

{% include "../component-table.njk" %}