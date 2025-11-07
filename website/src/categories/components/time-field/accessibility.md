---
title: Time field accessibility
tags: accessibility
eleventyNavigation:
  parent: Time field
  key: TimeFieldAccessibility
---
<section>

## Keyboard interactions

The time field supports keyboard navigation for both the input and the dropdown time picker.

<div class="ds-table-wrapper">

|Command| Description                                                                                                                                                              |
|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Tab| When focus is outside the time field, moves focus to the input. If focus is on the input, pressing Tab moves to the dropdown button, then to the next focusable element. |
|Space/Enter (on button)| Toggles the time picker dropdown when the button has focus.                                                                                                              |
|Escape| Closes the time picker dropdown.                                                                                                                                         |
|Arrow Up/Down (in dropdown)| Navigates through the hour or minute options in the currently focused column.                                                                                            |
|Arrow Left/Right (in dropdown)| Switches focus between the hour and minute columns.                                                                                                                      |
|Enter (in dropdown)| Selects the currently focused time option and closes the dropdown.                                                                                                       ||

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute | Value | Description                                                                                                                                                                                                                      |
|-|-|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`aria-label`|string| Defines a string that labels the time field. Required when not wrapped with `sl-form-field` and there is no `sl-label` component.                                                                                                |
|`aria-labelledby`|string| References the ID of the element that labels the time field.                                                                                                                                                                     |
|`aria-required`|boolean| Informs the user that an element is required. When set to ‘true’, screen readers notify users that the element is required. If there is already a `required` attribute added, it is recommended to avoid adding `aria-required`. |
|`aria-disabled`|boolean| Announces the time field as disabled with a screen reader. See note below about difference from the `disabled` attribute.                                                                                                        |

{.ds-table .ds-table-align-top}

</div>

**Notes:**

1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- The `disabled` attribute dims the time field visually, removes it from tab focus, prevents all interactions, and announces it as disabled. 
- The `aria-disabled` attribute only announces the disabled state but doesn't prevent interaction or remove focus. 

Use `disabled` for true disabled states, use `aria-disabled` only if you need the element to remain in the tab sequence for specific accessibility reasons.

</section>

