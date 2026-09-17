---
title: Calendar
description: The Calendar component displays a month view that lets users browse and select a date or date range. It supports min/max constraints, disabled dates, indicator dates, week numbers and locale-aware formatting, and can be used standalone or embedded in other components such as the Date Field.
componentType: form
shortDescription: Calendar for browsing and selecting a date or date range.
layout: "categories/components/components.njk"
tags: component
packageName: calendar
storybookCategory: form
eleventyNavigation:
  parent: Components
  key: Calendar
  status: new
---

## Date range

Set `mode="range"` and provide the selected dates through `range`. The order of the two dates does
not matter; `sl-change` emits them in chronological order after the second date is selected. The
same date can be selected twice for a one-day range.

```html
<sl-calendar
  mode="range"
  range="2025-09-17T00:00:00.000Z,2025-09-22T00:00:00.000Z"></sl-calendar>
```

After choosing the first date, moving the pointer or keyboard focus across the calendar previews
the resulting range. Pressing <kbd>Escape</kbd> cancels an unfinished selection.
