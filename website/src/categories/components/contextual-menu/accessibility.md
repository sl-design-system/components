---
title: Contextual menu accessibility
tags: accessibility
eleventyNavigation:
  parent: Checkbox
  key: ContextualMenuAccessibility
---

<section> 

## Keyboard interactions

...

</section>

<section> 

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a checkbox provide essential information to assistive technologies and screen readers. They convey the checkbox's role, state (checked or unchecked), and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

### Menu button

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`aria-checked`|`'true','false','mixed'`|The state of the checkbox.|no|
|`role`|`'checkbox'`|Declare our custom component as a checkbox.|no|
|`aria-label`|string|Can be added when the checkbox doesn't have a label text.|yes|
|`aria-describedby`|string|Used to describe (link with) hint (helper text) and/or error message.|no|
|`aria-disabled`|boolean|Announces the checkbox component as disabled with a screen reader. See [Note 1] below.|yes|
|`aria-labelledby`|string|When multiple checkboxes are used to connect with single header that describes checkboxes.|yes|

{.ds-table .ds-table-align-top}

</div>

### Menu

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon>|
|-|-|-|-|
|`role`|`'group'`|Declare our group of custom checkbox components as a checkbox group.|no|
|`aria-label`|string|Can be added when there is no label or header that could be described by.|yes|
|`aria-describedby`|string|Used to describe (link with) hint (helper text) and/or error message.|no|
|`aria-labelledby`|string|Used to connect with single header that describes checkbox group, when there is no label component connected to.|yes|

{.ds-table .ds-table-align-top}

</div>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the checkbox visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the checkbox out of the navigation flow.

When `disabled` is added to a checkbox there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

</section>