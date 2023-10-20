---
title: Radio group usage
tags: usage
eleventyNavigation:
  parent: Radio group
  key: RadioGroupUsage
---
<section class="no-heading">

<div class="ds-example">

  <sl-label for="radio-group">What animal do you like best?</sl-label>
  <sl-radio-group id="radio-group">
    <sl-radio>Dog</sl-radio>
    <sl-radio>Cat</sl-radio>
    <sl-radio>Hamster</sl-radio>
  </sl-radio-group>

</div>

<div class="ds-code">

  ```html 
    <sl-radio-group>
      <sl-radio>Dog</sl-radio>
      <sl-radio>Cat</sl-radio>
      <sl-radio>Hamster</sl-radio>
    </sl-radio-group>
  ```

</div>

</section>

<section>

## When to use

Radio buttons are best used in situations where users need to make a single selection from multiple options within a defined group. Here are two common scenarios:

<section class="ds-cards">
<figure>
{{'components/radio-group/sl-radio-group-when-use-forms.svg' | svgImage}}
<figcaption>

### In forms 
Radio buttons are commonly used in forms where users need to choose one option from a list, such as selecting a gender, indicating a preference, or specifying a category.
</figcaption>
</figure>
<figure>
    {{'components/radio-group/sl-radio-group-when-use-settings.svg' | svgImage}}
    <figcaption>

### Settings and Filters
They are also valuable for transitioning between settings within menus, pages, or components. Radio buttons help users make exclusive choices when configuring preferences or filtering content, ensuring a clear and structured user experience.

Additionally, radio buttons can be applied to various interfaces, including tiles, data tables, modals, and side panels, making them versatile tools for improving user interactions and decision-making.
    </figcaption>
  </figure>
</section>
</section>

<section>

## When not to use

While radio buttons are a valuable UI element in many situations, there are instances when it's best to avoid using them:

<section class="ds-cards">
  <figure>
    {{'components/radio-group/sl-radio-group-when-not-use-multiple.svg' | svgImage}}
    <figcaption>

  ### When Multiple Selections Are Allowed
  Radio buttons are intended for exclusive single-choice selection. If your design requires users to select multiple options from a list simultaneously, checkboxes are more appropriate.
    </figcaption>
  </figure>

  <figure>
    {{'components/radio-group/sl-radio-group-when-not-use-large-lists.svg' | svgImage}}
    <figcaption>

  ### For Large Lists
  Radio buttons become less practical as the number of options in a list grows. If you have an extensive list of choices, consider alternative UI components like dropdown menus or autocomplete fields to prevent clutter and maintain a cleaner user experience.
    </figcaption>
  </figure>
</section>
</section>
<section>

## Anatomy
{{ 'components/radio-group/sl-radio-group-anatomy.svg' | svgImage }}

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Radio input (unchecked)	|This unmarked state signifies that no option within the associated group has been selected by the user yet.|no|
|2|Radio input (checked)	|This marked state indicates that the user has selected a specific option from a group of choices presented in the associated radio button set.	|no|
|3|Label	|The label explains the purpose or meaning of the radio button and helps users understand the available choices.

{.ds-table}
</section>

<section>

## Options

With these options, you can tweak the appearance of the radio in Figma. They are available in the Design Panel so you can compose the radio (group) to exactly fit the user experience need for the use case you are working on.

{{ 'components/radio-group/sl-radio-group-figma-options.svg' | svgImage }}

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

<section class="ds-cards ds-cards-horizontal">


## Behavior
Let's explore the behavior of the radio button:

<figure>
{{'components/radio-group/sl-radio-group-behavior-overflow.svg' | svgImage}}
<figcaption>

### Label overflow wrap
When a label is too long for the available horizontal space, it wraps to form another line, with the text aligned to the top.
</figcaption>
</figure>

<figure>
{{'components/radio-group/sl-radio-group-behavior-clickable-area.svg' | svgImage}}
<figcaption>

### Clickable area
The radio has a clickable area around both the checkbox and label for more space to press. We've left a bit of space on the left side to ensure smooth alignment and avoid any unexpected layout issues.
</figcaption>
</figure>

<figure>
{{'components/radio-group/sl-radio-group-behavior-focusable-area.svg' | svgImage}}
<figcaption>

### Focusable area
Both the radio input and label are interactive elements, allowing users to interact with them. However, when it comes to focusing, whether through keyboard navigation or voice commands, the visible focus state is only visible on the checkbox itself. 
</figcaption>
</figure>

<figure>
{{'components/radio-group/sl-radio-group-behavior-validation.svg' | svgImage}}
<figcaption>

### Validation
If an issue arises after submitting a form, the help text will switch to an 'invalid' state. This serves as a valuable guide for users, clearly explaining the necessary actions to resolve any problems.
</figcaption>
</figure>

<figure>
{{'components/radio-group/sl-radio-group-behavior-exclusive-selection.svg' | svgImage}}
<figcaption>

### Exclusive selection
When a user selects one radio button within a group, it becomes the dominant choice, and all other options within the group immediately fade into the background, visually and functionally. This creates a clean and intuitive way for users to make a single, exclusive selection from a list of options.
</figcaption>
</figure>

<figure>
{{'components/radio-group/sl-radio-group-behavior-default.svg' | svgImage}}
<figcaption>

### Default checked
You have the power to decide the radio button's fate from the start! You can set it to be initially checked or unchecked by default, giving you control (or not) over its state.
</figcaption>
</figure>
</section>
