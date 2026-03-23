---
title: Accordion accessibility
tags: accessibility
eleventyNavigation:
  parent: Accordion
  key: AccordionAccessibility
---
<section>

## Alignment

The icons are left-aligned to improve the experience for users with low vision, as the expanded/collapsed indicator is closer to the accordion title.

</section>

<section>

## Keyboard interactions

Each accordion is a tab stop. `Space` or `Enter` keys expand or collapse accordions, which are collapsed by default. Interactive elements within expanded accordions integrate into the tab order automatically.

</section>

<section>

## Accessibility considerations

Sometimes, when e.g. we open or close accordion items externally, we need to announce to the user that something has changed (the accordion has expanded or collapsed).
When we expand them externally, it is not automatically read by the screen reader by default. We need to use `aria-live` to announce this to the user.


We recommend using the `Announcer` utility (`announce` function) to inform users about the changes.
Here you can find [an example of how to use the Announcer utility with accordion component](https://storybook.sanomalearning.design/?path=/story/layout-accordion--toggle-externally).

</section>

<section> 

## WAI-ARIA

{{ 'aria-attributes-no-list' | recurringText }}

</section>
