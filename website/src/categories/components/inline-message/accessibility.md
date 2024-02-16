---
title: Inline message accessibility
tags: accessibility
eleventyNavigation:
  parent: Inline message
  key: InlineMessageAccessibility
---

<section>

## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a text field provide essential information to assistive technologies and screen readers. They convey the inline message's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.
<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`aria-role`|`region`|Identifies the role of the InlineMessage within an interface.|no|
|`aria-label`	|`region`|Defines the aria-label of the inline message. |yes|
|`aria-label`|`"polite", "assertive" or "off" (default)`|Needs to be set when the inline message appears on the screen at runtime.|yes|

{.ds-table .ds-table-align-top}

</div>

// TODO: add role depending on variant


</section>
