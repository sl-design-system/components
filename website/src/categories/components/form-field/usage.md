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

If a field is part of a larger form, you should wrap it in a form field component. This will ensure that the field is properly labeled and that the hint is announced to screen readers.
Do not use the form field if the field is not part of a larger form. For example, if you are using a text field as a search input, you should not wrap it in a form field.

The `<sl-form-field>` component fulfills several functions:
1. It is a layout container for a form control.
2. It provides label and hint ease-of-use properties.
3. It displays any validation messages from the form control.
4. It manages integration within a parent `<sl-form>` component.

## Layout

A form field always has a vertical layout. The label is always at the top, followed by the optional hint, the form control itself and at the bottom any error messages.

## Label and hint

A form field should always have a label. That label can be hidden from view, but it should always be present in the DOM. The label is used to associate the form field with the form control. The label is also used to announce the form field to screen readers.

The hint is optional. It is used to provide additional information about the form field. The hint is announced to screen readers after the label.

Both label and hint are accessible as properties, but you can also use their respective slots if you need more control over the content.

## Validation messages

The form field component listens for `sl-update-validity` events from the form control. When the form control is invalid, the form field will display the `validationMessage`. When the form control is valid, the form field will hide the error message.

The API tried to closely follow the native `ValidityState` API. The `validationMessage` property is a string that contains the error message. The `validity` property is an object that contains the following properties.

You can set a custom validity by calling the `setCustomValidity(message)` method on the form control. This will trigger the `sl-update-validity` event on the form control.

The `reportValidity()` method can be called on the form field to trigger validation on the form control. This method returns a boolean indicating whether the form control is valid or not. Normally you would not call this method directly, but instead call it on the parent `<sl-form>` component.

## Integration

Besides delegating the `reportValidity()` calls from the parent `<sl-form>` to the form control, the form field also registers itself with the parent `<sl-form>`. This allows the `<sl-form>` to keep track of all the form fields and their validity. This done by dispatching the `sl-form-field` event for which the `<sl-form>` listens.
