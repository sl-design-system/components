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
<sl-badge emphasis="bold" size="sm" variant="danger"></sl-badge>
<sl-badge emphasis="bold" variant="success"><sl-icon name="check"></sl-icon></sl-badge>
<sl-badge variant="info">100</sl-badge>
<sl-badge size="lg" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
<sl-badge size="lg" variant="primary">Biology teacher</sl-badge>
</div>

<div class="ds-code">

  ```html
<sl-badge emphasis="bold" size="sm" variant="danger"></sl-badge>
<sl-badge emphasis="bold" variant="success"><sl-icon name="check"></sl-icon></sl-badge>
<sl-badge variant="info">100</sl-badge>
<sl-badge size="lg" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
<sl-badge size="lg" variant="primary">Biology teacher</sl-badge>
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