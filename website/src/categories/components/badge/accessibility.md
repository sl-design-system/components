---
title: Badge accessibility
tags: accessibility
eleventyNavigation:
  parent: Badge
  key: BadgeAccessibility
---
<section>

## Context and clarity
When using badges, pair them with a single item avoid confusion. Make sure the badge is clearly connected to the specific content it represents.

</section>

<section>

## Color independence
Don’t use color alone to provide information. Some users may have color vision deficiencies or rely on screen readers.
Ensure that the badge’s meaning is clear even without color cues.

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`role`|`'status'`|For badges that represent live status updates. This helps screen readers announce the badge appropriately.|
|`aria-label`|string|Description of the badge, you can add it when needed and contains important information.|

{.ds-table .ds-table-align-top}

</div>

</section>
