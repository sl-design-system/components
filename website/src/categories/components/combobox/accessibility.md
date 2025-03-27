---
title: Combobox accessibility
tags: accessibility
eleventyNavigation:
  parent: Combobox
  key: ComboboxAccessibility
---

<section>

## Keyboard interactions

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|Moves the focus into/outside of the component.|
|Arrow up/down|Moves the active option 1 position up/down. The focus indicator loops, so when you are at the last option and press "down" it will focus on the first option.|
|Arrow left/right|When the combobox supports multiple selection, moves the focus to the tag on the left/right, assuming the caret is already at the beginning of the input.|
|Home/End|Moves the active option to the first/last option.|
|Enter|Toggles the active option.|
|Backspace|When a tag is focused, removes the tag. This is effectively the same as toggling the selected option using the Enter key.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

### Input

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-label`	|string|Defines a string that labels the action that will be performed when the user interacts with the combobox. Needs to be added when the combobox is not wrapped with `sl-form-field` and there is no `sl-label`. |
|`aria-labelledby`|string|Used to connect with single header/element that describes the combobox, when there is no label component connected to.|

{.ds-table .ds-table-align-top}

</div>

</section>
