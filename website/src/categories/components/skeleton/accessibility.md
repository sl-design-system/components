---
title: Skeleton accessibility
tags: accessibility
eleventyNavigation:
  parent: Skeleton
  key: SkeletonAccessibility
---
<section>

## WAI-Aria

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`aria-busy`|`'true'`|To illustrate that the content is loading.|no|
|`aria-label`	|string|Can be used to describe what content is being loaded. Can be added to the `sl-skeleton` or/and wrapper element. |yes|

{.ds-table .ds-table-align-top}

</div>

</section>

