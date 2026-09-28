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

### Unavailable menu items

Menu items that are currently unavailable stay in the keyboard navigation order. You can move focus to them with the `up` and `down` keys, but pressing `space` or `enter` does not activate them, and neither does clicking them with a mouse.

This is intentional: skipping unavailable items would hide them from screen reader users, who would then have no way of knowing that those items exist at all. By keeping them focusable, everyone gets the same picture of what the menu contains, and screen readers announce these items as 'dimmed' or 'disabled' so it is clear they cannot be used right now. This approach is recommended by the [W3C ARIA Authoring Practices Guide on focusability of disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls).

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<section>

### Menu button

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-disabled`|boolean|Announces the menu button component as disabled with a screen reader. See [Note 1] below.|
|`aria-label`|string|Please add when only icon button is used (so no text for the menu button is added).|
|`aria-labelledby`|string|Please add when only icon button is used, but another element is providing a label for it.|

{.ds-table .ds-table-align-top}

</div>
</section>

<section>

### Menu item

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-disabled`|boolean|Marks the menu item as unavailable: it is dimmed, cannot be activated, and is announced as disabled, while remaining focusable. See [Note 2] below.|
|`aria-label`|string|Can be added when there is no label/text that could be described by. eg. when there is only an icon added.|

{.ds-table .ds-table-align-top}

</div>

</section>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the menu button visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. For the menu button you will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the menu button out of the navigation flow.

When `disabled` is added there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well.

2. Menu items only support `aria-disabled`; you have to add it yourself. Adding `disabled` to an `sl-menu-item` has no effect at all, as if it wasn't there. This is a deliberate choice: it keeps you in control of the markup and makes it explicit that unavailable menu items stay focusable instead of being skipped.

You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

</section>
