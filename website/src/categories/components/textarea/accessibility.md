---
title: Textarea accessibility
tags: accessibility
eleventyNavigation:
  parent: Text area
  key: TextareaAccessibility
---
<section>
  
## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a text area:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|When focus is outside the text area, moves focus to the input container. If focus is on the input container, moves focus to the end enhancer (if provided, and interactive).|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>


## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a text area provide essential information to assistive technologies and screen readers. They convey the text area's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.
<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`role`|`'textbox'`|Identifies as an element that allows the input of text.|no|
|`aria-label`|string|It is used to define a string that labels the action that will be performed when the user interacts with the text area. Needs to be added when the text area is not wrapped with `sl-form-field` and there is no `sl-label`.|yes|
|`aria-labelledby`|string|Used to connect with single header/element that describes the text area, when there is no label component connected to.|yes|
|`aria-required`|boolean|Informs the user that an element is required. When set to ‘true’, screen readers notify users that the element is required.|yes|
|`aria-disabled`|boolean|Announces the text area component as disabled with a screen reader. See [Note 1] below.|yes|

{.ds-table .ds-table-align-top}

</div>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the text area visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the text area out of the navigation flow.

When `disabled` is added to a text area there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).


</section>
