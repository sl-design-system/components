---
title: Form field code
tags: code
APIdescription: {
  sl-form-field: "Form field component provides a wrapper around a form control with a label, help text, and error messages."
}
eleventyNavigation:
  parent: FormField
  key: FormFieldCode
---
<div style="display: none;">Added to prevent rendering additional paragraph around, which causes navigation problems</div>
<ds-install-info link-in-navigation package="form"></ds-install-info>
<section>

The `<sl-form-field>` component fulfills four functions:
1. It is a layout container for a form control.
2. It provides label and hint ease-of-use properties.
3. It displays any validation messages from the form control.
4. It manages integration within a parent `<sl-form>` component.

</section>

<section>

## Layout

The form field component always has a vertical layout. The label is always at the top, followed by the form control itself and at the bottom an optional hint or error message.

The styling of the form field is managed by design tokens and should not be changed manually.

</section>

<section>

## Label and hint

Both label and hint are available as attributes or properties.

```html
<sl-form-field label="My label" hint="Hint text">
  ...
</sl-form-field>
```

If you need more control over the contents of the label or hint, the form field component provides `label` and `hint` slots. If you use the `<sl-label>` or `<sl-hint>` component, then that slot will automatically be applied.

```html
<sl-form-field>
  <sl-label>This is a <em>custom</em> label.</sl-label>
  <sl-hint>This is a <strong>custom</strong> hint</sl-hint>
  ...
</sl-form-field>
```

</section>

<section>

## Validation messages

The form field component listens for `sl-update-validity` events from the form control. When the form control is invalid, the form field will display the `validationMessage`. When the form control is valid, the form field will hide the error message.

The API tries to closely follow the native `ValidityState` API. The `validationMessage` property is a string that contains the error message. The `validity` property is an object that contains the validation state properties.

You can set a custom validity by calling the `setCustomValidity(message)` method on the form control. This will trigger the `sl-update-validity` event on the form control.

The `reportValidity()` method can be called on the form field to trigger validation on the form control. This method returns a boolean indicating whether the form control is valid or not. Normally you would not call this method directly, but instead call it on the parent `<sl-form>` component.

</section>

<section>

## Integration

Besides delegating the `reportValidity()` calls from the parent `<sl-form>` to the form control, the form field also registers itself with the parent `<sl-form>`. This allows the `<sl-form>` to keep track of all the form fields and their validity. This done by dispatching the `sl-form-field` event for which the `<sl-form>` listens.

</section>

{% include "../component-table.njk" %}
