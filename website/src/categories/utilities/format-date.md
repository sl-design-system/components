---
title: Format date
description: A utility component for formatting dates and times using the browser's <code>Intl.DateTimeFormat</code> API, with automatic locale support.
layout: "categories/getting-started.njk"
eleventyNavigation:
  parent: Utilities
  key: Format date
---

<section>

## Overview

`sl-format-date` renders a formatted date or time string based on a `date` property and a set of formatting options. It wraps the native [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API, so all standard formatting options are available as element properties.

When no valid date is provided, the element falls back to rendering its slotted content — useful for showing a placeholder or an error message.

<div class="ds-example">

<sl-format-date date="2026-04-01" time-style></sl-format-date>

</div>

<div class="ds-code">

```html
<sl-format-date date="2026-04-01" time-style></sl-format-date>
```

</div>

</section>

<section>

<ds-install-info package="format-date"></ds-install-info>

</section>

<section>

## Usage

### Date and time styles

The quickest way to format a date is to use `date-style` and/or `time-style`. These map directly to [`Intl.DateTimeFormatOptions`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options).

<div class="ds-table-wrapper">

| Style | Example output |
|-------|---------------|
| `full` | Wednesday, April 9, 2025 |
| `long` | April 9, 2025 |
| `medium` | Apr 9, 2025 |
| `short` | 4/9/25 |

{.ds-table}

</div>

<div class="ds-code">

```html
<sl-format-date date-style="long" time-style="short"></sl-format-date>
```

</div>

### Individual date/time parts

For precise control you can set individual part properties. When any of these are set, `date-style` and `time-style` are ignored. See the [Properties table](#properties) below for all available options.

### Locale

The component uses `LocaleMixin`, which automatically picks up the locale from the nearest `lang` attribute in the DOM. This means the formatted output adapts to the language and regional conventions of the surrounding page without any extra configuration. You can also override it explicitly with the `locale` property:

<div class="ds-code">

```html
<sl-format-date locale="nl" date-style="long"></sl-format-date>
```

</div>

### Advanced formatting options

For formatting options not exposed as individual properties, use `date-time-options` to pass an `Intl.DateTimeFormatOptions` object directly:

<div class="ds-code">

```js
const el = document.querySelector('sl-format-date');
el.date = new Date();
el.dateTimeOptions = { calendar: 'hebrew' };
```

</div>

### Fallback content

When `date` is not set or is invalid, the default slot is rendered. Use this to show a placeholder or error message:

<div class="ds-code">

```html
<sl-format-date>No date available</sl-format-date>
```

</div>

</section>

<section>

## API

### Properties

<div class="ds-table-wrapper">

| Property | Attribute | Type | Description |
|----------|-----------|------|-------------|
| `date` | `date` | `Date \| string \| number \| null \| undefined` | The date to format. Accepts a `Date` object, a date string, or a timestamp. Falls back to slot content when invalid or unset. |
| `dateStyle` | `date-style` | `'full' \| 'long' \| 'medium' \| 'short'` | Shorthand date format. Used together with `timeStyle`. Ignored when individual date/time part properties are set. |
| `timeStyle` | `time-style` | `'full' \| 'long' \| 'medium' \| 'short'` | Shorthand time format. Used together with `dateStyle`. Ignored when individual date/time part properties are set. |
| `weekday` | `weekday` | `'narrow' \| 'short' \| 'long'` | How to display the weekday. |
| `era` | `era` | `'narrow' \| 'short' \| 'long'` | How to display the era. |
| `year` | `year` | `'numeric' \| '2-digit'` | How to display the year. |
| `month` | `month` | `'numeric' \| '2-digit' \| 'narrow' \| 'short' \| 'long'` | How to display the month. |
| `day` | `day` | `'numeric' \| '2-digit'` | How to display the day. |
| `dayPeriod` | `day-period` | `'narrow' \| 'short' \| 'long'` | How to display the day period (AM/PM). Only effective when `hour12` is `true`. |
| `hour` | `hour` | `'numeric' \| '2-digit'` | How to display the hour. |
| `minute` | `minute` | `'numeric' \| '2-digit'` | How to display the minute. |
| `second` | `second` | `'numeric' \| '2-digit'` | How to display the second. |
| `timeZoneName` | `time-zone-name` | `'short' \| 'long'` | How to display the time zone name. |
| `timeZone` | `time-zone` | `string` | The IANA time zone to use (e.g. `Europe/Amsterdam`). Defaults to the runtime's local time zone. |
| `hour12` | `hour12` | `boolean` | Whether to use 12-hour time. Defaults to locale-dependent behaviour. |
| `locale` | `locale` | `string` | The BCP 47 locale tag to use. Inherits from the nearest `lang` attribute by default. |
| `dateTimeOptions` | `date-time-options` | `Intl.DateTimeFormatOptions` | Advanced formatting options passed directly to `Intl.DateTimeFormat`. These are merged with and can override the individual property values. |

{.ds-table .ds-table-align-top}

</div>

### Slots

<div class="ds-table-wrapper">

| Name | Description |
|------|-------------|
| *(default)* | Fallback content shown when `date` is not set or is invalid. |

{.ds-table}

</div>

### Static properties

The default values of `dateStyle` and `timeStyle` can be changed globally for all future instances:

<div class="ds-code">

```js
import { FormatDate } from '@sl-design-system/format-date';

FormatDate.dateStyle = 'short';
FormatDate.timeStyle = 'short';
```

</div>

</section>
