---
title: Text field accessibility
tags: accessibility
eleventyNavigation:
  parent: Text field
  key: TextInputAccessibility
---

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a text field:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|When focus is outside the text field, moves focus to the input container. If focus is on the input container, moves focus to the end enhancer (if provided, and interactive).|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>


## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a text field provide essential information to assistive technologies and screen readers. They convey the text field's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.
<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`ariaLabel`	|`'string'`|Defines a string that labels the action that will be performed when the user interacts with the text field. |yes|
|`aria-required`	|`'object'`|Informs the user that an element is required. When set to ‘true’, screen readers notify users that the element is required. |yes|
|`aria-required`	|`'object'`|Informs the user when there’s an error. Set to ‘false’ by default. Values include true, spelling and grammar. Screen readers alert users when the element is set to any value other than ‘false’ |yes|

{.ds-table .ds-table-align-top}

</div>

</section>

