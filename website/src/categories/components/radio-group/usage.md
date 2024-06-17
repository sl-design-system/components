---
title: Radio group usage
tags: usage
eleventyNavigation:
  parent: Radio group
  key: RadioGroupUsage
---
<section class="no-heading">

<div class="ds-example">
  <sl-form-field label="Which animal do you like best?">
    <sl-radio-group value="cat">
      <sl-radio value="dog">Dog</sl-radio>
      <sl-radio value="cat">Cat</sl-radio>
      <sl-radio value="hamster">Hamster</sl-radio>
    </sl-radio-group> 
  </sl-form-field>
</div>

<div class="ds-code">
  
  ```html
  <sl-form-field label="Which animal do you like best?">
    <sl-radio-group value="cat">
      <sl-radio value="dog">Dog</sl-radio>
      <sl-radio value="cat">Cat</sl-radio>
      <sl-radio value="hamster">Hamster</sl-radio>
    </sl-radio-group> 
  </sl-form-field>
  ```

</div>

</section>


<section>

## When to use
Radio buttons are best used in situations where users need to make a single selection from multiple options within a defined group. Here are two common scenarios:

### In forms 
Radio buttons are commonly used in forms where users need to choose one option from a list, such as selecting a gender, indicating a preference, or specifying a category.

### Settings and Filters
They are also valuable for transitioning between settings within menus, pages, or components. Radio buttons help users make exclusive choices when configuring preferences or filtering content, ensuring a clear and structured user experience.
Additionally, radio buttons can be applied to various interfaces, including tiles, data tables, modals, and side panels, making them versatile tools for improving user interactions and decision-making.

</section>


<section>

## When not to use

While radio buttons are a valuable UI element in many situations, there are instances when it's best to avoid using them:

### When Multiple Selections Are Allowed
Radio buttons are intended for exclusive single-choice selection. If your design requires users to select multiple options from a list simultaneously, checkboxes are more appropriate.

### For Large Lists
Radio buttons become less practical as the number of options in a list grows. If you have an extensive list of choices, consider alternative UI components like dropdown menus or autocomplete fields to prevent clutter and maintain a cleaner user experience.

</section>


<section>

## Anatomy

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Field Label |The group label, positioned at the top of a radio group, explains the purpose or meaning of the radio buttons and helps users understand the available choices |no|
|2|Radio input (unchecked) |This unmarked state signifies that no option within the associated group has been selected by the user yet.|no|
|3|Radio input (checked) |This marked state indicates that the user has selected a specific option from a group of choices presented in the associated radio button set. |no|
|4|Label |The label explains the purpose or meaning of the radio button and helps users understand the available choices.|yes|
|5|Radio groups |The radio groups can be displayed with one option, allowing a maximum of five selections. When the list of choices exceeds the limit, it's advisable to consider alternative design solutions like a dropdown menu or combobox. These options provide a more user-friendly way to navigate and select from more extensive choices.|yes|

{.ds-table}

</section>


<section>

## Sizing

Radio Group come in two sizes, to match diferents scenarios:

  - **Medium:** The medium-sized radio buttons function as the default option across our user interfaces. It achieves a balanced blend of size and clarity, establishing itself as the standard and user-friendly choice for single-choice. 

  - **Large:** Opting for the large radio buttons for touch-based devices can offer advantages since it presents a larger tap target. This size facilitates more accessible user interactions.

</section>


<section>

## Status

Radio Group come in two sizes, to match diferents scenarios:

  - **Checked:** The checked status signifies that a user has actively selected that option from a group of choices. It visually indicates the chosen state, this visual cue helps users easily identify which option they have selected among the available choices.

  - **Unchecked:** An unchecked radio button represents a state where the user has not selected that option. Users can choose only one option at a time in a group of radio buttons. Users can click on an unchecked radio button to select it, deselecting any chosen previously option within the same group.

</section>


<section>

## Variants

Radio Group come in various versions, each suited for specific situations:

  - **Default:** The default radio button variant allows users to check or uncheck an option. When a radio button is checked, it indicates that the option is chosen, while when it's unchecked, it means the option is not chosen.

  - **Valid:** The valid variant of a radio button functions as a feedback mechanism, confirming that the chosen option aligns with the correct choice according to established criteria.

  - **Invalid:** This variant is featured in validation processes. When checked, it communicates issues or discrepancies in the entered data, encouraging users to review and change their input, ensuring data accuracy and a smooth user experience.

</section>


<section>

## Figma Options

With these options, you can tweak the appearance of the radio group in Figma. They are available in the Design Panel so you can compose the component to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Size|`'medium', 'large'`|The button is available in three sizes. If not specified the default value is `medium` .|
|Variant|`'default', 'valid', 'invalid'`|The button offers four distinct intents: Default, Primary, Success, Warning, and Danger, each conveying a unique tone to the user.|
|State|`'idle', 'hover', 'active', 'disabled'`.|There are four button types to choose from so you can differentiate between buttons, depending on how essential they are. |
|Status |`'checked', 'unchecked'`|Elevate your buttons by including icons either before (start) or after (end) the label for enhanced functionality and visual impact.|
|Label|`text`|Positions the label to the right (at the end) of the radio to provide contextual information.|
|Focus ring|`'on', 'off'`|Turn the focus ring option to show the focus state of the checkbox.|

{.ds-table .ds-table-align-top}

</section>


<section>

## Behavior
Let's explore the behavior of the radio button:

### Label overflow wrap
When a label is too long for the available horizontal space, it wraps to form another line, with the text aligned to the top.

### Clickable area
The radio has a clickable area around both the checkbox and label for more space to press. We've left a bit of space on the left side to ensure smooth alignment and avoid any unexpected layout issues.

### Focusable area
Both the radio input and label are interactive elements, allowing users to interact with them. However, when it comes to focusing, whether through keyboard navigation or voice commands, the visible focus state is only visible on the checkbox itself. 

### Validation
If an issue arises after submitting a form, the radio button and the help text will switch to an 'invalid' state. This serves as a valuable guide for users, clearly explaining the necessary actions to resolve any problems.

### Exclusive selection
When a user selects one radio button within a group, it becomes the dominant choice, and all other options within the group immediately fade into the background, visually and functionally. This creates a clean and intuitive way for users to make a single, exclusive selection from a list of options.

### Default checked
You have the power to decide the radio button's fate from the start! You can set it to be initially checked or unchecked by default, giving you control (or not) over its state.

</section>
