---
title: Callout accessibility
tags: accessibility
eleventyNavigation:
  parent: Callout
  key: CalloutAccessibility
---
<section>

## Static vs dynamic messaging

Callouts are designed to be part of the static page layout and are not announced as live regions. They do not use ARIA `role="alert"` or `role="status"` as they're not meant to interrupt the user's workflow.

For dynamic feedback messages that appear/disappear in response to user actions, use the [Inline Message](/categories/components/inline-message/usage) component instead, which includes proper ARIA live region announcements.

</section>

<section>

## Callout title

We recommend using a heading element (e.g. `<h2>`) for the Callout title.
This way, screen readers announce it as a heading, making it easier to find and understand what the callout is about.

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes-no-list' | recurringText }}

</section>

