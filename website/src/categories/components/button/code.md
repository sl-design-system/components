---
title: Button code
tags: code
packageName: button
APIdescription: The SL Design System button can be used to replace the default HTML button. We've tried our best to mimic all the behaviours and options you get when using a standard button. But this one looks a lot nicer!
eleventyNavigation:
  parent: Button
  key: ButtonCode
---
<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-button fill="solid" size="md">Default</sl-button>
    <sl-button fill="solid" size="md" variant="primary">Primary</sl-button>
    <sl-button fill="solid" size="md" variant="success">Success</sl-button>
    <sl-button fill="solid" size="md" variant="warning">Warning</sl-button>
    <sl-button fill="solid" size="md" variant="danger">Danger</sl-button>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-button fill="solid" size="md">Default</sl-button>
  <sl-button fill="solid" size="md" variant="primary">Primary</sl-button>
  <sl-button fill="solid" size="md" variant="success">Success</sl-button>
  <sl-button fill="solid" size="md" variant="warning">Warning</sl-button>
  <sl-button fill="solid" size="md" variant="danger">Danger</sl-button>
  ```

</div>

</section>

<ds-install-info package="button"></ds-install-info>

{% include "../component-table.njk" %}

