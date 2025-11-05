---
title: Time field usage
tags: usage
eleventyNavigation:
  parent: Time field
  key: TimeFieldUsage
---

<section class="no-heading">

<div class="ds-example">
  <sl-time-field
    id="first-name"
    aria-label="First name"
  ></sl-time-field>
</div>

<div class="ds-code">

  ```html
    <sl-time-field id="first-name" aria-label="First name"></sl-time-field>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the text field component.

### Precise input and fast selection
Use the Time Field when the task requires an exact clock time and you want to accelerate entry with predictable stepped options. The split-column dropdown provides quick, scannable choices for common schedules (e.g., every 5/10/15/30 minutes) while still allowing direct typing. This is ideal for meetings, bookings, reminders, and any workflow where consistent, granular time values matter.

### Keyboard navigation

Use the Time Field when forms must support speed and accessibility for keyboard-centric users. The input accepts typed values, opens the dropdown via keyboard, and allows navigation of hour/minute columns with the arrow keys. This is especially useful in dense forms, operational tooling, or power-user interfaces where mouse interaction is secondary.

</section>


<section>

## When not to use
Text fields may not be the best choice in the following scenarios:

### relative timeframes
Avoid the Time Field when only approximate periods or relative notions of time are needed (e.g., “morning,” “after lunch,” “end of day”). In these cases, prefer radios, a segmented control, or a select that reflects coarse time choices without implying exact HH:MM precision.

</section>


<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container	|Wraps input and trigger, provides focus ring and error visuals. |no|
|2|Input |Editable text field for time entry. |no|
|3|Placeholder |Hint text when no value is set (e.g., “HH:MM”). |no|
|3|Icon Button |Opens the dropdown. |no|

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## States
- **Idle:** Empty, showing the placeholder, or with a formatted time as the value.
- **Hover:** Visual hover effects that show the user that the field is interactive.
- **Focus:** Display the focus ring. It's shown when the field is active by clicking or keyboard navigation.
- **Invalid:** When an incorrect value is entered, the field is styled to indicate the error.
- **Disabled:** Non-interactive, muted.

</section>


<section>

## Figma Options

With these options you can tweak the appearance of the text field in Figma. They are available in the Design Panel so you can compose the text field to exactly fit the user experience need for the uses case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Open|`on` or `off`|The text field is available in two sizes. If not specified the default value is `md` (medium).|
|Variant|`default` `valid` `invalid`| When you're working on a scenario where you show what happens when a field is skipped or filled in incorrectly you can choose a different variant to show this.|
|Size|`md` `lg`|The text field is available in two sizes. If not specified the default value is `md` (medium).|
|Placeholder|`on` or `off`|If the setting is enabled, the placeholder will be visible, whereas if it is disabled, the user's input will be displayed. Default value is `off`.|
|Text|`value`|Use placeholder text to give the user a short hint about what they need to input (e.g. a sample value or a short description of the expected format). Placeholder is not a replacement for labels. It's an optional feature that disappears once users begin entering their data. |
|Placeholder text|`value`|Use placeholder text to give the user a short hint about what they need to input (e.g. a sample value or a short description of the expected format). Placeholder is not a replacement for labels. It's an optional feature that disappears once users begin entering their data. |
|Label|`value`|Provide users with additional context about button functionality by adding a label, ensuring clarity and ease of use.|

{.ds-table .ds-table-align-top}

</div>

</section>


<section>
  
## Behaviours

### Free Typing (Default)
Users can type any valid HH:MM time, regardless of whether it is a step time. The component validates for format and parsability (e.g., two-digit hours/minutes within valid ranges). Step alignment is not enforced unless enforceSteps=true.

### Stepped Options (Shortcuts)
When steps are configured, the dropdown shows fixed, non-reordering stepped options in the hour and/or minute columns. These options act as shortcuts while typed input remains unrestricted. The dropdown content and order remain unchanged regardless of the user's input.

### Enforced Steps (Optional)
When enforceSteps=true, only stepped values are valid. If a user types an invalid time, a validation message appears after the field is blurred (i.e., when the user leaves the field). The typed value remains visible until corrected. The dropdown content and order still do not change.

### Keyboard Navigation
Press Tab to focus the field, and then press Enter/Space to open the dropdown. Use the Arrow keys to navigate the hour and minute columns. Typing in the input updates the value; in strict mode, off-step values are validated when the field loses focus. Press Esc to close the dropdown and return focus to the input.

### How to Open the Dropdown
Click on the field or dropdown button, or press Enter/Space when the field has focus.

### Formatting & Validation
The control accepts and normalises valid times as HH:MM. Optional minTime / maxTime constraints may be applied with clear validation messages. When enforceSteps=true, error text should indicate the required step pattern (e.g., “Select a time in 15-minute steps: 00, 15, 30, 45”).

</section>


<section>
  
## Related components
- [Text Field](/categories/components/text-field/usage): If you want a free-form text input.
- [Select](/categories/components/select/usage): Selecting from predefined numeric options.

</section>
