---
title: Format number
layout: component
eleventyNavigation:
  key: Format number
  parent: Utilities
---

```html {.example .show-source}
<sl-format-number number="1234.5"></sl-format-number>
```

## Usage

`<sl-format-number>` formats a number according to a locale. It is a thin wrapper around the native
[`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
API, so it can format plain numbers, currencies, percentages and units.

Set the value with the `number` attribute. If the value is not a valid number, the slotted content
is shown instead.

## Examples

### Decimal

By default the number is formatted as a decimal, using grouping separators appropriate for the
locale.

```html {.example .show-source}
<sl-format-number number="1234567.89"></sl-format-number>
```

### Currency

Set `number-style="currency"` together with a `currency` code (an ISO 4217 code such as `EUR` or
`USD`).

```html {.example .show-source}
<sl-format-number number="9.9" number-style="currency" currency="EUR"></sl-format-number>
<sl-format-number number="9.9" number-style="currency" currency="USD"></sl-format-number>
```

### Percent

With `number-style="percent"` the value is multiplied by 100 and a percent sign is appended, so
`0.1` becomes `10%`.

```html {.example .show-source}
<sl-format-number number="0.1" number-style="percent"></sl-format-number>
```

### Unit

Use `number-style="unit"` with a `unit` (such as `meter` or `kilometer-per-hour`) and an optional
`unit-display` of `short`, `long` or `narrow`.

```html {.example .show-source}
<sl-format-number number="1000" number-style="unit" unit="meter" unit-display="long"></sl-format-number>
```

### Locales

Set the `locale` attribute to change the grouping and decimal separators.

```html {.example .show-source}
<sl-format-number number="1234567.89" locale="en"></sl-format-number>
<sl-format-number number="1234567.89" locale="nl"></sl-format-number>
<sl-format-number number="1234567.89" locale="de"></sl-format-number>
```

### Fallback

When the value is not a valid number, the slotted content is rendered instead.

```html {.example .show-source}
<sl-format-number number="not a number">Not available</sl-format-number>
```

## API

See the [API reference](/api-reference/sl-format-number) for all attributes and properties.
