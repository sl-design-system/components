---
title: Date field accessibility
tags: accessibility
eleventyNavigation:
  parent: Date field
  key: DateFieldAccessibility
---
<section>

## Keyboard interactions

The date field supports keyboard navigation for both the input and the calendar popover.

<div class="ds-table-wrapper">

| Command                        | Description                                                                                                                                                                      |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tab                            | When focus is outside the date field, moves focus to the input. If focus is on the input, pressing Tab moves to the calendar trigger button, then to the next focusable element. |
| Space/Enter (on button)        | Toggles the calendar popover when the button has focus.                                                                                                                          |
| Escape                         | Closes the calendar popover.                                                                                                                                                     |
| Arrow Left/Right (in calendar) | Moves focus to the previous or next day.                                                                                                                                         |
| Arrow Up/Down (in calendar)    | Moves focus to the same day in the previous or next week.                                                                                                                        |
| Home/End (in calendar)         | Moves focus to the first or last focusable day in the calendar grid.                                                                                                             |
| Enter/Space (in calendar)      | Selects the currently focused date. Closes the popover unless `require-confirmation` is set.                                                                                                                                             |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute | Value | Description                                                                                                                                                                                                                      |
|-|-|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`aria-label`|string| Defines a string that labels the date field. Required when not wrapped with `sl-form-field` and there is no `sl-label` component.                                                                                                |
|`aria-labelledby`|string| References the ID of the element that labels the date field.                                                                                                                                                                     |
|`aria-required`|boolean| Informs the user that an element is required. When set to ‘true’, screen readers notify users that the element is required. If there is already a `required` attribute added, it is recommended to avoid adding `aria-required`. |
|`aria-disabled`|boolean| Announces the date field as disabled with a screen reader. See note below about difference from the `disabled` attribute.                                                                                                        |

{.ds-table .ds-table-align-top}

</div>

**Notes:**

1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- The `disabled` attribute dims the date field visually, removes it from tab focus, prevents all interactions, and announces it as disabled.
- The `aria-disabled` attribute only announces the disabled state but doesn't prevent interaction or remove focus.

Use `disabled` for true disabled states, use `aria-disabled` only if you need the element to remain in the tab sequence for specific accessibility reasons.

</section>

