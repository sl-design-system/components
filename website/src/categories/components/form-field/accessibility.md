---
title: Form accessibility
tags: accessibility
eleventyNavigation:
  parent: Form
  key: FormAccessibility
---

## Label

The label is automatically associated with the form control using the `<label>` `for` attribute. The `for` attribute value is the same as the `id` attribute value of the form control.

## Hint

The hint is associated with the form control using the `aria-describedby` attribute.

## Validation message

Any validation message is also associated with the form control using the `aria-describedby` attribute.