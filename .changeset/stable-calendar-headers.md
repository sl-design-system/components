---
'@sl-design-system/calendar': patch
'@sl-design-system/date-field': patch
---

Keep calendar navigation and year controls stationary across localized month names. Reserve space for the longest month name and align day, month and year headers using consistent grid spacing.

Keep localized calendars within narrow containers, align date cells and week numbers with weekday headings, and refresh header sizing when date constraints change.

Reserve a stable year control width for proportional digits and reduce header spacing on narrow screens to keep full month names visible.

Align month and year selector headers with the day view and preserve measured header widths when switching views so navigation buttons stay in place.

Resolve header spacing tokens to pixels before measuring so relative CSS units do not shrink the reserved header width.

Match range and hover preview backgrounds to the Figma design, align range row edges with day tiles, and align the second month header with its calendar grid. Preserve the height of all six week rows and match week number column spacing and picker panel padding to the design.
