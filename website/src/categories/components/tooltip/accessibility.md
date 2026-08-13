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
|`tab`|Shows the tooltip when the element that triggers it receives focus, and hides it again when focus moves on. Focusing that element with the mouse does not show the tooltip, and neither does moving focus to it from code (when closing a dialog for example).|
|`escape`|Hides the tooltip while it is showing.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>


## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

A tooltip is linked to the element it belongs to by either an `aria-labelledby` or an `aria-describedby` relation.
The choice between the two depends on the context and the relationship between the tooltip and the anchor element.
A good example of when to use `aria-labelledby` is when the tooltip provides a label or title for the anchor element,
such as an icon only button (so button with only an icon) and no visible text.
In this case, the tooltip serves as the accessible name for the button.

You can read  more on the difference between the two attributes in the [MDN article about aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby#:~:text=The%20aria%2Ddescribedby%20attribute%20is%20very%20similar%20to%20the)

You do not set these attributes yourself. Point the tooltip at its anchor with the `for` attribute and pick the relation with `type`; the tooltip then takes care of the rest, for every element listed in `for`:

<div class="ds-table-wrapper">

|Attribute | Value | Description |
|-|-|-|
|`for`|string|The `id` of the anchor element, so the element the tooltip belongs to. Pass several ids separated by spaces to link one tooltip to multiple elements.|
|`type`|`label` `description`|Which relation the tooltip sets up with its anchors: `label` (the default) makes the tooltip the accessible name of the anchor, `description` makes it the accessible description.|

{.ds-table .ds-table-align-top}

</div>

The tooltip sets up this relation using element references (`ariaLabelledByElements` and `ariaDescribedByElements`) rather than by writing an `aria-labelledby` or `aria-describedby` attribute on the anchor. Assistive technology sees the same thing, but you won't find the attribute on the anchor element when you inspect it in the browser.

Because the relation only exists while the tooltip is enabled, a `disabled` tooltip is not announced at all. Make sure an anchor that relies on the tooltip for its accessible name has another name when you disable the tooltip.

</section>
