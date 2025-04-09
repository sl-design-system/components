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

</section>

<section>

## Keyboard interactions

<div class="ds-table-wrapper">

|Command| Description                                                                                                                                                                                      |
|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Tab| Moves focus to the next tabbable element inside the dialog. When the dialog is opened, focus is trapped within the dialog, with the exception of being able to focus the browser UI.|
|Shift + Tab| Moves focus to the previous tabbable element inside the dialog. When the dialog is opened, focus is trapped within the dialog, with the exception of being able to focus the browser UI.|
|Escape (ESC)| Closes the dialog, but only when `disableCancel` is set to `false` (default)|

{.ds-table .ds-table-align-top}

</div>

</section>
