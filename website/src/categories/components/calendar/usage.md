---
title: Calendar usage
tags: usage
eleventyNavigation:
  parent: Calendar
  key: CalendarUsage
---

<section class="no-heading">

<div class="ds-example">
  <sl-calendar
    aria-label="Choose a date"
  ></sl-calendar>
</div>

<div class="ds-code">

  ```html
    <sl-calendar aria-label="Choose a date"></sl-calendar>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the calendar component.

### Visual date selection
Use the Calendar when users benefit from seeing a full month view to pick a date — for example, when context like weekdays, weekends, holidays or already booked days helps the choice. It works well embedded inside other components (such as the Date Field popover) or standalone in a panel.

### Browsing dates
Use the Calendar when users need to browse and orient themselves in time, for example to see which weekday a date falls on, or to navigate between months and years before making a choice.

</section>

<section>

## When not to use

The Calendar may not be the best choice in the following scenarios:

### Quick, known date entry
When users already know the exact date and just need to type it (for example a birth date), prefer the [Date Field](/categories/components/date-field/usage) which combines free typing with a popover calendar.

### Relative timeframes
Avoid the Calendar when only approximate periods or relative notions of time are needed (e.g. "next week", "this month"). Use radio buttons, a segmented control, or a select instead.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Header|Displays the current month and year and the navigation controls.|no|
|2|Navigation buttons|Move to the previous or next month (and optionally year).|no|
|3|Weekday row|Localized day-of-week labels.|no|
|4|Week numbers|ISO week numbers next to each row.|yes|
|5|Day grid|Grid of selectable days for the visible month.|no|
|6|Today indicator|Visual marker for today's date.|yes|
|7|Indicator dates|Visual markers for highlighted dates (e.g. events).|yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## States

- **Idle:** No date selected or with a selected date highlighted.
- **Hover:** Visual hover effects on focusable days.
- **Focus:** Display the focus ring on the focused day.
- **Selected:** Highlighted styling on the selected date.
- **Disabled day:** Days outside `min` / `max` or in `disabled-dates` are styled as non-selectable.
- **Indicator:** Days listed in `indicator-dates` show a visual marker.
- **Disabled (whole calendar):** Non-interactive, muted.
- **Read-only:** Visible state, no interaction.

</section>

<section>

## Behavior

### Selecting a date
Click a day or focus it with the keyboard and press `Enter` / `Space` to select it. Selecting a date emits an `sl-change` event.

### Navigating months and years
Use the navigation buttons in the header, or use `Page Up` / `Page Down` (and `Shift + Page Up` / `Shift + Page Down`) to move between months and years from the keyboard.

### Min and max
Days outside the configured `min` / `max` range are visually disabled and cannot be selected.

### Disabled and indicator dates
`disabled-dates` marks specific dates as non-selectable while still showing them in the grid. `indicator-dates` adds a visual marker to specific dates without changing their interactivity, which is useful for highlighting dates with events, deadlines or notifications.

### Today
When `show-today` is set, today's date is visually highlighted to help users orient themselves in the current month.

</section>

<section>

## Related components
- [Date Field](/categories/components/date-field/usage): Input field that combines free typing with a calendar popover.
- [Time Field](/categories/components/time-field/usage): Companion component for selecting a time.

</section>

