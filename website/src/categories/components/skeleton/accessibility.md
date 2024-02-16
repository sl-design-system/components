---
title: Skeleton accessibility
tags: accessibility
eleventyNavigation:
  parent: Skeleton
  key: SkeletonAccessibility
---
<section>

## WAI-Aria

The Skeleton component does not have accessibility on its own as it is only visual indicator and should be integrated within an element that refers to the loading state.

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`aria-busy`|`true`| To illustrate that the focusable element is loading. |yes|
|`role`	|`alert`| To announce the loading. |yes|

{.ds-table .ds-table-align-top}

</div>

</section>

