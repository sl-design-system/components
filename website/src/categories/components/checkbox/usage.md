---
title: Checkbox usage
tags: usage
eleventyNavigation:
  parent: Checkbox
  key: CheckboxUsage
---

<section class="no-heading">

<div class="ds-example">

<sl-form-field label="Subjects">
<sl-checkbox-group value="0">
  <sl-checkbox value="0" checked>Mathematics</sl-checkbox>
  <sl-checkbox value="1">Geography</sl-checkbox>
  <sl-checkbox value="2">Physics</sl-checkbox>
  <sl-checkbox value="3" disabled>History</sl-checkbox>
</sl-checkbox-group>
</sl-form-field>

</div>

<div class="ds-code">

  ```html
  <sl-form-field label="Subjects">
    <sl-checkbox-group value="0">
      <sl-checkbox value="0" checked>Mathematics</sl-checkbox>
      <sl-checkbox value="1">Geography</sl-checkbox>
      <sl-checkbox value="2">Physics</sl-checkbox>
      <sl-checkbox value="3" disabled>History</sl-checkbox>
    </sl-checkbox-group>
  </sl-form-field>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the Checkbox component.

<section class="ds-cards">

<figure class="ds-cards__do">
  {{'components/checkbox/sl-checkbox-when-use-yes-no.svg' | svgImage}}
<figcaption>

### Yes or No Decisions
Checkboxes simplify making yes-or-no decisions. Users can independently toggle options, whether it's about their preferences, agreeing to terms, or picking from a list.
</figcaption>
</figure>

<figure class="ds-cards__do">
  {{'components/checkbox/sl-checkbox-when-use-multiple.svg' | svgImage}}
  <figcaption>

  ### Multiple Selections
  When users need to pick multiple items from a list, checkboxes are a go-to. They offer flexibility, helping users select multiple choices or refine their search results.
  </figcaption>
</figure>

<figure class="ds-cards__do">
  {{'components/checkbox/sl-checkbox-when-use-filter.svg' | svgImage}}
  <figcaption>

  ### Filtering and Sorting
  Checkboxes are handy for users dealing with lots of options. They can fine-tune what they see by selecting specific attributes.
  </figcaption>
</figure>

<figure class="ds-cards__do">
  {{'components/checkbox/sl-checkbox-when-use-only.svg' | svgImage}}
  <figcaption>

  ### Only checkbox
  When it becomes necessary to indicate to the user that certain elements have been selected. A practical instance would be the selection of a table’s row or a series of cards.
  </figcaption>
</figure>

</section>

</section>

<section>

## When not to use

The following guidance describes when not to use the Checkbox component.

<section class="ds-cards">

<figure class="ds-cards__dont">
  {{'components/checkbox/sl-checkbox-when-not-use-exclusive.svg' | svgImage}}
  <figcaption>

  ### Exclusive choices
  While checkboxes work well in forms and filters, they're not suitable for exclusive selections. Instead, use radio buttons for single choices.
  </figcaption>
</figure>

<figure class="ds-cards__dont">
  {{'components/checkbox/sl-checkbox-when-not-use-toggle.svg' | svgImage}}
  <figcaption>

  ### Toggle preferences
  For actions that affect preferences or application behavior, opt for a switch for a better user experience.
  </figcaption>
</figure>

</section>

</section>

<section>

## Anatomy
{{ 'components/checkbox/sl-checkbox-anatomy.svg' | svgImage }}

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Field Label	|The group label, positioned at the top of a checkbox group, provides a clear and concise description of the category or context for the choices contained within the group. It serves as a visual and informational cue that helps users understand the purpose of the options and facilitates more straightforward decision-making in the user interface. More information about group labels you can find in the **Accessibility** tab.	|No|
|2|Checkbox input (unchecked)	|An unchecked checkbox input is like a blank canvas. It represents an option or choice that is currently unselected, waiting for the user to make a decision and activate it.	|No|
|3|Icon	|The icon in a checkbox is a visual confirmation of user selection.|No|
|4|Label	|A checkbox label is a brief, descriptive text next to the checkbox element.|Yes|
|5|Helper Text & Hint|The help text for a checkbox group is a informative component, it provides users with guidance and clarifications related to the available options. It assists users in making informed decisions by offering context, explanations, or additional details about the purpose or implications of the choices within the group. More information about help text you can find in the **Accessibility** tab.|Yes|
|6|Checkboxes|The checkbox group is designed with a minimum requirement of two options and allows a maximum of five selections. When the list of options exceeds this maximum limit, it's advisable to consider alternative design elements like a dropdown menu or combobox. These options provide a more user-friendly way to navigate and select from a larger set of choices, ensuring a streamlined and efficient user experience.|No|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Sizing

<section class="ds-cards">

<figure>
  {{'components/checkbox/sl-checkbox-sizing-medium.svg' | svgImage}}
  <figcaption>

  ### Medium (default)
  The medium checkbox serves as the default in our user interfaces. It strikes a balance between size and clarity, making it the standard and user-friendly option for binary decisions and multiple-choice selections within our applications.
  </figcaption>
</figure>

<figure>
  {{'components/checkbox/sl-checkbox-sizing-large.svg' | svgImage}}
  <figcaption>

  ### Large
  On touch-based devices, the large checkbox can be advantageous as it provides a bigger tap target, making it easier for users to interact with.
  </figcaption>
</figure>

</section>

</section>

<section>

## Status

The checkbox input facilitates multiple statuses, including unchecked, checked, and indeterminate. By default, a set of checkboxes the options are initially unchecked.

<section class="ds-cards">

<figure>
  {{'components/checkbox/sl-checkbox-status-checked.svg' | svgImage}}
  <figcaption>

  ### Checked
  A checked checkbox serves as a visual confirmation of a user's selection or decision within a user interface. Its primary purpose is to indicate that a specific option or choice has been actively chosen or enabled. When a checkbox is checked, it communicates to the user that a particular action or preference is in effect.
  </figcaption>
</figure>

<figure>
  {{'components/checkbox/sl-checkbox-status-unchecked.svg' | svgImage}}
  <figcaption>

  ### Unchecked
  An unchecked checkbox signals that a specific option or choice has not been selected or enabled by the user. Its primary purpose is to offer users the opportunity to make a binary decision as per their preference.
  </figcaption>
</figure>

<figure>
  {{'components/checkbox/sl-checkbox-status-indeterminate.svg' | svgImage}}
  <figcaption>

  ### Indeterminate
  The primary purpose of an indeterminate checkbox is to convey that the status of the associated options or sub-options is in a state of partial selection or indeterminacy. This can be particularly useful in scenarios where users are presented with a group of related choices, such as in a hierarchical list or nested categories. The indeterminate checkbox indicates that while some sub-options within the group are selected and some are not, the user can further refine their choices.
  </figcaption>
</figure>

</section>

</section>

<section>

## Variants

The default, valid, and invalid checkboxes play a pivotal role in offering users essential feedback on their interactions and guiding them toward necessary actions. These variants serve as visual indicators, providing users with clear cues about the status of their selections.

<section class="ds-cards">

<figure>
  {{'components/checkbox/sl-checkbox-variant-default.svg' | svgImage}}
  <figcaption>

  ### Default
  The purpose of the default variant is to provide users with the option to select or deselect a choice or preference. When checked, it indicates an affirmative decision, and when unchecked, it signifies a negative choice.
  </figcaption>
</figure>

<figure>
  {{'components/checkbox/sl-checkbox-variant-valid.svg' | svgImage}}
  <figcaption>

  ### Valid
  A valid checkbox used in an online test serves as a feedback mechanism, confirming that the selected option or answer aligns with the correct choice, as defined by the test's criteria or answer key. When the valid checkbox is checked, it signals to the test-taker that their response is accurate and meets the assessment's requirements.
  </figcaption>
</figure>

<figure>
  {{'components/checkbox/sl-checkbox-variant-invalid.svg' | svgImage}}
  <figcaption>

  ### Invalid
  This checkbox variant is prominently featured in form validation processes and tests. When checked, it communicates that there are significant issues or discrepancies in the entered data, prompting the user to review and rectify their input, ensuring data accuracy and a smooth user experience.
  </figcaption>
</figure>

</section>

</section>

<section>

## Options

With these options, you can tweak the appearance of the checkbox in Figma. They are available in the Design Panel so you can compose the checkbox to exactly fit the user experience need for the use case you are working on.

{{ 'components/checkbox/sl-checkbox-figma-options.svg' | svgImage }}

|Item|Options|Description|
|-|-|-|
|Size|`'md' (Default), 'lg'`|The checkbox and the label element come in two sizes: medium (default) and large, providing flexibility to align with your design requirements.|
|Variant|`'default', 'invalid', 'valid'`|This variants are provide to give feedback to the user about the interaction o the necessity of another action more.|
|States|`'idle', 'hover', 'active', 'disabled'`|Checkboxes interactive states to replicate the real behavior into your UI.|
|Status |`'Checked', 'Unchecked'`|To determinate between selected and unselect version.|
|Indeterminate |`'on', 'off'`|To turn the indeterminate state on or off.|
|Label|`'on', 'off'`|To turn to label on or off (label is turned on by default)|
|Label text|`'input text'`|To insert the text of the label.|
|Focus ring|`'on', 'off'`|Turn the focus ring option to show the focus state of the checkbox.|

{.ds-table .ds-table-align-top}

</section>

<section>

## Behavior

### Label overflow wrap
When a label is too long for the available horizontal space, it wraps to form another line, with the text aligned to the top.


### Clickable area
The checkbox has a clickable area around both the checkbox and label for more space to press. We've left a bit of space on the left side to ensure smooth alignment and avoid any unexpected layout issues.


### Focusable area
Both the checkbox input and label are interactive elements, allowing users to interact with them. However, when it comes to focusing, whether through keyboard navigation or voice commands, the visible focus state is only visible on the checkbox itself.


### Validation
If an issue arises after submitting a form, the help text will switch to an 'invalid' state. This serves as a valuable guide for users, clearly explaining the necessary actions to resolve any problems.


### Default checked
Set the initial state of the checkbox according to your preferences. You can choose whether it starts as checked or unchecked by default, providing you with control over its initial behavior in your interface.


### Indeterminate State
Useful in scenarios where checkboxes are nested, we've incorporated an indeterminate state. Users can't set the indeterminate state by clicking on it, but it can be programmatically set to this state.

</section>