---
title: Icon accessibility
tags: accessibility
eleventyNavigation:
  parent: Icon
  key: IconAccessibility
---

<section>

## Label

The label only needs to be set when there is no accompanying text with the icon, as the assistive technology will read this label as well as the accompanying text. It can however be used in the rare cases the icon adds additional information to the label.
</section>


<section>

## WAI-ARIA

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`aria-label`|string|Set by using the `label` property on the element.|no|
|`aria-hidden`|boolean|When no `label` is set we assume the icon is purely presentational and we hide it from assistive technology. |no|
|`role`|`'img'`|When a `label` is set this means the icon will be part of the accessibility and thus we need to declare it as an icon. |no|

{.ds-table .ds-table-align-top}

</div>

</section>
