---
title: Menu accessibility
tags: accessibility
eleventyNavigation:
  parent: Menu
  key: MenuAccessibility
---

<section>

## Keyboard interactions

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Space/Enter | Open the menu and the sub-menus. When you open the menu, the focus move to the first option.|
|Up & Down | Once you have open the menu. You can move between options with the `up` and `down` keys. The focus indicator loops, so when you are at the last option and press `down` it will focus on the first option. And if you are at the first option and press `up` it'll focus the last option.|
|Right | When you are in a sub-menu option `right` key open it and the focus move to the first option.|
|Right & Esc | This keys close the menu. But, when you are in a sub-menu `right` & `esc` keys close it and the focus move parent option. This works from any option, doesn't matter where you are.|


{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

In the component itself we use multiple aria-attributes to assure the component works well with a range of assistive technologies. For some attributes however it is not possible for the Design System to add a meaningfull value, because it relies on the context or way a component is used. Attributes that we recommend you use in certain scenarios are listed below.

<section>

### Menu button

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-label`|string|Please add when only icon button is used (so no text for the menu button is added).|
|`aria-disabled`|boolean|Announces the menu button component as disabled with a screen reader. See [Note 1] below.|

{.ds-table .ds-table-align-top}

</div>
</section>

<section>

### Menu item

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-disabled`|boolean|Announces the menu item component as disabled with a screen reader. See [Note 1] below.|
|`aria-label`|string|Can be added when there is no label/text that could be described by. eg. when there is only an icon added.|

{.ds-table .ds-table-align-top}

</div>

</section>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the menu button/menu item visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the menu button / menu item out of the navigation flow.

When `disabled` is added there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

</section>
