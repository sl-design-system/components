---
title: Textarea usage
tags: usage
eleventyNavigation:
  parent: Textarea
  key: TextareaUsage
---
<section>

## Live demo

Here is some space for the live demo

</section>
<section>

## When to use

The following guidance describes when to use the Text Area component.

### Unconstrained input
When you need to collect input that can be of variable length, such as comments, descriptions, or notes.
Use a text area when the newline character (line break) is a valid part of the content.

</section>

<section>

## When not to use

The following guidance describes when not to use the Text Area component.

### Single-line input

If the input is expected to be short and concise, consider using a the [Text Field](/categories/components/text-field/) component instead of a Text Area.
For instance, when collecting a username or password a single-line input is more appropriate.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional|
|-|-|-|-|
| 1 | Input container | An interactive input area. |No|
| 2 | Input & placeholder text | Input text is a value the user has entered into an input and the placeholder text is a short hint that describes the expected value of an input. |No|
| 3 | Caret | A thin vertical line that blinks to indicate where input will be inserted. |No|
| 4 | Resize handle | An indicator that appears in the bottom right corner of the input container. |No|

{.ds-table}

</div>

</section>

<section>

## Options
With these options, you can tweak the appearance of the dialog in Figma. They are available in the Design Panel so you can compose the checkbox to exactly fit the user experience need for the use case you are working on.

### Text Area

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size|`md` `lg`| The Text Area come in two sized medium (default) and large.|
|State|`default` `valid` `invalid`| To indicate the state of the Text Area.|
|Filled|`boolean`| To indicate if the Text Field is filled or displays a placeholder.|
|Input text|`value`| To insert the text of the filled text or placeholder.|

{.ds-table .ds-table-align-top}

</div>

### Label

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Label|`boolean`| To display a label above the Text Area|

{.ds-table}

</div>

### Hint

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Item|`option`| Description|

{.ds-table .ds-table-align-top}

</div>
  
</section>
