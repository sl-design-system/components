---
title: Tag accessibility
tags: accessibility
eleventyNavigation:
  parent: Tag
  key: TagAccessibility
---
<section>

## Keyboard interactions

Users can move through the tags within a tag-list using the arrow keys.
Tags also gain focus when clicked (not disabled or readonly tags), ensuring keyboard navigation starts at the currently focused chip.
When the tag is focused and is removable it can be removed by `Delete` or `Backspace` keydown.

arrow keys
focusable

// Users can move through the chips using the arrow keys and select/deselect them with space. Chips also gain focus when clicked, ensuring keyboard navigation starts at the currently focused chip.
// https://material.angular.io/components/chips/overview#keyboard-interactions
// when it's focused it can be removed by delete keydown

...

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
|`aria-labelledby`|string|Used to connect with single header/element that describes the tag. `Aria-labelledby` with `id` of the tag is added automatically in the `removable` tag to its remove button inside, used to connect the remove button with tag.|yes/no|
|`aria-describedby`|string|Used to connect (and describe) with a tooltip which is shown, when there is not enough space to show the whole label in the tag. It contains `id` of the tooltip. It's added to a tag element when the label overflows. The tooltip contains the whole label of the tag (when the label inside a tag got ellipsis).|no|
|`aria-readonly`|`true`|Applied when the tag is `readonly`.|no|

{.ds-table .ds-table-align-top}

</div>

### Tag list

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'list'`|Identifies the `tag-list` as a list.|no|
|`aria-label`|string|String that labels the tag list. In a `stacked` version it is added automatically and contains an information about the amount of visible and hidden tags. In a `non stacked` version `aria-label` can be applied by a user.|no/yes|
|`aria-labelledby`|string|Can be used to connect with single header/element that describes the tag list.|yes|
|`aria-describedby`|string|Used to connect (and describe) with a tooltip when there are hidden tags in `stacked` version, when there is not enough space to show all tags inside without wrapping. It contains `id` of the tooltip. It's added to a tag element which exists as a counter of hidden tags.|no|

{.ds-table .ds-table-align-top}

</div>

</section>
