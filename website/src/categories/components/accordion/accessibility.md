---
title: Accordion accessibility
tags: accessibility
eleventyNavigation:
  parent: Accordion
  key: AccordionAccessibility
---
<section>

## Alignment

The icons are left-aligned to improve the experience for users with low vision, as the expanded/collapsed indicator is closer to the accordion title.

</section>

<section>

## Keyboard interactions

Each accordion is a tab stop. `Space` or `Enter` keys expand or collapse accordions, which are collapsed by default. Interactive elements within expanded accordions integrate into the tab order automatically.

</section>

<section> 

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for an avatar provide essential information to assistive technologies and screen readers. They convey the accordion's role and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`aria-expanded`|boolean|When `true`, the associated content is shown; when `false`, it’s hidden.|no|
|`aria-controls`|id|This id references the hidden content beneath it|no|

{.ds-table .ds-table-align-top}
</div>
