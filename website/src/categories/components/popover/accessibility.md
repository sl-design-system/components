---
title: Popover accessibility
tags: accessibility
eleventyNavigation:
  parent: Popover
  key: PopoverAccessibility
---
<section>

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a popover:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|`Tab`|When the popover is opened, focus moves into the popover container to the first focusable element to navigate elements inside.|
|`Esc`|Closes the popover.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a popover provide essential information to assistive technologies and screen readers. They convey the popovers's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`aria-expanded`|boolean|Set to `true` (on the anchor element) if the popover is visible, `false` if the popover is hidden.|no|
|`aria-details`|string|Used to link the popover element with the anchor (element that triggers the popover component). It contains `id` of the popover element and is added to the anchor element.|no|
|`aria-label`|string|Can be used to describe the popover content/purpose.|yes|
|`aria-labelledby`|string|Used to connect (by `id`) with single header/element inside a popover that describes the popover.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>