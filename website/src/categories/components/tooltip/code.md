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
<ds-install-info link-in-navigation package="tooltip"></ds-install-info>
<section>

## TooltipDirective API

When working on the application with LitElement, `TooltipDirective` can be used as an alternative way for adding `sl-tooltip` component. 
This is a LitElement specific directive - a custom LitElement directive. More information you can find [here](https://lit.dev/docs/templates/custom-directives/).

The `TooltipDirective` can be added to the anchor element e.g. button by passing a `string` for the tooltip content:


<div class="ds-code">

  ```js
    ${tooltip('This tooltip is from a directive')}
  ```

</div>

The complete usage example might appear as follows:


<div class="ds-code">

  ```html
    <sl-button ${tooltip('This tooltip is from a directive')}>I have a tooltip</sl-button>
  ```

</div>

</section>

{% include "../component-table.njk" %}
