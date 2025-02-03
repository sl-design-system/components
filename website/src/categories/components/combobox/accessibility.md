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

WAI-ARIA Roles, States, and Properties for a combobox component provide essential information to assistive technologies and screen readers. They convey the combobox component's role, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

### Input

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`|`'combobox'`|Identifies the input as a combobox.|no|
|`aria-activedescendant`|string|When an option in the listbox is visually indicated as having keyboard focus, refers to that option (by `id`) or when it is already selected.|no|
|`aria-autocomplete`|`both`|Indicates that the combobox can be used for both input and suggestions. The value `both` indicates that the combobox is a multi-function combobox.|no|
|`aria-controls`|string|Identifies the listbox controlled by the combobox.|no|
|`aria-expanded`|boolean|Set to `true` if the listbox (list of options) is visible, `false` if it is hidden.|no|
|`aria-haspopup`|`listbox`|Indicates that the combobox has a listbox popup.|no|
|`aria-label`	|string|Defines a string that labels the action that will be performed when the user interacts with the combobox. Needs to be added when the combobox is not wrapped with `sl-form-field` and there is no `sl-label`. |yes|
|`aria-labelledby`|string|Used to connect with single header/element that describes the combobox, when there is no label component connected to.|yes|
|`aria-owns`|string|Identifies the listbox controlled by the combobox.|no|
|`aria-describedby`|string|Indicates the elements that describe the combobox. Used for helper text and validation.|no|

{.ds-table .ds-table-align-top}

</div>

### Listbox

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`|`'listbox'`|Identifies the element as a listbox.|no|
|`aria-multiselectable`|string|Indicates whether the combobox supports multiple selection (`true`), otherwise not present.|no|

{.ds-table .ds-table-align-top}

</div>

</section>