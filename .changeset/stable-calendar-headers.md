---
'@sl-design-system/calendar': patch
'@sl-design-system/date-field': patch
'@sl-design-system/locales': patch
---

Improve calendar layout, date range selection, and keyboard navigation.

Layout and styling

- Keep the header and navigation controls aligned across views and stable as localized labels, fonts, and date constraints change.
- Align the weekday headers, day cells, and week numbers. Keep six week rows and end the week number separator at the last visible week.
- Use a 24px gap between months and align the second month heading with its grid. Adjust the date field picker padding to match the calendar.
- Align range backgrounds with day tiles and blend the hover state into the range preview.
- Use equal-width highlights with a 40px height inside 48px month and year tiles. Truncate long month labels when space is limited.

Selection and navigation

- Show two years of months and 20 years in the expanded view. Adjust paging, keyboard navigation, and accessible navigation labels to match.
- Preserve the browsed month or year and keyboard focus when resizing. Keep selectable dates visible when the previous view overlaps the minimum date.
- Highlight months and years that overlap the selected range and expose their pressed states. Keep full accessible names for truncated month labels.
