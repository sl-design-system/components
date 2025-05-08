---
title: Number Field accessibility
tags: accessibility
eleventyNavigation:
  parent: Number Field
  key: NumberFieldAccessibility
---
<section>

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a number field:

<div class="ds-table-wrapper">

|Command| Description                                                                                                                                                                     |
|-|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Tab| When focus is outside the number field, moves focus to the input container. |
|Arrow up/down|Increases or decreases the value in the number field, respecting the `step` attribute if set.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute|Value| Description                                                                                                                                                                                            |
|-|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`aria-label`	|string| Defines a string that tells the user what information they need to enter in this number field. Needs to be added when the number-field is not wrapped with `sl-form-field` and there is no `sl-label`. |
|`aria-labelledby`|string| Used to connect with single header/element that describes the number field, when there is no label component connected to.                                                                             |
|`aria-required`	|boolean| Informs the user that an element is required. When set to ‘true’, screen readers notify users that the element is required. If there is already a `required` attribute added, it is recommended to avoid adding `aria-required`.                                                                            |
|`aria-disabled`|boolean| Announces the number field component as disabled with a screen reader. See [Note 1] below.                                                                                                             |

{.ds-table .ds-table-align-top}

</div>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the number field visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the number field out of the navigation flow.

When `disabled` is added to a number field there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

</section>

