---
title: Time field code
tags: code
APIdescription: Component to pick and edit a time for many use cases, with accessibility and validation.
eleventyNavigation:
  parent: Time field
  key: TimeFieldCode
---
<section class="no-heading">

<div class="ds-example">
  <sl-time-field
    aria-label="A parent‑teacher meeting"
    value="16:30"
  ></sl-time-field>
</div>

<div class="ds-code">

  ```html
    <sl-time-field aria-label="A parent‑teacher meeting" value="16:30"></sl-time-field>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="time-field"></ds-install-info>

<section>

## Localization

The separator between hours and minutes follows the active locale (via `Intl.DateTimeFormat`).
\
Most locales use a colon `:`, but a few (for example Finnish `fi`) use a dot `.` (e.g. `16.30`).

</section>

<section>

## Supported format

The time field supports the **24-hour** format `HH:MM` (hours `00`–`23`, minutes `00`–`59`).
\
This 24-hour notation is the most common in Europe and is the component default.
\
**12-hour** `AM/PM` format is not supported yet.

</section>

{% include "../component-table.njk" %}