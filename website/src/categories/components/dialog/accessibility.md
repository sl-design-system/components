---
title: Dialog accessibility
tags: accessibility
eleventyNavigation:
  parent: Dialog
  key: DialogAccessibility
---
<section>

## Keyboard interactions

<div class="ds-table-wrapper">

|Command| Description                                                                                                                                                                                      |
|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Tab| Moves focus to the next tabbable element inside the dialog. If focus is on the last tabbable element, it wraps back to the first. When the dialog is opened, focus is trapped within the dialog. |
|Shift + Tab| Moves focus to the previous tabbable element inside the dialog. If focus is on the first, it wraps to the last. When the dialog is opened, focus is trapped within the dialog.                   |
|Escape (ESC)| Closes the dialog, but only when `disableCancel` is set to `false` (default)                                                                                                                     |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`ariaDescribedby`|string|Describes the purpose of the dialog|

{.ds-table .ds-table-align-top}

</div>

</section>

