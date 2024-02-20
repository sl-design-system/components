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

.ds-example__skeleton section sl-skeleton {
  min-block-size: 2rem;
}

.ds-example__skeleton section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
</style>

<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__skeleton">
    <section aria-label="Loading subjects list">
      <sl-skeleton effect="shimmer" style="inline-size: 40rem;"></sl-skeleton>
      <sl-skeleton effect="shimmer" style="inline-size: 90%;"></sl-skeleton>
      <sl-skeleton effect="shimmer" style="inline-size: 80%;"></sl-skeleton>
    </section>
  </div>
</div>

<div class="ds-code">

  ```html
    <section aria-label="Loading subjects list">
      <sl-skeleton effect="shimmer"></sl-skeleton>
      <sl-skeleton effect="shimmer"></sl-skeleton>
      <sl-skeleton effect="shimmer"></sl-skeleton>
    </section>
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

