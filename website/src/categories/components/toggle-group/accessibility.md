---
title: Toggle group accessibility
tags: accessibility
eleventyNavigation:
  parent: Toggle group
  key: ToggleGroupAccessibility
---
<section>

## Keyboard interactions
Keyboard interactions within a toggle group allow users to navigate options using arrow keys, facilitating efficient selection and ensuring accessibility for those who rely on keyboard navigation.
Typically, users can navigate to a toggle group using the `Tab` key, once they're in the group they can focus the different options with Arrow keys. Then they can select or deselect an option with the `Space` or `Enter` key.


|Key| Description                                                                                                                                                                                                                                                                                          |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Tab| 	Shifts focus to the first toggle button in a toggle group. Or when a toggle button is focused the focus will go the the next focusable element in the page when the tab key is pressed.                                                                                                             |
|Space/Enter | Selects/deselects the currently focused option. In non-multiple variant selecting one toggle button deselects another one, when there is already another one selected.                                                                                                                               |
|Arrow Keys	| Once you are "in" a toggle group you can navigate to the next toggle button (option) by using the right or down arrow key. You can navigate back to the previous one with left or up. The focus indicator loops, so when you are at the last option and press "down" it will focus the first option. |

{.ds-table .ds-table-align-top}

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a toggle group provide essential information to assistive technologies and screen readers. They convey the toggle group's role and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.


|Attribute | Value | Description                                                                                                                                                                                             | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-|
|`role`	|`region`| Identifies the toggle group as a significant element of the page and that it should be easily accessible with screen readers.                                                                           |no|
|`aria-label`|string|The `aria-label` can be added on the toggle group to describe its purpose. Individual button labels, especially in case of icon only buttons, need to be set on button level. More information about accessibility of toggle buttons can be found in <a href="/categories/components/toggle-button/accessibility/" target="_blank">the toggle button documentation</a>. |yes|
|`aria-labelledby`|string| Can be used to connect with a single (heading) element that describes the toggle group, instead of using`aria-label`, which would duplicate the text.                                                                                        |yes|
|`aria-disabled`| boolean| Announces the toggle group as disabled with a screen reader. See [Note 1] below for more explanation.                                                                                                   | yes|

{.ds-table .ds-table-align-top}


**Notes:** 

1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

    - `disabled` dims the toggle group visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

    - `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the toggle group out of the navigation flow. 

    When `disabled` is added to a toggle group there is no need to also add `aria-disabled`; Everything `aria-disabled` does, `disabled` does as well.

    You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)


</section>

