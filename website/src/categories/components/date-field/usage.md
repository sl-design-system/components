---
title: Date field usage
tags: usage
eleventyNavigation:
  parent: Date field
  key: DateFieldUsage
---

<section class="no-heading">

<div class="ds-example">
  <sl-date-field
    aria-label="Start date"
  ></sl-date-field>
</div>

<div class="ds-code">

  ```html
    <sl-date-field aria-label="Start date"></sl-date-field>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the date field component.

### Precise date entry
Use the Date Field when the task requires an exact calendar date and you want to combine fast typing with visual confirmation through a calendar popover. It is ideal for booking dates, deadlines, birthdays, appointments, and any workflow where the date must be unambiguous.

### Constrained date selection
Use the Date Field when only a specific date range is valid (for example, future dates only, dates within a school year, or dates between a start and end). The `min` and `max` attributes communicate the valid range visually in the calendar and through validation.

</section>

<section>

## When not to use

Date fields may not be the best choice in the following scenarios:

### Relative timeframes
Avoid the Date Field when only approximate periods or relative notions of time are needed (e.g., "next week", "this month", "in three days"). In these cases, prefer radio buttons, a segmented control, or a select that reflects a relative period.

### Date ranges
For selecting a start and end date together, prefer a dedicated date range picker rather than two separate date fields, when available.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container|Wraps the input and trigger, provides the focus ring and error visuals.|no|
|2|Input|Editable field for typing a date.|no|
|3|Placeholder|Hint text when no value is set (e.g. the expected date format).|yes|
|4|Icon Button|Opens the calendar popover.|no|
|5|Calendar popover|Calendar overlay for picking a date visually.|no|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## States

- **Idle:** Empty, showing the placeholder, or with a formatted date as the value.
- **Hover:** Visual hover effects that show the user that the field is interactive.
- **Focus:** Display the focus ring. It's shown when the field is active by clicking or keyboard navigation.
- **Invalid:** When an incorrect or out-of-range value is entered, the field is styled to indicate the error.
- **Disabled:** Non-interactive, muted.
- **Read-only:** Visible value, no interaction.

</section>

<section>

## Behavior

### Free Typing (Default)
Users can type any valid date matching the locale-aware format. The component validates for format, parsability, and the optional `min` / `max` range when the field loses focus.

### Calendar popover
Click the calendar icon button or press `Space`/`Enter` on it to open the popover. Use the keyboard or pointer to focus a date and press `Enter` to select it. Pressing `Escape` closes the popover and returns focus to the input.

### Select-only mode
When `select-only` is set, the input becomes read-only and users can only pick a date through the calendar popover. This is useful when you want to enforce valid input without relying on typed values.

### Min and max
Dates outside the configured `min` / `max` range are disabled in the calendar and rejected by validation when typed.

### Require confirmation
When `require-confirmation` is set, the user must explicitly confirm the selected date in the calendar before it becomes the field value. This is useful in workflows where accidental selection could trigger an action.

</section>

<section>

## Related components
- [Calendar](/categories/components/calendar/usage): Standalone calendar for date selection or date browsing.
- [Time Field](/categories/components/time-field/usage): Companion component for selecting a time.
- [Text Field](/categories/components/text-field/usage): For free-form text input.

</section>

