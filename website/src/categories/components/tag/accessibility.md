---
title: Tag accessibility
tags: accessibility
eleventyNavigation:
  parent: Tag
  key: TagAccessibility
---
<section>

## Keyboard interactions

The tag list component uses a roving tabindex. You can focus the first removable tag in the list by pressing the `Tab` key. After that, you can navigate through the removable tags using the left and right arrow keys. You can navigate back to the previous tag with left. The focus indicator loops, so when you are at the last option and press right it will focus on the first tag.
In the stacked version of tag-list, when there are hidden tags, you can navigate only through visible removable tags with arrow keys. The first tag indicates how many hidden tags there are. Using a screen reader, it will announce how many hidden tags there are.


When the tag is focused and is removable, it can be removed by pressing the `Delete` or `Backspace` key. This behavior is also announced by the screen reader.

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

### Tag

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`role`|`'listitem', 'button'`|Identifies the tag element as a `listitem` when it's used inside the `sl-tag-list` - this role is added automatically. Please provide a role `button` when the tag is interactive, is used to perform an action or is removable and not used inside `sl-tag-list`.|

{.ds-table .ds-table-align-top}

</div>

### Tag list

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-
|`aria-label`|string|String that labels the tag list. Use this to label what the tag list indicates, such as the selected options in a combobox.|
|`aria-labelledby`|string|Can be used to connect with a single header/element that describes the tag list.|

{.ds-table .ds-table-align-top}

</div>

</section>
