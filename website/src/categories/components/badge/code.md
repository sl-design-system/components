---
title: Badge code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Badge
  key: BadgeCode
---
<section>
<div class="ds-example" style="gap: 3rem;">
<sl-badge>100</sl-badge>
<sl-badge size="sm" variant="danger"></sl-badge>
<sl-badge size="lg" variant="success"></sl-badge>
<sl-badge size="3xl" variant="warning"><sl-icon name="face-smile"></sl-icon></sl-badge>
<sl-badge size="3xl" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
<sl-badge size="2xl" variant="primary">Biology teacher</sl-badge>
</div>

<div class="ds-code">

  ```html
<sl-badge>100</sl-badge>
<sl-badge size="sm" variant="danger"></sl-badge>
<sl-badge size="lg" variant="success"></sl-badge>
<sl-badge size="3xl" variant="warning"><sl-icon name="face-smile"></sl-icon></sl-badge>
<sl-badge size="3xl" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
<sl-badge size="2xl" variant="primary">Biology teacher</sl-badge>
  ```

</div>
</section>

<section>

## Installation

With npm

<div class="ds-code">

  ```bash
    npm install @sl-design-system/badge
  ```

</div>

With yarn

<div class="ds-code">

  ```bash
    yarn add @sl-design-system/badge
  ```
</div>

</section>

{% include "../component-table.njk" %}