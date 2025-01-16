---
title: Inline message accessibility
tags: accessibility
eleventyNavigation:
  parent: Inline message
  key: InlineMessageAccessibility
---

<section>

## Announcements
When adding an inline message dynamically after page load, either after a direct user action (a warning that a form is not filled in correctly) or for other reasons (timeout, lost connection, new message) it is important to also let screen reader users know some new text has appeared on the page. 


You can use the `Announcer` utility (`announce` function) to inform users about the new message.
Here you can find [an example of how to use the Announcer utility when showing a message](https://storybook.sanomalearning.design/?path=/story/feedback-status-inline-message--accessibility-considerations).


It is also good practice to make sure the keyboard focus lands on a logical place after the message is closed. You can do this in an event handler that listens to the `sl-dismiss` event on the inline message.
</section>
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
