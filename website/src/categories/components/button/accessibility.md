---
title: Button accessibility
tags: accessibility
eleventyNavigation:
  parent: Button
  key: ButtonAccessibility
---

<section>
Exploring essential accessibility considerations for buttons: ensuring an inclusive user experience.
</section>

<section>

## Content
Having an accessible application is not only achieved by writing good code, but also (maybe even MORE so) by writing good copy. To make sure buttons and their actions are clear for all users make sure to keep these points in mind:

### Concise Clarity
Button text should be brief, ideally 1 or 2 words, and at most 4 words with fewer than 20 characters, spaces included. Avoid punctuation like periods or exclamation points.

### Action-Centric
Buttons should express actions, using verbs in their labels and a bare infinitive conjunction. This approach enhances clarity and user orientation.

### Clear Outcomes
The button's label should unmistakably convey the action's result, mirroring the wording elsewhere in the experience.

### Sentence Case
Always use sentence case for button text; capitalization should not be used for emphasis.

### Mindful Tone
Buttons serve a functional purpose, so emojis and exclamation points should be left behind. Keep labels as plain text, free from extra punctuation or embellishments.

</section>

<section>

## Keyboard Interaction
When the button has focus:

- Space: Activates the button.
- Enter: Activates the button.
- Following button activation, the focus is set depending on the type of action the button performs. For example:
  - If activating the button opens a dialog, the focus moves inside the dialog.
  - If activating the button closes a dialog, focus typically returns to the button that opened the dialog unless the function performed in the dialog context logically leads to a different element. For example, activating a cancel button in a dialog returns focus to the button that opened the dialog. However, if the dialog were confirming the action of deleting the page from which it was opened, the focus would logically move to a new context.
  - If activating the button does not dismiss the current context, focus typically remains on the button after activation, e.g., an Apply or Recalculate button.
  - If the button action indicates a context change, such as move to next step in a wizard or add another search criteria, then it is often appropriate to move focus to the starting point for that action.

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a button provide essential information to assistive technologies and screen readers. They convey the button's role, state (enabled or disabled), and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`	|`'button'`|Makes it clear that our custom component is a button |no|
|`aria-labelledby`|string| When different element serves as the label, for example in the case of an icon-only button that has a label outside the button, this property can be set to the `id` of that element|yes|
|`aria-label`|string|To be used when the button is icon-only|yes|
|`aria-describedby`|string| When the button needs extra explanation or description you can reference this element here by the `id`. See [Note 1] below for more explanation.| yes|
|`aria-disabled`| boolean| Announces the button as disabled with a screenreader. See [Note 2] below for more explanation| yes|
|`aria-pressed`| boolean | When the button is used as a toggle and is toggled on, the value of this state is true, and when toggled off, the state is false.| yes|

{.ds-table .ds-table-align-top}

**Notes:** 
1. There is a subtle difference between `aria-labelledby` and `aria-describedby`; a label should be concise, where a description is intended to provide more verbose information. A description can for example be "Items in the trash will be permanently removed after 30 days." to explain what (delayed) effect a "Move to trash" button has.
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

    - `disabled` dims the button visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and anounces it as 'dimmed' or 'disabled' in a screenreader. 

    - `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenario's where you don't want to take the button out of the navigation flow. 

    When `disabled` is added to a button there is no need to also add `aria-disabled`; Everything `aria-disabled` does, `disabled` does as well.

    You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)

</section>


