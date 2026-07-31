---
title: Date field code
tags: code
APIdescription: {
  sl-date-field: "Date input for forms with a built-in calendar popover. Includes a range of configurable properties for different use cases."
}
eleventyNavigation:
  parent: Date field
  key: DateFieldCode
---
<section class="no-heading">

<div class="ds-example">
  <sl-date-field
    aria-label="Appointment date"
    show-week-numbers
  ></sl-date-field>
</div>

<div class="ds-code">

  ```html
    <sl-date-field aria-label="Appointment date" show-week-numbers></sl-date-field>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="date-field"></ds-install-info>

<section>

## Localization

The date format and first day of the week follow the active locale (via `Intl.DateTimeFormat`).

You can set `first-day-of-week` to choose the week start (`0` for Sunday, `1` for Monday, etc.).

</section>

{% include "../component-table.njk" %}

