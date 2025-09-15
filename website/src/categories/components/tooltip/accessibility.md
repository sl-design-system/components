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

For keyboard users to be able to see the tooltip it is important to use the tooltip only on elements that can get focus; for example a button or link. If the part of the interface you want to describe can not have the focus you can add a button with an information icon that will trigger the tooltip

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

A tooltip can be linked to another element by either using `aria-describedby` or `aria-labelledby` attributes.
The choice between the two depends on the context and the relationship between the tooltip and the anchor element.
A good example of when to use `aria-labelledby` is when the tooltip provides a label or title for the anchor element,
such as an icon only button (so button with only an icon) and no visible text.
In this case, the tooltip serves as the accessible name for the button.

You can read  more on the difference between the two attributes in the [MDN article about aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby#:~:text=The%20aria%2Ddescribedby%20attribute%20is%20very%20similar%20to%20the)

<div class="ds-table-wrapper">

|Attribute | Value | Description | 
|-|-|-|
|`aria-describedby`|string|Used to link with the anchor element of the tooltip (element that triggers the tooltip). Should contain `id` of anchor element.|
|`aria-labelledby`|string|Used to link with the anchor element of the tooltip (element that triggers the tooltip). Should contain `id` of anchor element.|

{.ds-table .ds-table-align-top}

</div>

</section>
