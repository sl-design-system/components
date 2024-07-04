---
title: Button bar code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Button bar
  key: ButtonBarCode
---

<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-button-bar align="center" aria-label="Actions group">
    <sl-button fill="outline" variant="danger"><sl-icon name="far-trash"></sl-icon>Delete</sl-button>
    <sl-button fill="outline" variant="default"><sl-icon name="far-file-pen"></sl-icon>Edit</sl-button>
    <sl-button fill="outline" variant="primary"><sl-icon name="far-floppy-disk"></sl-icon>Save</sl-button>
    </sl-button-bar>
  </div>
</div>

<div class="ds-code">

  ```html
    <sl-button-bar align="center" aria-label="Actions group">
      <sl-button fill="outline" variant="danger"><sl-icon name="far-trash"></sl-icon>Delete</sl-button>
      <sl-button fill="outline" variant="default"><sl-icon name="far-file-pen"></sl-icon>Edit</sl-button>
      <sl-button fill="outline" variant="primary"><sl-icon name="far-floppy-disk"></sl-icon>Save</sl-button>
    </sl-button-bar>
  ```

</div>

</section>
<ds-install-info package="button-bar" link-in-navigation></ds-install-info>
{% include "../component-table.njk" %}
