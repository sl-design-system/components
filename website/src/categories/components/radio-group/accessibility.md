---
title: Radio group accessibility
tags: accessibility
eleventyNavigation:
  parent: Radio group
  key: RadioGroupAccessibility
---
<section>Having an accessible application is not only achieved by writing good code, but also (maybe even MORE so) by writing good copy. To make sure radio groups and their options are clear for all users make sure to keep these points in mind:</section>

<section>

## Radio Group labels

A group label of a radio group is a descriptive element that provides context and identifies a collection of radio buttons that are related or belong to the same category or set.

By following the tips below, you can write group labels that effectively categorize radios.

### Conciseness
Keep the label concise. Use as few words as possible while still conveying the primary purpose or theme of the options in the group.

### Descriptive Clarity
While being concise, ensure the label provides enough information to make it clear what the options within the group represent. Use descriptive language that leaves no ambiguity.

### User-Centered Language
Use language that your target audience can easily understand. Avoid complex terminology or jargon that might confuse users.

### Consistency
Maintain a consistent style and wording for group labels throughout your interface. This creates a cohesive design and makes it easier for users to understand the organization. 

</section>

<section> 

## Radio button labels

The primary purpose of the label is to provide context, explanation, or information about the choice represented by the radio button. Labels help users understand the meaning of the radio button and the choices available. Follow these tips for creating clear and user-friendly radio labels:

### Conciseness: 
Keep the label concise. Use as few words as necessary to convey the radio's primary purpose or action.

### Descriptive Clarity
While being concise, ensure the label provides enough information to make it clear what the radio represents or the action it triggers. Use descriptive language that leaves no room for ambiguity.

### User-Centered Language
Use language that your target audience can easily understand. Avoid using technical jargon or industry-specific terms that might confuse users.

### Sorting Options
When presenting checkboxes in a group, consider sorting them logically. You can arrange them alphabetically or by importance.
</section>

<section>

## Help text
Positioned beneath radio groups, help text offers valuable context and guidance. Follow these tips to craft informative and user-friendly help text:

### Conciseness
Keep the help text brief, using only 1-2 short, complete sentences. Avoid unnecessary verbosity to maintain clarity.

### Descriptive Clarity
While being concise, ensure the help text provides clear and informative guidance. Explain what happens when the user selects the option, ensuring they understand the consequences or benefits associated with their choice.

### User-Centered Language
Use language that aligns with your target audience. Avoid technical jargon or industry-specific terms that might confuse users.

### No Repetition
Avoid merely restating the label in different phrasing within your help text. Instead, focus on providing additional context and information that enhances the user's understanding.

### Consistency
Maintain a consistent style and tone throughout your help text. This consistency aids users in understanding and interacting with your interface.

</section>

<section>

## Focus order
The focus order of a radio button group determines the sequence in which keyboard or accessibility device users can navigate and select options within the group. It ensures a logical and consistent flow of focus, enabling users to make choices in an organized manner while adhering to accessibility standards.
</section>

<section>

## Keyboard interactions
Keyboard interactions within a radio button group allow users to navigate options using arrow keys or the Tab key, facilitating efficient selection and ensuring accessibility for those who rely on keyboard navigation.
Typically, users can navigate to a radio group using the "Tab" key, once they're in the group they can focus the different options with Arrow keys. Then they can select an option with the "Spacebar" or "Enter" key. Keyboard interaction ensures that individuals who rely on keyboard navigation or assistive technologies can easily control checkboxes within a user interface.
We use tab to switch between groups and "skip" the separate options in the tab-flow to enable faster navigation in a form; when you want to navigate to the "Save" button quickly, you shouldn't be required to go over the complete list of options just to get to the end of the form.


|Key| Description |
|---|-------------|
|Tab|	Shifts focus to the first radio option in a radio group. Or when a radio button is focused the focus will go the the next focusable element in the page when the tab key is pressed|
|Space/Enter | Selects the currently focused option|
|Arrow Keys	| Once you are "in" a radio group you can navigate to the next option by using the right or down arrow key. You can navigate back to the previous box with left or up. The focus indicator loops, so when you are at the last option and press "down" it will focus the first option. |

{.ds-table .ds-table-align-top}
</section>


<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for radio buttons and groups provide essential information to assistive technologies and screen readers. They convey the radio button's role, state (checked, unchecked, valid and invalid), and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>
### Radio Group  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`role`	|`'radiogroup'`|Makes it clear that our custom component is a radio group |no|
|`aria-labelledby`|string| When different element serves as the label this property can be set to the `id` of that element|yes|
|`aria-describedby`|string| When the radio group needs extra explanation or description you can reference this element here by the `id`. See [Note 1] below for more explanation| yes|
|`aria-disabled`| boolean| Announces the radio group as disabled with a screenreader. See [Note 2] below for more explanation| yes|

{.ds-table .ds-table-align-top}

### Radio Button
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`	|`'radio'`|Makes it clear that our custom component is a radio button |no |
|`aria-checked`|`'true','false'`|The state of the radio button.|no|
|`aria-labelledby`|string| When different element serves as the label this property can be set to the `id` of that element|yes|
|`aria-label`|string|To be used when you don't have a text label because you want to use images as the options for example|yes|
|`aria-describedby`|string| When the option needs extra explanation or description you can reference this element here by the `id`. See [Note 1] below for more explanation| yes|
|`aria-disabled`| boolean| Announces the option as disabled with a screenreader. See [Note 2] below for more explanation| yes|

{.ds-table .ds-table-align-top}

**Notes:** 
1. There is a subtle difference between `aria-labelledby` and `aria-describedby`; a label should be concise, where a description is intended to provide more verbose information. A description for a radio group can for example be used to explain what (delayed) effect a the chosen option will have. Or in the case of an option you can use it for example for an option with a value of "other..." so you can direct the user to a textfield where they can leave their own option.
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

    - `disabled` dims the button visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and anounces it as 'dimmed' or 'disabled' in a screenreader. 

    - `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenario's where you don't want to take the button out of the navigation flow. 

    When `disabled` is added to an element there is no need to also add `aria-disabled`; Everything `aria-disabled` does, `disabled` does as well.

    You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)

</section>
