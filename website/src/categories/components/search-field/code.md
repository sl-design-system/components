---
title: Search field code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Search field
  key: SearchFieldCode
---
<section class="no-heading">

<div class="ds-example">
  <sl-search-field placeholder="Search"></sl-search-field>
</div>

<div class="ds-code">

  ```html
    <sl-search-field placeholder="Search"></sl-search-field>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="search-field"></ds-install-info>
<section>

## Search element

When using the search field as a standalone component, please wrap the search field in a `<search>` element to ensure the search field is accessible to screen readers. For more information, see this [article on the search element](https://www.scottohara.me/blog/2023/03/24/search-element.html) by Scott O'Hara.

</section>

{% include "../component-table.njk" %}
