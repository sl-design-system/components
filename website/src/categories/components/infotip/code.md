---
title: Infotip code
tags: code
APIdescription: {
  sl-infotip: "The infotip component renders an icon button that toggles a popover containing slotted content. Place it inside the <code>infotip</code> slot of <code>sl-label</code> to associate it with a form field."
}
eleventyNavigation:
  parent: Infotip
  key: InfotipCode
---

<section class="no-heading">
<div class="ds-example">

<sl-form-field>
  <sl-label>
    Username
    <sl-infotip slot="infotip" size="sm">This field requires a unique identifier used for account login.</sl-infotip>
  </sl-label>
  <sl-text-field placeholder="Username"></sl-text-field>
</sl-form-field>

</div>

<div class="ds-code">

```html
<sl-form-field>
  <sl-label>
    Username
    <sl-infotip slot="infotip" size="sm">This field requires a unique identifier used for account login.</sl-infotip>
  </sl-label>
  <sl-text-field placeholder="Username"></sl-text-field>
</sl-form-field>
```

</div>
</section>

<ds-install-info link-in-navigation package="infotip"></ds-install-info>
{% include "../component-table.njk" %}
