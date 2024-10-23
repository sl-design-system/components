---
title: Toggle group code
tags: code
APIdescription: Component is a kind of wrapper for toggle-buttons with some additional features. Toggle group should be used together with toggle buttons inside.
  More information about toggle buttons can be found in <a href="/categories/components/toggle-button/usage/" target="_blank">the toggle button documentation</a>.
eleventyNavigation:
  parent: Toggle group
  key: ToggleGroupCode
---

<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__code-wrapper">
  <sl-toggle-group multiple>
    <sl-toggle-button pressed>
      <sl-icon name="far-badge-check" slot="default"></sl-icon>
      <sl-icon name="fas-badge-check" slot="pressed"></sl-icon>
      Passed
    </sl-toggle-button>
    <sl-toggle-button>
      <sl-icon name="far-bell-exclamation" slot="default"></sl-icon>
      <sl-icon name="fas-bell-exclamation" slot="pressed"></sl-icon>
      Failed
    </sl-toggle-button>
  </sl-toggle-group>
  <sl-toggle-group>
    <sl-toggle-button aria-label="Grid view" pressed>
      <sl-icon name="far-grid" slot="default"></sl-icon>
      <sl-icon name="fas-grid" slot="pressed"></sl-icon>
    </sl-toggle-button>
    <sl-toggle-button aria-label="List view">
      <sl-icon name="far-list-ul" slot="default"></sl-icon>
      <sl-icon name="fas-list-ul" slot="pressed"></sl-icon>
    </sl-toggle-button>
  </sl-toggle-group>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-toggle-group multiple>
    <sl-toggle-button pressed>
      <sl-icon name="far-badge-check" slot="default"></sl-icon>
      <sl-icon name="fas-badge-check" slot="pressed"></sl-icon>
      Passed
    </sl-toggle-button>
    <sl-toggle-button>
      <sl-icon name="far-bell-exclamation" slot="default"></sl-icon>
      <sl-icon name="fas-bell-exclamation" slot="pressed"></sl-icon>
      Failed
    </sl-toggle-button>
  </sl-toggle-group>
  <sl-toggle-group>
    <sl-toggle-button aria-label="Grid view" pressed>
      <sl-icon name="far-grid" slot="default"></sl-icon>
      <sl-icon name="fas-grid" slot="pressed"></sl-icon>
    </sl-toggle-button>
    <sl-toggle-button aria-label="List view">
      <sl-icon name="far-list-ul" slot="default"></sl-icon>
      <sl-icon name="fas-list-ul" slot="pressed"></sl-icon>
    </sl-toggle-button>
  </sl-toggle-group>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="toggle-group"></ds-install-info>

{% include "../component-table.njk" %}