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

## Labeling
Assistive technology adds the term `pressed` to label of the button to indicate the status of the button. Therefore the aria-label you choose needs to make sense in combination with this term and certainly not change when the state changes.

If you have a toggle button that toggles a sidepanel you could choose "Show sidepanel" as a label. When a screenreader reads out "*Show sidepanel. Toggle button.*" it is clear this button button can be toggled and is currently `off` and the sidepanel will not be visible. When the button is then pressed it will read out "*Selected. Show sidepanel. Toggle button.*" indicating that "Show sidepanel" is now `on` and the side panel is visible.

Switching the label to what will happen when the button is pressed, ie. "Hide sidepanel" is wrong because it will confuse the user; it wil read "*Selected. Hide sidepanel. Toggle button*", meaning that "Hide sidepanel" is `on`, so not showing the sidepanel, while in fact it **is** shown.

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

|Attribute | Value | Description |
|-|-|-|
|`aria-label`|string|Used when the describe the function of the button because it is icon-only|
|`aria-disabled`| boolean|Announces the toggle button as disabled with a screenreader. See [Note 1] below for more explanation|

{.ds-table .ds-table-align-top}

**Notes:** 

1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

    - `disabled` dims the button visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and anounces it as 'dimmed' or 'disabled' in a screenreader. 

    - `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenario's where you don't want to take the button out of the navigation flow. 

    When `disabled` is added to a button there is no need to also add `aria-disabled`; Everything `aria-disabled` does, `disabled` does as well.

    You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)

</section>
