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
      There are some problems
      <span slot="description">Please fulfill all required fields:</span>
      <span slot="details">
        <ul>
          <li style="font-size: 1.4rem;">Last name is required</li>
          <li style="font-size: 1.4rem;">School name is required</li>
        </ul>
      </span>
    </sl-inline-message>
</div>

<div class="ds-code">

  ```html
    <sl-inline-message variant="danger">
      There are some problems
      <span slot="description">Please fulfill all...</span>
      <span slot="details">
        <ul>
          <li>Last name is required</li>
          <li>...</li>
        </ul>
      </span>
    </sl-inline-message>
  ```

</div>

</section>

<section>

## Installation

With npm

<div class="ds-code">

  ```bash
    npm install @sl-design-system/inline-message
  ```

</div>

With yarn

<div class="ds-code">

  ```bash
    yarn add @sl-design-system/inline-message
  ```
</div>

</section>

{% include "../component-table.njk" %}
