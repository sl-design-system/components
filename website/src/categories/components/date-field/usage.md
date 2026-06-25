---
title: Date field usage
tags: usage
eleventyNavigation:
  parent: Date field
  key: DateFieldUsage
---

<section class="no-heading">

<div class="ds-example">
  <sl-date-field
    aria-label="School year start date"
  ></sl-date-field>
</div>

<div class="ds-code">

  ```html
    <sl-date-field aria-label="School year start date"></sl-date-field>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the date field component.

### Precise date entry
Use the Date Field when the task requires an exact date and you want to combine fast typing with visual confirmation through a calendar popover. It is ideal for booking dates, deadlines, birthdays, appointments, and any workflow where the date must be unambiguous.

### Constrained date selection
Use the Date Field when only a specific date range is valid, for example, future dates only, dates within a school year, or dates between a start and end. The `min` and `max` attributes communicate the valid range visually in the calendar and through validation.


</section>

<section>

## When not to use

Date fields may not be the best choice in the following scenarios:

### Relative timeframes
Avoid the Date Field when only approximate periods or relative notions of time are needed (e.g., "next week", "this month", "in three days"). In these cases, prefer select or radio buttons that reflect a relative period.

### Date ranges
For selecting a start and end date together, prefer a dedicated date range picker rather than two separate date fields, when available.

### Only calendar
Do not use the Date Field when the date selection needs to be shown directly in the layout instead of inside a dropdown. Use the [Calendar](/categories/components/calendar/) when the visual date picker is the main interaction.


</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name|Description|Optional|
|-|-|-|-|
|1|Label|Describes the purpose of the field and helps users understand which date to enter.|yes|
|2|Input field|Main input area where users can type a date or view the selected value.|no|
|3|Placeholder|Hint shown inside the field when no value is selected, usually showing the expected date format.|yes|
|4|Picker button|Icon-only button that opens the Picker dropdown for visual date selection.|no|
|5|Clear button|Icon-only button that appears when a date is selected and clears the current value.|yes|
|6|Picker|Dropdown connected to the field that contains the Calendar and optional picker panels.|yes|
|7|Calendar|Visual date picker used inside the Picker to navigate and select a date.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## States

These states describe what users see when the Date Field is available.

- **Idle:** Empty, showing the placeholder, or with a formatted date as the value if the field is filled.
- **Hover:** Visual hover effects that show the user that the field is interactive.
- **Focus:** Display the focus ring. It's shown when the field is active by clicking or keyboard navigation.
- **Invalid:** When an incorrect or out-of-range value is entered, the field is styled to indicate the error.
- **Disabled:** Non-interactive, the field is visible but unavailable for interaction.

</section>


<section>

## Figma Properties

These properties describe the Figma setup for the Date Field. Some properties represent real UI behaviour, while others are only used to preview or compose the component in Figma.


### sl-date_field

Main component used to compose the Date Field and preview the closed or open Picker state.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Open | `false` `true` | Figma-only preview property that shows or hides the Picker dropdown. The open state is triggered by interaction in the product UI. |

{.ds-table .ds-table-align-top}

</div>


### sl-date_field-variants

Nested field component used to control the visible field content, label visibility, and clear action in Figma.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Text | `text` | Figma text property for the visible field value. Represents the selected or typed date shown in the field. |
| Placeholder text | `text` | Figma text property for the placeholder shown when the field has no value. |
| Label | `boolean` | Shows or hides the label above the field. |
| Clear | `boolean` | Shows or hides the clear button in Figma. In product UI, the clear button appears when a date is selected. |
| Variant | `Default` | Main visual style currently represented in Figma. |
| Size | `MD` | Figma size property. The current component setup represents the medium field size. |
| Placeholder | `false` | Figma setup property for previewing the placeholder state. The product UI should rely on the field value and placeholder text. |

{.ds-table .ds-table-align-top}

</div>


### sl-base-label

Nested label component used to configure the label content, hint, and optional information shown above the field.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Label | `text` | Sets the label text. |
| Show Info | `boolean` | Shows or hides the info icon next to the label. |
| Show Hint | `boolean` | Shows or hides the hint text. |
| Hint | `text` | Sets the hint content shown with the label. |
| Optional | `false` | Figma property present in the nested label setup. Not currently exposed as an alternative option in this component. |
| Required | `false` | Figma property present in the nested label setup. Not currently exposed as an alternative option in this component. |

{.ds-table .ds-table-align-top}

</div>


### sl-date-calendar

Nested Calendar component shown inside the Picker. It is shared with the Range Field and controls the visual date selection experience.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| View | `Days` `Months` `Years` | Switches the Calendar between day, month, and year selection views. |
| Footer | `boolean` | Shows or hides the footer area for quick actions such as selecting today or clearing the date. |

{.ds-table .ds-table-align-top}

</div>


### Calendar Day Grid

Nested Calendar properties are used to compose and preview date, month, and year selection states inside Figma.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Weeks Number | `boolean` | Shows or hides week numbers in the day grid. |

{.ds-table .ds-table-align-top}

</div>


### Calendar Day Toggle Button

Nested Calendar properties are used to compose and preview date, month, and year selection states inside Figma.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Type | `Default` `Secondary` `Disabled` | Previews the visual role or availability of Calendar items. |
| Selected | `False` `True` | Previews whether a day, month, or year item is selected. |
| Today Indicator | `boolean` | Shows the marker for today in the day view. |
| Focus | `boolean` | Shows the focus ring for a Calendar item. |
| Event Indicator | `boolean` | Shows a small indicator under a day item. |
| Current Indicator | `boolean` | Shows the marker for the current month or year. |

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Behavior

### Free Typing (Default)
Users can type only numbers in the day, month, and year segments. The date is checked when focus leaves the field, and errors are shown then.

### Calendar popover
Click the calendar icon button or press `Space`/`Enter` on it to open the popover. Use the keyboard or pointer to focus a date and press `Enter` to select it. Pressing `Escape` closes the popover and returns focus to the input.

### Select-only mode
When `select-only` is set, the input becomes read-only and users can only pick a date through the calendar popover. Use it when typed values could be invalid or when users benefit from selecting from the available dates.

Avoid this mode when users know the exact date or need to reach a distant one. Free typing is faster, while keyboard and pointer navigation can help when browsing the Calendar.

### Min and max dates
Dates outside the configured `min` / `max` range are disabled in the calendar and rejected by validation when typed.

### Require confirmation
When `require-confirmation` is set, the user must explicitly confirm the selected date in the calendar using the confirm button in the popover footer before it is set as the field value. This is useful in workflows where accidental selection could trigger an action.

</section>

<section>

## Related components
- [Calendar](/categories/components/calendar/usage): Standalone calendar for date selection or date browsing.
- [Time Field](/categories/components/time-field/usage): Companion component for selecting a time.
- [Text Field](/categories/components/text-field/usage): For free-form text input.

</section>

