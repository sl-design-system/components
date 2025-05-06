---
title: Number Field usage
tags: usage
eleventyNavigation:
  parent: Number Field
  key: NumberFieldUsage
---
<section class="no-heading">

<div class="ds-example">
<sl-tag>Mathematics</sl-tag>
<sl-tag removable>History</sl-tag>
<sl-tag disabled removable>Science</sl-tag>
</div>

<div class="ds-code">

  ```html
<sl-tag>Mathematics</sl-tag>
<sl-tag removable>History</sl-tag>
<sl-tag disabled removable>Science</sl-tag>
  ```

</div>
</section>

<section>

## When to use

### Easy Adjusting Values
Stepper controls allow users to increment or decrement a number field value in defined steps, ensuring precision and ease when selecting quantities within a set range. They are ideal for contexts like adjusting product amounts, setting measurement values, or tuning numeric settings where direct typing might lead to errors.

### Contextual Formatting Input
Number fields can display format-specific information, such as currency symbols or percentage signs, alongside the input value. This visual formatting helps users recognise the context of the data they enter, improving clarity and reducing mistakes, especially in financial or statistical inputs.

</section>


<section>

## When not to use

### Use a Dropdown for Fixed Options
When the selection involves a small, predefined set of numeric options, a dropdown menu is more suitable than a number field. Dropdowns ensure quicker selection, avoid invalid entries, and streamline the user experience for limited choices.

</section>


<section>

## Anatomy tag

<div class="ds-table-wrapper">

| Item | Name | Description | Optional |
|------|------|-------------|----------|
| 1 | Input field | Area where users type the number. | No |
| 2 | Stepper controls | Field buttons to increment or decrement the value. | Yes |
| 3 | Label | Text describing the purpose of the field. | Yes |
| 4 | Helper text | Trxt that provides extra guidance. | Yes |
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
|Placeholader|`value`|The text of the placeholder|
|Steppers|`End` `Edges`|Define the place of the stepper buttons|
|Imput Text|`value`|The text of the value|
|Focus|`On` `Off`|Shows the focus ring|
|Prefix|`On` `Off`|Shows the prefix of the field|
|Sufix|`On` `Off`|Shows the sufix of the field|

{.ds-table .ds-table-align-top}

</div>

</section>
