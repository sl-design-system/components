---
title: Contextual menu accessibility
tags: accessibility
eleventyNavigation:
  parent: Contextual menu
  key: ContextualMenuAccessibility
---

<section> 

## Keyboard interactions

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Space/Enter | Open the contextual menu and the sub-menus. When you open the menu, the focus move to the first option.|
|Up & Down | Once you have open the contextual menu. You can move between options with the `up` and `down` keys. The focus indicator loops, so when you are at the last option and press `down` it will focus on the first option. And if you are at the first option and press `up` it'll focus the last option.|
|Right | When you are in a sub-menu option `right` key open it and the focus move to the first option.|
|Right & Esc | This keys close the contextual menu. But, when you are in a sub-menu `right` & `esc` keys close it and the focus move parent option. This works from any option, doesn't matter wher you are.|


{.ds-table .ds-table-align-top}

</div>

</section>

<section> 

## WAI-ARIA

<section>

### Menu button

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`|`'button'`|`sl-button` as part of `sl-menu-button` has a role of button.|no|
|`aria-expanded`|boolean|Set to `true` if the `sl-menu` is visible (opened), `false` if it is hidden.|no|
|`aria-details`|string|Used to link the menu element with the button (that triggers the menu component). It contains `id` of the menu element and is added to the button element.|no|
|`aria-label`|string|Please add when only icon button is used (so no text for the menu button is added).|yes|
|`aria-disabled`|boolean|Announces the menu button component as disabled with a screen reader. See [Note 1] below.|yes|

{.ds-table .ds-table-align-top}

</div>
</section>

<section>

### Menu

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'menu'`|Declare component as a menu.|no|

{.ds-table .ds-table-align-top}

</div>
</section>

<section>

### Menu item

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'menuitem'`|Declare an element as an menu item.|no|
|`aria-expanded`|boolean|Added when menu item is expandable and connected with another menu element (submenu). Set to `true` if the `sl-menu` (submenu) is visible (opened), `false` if it is hidden.|no|
|`aria-details`|string|Used to link the menu (submenu) element with the expandable menu item (that triggers the \[sub\]menu). It contains `id` of the menu (submenu) and is added to the menu item element.|no|
|`aria-disabled`|boolean|Announces the menu item component as disabled with a screen reader. See [Note 1] below.|yes|
|`aria-label`|string|Can be added when there is no label/text that could be described by. eg. when there is only an icon added.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the menu button/menu item visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the menu button / menu item out of the navigation flow.

When `disabled` is added there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

</section>