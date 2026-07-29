---
title: Tooltip code
tags: code
APIdescription: {
  sl-tooltip: "Tooltip component has a range of properties to define the experience in different use cases. <code>sl-tooltip</code> component is recommended to use in all non-LitElement applications. Tooltip component should be a sibling of the element it is describing (not a child element).",
  TooltipDirective: "When working on the application with LitElement, <code>TooltipDirective</code> can be used as an alternative way for adding <code>sl-tooltip</code> component. This is a LitElement specific directive."
}
eleventyNavigation:
  parent: Tooltip
  key: TooltipCode
---

<section class="no-heading">

The tooltip should be a sibling of the elements it belongs to (not a child element). Point the `for` attribute at the id of the anchor element. To share one tooltip between multiple elements, pass several ids separated by spaces.

<div class="ds-example">
<sl-button-bar>
  <sl-button id="shared-we" fill="solid" variant="primary">We</sl-button>
  <sl-button id="shared-share" fill="solid" variant="primary">share</sl-button>
  <sl-button id="shared-the" fill="solid" variant="primary">the</sl-button>
  <sl-button id="shared-same" fill="solid" variant="primary">same</sl-button>
  <sl-button id="shared-tooltip" fill="solid" variant="primary">tooltip</sl-button>
</sl-button-bar>
<sl-tooltip for="shared-we shared-share shared-the shared-same shared-tooltip" type="description">I am shared between different elements</sl-tooltip>

</div>

<div class="ds-code">

  ```html
<sl-button id="shared-we" fill="solid" variant="primary">We</sl-button>
<sl-button id="shared-share" fill="solid" variant="primary">share</sl-button>
<sl-button id="shared-the" fill="solid" variant="primary">the</sl-button>
<sl-button id="shared-same" fill="solid" variant="primary">same</sl-button>
<sl-button id="shared-tooltip" fill="solid" variant="primary">tooltip</sl-button>
<sl-tooltip for="shared-we shared-share shared-the shared-same shared-tooltip" type="description">I am shared between different elements</sl-tooltip>
  ```

</div>

Every element listed in `for` gets the tooltip's hover, focus and click triggers, and the tooltip is positioned against whichever one the user interacted with.

Use `type` to control how the tooltip is linked for screen readers. The default, `label`, exposes the tooltip as the accessible name of the anchor and is what you want for icon-only buttons. Use `type="description"` — as in the example above — when the anchor already has its own label and the tooltip only adds extra information.

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

### Add config with the directive

You can also pass a second argument: a **config** object. Use this to control how the tooltip appears.

<div class="ds-code">

```js
// Basic string content + position + max width
html`<sl-button ${tooltip('More info', { position: 'right', maxWidth: 240 })}>Hover me</sl-button>`;

// Use ariaRelation: 'label' when the tooltip should be used as the accessible label (e.g. icon only buttons)
html`<sl-button ${tooltip('Settings', { ariaRelation: 'label' })}><sl-icon name="smile"></sl-icon></sl-button>`;
```

</div>

### Available config options

- **position**: Where the tooltip shows relative to the anchor. One of: `top`, `right`, `bottom`, `left`, `top-start`, `top-end`, `right-start`, `right-end`, `bottom-start`, `bottom-end`, `left-start`, `left-end`. Default: `top`.
- **maxWidth**: A `number` (pixels). The maximum width of the tooltip.
- **ariaRelation**: How the tooltip is linked for screen readers. A `description` (default) uses `aria-describedby`, `label` uses `aria-labelledby` and should be used when the tooltip text is the actual label of the anchor element (like an icon-only button).

If you omit a `config` it just uses its default behaviour. Config options are optional.

</section>

<section>

## Tooltip.lazy helper

`Tooltip.lazy` is a small helper that creates a tooltip only when the user first hovers or focuses the target element.
This avoids unnecessary processing if the user never interacts with it.

Basic shape:

```ts
import { Tooltip } from '@sl-design-system/tooltip';

const cleanup = Tooltip.lazy(targetElement, tooltip => {
  // Runs once when the tooltip is actually created
  tooltip.textContent = 'Hello there';
});
```

With options:

```ts
Tooltip.lazy(button, tooltip => {
    tooltip.textContent = 'Settings';
    tooltip.position = 'bottom-start';
  },
  {
    ariaRelation: 'label',
    context: shadowRoot,
    parentNode: someContainer,
  }
);
```

### Available options

- **ariaRelation**: How the tooltip is linked for screen readers. A `description` (default) uses `aria-describedby`, `label` uses `aria-labelledby` and should be used when the tooltip text is the actual label of the anchor element (like an icon-only button).
- **context**: A `Document` or `ShadowRoot` to create the `<sl-tooltip>` element in. If not provided, the tooltip will be created on the target element if it has a `shadowRoot`, or the root node of the target element.
- **parentNode**: A `Node` where the tooltip element should be inserted. This can be useful when you don't want the tooltip to be added next to the anchor element. If not provided, it will be added next to the anchor element.

</section>

{% include "../component-table.njk" %}
