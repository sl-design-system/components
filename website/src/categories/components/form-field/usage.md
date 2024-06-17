---
title: Form field usage
tags: usage
eleventyNavigation:
  parent: Form field
  key: FormFieldUsage
---

<section class="no-heading">

<div class="ds-example">

  <sl-form-field hint="Please enter a descriptive name for the course." label="Course name">
    <sl-text-field name="courseName"></sl-text-field>
  </sl-form-field>

</div>

<div class="ds-code">

  ```html
  <sl-form-field hint="Please enter a descriptive name for the course." label="Course name">
    <sl-text-field name="courseName"></sl-text-field>
  </sl-form-field>
  ```

</div>

</section>

<section>

## When to use

If a field is part of a larger form, you should wrap it in a form field component. This will ensure that the field is properly labeled and that the hint is announced to screen readers.

</section>

<section>

## When not to use

Do not use the form field if the field is not part of a larger form. For example, if you are using a text field as a search input, you should not wrap it in a form field.

</section>

<section>

## Layout

A form field always has a vertical layout. The label is always at the top, followed by an optional hint and then the form control itself, and at the bottom the error message, depending on the state of the component.

</section>

<section>

## Anatomy

A form field should always have a label. That label can be hidden from view, but it should always be present in the DOM. The label is used to associate the form field with the form control. The label is also used to announce the form field to screen readers.
The hint is optional. It is used to provide additional information about the form field. The hint is announced to screen readers after the label.

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Form field	|Wrapper component for form controls.|no|
|2|Label	|Descriptive text that helps identify and describe the purpose of the form control.|no|
|3|Hint	|Provides additional information or context. |yes|
|4|Form control	|Space to insert the preferred form control.|no|
|4|Validation message	|Describes what went wrong after validation.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Figma Options
With these options you can tweak the appearance of the label and hint in Figma. They are available in the Design Panel so you can compose the input field to exactly fit the user experience need for the uses case you are working on.

### Label

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size|`sm` `md` `lg`|The label is available in three sizes. If not specified the default value is `medium`.|
|Text|`value`|Displays the text of the label.|
|Disabled|`boolean`|Indicates if the label has disabled styling.|
|Required|`boolean`|Indicates if the form control is required.|
|Optional|`boolean`|Indicates if the form control is optional.|
|Info|`boolean`|Shows an info icon on the end of the label to provide additional information.|

{.ds-table .ds-table-align-top}

</div>

### Hint

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size|`sm` `md` `lg`|The hint is available in three sizes. If not specified the default value is `medium`.|
|Text|`value`|Displays the text of the hint.|
|State|`default` `invalid` `disabled`|Indicates the state of the form control.|
|Icon|`boolean`|Show an icon in front of the hint.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Related components

- [Form](/categories/components/form/usage)

</section>
