---
title: Paginator accessibility
tags: accessibility
eleventyNavigation:
  parent: Paginator
  key: PaginatorAccessibility
---
<section>

## Keyboard interactions

The paginator provides full keyboard navigation to move between the pages of a list:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|`Tab`|Moves focus through the paginator controls: previous button, page buttons, next button, and page select dropdown (on smaller widths).|
|`Shift + Tab`|Moves focus backward through the paginator controls.|
|`Enter` or `Space`|Activates the focused button to navigate to the selected page, or opens the page select dropdown.|
|`Arrow keys`|When the page select dropdown is focused, use up/down arrows to navigate between page options.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Announcements

The paginator provides screen reader announcements for important state changes:

- **Page changes**: When navigating between pages using previous/next buttons or selecting a page directly, the new page number and total pages are announced.
- **Page size changes**: When changing the number of items per page, the new page size is announced to inform users of the updated display.
- **Status updates**: When the page, page size, or total items change, the current page range and total item count are immediately announced to screen readers to provide context about the displayed content.

These announcements help users understand pagination changes without needing to navigate back to check the current state.

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

### Paginator

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-label`|string|Labels the navigation region. Defaults to "Pagination" if not provided.|

{.ds-table .ds-table-align-top}

</div>

</section>

