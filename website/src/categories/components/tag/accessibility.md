---
title: Tag accessibility
tags: accessibility
eleventyNavigation:
  parent: Tag
  key: TagAccessibility
---
<section>

## Keyboard interactions

Users can move through the tags within a tag-list using the `arrow keys`.
You can navigate back to the previous tag with `left` or `up`. The focus indicator loops, so when you are at the last option and press `down` it will focus on the first tag.
In the stacked version of tag-list, when there are hidden tags, you can navigate only through visible tags with arrow keys, and you can focus tag with amount of hidden tags by `Tab` key.


When you click on a tag inside a tag-list (as long as it is not disabled), the tag become the active spot for using the keyboard. This means you can start using keyboard navigation right from the tag you just clicked on.


When the tag is focused and is removable, it can be removed by `Delete` or `Backspace` keydown.

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a tag and tag-list component provide essential information to assistive technologies and screen readers.

### Tag

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`|`'listitem', 'button'`|Identifies the tag element as a `listitem` when it's used inside the `sl-tag-list` - this role is added automatically. Please provide a role `button` when the tag is interactive, is used to perform an action or is removable and not used inside `sl-tag-list`.|no/yes|
|`aria-label`|string|Defines a string that labels the action that will be performed when the user interacts with the tag or the purpose/more information about the tag. `Aria-label` is added automatically in the `removable` tag to its button inside, used to perform a remove action, which contains only an icon.|yes/no|
|`aria-labelledby`|string|Used to connect with a single header/element that describes the tag.|yes|
|`aria-describedby`|string|Used to connect (and describe) with a tooltip which is shown, when there is not enough space to show the whole label in the tag. It contains `id` of the tooltip. It's added to a tag element when the label overflows. The tooltip contains the whole label of the tag (when the label inside a tag got ellipsis).|no|

{.ds-table .ds-table-align-top}

</div>

### Tag list

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'list'`|Identifies the `tag-list` as a list.|no|
|`aria-label`|string|String that labels the tag list. In a `stacked` version it is added automatically and contains an information about the amount of visible and hidden tags. In a `non stacked` version `aria-label` can be applied by a user.|no/yes|
|`aria-labelledby`|string|Can be used to connect with a single header/element that describes the tag list.|yes|
|`aria-describedby`|string|Used to connect (and describe) with a tooltip when there are hidden tags in `stacked` version, when there is not enough space to show all tags inside without wrapping. It contains `id` of the tooltip. It's added to a tag element which exists as a counter of hidden tags.|no|

{.ds-table .ds-table-align-top}

</div>

</section>
