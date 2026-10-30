---
'@sl-design-system/calendar': patch
---

Keep calendar navigation and year controls stationary across localized month names. Reserve space for the longest month name and align day, month and year headers using consistent grid spacing.

Keep localized calendars within narrow containers, align date cells and week numbers with weekday headings, and refresh header sizing when date constraints change.

Reserve a stable year control width for proportional digits and reduce header spacing on narrow screens to keep full month names visible.

Align month and year selector headers with the day view and preserve measured header widths when switching views so navigation buttons stay in place.

Resolve header spacing tokens to pixels before measuring so relative CSS units do not shrink the reserved header width.
