---
title: Combobox accessibility
tags: accessibility
eleventyNavigation:
  parent: Combobox
  key: ComboboxAccessibility
---

<section>

Having an accessible application is not only achieved by writing good code, but also (maybe even MORE so) by writing good copy. To make sure checkbox groups and their options are clear for all users make sure to keep these points in mind:

</section>

<section>

## Group labels

Positioned above checkbox groups to ensure clear organization when multiple checkboxes share a common category. They must effectively convey the common theme while maintaining a balance between brevity and descriptiveness for user clarity.


By following the tips below, you can write group labels that effectively categorize checkboxes.

### Conciseness
Keep the label concise. Use as few words as possible while still conveying the primary purpose or theme of the checkboxes in the group.

### Descriptive Clarity 
While being concise, ensure the label provides enough information to make it clear what the checkboxes within the group represent. Use descriptive language that leaves no ambiguity.

### User-Centered Language
Use language that your target audience can easily understand. Avoid complex terminology or jargon that might confuse users.

### Consistency
Maintain a consistent style and wording for group labels throughout your interface. This creates a cohesive design and makes it easier for users to understand the organization.

</section>


<section>

## Checkbox labels

Positioned alongside individual checkboxes, checkbox labels play a pivotal role in user understanding and interaction. Follow these tips for creating clear and user-friendly checkbox labels:

### Conciseness 
Keep the label concise. Use as few words as necessary to convey the checkbox's primary purpose or action.

### Descriptive Clarity 
While being concise, ensure the label provides enough information to make it clear what the checkbox represents or the action it triggers. Use descriptive language that leaves no room for ambiguity.

### User-Centered Language
Use language that your target audience can easily understand. Avoid using technical jargon or industry-specific terms that might confuse users.

### No Negative Statements 
Avoid using negative statements that might confuse users, such as "checking the checkbox to turn off" or "opt-out." Instead, positively frame the label.

### Avoid Mixing "Enable" and "Disable" Options
In a group of checkboxes, maintain consistency by not mixing "enable" and "disable" options. Users should easily discern the purpose of each checkbox.

### Consistency
Ensure that all options in a group have the same form or category. Avoid mixing unrelated categories (e.g., nationalities and countries) within the same checkbox group.

### Sorting Options 
When presenting checkboxes in a group, consider sorting them logically. You can arrange them alphabetically or by importance.

</section>

<section>

## Help text

Positioned beneath checkbox groups, help text offers valuable context and guidance. Follow these tips to craft informative and user-friendly help text:

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

## Keyboard interactions

Keyboard interaction with a checkbox refers to how users can interact with checkboxes using keyboard inputs. Typically, users can navigate to a checkbox using the "Tab" key, select or deselect it with the "Spacebar" key, and sometimes use other keyboard shortcuts for efficiency. Keyboard interaction ensures that individuals who rely on keyboard navigation or assistive technologies can easily control checkboxes within a user interface.
We use a tab to switch between checkbox groups to enable faster navigation in a form; when you want to navigate to the "Save" button quickly, you shouldn't be required to go over the complete list of options just to get to the end of the form.

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|Shifts focus to the first checkbox input in a checkbox group or a checkbox that isn't in a group.|
|Space/Enter|Toggles the checkbox between checked and unchecked states.|
|Arrow Keys|Once you are in a checkbox group you can navigate to the next checkbox by using the right or down arrow key. You can navigate back to the previous box with left or up. The focus indicator loops, so when you are at the last option and press "down" it will focus on the first option.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section> 

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a checkbox provide essential information to assistive technologies and screen readers. They convey the checkbox's role, state (checked or unchecked), and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

### Checkbox

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

### Checkbox group

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