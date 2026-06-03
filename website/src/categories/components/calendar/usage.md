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
Use the Calendar when users benefit from seeing dates in a full month view. This is useful when context such as weekdays, weekends, holidays, deadlines, or already booked days helps users make a clear date choice.

### Browsing dates
Use the Calendar when users need to browse and orient themselves in time, for example to check which weekday a date falls on or to navigate between months and years before selecting a date.

### Date navigation
Use the Calendar anywhere users need to navigate through dates and make a selection. This is useful when users need to move between months or years, explore available dates, or choose a date within a broader date-based workflow.

</section>


<section>

## When not to use

The Calendar may not be the best choice in the following scenarios:

### Date selection
Calendar is a standalone date navigation component designed for browsing and navigating days, months, and years in date-related content, rather than for simple date entry or relative timeframe selection. Use the [Date Field](/categories/components/date-field/usage) when users need to enter a specific date, and use radio buttons, a segmented control, or a select for relative periods.




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
|5|Grid|Grid of selectable days, month or year visible. |yes|
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
- **Disabled (whole calendar):** Non-interactive, muted.
- **Read-only:** Visible state, no interaction.

</section>


<section>

## Figma Properties

These properties describe the Figma setup for the Calendar. Some properties represent real component behaviour, while others are only used to preview or compose the component in Figma.

### sl-calendar

Main component used to compose the Calendar and preview its available views.

<div class="ds-table-wrapper">

| Item   | Options                 | Description                                                                                                                                                |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View   | `Days` `Months` `Years` | Switches the Calendar preview between day, month, and year selection views.                                                                                |
| Footer | `boolean`               | Figma-only composition property. The footer is not part of the current code component and should move to the Date Field or Range Field Picker composition. |

{.ds-table .ds-table-align-top}

</div>

### cal-header

Nested header component used to preview which view-switching buttons are available in the Calendar header.

<div class="ds-table-wrapper">

| Item          | Options   | Description                                              |
| ------------- | --------- | -------------------------------------------------------- |
| Month Button  | `boolean` | Shows or hides the month button in the Calendar header.  |
| Year Button   | `boolean` | Shows or hides the year button in the Calendar header.   |
| Decade Button | `boolean` | Shows or hides the decade button in the Calendar header. |

{.ds-table .ds-table-align-top}

</div>

### date-cal-days_grid

Nested day grid component used to preview the day view layout.

<div class="ds-table-wrapper">

| Item         | Options   | Description                                  |
| ------------ | --------- | -------------------------------------------- |
| Weeks Number | `boolean` | Shows or hides week numbers in the day grid. |

{.ds-table .ds-table-align-top}

</div>

### cal-months_grid

Nested month grid component used to compose the month selection view.

<div class="ds-table-wrapper">

| Item       | Options            | Description                                                                                                                                 |
| ---------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Month grid | `nested component` | Displays selectable months when the Calendar is shown in the month view. No exposed Figma property was provided in the current screenshots. |

{.ds-table .ds-table-align-top}

</div>

### cal-years_grid

Nested year grid component used to compose the year selection view.

<div class="ds-table-wrapper">

| Item      | Options            | Description                                                                                                                               |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Year grid | `nested component` | Displays selectable years when the Calendar is shown in the year view. No exposed Figma property was provided in the current screenshots. |

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Behavior

### Selecting a date
Click a day or focus it with the keyboard and press `Enter` / `Space` to select it.

### Navigating through dates
Use the navigation buttons in the header, or use `Page Up` / `Page Down` (and `Shift + Page Up` / `Shift + Page Down`) to move between months and years from the keyboard.

### Day indicators
Calendar day buttons can display different visual indications to help users understand the status of a date. When `show-today` is set, today's date is visually highlighted to help users orient themselves in the current month. Dates included in `indicator-dates` display a visual marker without changing their interactivity, which is useful for highlighting events, deadlines, or notifications. Dates included in `disabled-dates`, or dates outside the configured `min` and `max` range, remain visible in the grid but are shown as unavailable and cannot be selected.

</section>

<section>

## Related components
- [Date Field](/categories/components/date-field/usage): Input field that combines free typing with a calendar popover.
- [Time Field](/categories/components/time-field/usage): Companion component for selecting a time.

</section>