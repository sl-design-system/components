---
title: Toggle button code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Toggle button
  key: ToggleButtonCode
---

<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-toggle-button>
      <sl-icon name="far-gear"></sl-icon>
      <sl-icon name="fas-gear" slot="pressed"></sl-icon>
    </sl-toggle-button>
      <sl-toggle-button fill="outline" pressed>
      <sl-icon name="far-gear"></sl-icon>
      <sl-icon name="fas-gear" slot="pressed"></sl-icon>
    </sl-toggle-button>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-toggle-button>
    <sl-icon name="far-gear"></sl-icon>
    <sl-icon name="fas-gear" slot="pressed"></sl-icon>
  </sl-toggle-button>

  <sl-toggle-button fill="outline" pressed>
    <sl-icon name="far-gear"></sl-icon>
    <sl-icon name="fas-gear" slot="pressed"></sl-icon>
  </sl-toggle-button>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="toggle-button"></ds-install-info>
{% include "../component-table.njk" %}
