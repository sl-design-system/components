---
title: Utilities
layout: docs
eleventyNavigation:
  key: Utilities
  parent: Components
  order: 6
  icon: wrench
---

Utilities are small, focused helpers that solve a single, common problem. Some are purely
behavioural (like sending screen reader announcements), some format data (dates and numbers
according to a locale), and some are low-level building blocks used by other components (like the
listbox or virtual list).

Unlike the larger components, utilities are usually combined with your own markup or other
components rather than used on their own.

## Overview

[Format date](/components/utilities/format-date)
: Format a date and/or time according to a locale, built on top of `Intl.DateTimeFormat`.

[Format number](/components/utilities/format-number)
: Format a number, currency, percentage or unit according to a locale, built on top of
  `Intl.NumberFormat`.

[Ellipsize text](/components/utilities/ellipsize-text)
: Truncate text that overflows its container and reveal the full text in a tooltip.

[Infotip](/components/utilities/infotip)
: An info icon button that reveals additional information in a popover.

[Listbox](/components/utilities/listbox)
: A scrollable container of selectable options, used internally by components such as select and
  combobox.

[Virtual list](/components/utilities/virtual-list)
: Efficiently render very large lists by only rendering the items that are currently visible.

[Scrollbar](/components/utilities/scrollbar)
: A custom, themable scrollbar for a separate scrolling container.

[Announcer](/components/utilities/announcer)
: Send messages to assistive technology through an ARIA live region.

[Emoji browser](/components/utilities/emoji-browser)
: A searchable emoji picker.
