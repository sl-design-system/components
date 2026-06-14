---
title: Format date
layout: docs
eleventyNavigation:
  key: Format date
  parent: Utilities
---

`<sl-format-date>` formats a date and/or time according to a locale. It is a thin wrapper around the
native [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
API, so anything you can do with `Intl.DateTimeFormat` you can do declaratively in your markup.

The `date` attribute accepts anything the `Date` constructor understands — an ISO string, a
timestamp, or a `Date` object set via the property.

## Usage

```html
<sl-format-date date="2024-01-15T09:30:00"></sl-format-date>
```

If no valid date is set, the slotted content is shown instead, which makes it easy to provide a
fallback message.

## Examples

### Date and time style

Use the `date-style` and `time-style` attributes for quick, locale-aware formatting. They accept
`full`, `long`, `medium` and `short`, and can be combined.

```html {.example .show-source}
<sl-format-date date="2024-01-15T09:30:00" date-style="full"></sl-format-date>
<sl-format-date date="2024-01-15T09:30:00" date-style="long" time-style="medium"></sl-format-date>
<sl-format-date date="2024-01-15T09:30:00" date-style="short" time-style="short"></sl-format-date>
```

### Individual fields

For full control, set individual fields such as `weekday`, `year`, `month`, `day`, `hour` and
`minute`. These cannot be combined with `date-style`/`time-style`.

```html {.example .show-source}
<sl-format-date date="2024-01-15T09:30:00" weekday="long" year="numeric" month="long" day="numeric"></sl-format-date>
```

### Locales

Set the `locale` attribute to format the same date for a different language and region.

```html {.example .show-source}
<sl-format-date date="2024-01-15T09:30:00" date-style="long" locale="en-GB"></sl-format-date>
<sl-format-date date="2024-01-15T09:30:00" date-style="long" locale="nl"></sl-format-date>
<sl-format-date date="2024-01-15T09:30:00" date-style="long" locale="fr"></sl-format-date>
<sl-format-date date="2024-01-15T09:30:00" date-style="long" locale="fi"></sl-format-date>
```

### Fallback

When the date is missing or invalid, the slotted content is rendered instead.

```html {.example .show-source}
<sl-format-date>No date available</sl-format-date>
```

## API

See the [API reference](/api-reference/sl-format-date) for all attributes and properties.
