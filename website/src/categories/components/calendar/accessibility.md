---
title: Calendar accessibility
tags: accessibility
eleventyNavigation:
  parent: Calendar
  key: CalendarAccessibility
---
<section>

## Keyboard interactions

The calendar supports full keyboard navigation through the month view, with shortcuts for moving between months and years.

<div class="ds-table-wrapper">

|Command| Description                                                                                                                                                              |
|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Tab| Moves focus into and out of the calendar grid and the month/year navigation controls.                                                                                    |
|Arrow Left/Right| Moves focus to the previous or next day.                                                                                                                                 |
|Arrow Up/Down| Moves focus to the same day in the previous or next week.                                                                                                                |
|Page Up/Down| Moves focus to the same day in the previous or next month.                                                                                                               |
|Shift + Page Up/Down| Moves focus to the same day in the previous or next year.                                                                                                                |
|Home/End| Moves focus to the first or last day of the current week.                                                                                                                |
|Enter/Space| Selects the currently focused date.                                                                                                                                      |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute | Value | Description                                                                                                                                                                                                                      |
|-|-|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`aria-label`|string| Defines a string that labels the calendar. Useful when the calendar is used standalone, without a surrounding labelled control.                                                                                                  |
|`aria-labelledby`|string| References the ID of the element that labels the calendar.                                                                                                                                                                       |

{.ds-table .ds-table-align-top}

</div>

</section>

