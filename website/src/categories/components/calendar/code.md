---
title: Calendar code
tags: code
APIdescription: {
  sl-calendar: "Calendar component that combines day, month and year selection views to pick a date. Used internally by the date field, but can also be used standalone.",
  sl-month-view: "A component that renders a single month grid without navigation controls. Used internally by select-day and can be used to compose custom calendar layouts."
}
eleventyNavigation:
  parent: Calendar
  key: CalendarCode
---
<section class="no-heading">

<div class="ds-example">
  <sl-calendar
    aria-label="Choose a course start date"
    show-today
    show-week-numbers
  ></sl-calendar>
</div>

<div class="ds-code">

  ```html
    <sl-calendar aria-label="Choose a course start date" show-today show-week-numbers></sl-calendar>
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

{% include "../component-table.njk" %}

