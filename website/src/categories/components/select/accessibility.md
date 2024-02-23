---
title: Select accessibility
tags: accessibility
eleventyNavigation:
  parent: Select
  key: SelectAccessibility
---
<section>

## Keyboard interactions

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|When focus is outside the select, moves focus to the input container.|
|Space/Enter|Opens/closes the select panel|
|Arrow Keys|Once you are in the opened select panel you can navigate to the next option by using the right or down arrow key. You can navigate back to the previous option with left or up. The focus indicator loops, so when you are at the last option and press "down" it will focus on the first option.|
|Home|When focus is inside the select panel, moves to the first available option item in the select panel|
|End|When focus is inside the select panel, moves to the last available option item in the select panel|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a select component provide essential information to assistive technologies and screen readers. They convey the select component's role, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

### Select

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`|`'combobox'`|Identifies the select-button as a combobox.|no|
|`role`|`'listbox'`|Identifies the list of options as a listbox.|no|
|`aria-expanded`|boolean|Set to `true` if the listbox (list of options) is visible, `false` if it is hidden.|no|
|`aria-activedescendant`|string|When a select option in the listbox is visually indicated as having keyboard focus, refers to that option (by `id`) or when it is already selected.|no|
|`aria-label`|string|Defines a string that labels the action that will be performed when the user interacts with the select. Needs to be added when the select is not wrapped with `sl-form-field` and there is no `sl-label`.|yes|
|`aria-labelledby`|string|Used to connect with single header/element that describes the select, when there is no label connected to.|yes|

{.ds-table .ds-table-align-top}

</div>

### Select option group

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'group'`|Identifies the `select-option-group` as a group.|no|
|`aria-label`|string|String that labels the select options group. Same as `heading` string by default. When there is no `heading` please add your own aria-label string.|no/yes|
|`aria-labelledby`|string|Can be used to connect with single header/element that describes the select group, when there is no label/`heading` connected to.|yes|

{.ds-table .ds-table-align-top}

</div>

### Select option

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'option'`|Identifies the `select-option` as an option, which is a part of the listbox/group.|no|
|`aria-disabled`|boolean|Announces the select option as disabled with a screen reader when there is a `disabled` attribute set.|no|
|`aria-selected`|boolean|Set to `true` when a select option is selected.|no|

{.ds-table .ds-table-align-top}

</div>

</section>