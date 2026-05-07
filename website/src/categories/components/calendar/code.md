---
title: Calendar code
tags: code
APIdescription: {
  sl-calendar: "Calendar component that combines day, month and year selection views to pick a date. Used internally by the date field, but can also be used standalone.",
  sl-month-view: "Low-level component that renders a single month grid without navigation controls. Used internally by select-day and can be used to compose custom calendar layouts."
}
eleventyNavigation:
  parent: Calendar
  key: CalendarCode
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

<ds-install-info link-in-navigation package="calendar"></ds-install-info>

<section>

## Localization

Month names, day names and the first day of the week follow the active locale (via `Intl.DateTimeFormat`).
\
You can override the first day of the week with the `first-day-of-week` attribute (`0` for Sunday, `1` for Monday, etc.).

</section>

<section>

## Min and max constraints

Use the `min` and `max` attributes to restrict the selectable date range. Dates outside the range are visually disabled and cannot be selected.

</section>

<section>

## Disabled and indicator dates

Use `disabled-dates` to mark specific dates as non-selectable (for example, holidays or already booked days). Use `indicator-dates` to highlight specific dates with a visual indicator (for example, dates with events) without disabling them.

</section>

<section>

## Week numbers

Set `show-week-numbers` to display ISO week numbers next to each row of days.

</section>

{% include "../component-table.njk" %}

