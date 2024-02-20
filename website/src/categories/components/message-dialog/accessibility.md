---
title: Message dialog accessibility
tags: accessibility
eleventyNavigation:
  parent: Message dialog
  key: MessageDialogAccessibility
---

<section>

## Role

The message dialog has a role of `alertdialog` by default, which is appropriate for a dialog that requires immediate attention from the user. This role is announced by screen readers and is used to indicate that the dialog is a modal dialog that requires immediate attention from the user.

Since the message dialog is just a utility built on top of the dialog component, it inherits all of the same keyboard interactions and WAI-ARIA attributes. See the [dialog accessibility](../dialog) page for more information.

</section>