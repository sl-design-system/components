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
WAI-ARIA Roles, States, and Properties for a tooltip provide essential information to assistive technologies and screen readers. They convey the tooltip's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

A tooltip can be linked to another element by either using `aria-describedby` or `aria-labelledby` attributes. The choice between the two depends on the context and the relationship between the tooltip and the anchor element.

<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`role`|`'tooltip'`|Declare our custom component as a tooltip.|no|
|`aria-describedby`|string|Used to link with the anchor element of the tooltip (element that triggers the tooltip). Should contain `id` of anchor element.|yes|
|`aria-labelledby`|string|Used to link with the anchor element of the tooltip (element that triggers the tooltip). Should contain `id` of anchor element.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>
