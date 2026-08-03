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
|Tab|Moves the focus into/outside of the component. In a multiple combobox with selected removable tags, focus moves between the tag list and the combobox input. When the tag list is stacked, the tag list tab stop is the stack counter; otherwise it is the remove button of the first selected removable tag.|
|Arrow up/down|Moves the active option one position up/down. The focus indicator loops, so when you are at the last option and press "down" it will focus on the first option.|
|Arrow left/right|When focus is on a selected tag's remove button, moves focus to the remove button of the previous/next selected removable tag. Arrow left/right does not move focus from the combobox input to selected tags.|
|Home/End|Moves the active option to the first/last option.|
|Enter|Toggles the active option. When focus is on a selected tag's remove button, removes that tag.|
|Space|When focus is on a selected tag's remove button, removes that tag.|
|Backspace/Delete|When focus is on a selected tag's remove button, removes that tag.|

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
