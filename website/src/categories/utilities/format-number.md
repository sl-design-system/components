---
title: Format number
description: A utility component for formatting numbers using the browser's <code>Intl.NumberFormat</code> API, with automatic locale support.
layout: "categories/getting-started.njk"
eleventyNavigation:
  parent: Utilities
  key: Format number
---

<section>

## Overview

`sl-format-number` renders a formatted number string based on a `number` property and a set of formatting options. It wraps the native [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API, covering decimal numbers, currencies, percentages, and units.

When `number` is not set or is not a valid number, the element falls back to rendering its slotted content — useful for showing a placeholder or an error message.

The component uses `LocaleMixin`, which automatically picks up the locale from the nearest `lang` attribute in the DOM. This means the formatted output adapts to the language and regional conventions of the surrounding page without any extra configuration. You can also override it explicitly with the `locale` property.

<div class="ds-example">

<sl-format-number number="1234567.89"></sl-format-number>

</div>

<div class="ds-code">

```html
<sl-format-number number="1234567.89"></sl-format-number>
```

</div>

</section>

<section>

<ds-install-info package="format-number"></ds-install-info>

</section>

<section>

## Usage

### Decimal numbers

By default (no `number-style` set), numbers are formatted as plain decimals using the locale's conventions for digit grouping and decimal separators.

<div class="ds-code">

```html
<sl-format-number number="1234567.89"></sl-format-number>
<!-- en: 1,234,567.89 | nl: 1.234.567,89 -->
```

</div>

### Currency

Set `number-style="currency"` and provide a `currency` code (ISO 4217) to format a monetary value.

<div class="ds-code">

```html
<sl-format-number number-style="currency" currency="EUR" number="9.90"></sl-format-number>
<!-- en: €9.90 | nl: € 9,90 -->
```

</div>

Control how the currency symbol is displayed with `currency-display`:

<div class="ds-table-wrapper">

| Value | Example |
|-------|---------|
| `symbol` (default) | €9.90 |
| `narrowSymbol` | €9.90 |
| `code` | EUR 9.90 |
| `name` | 9.90 euros |

{.ds-table}

</div>

### Percent

Set `number-style="percent"` to format a number as a percentage. Pass values between `0` and `1`.

<div class="ds-code">

```html
<sl-format-number number-style="percent" number="0.42"></sl-format-number>
<!-- 42% -->
```

</div>

### Unit

Set `number-style="unit"` together with a `unit` (a valid [CLDR unit identifier](https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers)) to format a measurement.

<div class="ds-code">

```html
<sl-format-number number-style="unit" unit="kilometer-per-hour" number="120"></sl-format-number>
<!-- 120 km/h -->
```

</div>

Control how the unit is displayed with `unit-display`:

<div class="ds-table-wrapper">

| Value | Example |
|-------|---------|
| `short` (default) | 120 km/h |
| `long` | 120 kilometers per hour |
| `narrow` | 120km/h |

{.ds-table}

</div>

### Notation

Use `notation` to control the number format style:

<div class="ds-table-wrapper">

| Value | Description | Example |
|-------|-------------|---------|
| `standard` (default) | Plain formatting | 1,234,567 |
| `scientific` | Scientific notation | 1.235E6 |
| `engineering` | Engineering notation (exponents divisible by 3) | 1.235E6 |
| `compact` | Abbreviated for readability | 1.2M |

{.ds-table}

</div>

### Grouping separators

Grouping separators (e.g. thousands separators) are enabled by default. Set `use-grouping="false"` to disable them.

<div class="ds-code">

```html
<sl-format-number number="1234567" use-grouping="false"></sl-format-number>
<!-- 1234567 -->
```

</div>

### Digit precision

Control the number of displayed digits with the precision properties. See the [Properties table](#properties) for the full list.

<div class="ds-code">

```html
<sl-format-number number="3.14159" maximum-fraction-digits="2"></sl-format-number>
<!-- 3.14 -->
```

</div>

### Advanced formatting options

For options not exposed as individual properties, use `format-options` to pass an `Intl.NumberFormatOptions` object directly. These are merged with and can override the individual property values.

<div class="ds-code">

```js
const el = document.querySelector('sl-format-number');
el.number = 1234567;
el.formatOptions = { notation: 'compact', compactDisplay: 'long' };
```

</div>

### Fallback content

When `number` is not set or is not a valid number, the default slot is rendered:

<div class="ds-code">

```html
<sl-format-number>N/A</sl-format-number>
```

</div>

</section>

<section>

## API

### Properties

<div class="ds-table-wrapper">

| Property | Attribute | Type | Description |
|----------|-----------|------|-------------|
| `number` | `number` | `number` | The number to format. Falls back to slot content when not set or `NaN`. |
| `numberStyle` | `number-style` | `'decimal' \| 'currency' \| 'percent' \| 'unit'` | The formatting style. Defaults to `'decimal'`. |
| `currency` | `currency` | `string` | ISO 4217 currency code (e.g. `'EUR'`). Required when `numberStyle` is `'currency'`. |
| `currencyDisplay` | `currency-display` | `'code' \| 'symbol' \| 'narrowSymbol' \| 'name'` | How to display the currency. Defaults to `'symbol'`. |
| `unit` | `unit` | `string` | A CLDR unit identifier (e.g. `'kilometer-per-hour'`). Required when `numberStyle` is `'unit'`. |
| `unitDisplay` | `unit-display` | `'short' \| 'long' \| 'narrow'` | How to display the unit. Defaults to `'short'`. |
| `notation` | `notation` | `'standard' \| 'scientific' \| 'engineering' \| 'compact'` | The number notation style. Defaults to `'standard'`. |
| `signDisplay` | `sign-display` | `'auto' \| 'never' \| 'always' \| 'exceptZero'` | When to show the sign. Defaults to `'auto'`. |
| `useGrouping` | `use-grouping` | `boolean` | Whether to use grouping separators (e.g. thousands separator). Defaults to `true`. |
| `minimumIntegerDigits` | `minimum-integer-digits` | `number` | Minimum integer digits. Range 1–21. Defaults to `1`. |
| `minimumFractionDigits` | `minimum-fraction-digits` | `number` | Minimum fraction digits. Range 0–100. |
| `maximumFractionDigits` | `maximum-fraction-digits` | `number` | Maximum fraction digits. Range 0–100. |
| `minimumSignificantDigits` | `minimum-significant-digits` | `number` | Minimum significant digits. Range 1–21. |
| `maximumSignificantDigits` | `maximum-significant-digits` | `number` | Maximum significant digits. Range 1–21. |
| `locale` | `locale` | `string` | BCP 47 locale tag. Inherits from the nearest `lang` attribute by default. |
| `formatOptions` | `format-options` | `Intl.NumberFormatOptions` | Advanced options passed directly to `Intl.NumberFormat`. Merged with and overrides individual property values. |

{.ds-table .ds-table-align-top}

</div>

### Slots

<div class="ds-table-wrapper">

| Name | Description |
|------|-------------|
| *(default)* | Fallback content shown when `number` is not set or is `NaN`. |

{.ds-table}

</div>

</section>
