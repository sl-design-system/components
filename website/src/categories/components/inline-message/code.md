---
title: Inline message code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Inline message
  key: InlineMessageCode
---
<section class="no-heading">

<div class="ds-example">
  <sl-inline-message variant="danger" style="inline-size: 80%;">
      <span slot="title">There are some problems</span>
      Please fulfill all required fields:
      <ul>
        <li style="font-size: 1.4rem;">Last name is required</li>
        <li style="font-size: 1.4rem;">School name is required</li>
      </ul>
    </sl-inline-message>
</div>

<div class="ds-code">

  ```html
    <sl-inline-message variant="danger">
      <span slot="title">There are some problems</span>
      Please fulfill all...
      <ul>
        <li>Last name is required</li>
        <li>...</li>
      </ul>
    </sl-inline-message>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="inline-message"></ds-install-info>
{% include "../component-table.njk" %}
