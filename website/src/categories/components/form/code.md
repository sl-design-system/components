---
title: Form code
tags: code
APIdescription: {
  sl-form: "Form component is meant as a wrapper around form fields."
}
eleventyNavigation:
  parent: Form
  key: FormCode
---
<div style="display: none;">Added to prevent rendering additional paragraph around, which causes navigation problems</div>
<ds-install-info link-in-navigation package="form"></ds-install-info>

<section>

The `<sl-form>` component fulfills four functions:
1. It provides a default layout for form fields.
2. It manages the way required/optional fields should be marked.
2. It provides a way to validate all form fields at once.
3. It allows you to query the state of the form.

</section>
<section>

## Layout

By default, the form component has a vertical flexbox layout. This means that form fields will stack on top of each other. If you want to change this, you can customize the CSS to use a grid layout instead.

```css
/* Define a two column grid layout. */
sl-form {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}

/* Position the form fields in specific columns here... */

/* Make the button bar span both columns. */
sl-button-bar {
  grid-column: 1 / 3;
}
```

</section>

<section>

## Required or optional

The form itself manages a `mark` state. This determines how required or optional labels should be shown. If the required fields outnumber the optional fields, only the optional fields will be marked. If it is the other way around, then only the required fields will be marked.

This behavior happens automatically, and the developer does not need to do anything to make it work.

</section>

<section>

## Validation

The form component provides a way to validate all form fields at once. The `reportValidity()` method can be used to trigger validation on all form fields. This method returns a boolean indicating whether the form is valid or not.

```js
submitButton.addEventListener('click', event => {
  const form = event.target.closest('sl-form');

  if (form?.reportValidity()) {
    // Submit the form
  }
});
```

</section>

<section>

## State

You can query the state of the entire form by simply getting the `valid` property on the `<sl-form>`. This will return `false` if any form field within the form is not valid.

</section>

<section>

## Validate on blur

By default, validation feedback is only shown after `reportValidity()` is called (for example on form submit). You can opt in to validation on blur by adding the `validate-on-blur` attribute to `<sl-form>`:

```html
<sl-form validate-on-blur>
  <!-- form fields -->
</sl-form>
```

With this enabled, each field is validated when the user leaves it. For required fields, this behavior is designed with accessibility in mind:

- **Just tabbing through** a field shows no error. This allows keyboard and screen reader users to explore the form and hear all field labels and hints without being interrupted by error announcements on empty fields they haven't interacted with yet.
- **Typing and clearing** a field, then leaving it, shows the required error on blur. The user has interacted with the field and is expected to see feedback.
- **Mouse actions** such as unchecking a checkbox or removing the last selection in a combobox do not show the error immediately; the error is shown when the control loses focus (for example by clicking outside the field).

Fields that were never interacted with are still validated when `reportValidity()` is called, for example on submit.

### Validation triggers per field type

| Control | Mouse | Keyboard |
| - | - | - |
| ``Checkbox`` | When the user checks the checkbox, then unchecks it and moves focus away. | When the user changes the value to checked, then unchecked, and moves focus away. |
| ``Checkbox Group`` | When the user selects one or more options, then removes all selections and moves focus away. | When the user selects one or more options, then removes all selections and moves focus away. | 
| ``Radio`` | Not applicable — a radio button can't be unselected once checked, so the field can only be empty if never interacted with; it's validated on submit via `reportValidity()`. | Not applicable — a radio button can't be unselected once checked, so the field can only be empty if never interacted with; it's validated on submit via `reportValidity()`. |
| ``Switch`` | When the user unchecks or empties the field. | When the user moves focus away and the field is unchecked or empty. | 
| ``Select`` | When the user selects an item, then removes the selection or uses the ‘Clear’ button.<br aria-hidden="true">If, after removing the selection, the field becomes empty and the focus moves away by clicking outside the field. | When the user selects a value, then uses the ‘Clear’ button and moves focus away, or when the user selects a value, moves focus away, returns, removes the value, and moves focus away again. |
| ``Single Combobox`` | When the user selects an item, then removes the selection by clicking the option again or by removing the selection's text.<br aria-hidden="true">If, after removing the selection, the field becomes empty and the focus moves away by clicking outside the field. | When the user selects a value, then deselects, then moves focus away or when the user selects a value, then moves focus away, returns, and removes the value. |
| ``Multiple Combobox`` | When the user selects an item, then removes the selection by clicking the option again or by removing the selection's text.<br aria-hidden="true">If, after removing the selection, the field becomes empty and the focus moves away by clicking outside the field. | When the user selects a value, then deselects, then moves focus away or when the user selects a value, then moves focus away, returns, and removes the value.<br aria-hidden="true">If, after removing the selections, the field becomes empty and the user moves the focus away. | 
| ``Search Field`` | Not applicable | Not applicable |
| ``Text Field`` | When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away.| When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away. |
| ``Text Area`` | When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away.| When the user fills the field, then removes the value and moves focus away or when the user enters invalid data and moves focus away. |
| ``Number Field`` | When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away.<br aria-hidden="true">If, after removing the value, the field becomes empty and the focus moves away by clicking outside the field. | When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away. |
| ``Date Field`` | When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away.<br aria-hidden="true">If, after removing the value, the field becomes empty and the focus moves away by clicking outside the field. | When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away.<br aria-hidden="true">Focus on the field button is still considered inside the field. |
| ``Time Field`` | When the user fills the field, then removes the value and moves focus away  (for required field) or when the user enters invalid data and moves focus away.<br aria-hidden="true">If, after removing the value, the field becomes empty and the focus moves away by clicking outside the field. | When the user fills the field, then removes the value and moves focus away (for required field) or when the user enters invalid data and moves focus away.<br aria-hidden="true">Focus on the field button is considered to still be inside the field. |

{.ds-table}

</section>

{% include "../component-table.njk" %}
