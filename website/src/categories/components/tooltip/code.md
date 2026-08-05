---
title: Tooltip code
tags: code
APIdescription: {
  sl-tooltip: "Tooltip component has a range of properties to define the experience in different use cases. The tooltip should be a sibling of the element it belongs to (not a child element) and is linked to that element with the <code>for</code> attribute."
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

Every element listed in `for` gets the tooltip's triggers, and the tooltip is positioned against whichever one the user interacted with. The tooltip looks up the ids in its own root node, so the tooltip and its anchors need to live in the same document or shadow root.

</section>
<ds-install-info link-in-navigation package="tooltip"></ds-install-info>
<section>

## Label or description

Use `type` to control how the tooltip is linked for screen readers. The default, `label`, exposes the tooltip as the accessible name of the anchor and is what you want for icon-only buttons. Use `type="description"` when the anchor already has its own label and the tooltip only adds extra information.

<div class="ds-code">

  ```html
<sl-button id="edit" fill="outline"><sl-icon name="far-pen"></sl-icon></sl-button>
<sl-tooltip for="edit">Edit</sl-tooltip>

<sl-button id="publish" fill="solid" variant="primary">Publish</sl-button>
<sl-tooltip for="publish" type="description">Makes the page visible to everyone</sl-tooltip>
  ```

</div>

You don't have to add `aria-labelledby` or `aria-describedby` yourself; the tooltip sets the relation on every anchor it belongs to, and removes it again when it is disabled or removed. See the [accessibility page](/categories/components/tooltip/accessibility/) for more about this.

</section>

<section>

## Triggers

By default the tooltip shows when the user hovers over the anchor or focuses it with the keyboard. Use `trigger` to change that; it takes a space separated list of `hover`, `focus` and `click`. Use `manual` when the tooltip should only be shown programmatically.

<div class="ds-example">

<sl-button id="click-trigger" fill="solid" variant="primary">Click me</sl-button>
<sl-tooltip for="click-trigger" trigger="click" type="description">Click the button again to dismiss me</sl-tooltip>

</div>

<div class="ds-code">

  ```html
<sl-button id="click-trigger">Click me</sl-button>
<sl-tooltip for="click-trigger" trigger="click" type="description">Click the button again to dismiss me</sl-tooltip>
  ```

</div>

A few details worth knowing:

- Focusing the anchor with the mouse does not show the tooltip; only keyboard focus (`:focus-visible`) does. That way the tooltip stays out of the way when a dialog returns focus to the button that opened it, for example.
- Pressing <kbd>Escape</kbd> hides the tooltip while it is open.
- Hovering is delayed to prevent tooltips from flashing by when the pointer moves across the screen. The delays are static properties, so changing them applies to every tooltip in the application:

<div class="ds-code">

  ```js
  import { Tooltip } from '@sl-design-system/tooltip';

  Tooltip.hoverShowDelay = 150; // default, in milliseconds
  Tooltip.hoverHideDelay = 0; // default, in milliseconds
  ```

</div>

</section>

<section>

## Showing and hiding programmatically

Set the `open` property to show or hide the tooltip regardless of its triggers. The tooltip is a [popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), so you can also call `showPopover()` and `hidePopover()` on it directly.

To check whether a tooltip is showing, don't read the `open` property; use `matches(':popover-open')` instead. That also covers tooltips that were opened by one of the triggers.

<div class="ds-code">

  ```js
  const tooltip = document.querySelector('sl-tooltip');

  tooltip.open = true;

  if (tooltip.matches(':popover-open')) {
    // The tooltip is showing
  }
  ```

</div>

Use `disabled` to stop a tooltip from showing altogether. A disabled tooltip hides itself if it is open, ignores its triggers and drops the ARIA relation with its anchors, so screen readers no longer announce it.

</section>

<section>

## Positioning and size

The tooltip positions itself with [CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning). It renders above the anchor by default, and flips to the other side when there is not enough room. Since this is plain CSS, you change the position by styling the tooltip:

<div class="ds-code">

  ```css
  sl-tooltip {
    /* Show the tooltip to the right of the anchor instead of above it */
    position-area: right;

    /* Prevent long tooltips from becoming too wide */
    max-inline-size: 200px;
  }
  ```

</div>

Not every browser supports CSS anchor positioning yet. In those browsers you need the CSS Anchor Positioning polyfill, see [add polyfills](/categories/getting-started/developers/#add-polyfills) in the getting started guide.

The tooltip renders an invisible element between the anchor and the tooltip, so the pointer can travel from one to the other without the tooltip disappearing. It is available as the `hover-bridge` CSS part, which is handy when you want to see what it covers:

<div class="ds-code">

  ```css
  sl-tooltip::part(hover-bridge) {
    background: hotpink;
  }
  ```

</div>

</section>

<section>

## Migrating from older versions

The tooltip was rewritten to use the browser's popover and CSS anchor positioning APIs. If you are coming from an older version:

<div class="ds-table-wrapper">

|Before|Now|
|-|-|
|`Tooltip.lazy(element, callback, options)`|Render an `<sl-tooltip>` with a `for` attribute; there is nothing to create lazily anymore|
|The `tooltip()` directive from `@sl-design-system/tooltip`|Render an `<sl-tooltip>` with a `for` attribute|
|`aria-describedby="my-tooltip"` on the anchor|`for="my-anchor"` on the tooltip, combined with `type`|
|`position="bottom"`|The `position-area` CSS property|
|`maxWidth="200"`|The `max-inline-size` CSS property|
|`ariaRelation="label"`|`type="label"`, which is the default|

{.ds-table .ds-table-align-top}

</div>

</section>

{% include "../component-table.njk" %}
