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

{{ 'aria-attributes' | recurringText }}

### Select

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-label`|string|Defines a string that labels the action that will be performed when the user interacts with the select. Needs to be added when the select is not wrapped with `sl-form-field` and there is no `sl-label`.|
|`aria-labelledby`|string|Used to connect with single header/element that describes the select, when there is no label connected to.|

{.ds-table .ds-table-align-top}

</div>

### Option group

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-label`|string|String that labels the select options group. If `heading` is set this value will be added as the `aria-label`. When there is no `heading` please add your own aria-label string.|
|`aria-labelledby`|string|Can be used to connect with single header/element that describes the select group, when there is no label/`heading` connected to.|

{.ds-table .ds-table-align-top}

</div>
</section>
