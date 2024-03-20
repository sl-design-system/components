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

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`aria-label`|breadcrumb|Provides a label that describes the type of navigation provided in the nav element.|no|
|`aria-hidden`|true|Hides the separators between breadcrumb items so they are not announced by a screen reader or any other assistive technology.|no|
|`aria-current`|page|Applied to the last link in the set to indicate that it represents the current page.

Used to inform the assistive technology user what has been indicated via styling.|no|

{.ds-table .ds-table-align-top}

</div>

</section>
