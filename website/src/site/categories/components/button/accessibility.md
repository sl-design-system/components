---
title: Button accessibility
tags: accessibility
eleventyNavigation:
  parent: Button
  key: ButtonAccessibility
---

<section> 

## Accessibility

Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<section>

## Interaction

### Keyboard Interaction
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

## Behaviour

### WAI-ARIA Roles, States, and Properties

- The button has role of button.
- The button has an accessible label. By default, the accessible name is computed from any text content inside the button element. However, it can also be provided with aria-labelledby or aria-label.
- If a description of the button's function is present, the button element has aria-describedby set to the ID of the element containing the description.
- When the action associated with a button is unavailable, the button has aria-disabled set to true.
- If the button is a toggle button, it has an aria-pressed state. When the button is toggled on, the value of this state is true, and when toggled off, the state is false.

[source](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

## Labelling

### Be concise
Button text should be concise: 1 or 2 words, no longer than 4 words, with fewer than 20 characters, including spaces. Don’t use punctuation marks such as periods or exclamation points.

### Write labels as verbs
A button represents an action, so its label needs to reflect the action that a user is taking — which is a verb. Labels written as nouns or adjectives tend to be unclear and disorienting.

### Clearly state the action
Make sure that a button’s label clearly states the outcome of the action. Use the same word or phrase as found elsewhere in the experience.

### Use sentence case
Button text should always be in sentence case. Never use capitalization to emphasize a specific button.

### Be aware of tone
Emojis and exclamation points aren’t appropriate for the functional, utilitarian nature of buttons. Keep the label to just text, with no punctuation or extra decoration.

</section>
