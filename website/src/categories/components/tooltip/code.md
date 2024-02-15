---
title: Tooltip code
tags: code
APIdescription: {
  sl-tooltip: "Tooltip component has a range of properties to define the experience in different use cases. <code>sl-tooltip</code> component is recommended to use in all non-LitElement applications.",
  TooltipDirective: "When working on the application with LitElement, <code>TooltipDirective</code> can be used as an alternative way for adding <code>sl-tooltip</code> component. This is a LitElement specific directive."
}
eleventyNavigation:
  parent: Tooltip
  key: TooltipCode
---

<section class="no-heading">
<div class="ds-example">
<sl-button-bar>
  <sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">We</sl-button>
  <sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">share</sl-button>
  <sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">the</sl-button>
  <sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">same</sl-button>
  <sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">tooltip</sl-button>
</sl-button-bar>
<sl-tooltip id="tooltip-id">I am shared between different elements</sl-tooltip>

</div>

<div class="ds-code">

  ```html
<sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">We</sl-button>
<sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">share</sl-button>
<sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">the</sl-button>
<sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">same</sl-button>
<sl-button aria-describedby="tooltip-id" fill="solid" variant="primary">tooltip</sl-button>
<sl-tooltip id="tooltip-id">I am shared between different elements</sl-tooltip>
  ```

</div>
</section>

<section>

## Installation

With npm

<div class="ds-code">

  ```bash
    npm install @sl-design-system/tooltip
  ```

</div>

With yarn

<div class="ds-code">

  ```bash
    yarn add @sl-design-system/tooltip
  ```
</div>

</section>

{% include "../component-table.njk" %}
