---
title: Form
layout: component
eleventyNavigation:
  key: Form
  parent: Components
  order: 1
  icon: input-pipe
---

Form components let users enter and submit data. They share a common foundation: every control
integrates with `<sl-form>` for value collection and validation, and is typically wrapped in an
`<sl-form-field>` that provides the label, hint and error messages.

## Overview

[Form field](/components/form/form-field)
: Wraps a control with a label, hint and validation messages.

[Text field](/components/form/text-field)
: A single-line text input.

[Text area](/components/form/text-area)
: A multi-line text input.

[Number field](/components/form/number-field)
: A numeric input with optional step buttons and formatting.

[Search field](/components/form/search-field)
: A text input tailored for search, with a clear button.

[Select](/components/form/select)
: A dropdown for choosing a single option from a list.

[Combobox](/components/form/combobox)
: A text input combined with a filterable list of options, with single or multiple selection.

[Checkbox](/components/form/checkbox)
: A single on/off choice.

[Checkbox group](/components/form/checkbox-group)
: A group of related checkboxes whose values are collected together.

[Radio group](/components/form/radio-group)
: A set of mutually exclusive choices.

[Date field](/components/form/date-field)
: An input with a calendar for selecting a date.

[Time field](/components/form/time-field)
: An input for selecting a time.

[Editor](/components/form/editor)
: A rich text editor.

## The form element

`<sl-form>` ties the individual controls together. It collects their values into a single object,
tracks overall validity, and emits `sl-update-state` and `sl-update-validity` events as the user
interacts with the form.

```html {.example .show-source}
<sl-form>
  <sl-form-field label="Name">
    <sl-text-field name="name" required></sl-text-field>
  </sl-form-field>
  <sl-form-field label="Email">
    <sl-text-field name="email" type="email" required></sl-text-field>
  </sl-form-field>
</sl-form>
```

Give each control a `name` so its value appears in the form's `value` object. Call
`form.reportValidity()` to validate all controls and show their error messages, and `form.reset()`
to restore their initial values.

## Disabling a form

Setting the `disabled` attribute on `<sl-form>` disables all the controls inside it at once.

```html {.example .show-source}
<sl-form disabled>
  <sl-form-field label="Name">
    <sl-text-field value="Jane Doe"></sl-text-field>
  </sl-form-field>
</sl-form>
```
