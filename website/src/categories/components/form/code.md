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

The `<sl-form>` component fulfills three functions:
1. It provides a default layout for form fields.
2. It manages the way required/optional fields should be marked.
2. It provides a way to validate all form fields at once.
3. It allow you to query the state of the form.

## Layout

By default, the form component has a vertical flexbox layout. This means that form fields will stack on top of each other. If you want to change this, you can use a grid layout instead.

```css
/* Define a two column grid layout. */
sl-form {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}

/* Make the button bar span both columns. */
sl-button-bar {
  grid-column: 1 / 3;
}
```

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

## State

You can query the state of the entire form by simply getting the `valid` property on the `<sl-form>`. This will return `false` if any form field within the form is not valid.

{% include "../component-table.njk" %}
