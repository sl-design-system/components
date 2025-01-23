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

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`ariaLabelledby`|string|Defines the aria-label of the dialog, taken from the contents of the `title` slot.|no|
|`ariaDescribedby`|string|Describes the purpose of the dialog|yes|
|`ariaModal`|boolean|Defines the type of dialog; whether it is modal or not|no|
|`ariaRole`|`'dialog', 'alertdialog'`|Defines the type of dialog; set by the `role` property, default is `dialog`|no|

{.ds-table .ds-table-align-top}

</div>

</section>

