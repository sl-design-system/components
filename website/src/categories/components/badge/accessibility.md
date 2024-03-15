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

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`|`'status'`|For badges that represent live status updates. This helps screen readers announce the badge appropriately.|yes|
|`aria-label`|string|Description of the badge, you can add it when needed and contains important information. Sometimes adding `tabindex` can be necessary, when you want to make it tabbable.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>
