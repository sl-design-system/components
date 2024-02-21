---
title: Select accessibility
tags: accessibility
eleventyNavigation:
  parent: Select
  key: SelectAccessibility
---
<section>

## Keyboard interactions

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|When focus is outside the select, moves focus to the input container.|
|Space|Launches/closes the select panel|
|Up|When focus is inside the select panel, moves focus upwards through the option items in the select panel|
|Down|When focus is inside the select panel, moves focus downwards through the option items in the select panel|
|Home|When focus is inside the select panel, moves to the first available option item in the select panel|
|End|When focus is inside the select panel, moves to the last available option item in the select panel|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`ariaLabel`|string|Defines a string that labels the action that will be performed when the user interacts with the select|no|
|`aria-required`|string|Informs the user that an input is required. When set to ‘true’, screen readers notify users that the element is required|yes|
|`aria-invalid`|object|Informs the user when there’s an error. Set to ‘false’ by default. Values include true, spelling and grammar. Screen readers alert users when the element is set to any value other than ‘false’|no|

{.ds-table .ds-table-align-top}

</div>

</section>