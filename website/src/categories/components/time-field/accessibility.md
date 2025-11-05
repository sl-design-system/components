---
title: Time field accessibility
tags: accessibility
eleventyNavigation:
  parent: Time field
  key: TimeFieldAccessibility
---
<section>

## Keyboard interactions

The time field supports full keyboard navigation for both the input and the dropdown picker.

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|When focus is outside the time field, moves focus to the input. If focus is on the input, pressing Tab moves to the dropdown button (if not disabled), then to the next focusable element.|
|Space/Enter (on button)|Opens the time picker dropdown when the button has focus.|
|Escape|Closes the time picker dropdown without selecting a value.|
|Arrow Up/Down (in dropdown)|Navigates through the hour or minute options in the currently focused column.|
|Arrow Left/Right (in dropdown)|Switches focus between the hour and minute columns.|
|Enter (in dropdown)|Selects the currently focused time option and closes the dropdown.|
|Type in input|Users can directly type time values in formats like "13:30", "1:30", "130", or "0130".|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Screen reader support

The time field is announced with its role and label. The dropdown uses proper ARIA attributes to announce the hour and minute listboxes. Ensure:
- All time fields have accessible labels via `sl-form-field` with `sl-label` or via `aria-label`
- The current value and selected options are announced when navigating
- The dropdown state (open/closed) is announced via `aria-expanded`
- Required fields are properly announced via the `required` attribute

</section>

<section>

## WAI-ARIA

WAI-ARIA roles, states, and properties used in the time field component:

<div class="ds-table-wrapper">

|Attribute | Value | Description|
|-|-|-|
|`aria-label`|string|Defines a string that labels the time field. Required when not wrapped with `sl-form-field` and there is no `sl-label` component.|
|`aria-labelledby`|string|References the ID of the element that labels the time field.|
|`aria-required`|boolean|Informs users that the field is required. Automatically set when the `required` attribute is present.|
|`aria-disabled`|boolean|Announces the time field as disabled. See note below about difference from `disabled` attribute.|
|`aria-expanded`|boolean|On the dropdown button, indicates whether the time picker is open or closed.|
|`aria-haspopup`|'listbox'|Indicates that the button opens a listbox popup.|
|`aria-controls`|string|References the ID of the dropdown dialog element.|

{.ds-table .ds-table-align-top}

</div>

**Note on `disabled` vs `aria-disabled`:**

The `disabled` attribute dims the time field visually, removes it from tab focus, prevents all interactions, and announces it as disabled. The `aria-disabled` attribute only announces the disabled state but doesn't prevent interaction or remove focus. Use `disabled` for true disabled states; use `aria-disabled` only if you need the element to remain in the tab sequence for specific accessibility reasons.

</section>

<section>

## WCAG compliance

The time field component supports the following WCAG success criteria:

- **2.1.1 Keyboard** - All functionality is available via keyboard (typing, dropdown navigation, selection)
- **2.4.7 Focus Visible** - Clear focus indicators on the input, button, and dropdown options
- **3.2.4 Consistent Identification** - Time fields with the same purpose have consistent labels and behavior
- **3.3.1 Error Identification** - Invalid time entries are clearly identified with error states
- **3.3.2 Labels or Instructions** - Clear labels and placeholder text guide users
- **4.1.2 Name, Role, Value** - Proper ARIA attributes communicate the component's state

</section>

