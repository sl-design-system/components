---
title: Tooltip accessibility
tags: accessibility
eleventyNavigation:
  parent: Tooltip
  key: TooltipAccessibility
---
<section>

## Accessibility considerations

### Discoverability and readability
Ensure that tooltips are discoverable and readable using various input methods, including:
Mouse or other pointer devices, keyboard navigation, screen readers, zoom software or any other assistive technology.
Users with different abilities should be able to access tooltip content seamlessly.

Not all elements are reachable by all screenreaders. A div for example, without any interactions or a role, will not be announced in a special way by the screenreader, so it also has no "stop" to read out the contents of the tooltip. Make sure you test the discoverability of your tooltip in multiple screenreaders when you use a tooltip on an element that doesn't naturally have a tab stop. Read more about this in this [W3C test report](https://w3c.github.io/using-aria/#label-support)

### Informative but non-essential content
Tooltips should provide information that enhances the user’s understanding of the UI but is not strictly necessary for operating it.
Avoid critical information in tooltips, as users relying solely on assistive technologies may miss it.

### Non-blocking behavior
When a tooltip is open, it should not obstruct the user from performing other tasks on the screen.
Test this behavior across all responsive breakpoints to ensure consistent behavior regardless of screen size.
</section>

<section>

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a tooltip:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|`tab`|Toggles the tooltip when the element that triggers it is focussed.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>


## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

A tooltip can be linked to another element by either using `aria-describedby` or `aria-labelledby` attributes. The choice between the two depends on the context and the relationship between the tooltip and the anchor element.

You can read  more on the difference between the two attributes in the [MDN article about aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby#:~:text=The%20aria%2Ddescribedby%20attribute%20is%20very%20similar%20to%20the)

<div class="ds-table-wrapper">

|Attribute | Value | Description | 
|-|-|-|
|`aria-describedby`|string|Used to link with the anchor element of the tooltip (element that triggers the tooltip). Should contain `id` of anchor element.|
|`aria-labelledby`|string|Used to link with the anchor element of the tooltip (element that triggers the tooltip). Should contain `id` of anchor element.|

{.ds-table .ds-table-align-top}

</div>

</section>
