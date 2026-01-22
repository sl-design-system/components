---
title: Number Field usage
tags: usage
eleventyNavigation:
  parent: Number Field
  key: NumberFieldUsage
---
<section class="no-heading">

<div class="ds-example">
<sl-number-field aria-label="Number field" step-buttons="end" value="100"></sl-number-field>
</div>

<div class="ds-code">

  ```html
<sl-number-field aria-label="Number field" step-buttons="end" value="100"></sl-number-field>
  ```

</div>
</section>

<section>

## When to use

### Easily Adjust Values
The stepper control buttons allow users to increment or decrement the value is defined in steps, within a well-defined, preferably small, range. They are ideal for scenarios like adjusting product amounts, setting measurement values, or tuning numeric settings where direct typing might lead to errors.

### Require Formatting Values
Number fields can display format-specific information, such as currency symbols or percentage signs, alongside the input value. This visual formatting helps users recognize the context of the data they enter, improving clarity and reducing mistakes, especially in financial or statistical inputs.

</section>


<section>

## When not to use

### For a Fixed Number of Options
When the selection involves a small, predefined set of numeric options, the [Select](/categories/components/select/usage) component is more suitable than a number field. Select ensure quicker selection, avoid invalid entries, and streamline the user experience for limited choices.

</section>


<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional |
|------|------|-------------|----------|
| 1 | Input field | Area where users type the number. | No |
| 2 | Stepper controls | Field buttons to increment or decrement the value. | Yes |
| 3 | Label | Text describing the purpose of the field. | Yes |
| 4 | Helper text | Text that provides extra guidance. | Yes |
| 5 | Prefix | Text placed before the value. | Yes |
| 6 | Suffix | Text placed after the value. | Yes |
| 7 | Error message | Communicates validation issues. | Yes |

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Variants

- **Basic**: Input field only.
- **Steppers**: Input field plus increment/decrement controls.
- **Prefix or Suffix**: Adds contextual information like currency or units.
- **Hint text**: Provides additional instructions.
- **Validation**: Shows error messages when input rules are not respected.

</section>

<section>

## States
- **Default**: Active field allowing free numerical input and adjustments.
- **Hover**: Highlighted field indicating interactivity before clicking.
- **Active**: Field focused and ready for user input.

</section>


<section>

## Figma Options

With these options, you can tweak the appearance of the number field in Figma. They are available in the Design Panel so you can compose the tag to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size|`md` `lg`|Size 'md' is the default size of the number field component |
|Variant|`Default` `Invalid` `disabled`|Indicates the state of the number field|
|State|`idle` `hover` `active` `disabled`|Indicates the state of the number field|
|Label|`value`|The text of the label|
|Placeholder|`value`|The text of the placeholder|
|Steppers|`End` `Edges`|Define the place of the stepper buttons|
|Input Text|`value`|The text of the value|
|Focus|`On` `Off`|Shows the focus ring|
|Prefix|`On` `Off`|Shows the prefix of the field|
|Suffix|`On` `Off`|Shows the suffix of the field|

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Behaviours

### Keyboard Input
The number field accepts direct keyboard input, allowing users to quickly enter numerical values without relying on other controls.

### Stepper Controls
Users can adjust the value easily using the increment and decrement buttons, ensuring fine-grained control over numerical input.

### Input Validation
The field validates user input based on minimum, maximum, and step settings to maintain consistent and valid data.

### Visual Formatting
The number field can apply visual formatting, such as thousand separators, to improve readability and reduce entry errors.

### Accessibility Support
Built with accessibility in mind, the number field uses ARIA roles and supports full keyboard navigation, ensuring an inclusive user experience.

</section>

<section>

## Related components
- [Text Field](/categories/components/text-field/usage): If you want a free-form text input.
- [Select](/categories/components/select/usage): Selecting from predefined numeric options.

</section>