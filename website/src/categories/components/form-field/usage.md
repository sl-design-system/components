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

A form field always has a vertical layout. The label is always at the top, followed by the optional hint, the form control itself and at the bottom any error messages.

</section>

<section>

## Label and hint

A form field should always have a label. That label can be hidden from view, but it should always be present in the DOM. The label is used to associate the form field with the form control. The label is also used to announce the form field to screen readers.

The hint is optional. It is used to provide additional information about the form field. The hint is announced to screen readers after the label.

</section>
