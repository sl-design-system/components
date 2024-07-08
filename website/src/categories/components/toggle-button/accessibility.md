---
title: Toggle button accessibility
tags: accessibility
eleventyNavigation:
  parent: Toggle button
  key: ToggleButtonAccessibility
---

<section>

## Keyboard Interaction
When the toggle button has focus:

- Space: Activates the toggle button.
- Enter: Activates the toggle button.
- Following button activation, the focus is set depending on the type of action the button performs. For example:
  - If activating the toggle button opens a drawer, the focus moves inside the drawer.

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a toggle button provide essential information to assistive technologies and screen readers. They convey the toggle button's role, state (enabled or disabled), and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`	|`checkbox`|Makes it clear that our custom component has the same behavior as a checkbox |no|
|`aria-labelledby`|string|The label outside the toggle button can be set to the `id` of that element|yes|
|`aria-label`|string|Used when the button is icon-only|yes|
|`aria-describedby`|string|When the toggle button needs extra explanation or description you can reference this element here by the `id`. See [Note 1] below for more explanation.| yes|
|`aria-disabled`| boolean|Announces the toggle button as disabled with a screenreader. See [Note 2] below for more explanation| yes|
|`aria-pressed`| boolean |When the toggle button is toggled on, the value of this state is true, and when toggled off, the state is false.| yes|

{.ds-table .ds-table-align-top}

**Notes:** 
1. There is a subtle difference between `aria-labelledby` and `aria-describedby`; a label should be concise, where a description is intended to provide more verbose information. A description can for example be "Items in the trash will be permanently removed after 30 days." to explain what (delayed) effect a "Move to trash" button has.
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

    - `disabled` dims the button visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and anounces it as 'dimmed' or 'disabled' in a screenreader. 

    - `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenario's where you don't want to take the button out of the navigation flow. 

    When `disabled` is added to a button there is no need to also add `aria-disabled`; Everything `aria-disabled` does, `disabled` does as well.

    You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)

</section>
