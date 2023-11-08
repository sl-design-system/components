---
title: Text field accessibility
tags: accessibility
eleventyNavigation:
  parent: Text field
  key: TextInputAccessibility
---
<section>

## Labels 
Effective labeling is crucial for helping users understand the information they should input into text fields. In all cases, text fields should be accompanied by clear and concise labels.

Here are key principles to follow:

### Sentence-Style Capitalization
Utilize sentence-style capitalization for all labels, with the exception being product names and proper nouns. This means capitalizing only the first word of the label and any proper nouns within it.

### Conciseness
Keep labels brief and to the point. Avoid unnecessary words or details that could make labels lengthy and confusing.

### No Colons
Avoid the use of colons after label names, as they can clutter the label and potentially cause confusion.
</section>

<section>

## Placeholder text
Placeholder text plays a valuable role in guiding users and providing examples of input. It's an optional feature that disappears once users begin entering their data. However, it's important to use it thoughtfully and in alignment with best practices.

Here's how to make the most of placeholder text:

### Sentence-Style Capitalization
Keep the text straightforward by using sentence-style capitalization. In most cases, present the text as a clear statement without punctuation.

### Not Mandatory
Remember that placeholder text is not a requirement, and it remains hidden in text field fields by default.

### Exercise Caution
Be mindful when adding placeholder text; overuse can potentially disrupt the user experience. Utilize it only when it genuinely enhances user interactions.
</section>

<section>

## Help text
Positioned beneath text field, help text offers valuable context and guidance. Follow these tips to craft informative and user-friendly help text:

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
The focus order of a text field refers to the sequence in which the cursor or focus moves between different text field fields or interactive elements on a user interface, typically when using the keyboard to navigate. It's an essential aspect of web and application accessibility and usability.

</section>

<section> 

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a text field:

</section>

<section>


## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a text field provide essential information to assistive technologies and screen readers. They convey the text field's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.
<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`role`	|`'button'`|Makes it clear that our custom component is a button |no|
|`aria-labelledby`|string| When different element serves as the label, for example in the case of an icon-only button that has a label outside the button, this property can be set to the `id` of that element|yes|
|`aria-label`|string|To be used when the button is icon-only|yes|
|`aria-describedby`|string| When the button needs extra explanation or description you can reference this element here by the `id`. See [Note 2] below for more explanation| yes|
|`aria-disabled`| boolean| Announces the button as disabled with a screenreader. See [Note 3] below for more explanation| yes|
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
