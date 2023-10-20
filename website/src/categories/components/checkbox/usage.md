---
title: Checkbox usage
tags: usage
eleventyNavigation:
  parent: Checkbox
  key: CheckboxUsage
---

<section class="no-heading">

<div class="ds-example">

<sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>

</div>

<div class="ds-code">

  ```html
  <sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the Checkbox component.

<section class="ds-cards">
<figure>
{{'components/button/sl-button-when-use-actions.svg' | svgImage}}
<figcaption>

### Yes or No Decisions
Checkboxes simplify making yes-or-no decisions. Users can independently toggle options, whether it's about their preferences, agreeing to terms, or picking from a list.
</figcaption>
</figure>
<figure>
    {{'components/button/sl-button-when-use-navigation.svg' | svgImage}}
    <figcaption>

### Multiple Selections
When users need to pick multiple items from a list, checkboxes are a go-to. They offer flexibility, helping users select multiple choices or refine their search results.
</figcaption>
  </figure>
<figure>
{{'components/button/sl-button-when-use-actions.svg' | svgImage}}
<figcaption>

### Filtering and Sorting
Checkboxes are handy for users dealing with lots of options. They can fine-tune what they see by selecting specific attributes.
</figcaption>
</figure>
</section>


[//]: # (### Binary Decisions)

[//]: # (Checkboxes simplify making yes-or-no decisions. Users can independently toggle options, whether it's about their preferences, agreeing to terms, or picking from a list.)

[//]: # ()
[//]: # (### Multiple Selections)

[//]: # (When users need to pick multiple items from a list, checkboxes are a go-to. They offer flexibility, helping users select multiple choices or refine their search results.)

[//]: # ()
[//]: # (### Filtering and Sorting)

[//]: # (Checkboxes are handy for users dealing with lots of options. They can fine-tune what they see by selecting specific attributes.)

</section>

<section>

## When not to use

The following guidance describes when not to use the Checkbox component.

### Exclusive choices
While checkboxes work well in forms and filters, they're not suitable for exclusive selections. Instead, use radio buttons for single choices.

### Toggle preferences
For actions that affect preferences or application behavior, opt for a switch for a better user experience.

</section>

<section>

## Anatomy

```html
  (Visual)
```

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Checkbox input (unchecked)	|An unchecked checkbox input is like a blank canvas. It represents an option or choice that is currently unselected, waiting for the user to make a decision and activate it.	|no|
|2|Icon	|The icon in a checkbox is a visual confirmation of user selection.	|no|
|3|Label	|A checkbox label is a brief, descriptive text next to the checkbox element.|yes|

{.ds-table}

</section>

<section>

## Sizing

### Medium (default)
The medium checkbox serves as the default in our user interfaces. It strikes a balance between size and clarity, making it the standard and user-friendly option for binary decisions and multiple-choice selections within our applications.

### Large
On touch-based devices, the large checkbox can be advantageous as it provides a bigger tap target, making it easier for users to interact with.

</section>

<section>

## Status

### Checked
A checked checkbox serves as a visual confirmation of a user's selection or decision within a user interface. Its primary purpose is to indicate that a specific option or choice has been actively chosen or enabled. When a checkbox is checked, it communicates to the user that a particular action or preference is in effect.

### Unchecked
An unchecked checkbox signals that a specific option or choice has not been selected or enabled by the user. Its primary purpose is to offer users the opportunity to make a binary decision as per their preference.

### Indeterminate
The primary purpose of an indeterminate checkbox is to convey that the status of the associated options or sub-options is in a state of partial selection or indeterminacy. This can be particularly useful in scenarios where users are presented with a group of related choices, such as in a hierarchical list or nested categories. The indeterminate checkbox indicates that while some sub-options within the group are selected and some are not, the user can further refine their choices.

</section>

<section>

## Variants

### Default
The purpose of the default variant is to provide users with the option to select or deselect a choice or preference. When checked, it indicates an affirmative decision, and when unchecked, it signifies a negative choice.

### Valid
A valid checkbox used in an online test serves as a feedback mechanism, confirming that the selected option or answer aligns with the correct choice, as defined by the test's criteria or answer key. When the valid checkbox is checked, it signals to the test-taker that their response is accurate and meets the assessment's requirements.

### Invalid
This checkbox variant is prominently featured in form validation processes and tests. When checked, it communicates that there are significant issues or discrepancies in the entered data, prompting the user to review and rectify their input, ensuring data accuracy and a smooth user experience.

</section>

<section>

## Options

With these options, you can tweak the appearance of the radio in Figma. They are available in the Design Panel so you can compose the checkbox to exactly fit the user experience need for the use case you are working on.


|Item|Options|Description|
|-|-|-|
|Size|`???`.|Medium (default), and large|
|Variant|`???`|Default, valid or invalid|
|States|`???`|Idle, hover, active and disabled|
|Status |`???`|Checked or unchecked|
|Indeterminate |`???`|To turn the indeterminate state on or off|
|Label|`???`|To turn to label on or off (label is turned on by default)|
|Label text|`???`|To insert the text of the label
|Focus ring|`???`|Turn the focus ring option to show the focus state of the checkbox|

{.ds-table .ds-table-align-top}

</section>

<section>

<div class="ds-example">

<sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>

Example of the checkbox group

</div>

<div class="ds-code">

  ```html
  <sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>

Example of the checkbox group
  ```

</div>

</section>

<section>

## Checkbox group

Use the checkbox group component to group multiple checkboxes with the same category, together with the group label, and help text for clear organization.

### Group label
The group label, positioned at the top of a checkbox group, provides a clear and concise description of the category or context for the choices contained within the group. It serves as a visual and informational cue that helps users understand the purpose of the options and facilitates more straightforward decision-making in the user interface.

### Amount of options
The checkbox group is designed with a minimum requirement of two options and allows a maximum of five selections. When the list of options exceeds this maximum limit, it's advisable to consider alternative design elements like a dropdown menu or combobox. These options provide a more user-friendly way to navigate and select from a larger set of choices, ensuring a streamlined and efficient user experience.

### Help text
The help text for a checkbox group is a informative component, it provides users with guidance and clarifications related to the available options. It assists users in making informed decisions by offering context, explanations, or additional details ``link to help text details in accessibility tab`` about the purpose or implications of the choices within the group.

</section>

<section>

## Behaviors

Let's explore the behavior of the checkbox:

### Label overflow wrap
When a label is too long for the available horizontal space, it wraps to form another line, with the text aligned to the top.

```html
  (Visual)
```

### Clickable area
The checkbox has a clickable area around both the checkbox and label for more space to press. We've left a bit of space on the left side to ensure smooth alignment and avoid any unexpected layout issues.

```html
  (Visual)
```

### Focusable area
Both the checkbox input and label are interactive elements, allowing users to interact with them. However, when it comes to focusing, whether through keyboard navigation or voice commands, the visible focus state is only visible on the checkbox itself.

```html
  (Visual)
```

### Validation
If an issue arises after submitting a form, the help text will switch to an 'invalid' state. This serves as a valuable guide for users, clearly explaining the necessary actions to resolve any problems.

```html
  (Visual)
```

### Default checked
Set the initial state of the checkbox according to your preferences. You can choose whether it starts as checked or unchecked by default, providing you with control over its initial behavior in your interface.

```html
  (Visual)
```

### Indeterminate State
Useful in scenarios where checkboxes are nested, we've incorporated an indeterminate state. Users can't set the indeterminate state by clicking on it, but it can be programmatically set to this state.

```html
  (Visual)
```


</section>