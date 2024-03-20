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

{% include "../component-table.njk" %}
