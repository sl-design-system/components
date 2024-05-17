---
title: Text area usage
tags: usage
eleventyNavigation:
  parent: Text area
  key: TextAreaUsage
---
<section class="no-heading">

<div class="ds-example">
  <sl-text-area
    aria-label="Hobbies"
    value="Painting, drawing, dance, photography, knitting, web design and cycling."
    style="width: 300px;"
  ></sl-text-area>
</div>

<div class="ds-code">

  ```html
    <sl-text-area aria-label="Hobbies" value="Painting, drawing, dance..."></sl-text-area>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the text area component.

### Unconstrained input
When you need to collect input that can be of variable length, such as comments, descriptions, or notes.
Use a text area when the newline character (line break) is a valid part of the content.

</section>

<section>

## When not to use

The following guidance describes when not to use the text area component.

### Single-line input

If the input is expected to be short and concise, consider using a [text field](/categories/components/text-field/usage) component instead of a Text Area.
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
With these options, you can tweak the appearance of the text area in Figma. They are available in the Design Panel so you can compose the text area to exactly fit the user experience need for the use case you are working on.

### Text Area

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size|`md` `lg`| The text area come in two sized medium (default) and large.|
|State|`default` `valid` `invalid`| To indicate the state of the text area.|
|Filled|`boolean`| To indicate if the text area is filled or displays a placeholder.|
|Input text|`value`| To insert the text of the filled text or placeholder.|

{.ds-table .ds-table-align-top}

</div>

### Label

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Label|`boolean`| To display a label.|
|Size|`sm` `md` `lg`| The label come in three sizes small, medium (default) and large.|
|Disabled|`boolean`| To show the disabled state of the label.|
|Required|`boolean`| Indicates if the text area is required.|
|Optional|`boolean`| Indicates if the text area is optional.|
|Info|`boolean`| To show a info icon with tooltip after the label.|
|Text|`value`| To insert the text of the label.|

{.ds-table}

</div>

### Hint

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Hint|`boolean`| To display the hint.|
|Size|`sm` `md` `lg`| The label come in three sizes small, medium (default) and large.|
|State|`default` `disabled` `invalid`| To indicate the state of the hint.|
|Icon|`boolean`| Displays an icon in front of the hint.|
|Text|`value`| To insert the text of the hint.|

{.ds-table .ds-table-align-top}

</div>

### Focus ring

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Focus ring|`boolean`| To display the focus state of the text area.|

{.ds-table}

</div>

</section>
