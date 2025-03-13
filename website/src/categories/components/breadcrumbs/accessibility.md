---
title: Breadcrumbs accessibility
tags: accessibility
eleventyNavigation:
  parent: Breadcrumbs
  key: BreadcrumbsAccessibility
---
<section>

## Accessibility Considerations

- Breadcrumbs are organized using a numbered list. This is because when we label nav elements as 'breadcrumb,' it tells users that this structure is a breadcrumb trail, making it easy for them to find their way around.
- We use CSS to add visual separators between breadcrumb items while keeping them hidden from screen readers using aria-hidden. This helps maintain a smooth reading experience.
- The separators between breadcrumb items are non-clickable, meaning users won't accidentally interact with them.

</section>
<section>

## Keyboard interactions

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|When focus moves away from the breadcrumbs, it automatically shifts to the first breadcrumb item. Similarly, if focus is on a breadcrumb item, it then moves to the next breadcrumb item in the sequence.|
|Shift + Tab |Moves focus to previous breadcrumb item.|
|Enter|Selects the breadcrumb item if it hasn't been already activated.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes-no-list' | recurringText }}

</section>
