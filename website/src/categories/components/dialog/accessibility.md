---
title: Dialog accessibility
tags: accessibility
eleventyNavigation:
  parent: Dialog
  key: DialogAccessibility
---

<section>

## Dialog title

The dialog title should be an `<h1>` element. Since the dialog is a separate layer on top of the page, it establishes its own heading hierarchy. This means the title should always be at the top level (`<h1>`), regardless of the heading level used on the page that opens the dialog.

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

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`aria-describedby`|string|Describes the purpose of the dialog|

{.ds-table .ds-table-align-top}

</div>

</section>

