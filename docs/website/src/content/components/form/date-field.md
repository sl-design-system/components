---
title: Date field
layout: component
eleventyNavigation:
  key: Date field
  parent: Form
---

```html {.example .show-source}
<sl-form-field label="Date of birth">
  <sl-date-field></sl-date-field>
</sl-form-field>
```

## Usage

`<sl-date-field>` is a text input with an attached calendar for selecting a date. Users can either
type a date or pick one from the calendar. For selecting a time, use a
[time field](/components/form/time-field).

Wrap it in an [`<sl-form-field>`](/components/form/form-field) to add a label, hint and validation
messages.

## Examples

### Basic

```html {.example .show-source}
<sl-date-field></sl-date-field>
```

### Value

Set the `value` attribute to an ISO date string to preselect a date.

```html {.example .show-source}
<sl-date-field value="2024-01-15"></sl-date-field>
```

### Min and max

Restrict the selectable range with the `min` and `max` attributes.

```html {.example .show-source}
<sl-date-field min="2024-01-01" max="2024-12-31"></sl-date-field>
```

### Select only

Add `select-only` to prevent typing, so the date can only be chosen from the calendar.

```html {.example .show-source}
<sl-date-field select-only></sl-date-field>
```

### Week numbers

Add `show-week-numbers` to display week numbers in the calendar.

```html {.example .show-source}
<sl-date-field show-week-numbers></sl-date-field>
```

### Disabled and readonly

```html {.example .show-source .vertical}
<sl-date-field value="2024-01-15" disabled></sl-date-field>
<sl-date-field value="2024-01-15" readonly></sl-date-field>
```

## API

See the [API reference](/api-reference/sl-date-field) for all attributes and properties.
