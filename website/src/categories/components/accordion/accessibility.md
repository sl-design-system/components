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

WAI-ARIA roles, states, and properties for an accordion provide essential information to assistive technologies and screen readers. They convey the accordion's role and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

### Accordion item

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`aria-expanded`|boolean|The header element (summary) contains `aria-expanded` attribute. When `true`, the associated content is shown; when `false`, it’s hidden.|no|
|`aria-controls`|string|The header element (summary) contains `aria-controls` attribute. This `id` references the hidden content beneath it - the accordion panel content. It contains `id` of the panel element.|no|
|`role`|`'region'`|Role of the panel container. Creates a landmark region that contains the currently expanded accordion item's panel.|no|
|`aria-labelledby`|string|Used to connect the content with accordion item summary (header). It contains `id` of the summary (header) element.|no|

{.ds-table .ds-table-align-top}

</div>
