---
title: Date field code
tags: code
APIdescription: {
  sl-date-field: "Form-aware date input with an integrated calendar popover. Supports localization, min/max constraints, validation and an optional select-only mode."
}
eleventyNavigation:
  parent: Date field
  key: DateFieldCode
---
<section class="no-heading">

<div class="ds-example">
  <sl-date-field
    aria-label="Appointment date"
  ></sl-date-field>
</div>

<div class="ds-code">

  ```html
    <sl-date-field aria-label="Appointment date"></sl-date-field>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="date-field"></ds-install-info>

<section>

## Localization

The date format and the first day of the week follow the active locale (via `Intl.DateTimeFormat`).
\
You can override the first day of the week with the `first-day-of-week` attribute (`0` for Sunday, `1` for Monday, etc.).

</section>

<section>

## Min and max constraints

Use the `min` and `max` attributes to restrict the selectable date range. Dates outside the range are disabled in the calendar and rejected by validation.

</section>

<section>

## Select-only mode

Set `select-only` to disable free typing in the input. Users can only pick a date through the calendar popover.

</section>

{% include "../component-table.njk" %}

