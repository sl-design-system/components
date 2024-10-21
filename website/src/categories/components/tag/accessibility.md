---
title: Tag accessibility
tags: accessibility
eleventyNavigation:
  parent: Tag
  key: TagAccessibility
---
<section>

## Keyboard interactions

The tag list component uses a roving tabindex. You can focus the first tag in the list by pressing the `Tab` key. After that, you can navigate through the tags using the left and right arrow keys. You can navigate back to the previous tag with left. The focus indicator loops, so when you are at the last option and press right it will focus on the first tag.
In the stacked version of tag-list, when there are hidden tags, you can navigate only through visible tags with arrow keys. The first tag indicates how many hidden tags there are. Using a screen reader, it will announce how many hidden tags there are.


When you click on a tag inside a tag-list (as long as it is not disabled), the tag become the active spot for using the keyboard. This means you can start using keyboard navigation right from the tag you just clicked on.


When the tag is focused and is removable, it can be removed by pressing the `Delete` or `Backspace` key. This behavior is also announced by the screen reader.

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a tag and tag-list component provide essential information to assistive technologies and screen readers.

### Tag

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`|`'listitem', 'button'`|Identifies the tag element as a `listitem` when it's used inside the `sl-tag-list` - this role is added automatically. Please provide a role `button` when the tag is interactive, is used to perform an action or is removable and not used inside `sl-tag-list`.|no/yes|
|`aria-description`|string|Defines a string that describes the action that will be performed when the user interacts with the tag or the purpose/more information about the tag. `aria-description` is added automatically for the `removable` tag to describe the ability to use the keyboard to remove the tag.|no|
|`aria-labelledby`|string|Used to label the tag that indicates the number of hidden tags, when the tag list overflows. It contains the `id` of the tooltip. The tooltip lists all the hidden tags.|no|

{.ds-table .ds-table-align-top}

</div>

### Tag list

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'list'`|Identifies the `tag-list` as a list.|no|
|`aria-label`|string|String that labels the tag list. Use this to label what the tag list indicates, such as the selected options in a combobox.|yes|
|`aria-labelledby`|string|Can be used to connect with a single header/element that describes the tag list.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>
