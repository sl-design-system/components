---
title: Skeleton usage
tags: usage
eleventyNavigation:
  parent: Skeleton
  key: SkeletonUsage
---
<style>
.ds-example__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ds-example__skeleton sl-skeleton {
  height: 2rem;
}

.ds-example__skeleton sl-skeleton:nth-child(1) {
    inline-size: 40rem;
}

.ds-example__skeleton sl-skeleton:nth-child(2) {
    inline-size: 90%;
}

.ds-example__skeleton sl-skeleton:nth-child(3) {
    inline-size: 80%;
}
</style>

<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__skeleton">
    <sl-skeleton effect="shimmer" aria-label="Loading title"></sl-skeleton>
    <sl-skeleton effect="shimmer" aria-label="Loading subtitle"></sl-skeleton>
    <sl-skeleton effect="shimmer" aria-label="Loading description"></sl-skeleton>
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

<section>

## When to use

### Loading states
Use skeletons to represent content while data is being fetched. For instance, display a skeleton list before actual items load.

### Page transitions
During page transitions or navigation, show skeletons to indicate that content is loading. This maintains user engagement.

### Image loading
When images take time to load, display image placeholders using skeletons. Users perceive faster loading times.

</section>

<section>

## When not to use

### Misleading expectations
Don’t use skeletons if they might mislead users. For instance, showing a skeleton for a feature that won’t load can frustrate users.

</section>

