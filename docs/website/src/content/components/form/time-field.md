---
title: Time field
layout: docs
eleventyNavigation:
  key: Time field
  parent: Form
---

`<sl-time-field>` is an input for selecting a time. It formats the time according to the locale and
can be constrained to a range and to specific step increments. For selecting a date, use a
[date field](/components/form/date-field).

Wrap it in an [`<sl-form-field>`](/components/form/form-field) to add a label, hint and validation
messages.

## Usage

```html
<sl-form-field label="Start time">
  <sl-time-field></sl-time-field>
</sl-form-field>
```

## Examples

### Basic

```html {.example .show-source}
<sl-time-field placeholder="Select a time"></sl-time-field>
```

### Value

```html {.example .show-source}
<sl-time-field value="14:30"></sl-time-field>
```

### Min and max

Restrict the selectable range with the `min` and `max` attributes.

```html {.example .show-source}
<sl-time-field min="09:00" max="17:00" placeholder="09:00 – 17:00"></sl-time-field>
```

### Steps

Use `hour-step` and `minute-step` to control the increments offered.

```html {.example .show-source}
<sl-time-field minute-step="15" placeholder="15-minute steps"></sl-time-field>
```

### Locale

The `locale` attribute changes how the time is formatted (for example 12- vs 24-hour).

```html {.example .show-source}
<sl-time-field value="14:30" locale="en-US"></sl-time-field>
```

### Disabled and readonly

```html {.example .show-source .vertical}
<sl-time-field value="14:30" disabled></sl-time-field>
<sl-time-field value="14:30" readonly></sl-time-field>
```

## API

See the [API reference](/api-reference/sl-time-field) for all attributes and properties.
