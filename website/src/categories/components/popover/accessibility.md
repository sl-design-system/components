---
title: Popover accessibility
tags: accessibility
eleventyNavigation:
  parent: Popover
  key: PopoverAccessibility
---
<section>

<section>
  
## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a popover:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|`tab`|Toggles the popover when the element that triggers it is focussed.|
|`esc`|Closes the popover.|

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
|`role`|`'popover'`|Declare our custom component as a popover.|no|
|`aria-haspopup`|boolean|Indicates whether the popover has a popup menu or sub-level content.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>