---
title: Textarea accessibility
tags: accessibility
eleventyNavigation:
  parent: Textarea
  key: TextareaAccessibility
---
<section>
  
## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a text area:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|When focus is outside the text area, moves focus to the input container. If focus is on the input container, moves focus to the end enhancer (if provided, and interactive).|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>


## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a text area provide essential information to assistive technologies and screen readers. They convey the text field's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.
<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`ariaLabel`|`string`|Aria-label attribute is used to define a string that labels the action that will be performed when the user interacts with the text area|yes|
|`aria-required`|`object`|This attribute informs the user that an input is required. When set to true, screen readers notify users that the input is required|yes|


{.ds-table .ds-table-align-top}

</div>

</section>
