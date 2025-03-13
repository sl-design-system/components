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
Here you can find [an example of how to use the Announcer utility when showing a message](https://storybook.sanomalearning.design/?path=/story/feedback-status-inline-message--dynamic).


It is also good practice to make sure the keyboard focus lands on a logical place after the message is closed. You can do this in an event handler that listens to the `sl-dismiss` event on the inline message.
</section>
<section>

## WAI-ARIA

{{ 'aria-attributes-no-list' | recurringText }}

</section>
