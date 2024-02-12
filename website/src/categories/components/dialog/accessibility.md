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

|Command|Description|
|-|-|
|Tab|Moves focus to the next tabbable element inside the dialog. If focus is on the last tabbable element, it wraps back to the first.|
|Shift + Tab|Moves focus to the previous tabbable element inside the dialog. If focus is on the first, it wraps to the last.|
|Escape (ESC)|Closes the dialog.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`ariaLabelledby`|`'string'`|Defines the aria-label of the dialog|no|
|`ariaDescribedby`|`'string'`|Describes the purpose of the dialog|no|
|`ariaModal`|boolean|Defines the dialog|no|

{.ds-table .ds-table-align-top}

</div>

</section>

