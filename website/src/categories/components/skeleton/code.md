---
title: Skeleton code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Skeleton
  key: SkeletonCode
---
<style>
.ds-example__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ds-example__skeleton sl-skeleton {
  min-block-size: 3rem;
}

.ds-example__skeleton sl-skeleton:nth-child(2) {
    inline-size: 40rem;
}

.ds-example__skeleton sl-skeleton:nth-child(3) {
    inline-size: 90%;
}

.ds-example__skeleton sl-skeleton:nth-child(4) {
    inline-size: 80%;
}
</style>
<section class="no-heading">

<div class="ds-example">
  <div class="ds-example__skeleton">
    <div style="display: inline-flex; gap: 0.8rem;">
      <sl-skeleton effect="sheen" variant="circle" aria-label="Loading avatar"></sl-skeleton>
      <sl-skeleton effect="sheen" aria-label="Loading title"></sl-skeleton>
    </div>
    <sl-skeleton effect="sheen" aria-label="Loading subtitle"></sl-skeleton>
    <sl-skeleton effect="sheen" aria-label="Loading description"></sl-skeleton>
    <sl-skeleton effect="sheen" aria-label="Loading description"></sl-skeleton>
  </div>
</div>

<div class="ds-code">

  ```html
    <sl-skeleton effect="shimmer" aria-label="Loading title"></sl-skeleton>
    <sl-skeleton effect="shimmer" aria-label="Loading subtitle"></sl-skeleton>
    <sl-skeleton effect="shimmer" aria-label="Loading description"></sl-skeleton>
  ```

</div>

</section>

{% include "../component-table.njk" %}