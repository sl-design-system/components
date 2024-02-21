---
title: Inline message accessibility
tags: accessibility
eleventyNavigation:
  parent: Inline message
  key: InlineMessageAccessibility
---

<section>

## WAI-ARIA
WAI-ARIA Roles, States, and Properties for an inline message provide essential information to assistive technologies and screen readers. They convey the inline message's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.
<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`role`|`'alert', 'status'`|Identifies the role of the Inline Message depending on its variant. Role `'alert'` is set when the variant is `danger` or `warning`, role `'status'` is set when the variant is `info` or `success`.|no|
|`aria-label`	|string|Defines the aria-label of the inline message. |yes|

{.ds-table .ds-table-align-top}

</div>

</section>
