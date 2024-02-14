---
title: Switch accessibility
tags: accessibility
eleventyNavigation:
  parent: Switch
  key: SwitchAccessibility
---
<section>

When designed with accessibility in mind, switches can be useful for users with disabilities, as they offer a clear and easily distinguishable way to change settings.

</section>

<section>

## Keyboard interactions

Navigating and using switch components with a keyboard is a seamless experience, ensuring accessibility for all users. Here's a breakdown of the keyboard interactions:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|Pressing the 'Tab' key allows users to move focus to the switch. Once focused, they can activate the switch using the 'Space' key.|
|Space/Enter|When the switch is in focus, hitting the 'Enter' or 'Space' key toggles it between the 'on' and 'off' states. This intuitive action ensures that users can easily control the switch without the need for a mouse.|

{.ds-table .ds-table-align-top}

</div>

These keyboard interactions make switch components not only accessible but also user-friendly, catering to a diverse range of user needs and preferences.

</section>

<section> 

## WAI-ARIA

When it comes to ensuring accessibility for switch components, we turn to the power of WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications). Here's how WAI-ARIA contributes:

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`aria-checked`|`'true','false'`|The state of the switch.|no|
|`role`|`'switch'`|Declare our custom component as a switch.|no|
|`aria-label`|string|Can be added when the switch doesn't have a label text or label component connected with.|yes|
|`aria-describedby`|string|Used to describe (link with) hint (helper text) and/or error message.|no|
|`aria-disabled`|boolean|Announces the switch component as disabled with a screen reader. See [Note 1] below.|yes|
|`aria-labelledby`|string|When multiple switches are used to connect with single header that describes those switches.|yes|

{.ds-table .ds-table-align-top}

</div>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the switch visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.
- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the switch out of the navigation flow.

When `disabled` is added to a switch component there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).
</section>
