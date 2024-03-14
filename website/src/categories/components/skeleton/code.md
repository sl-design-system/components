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
  gap: 0.8rem;
  background-color: var(--background-color);
  padding: 0.8rem;
  border-radius: 0.4rem;
}

.ds-example__skeleton sl-skeleton {
  min-block-size: 3rem;
}

.ds-example__skeleton sl-skeleton:first-child {
    inline-size: 3rem;
}

.ds-example__skeleton sl-skeleton:nth-child(2) {
    inline-size: 40rem;
}

.ds-example__skeleton sl-skeleton:nth-child(3) {
    inline-size: 80%;
}

.ds-example__skeleton sl-skeleton:nth-child(4) {
    inline-size: 60%;
}

.ds-example__skeletons-wrapper {
    display: inline-flex;
    gap: 1.2rem;
}
</style>

<section class="no-heading">

<div class="ds-example">
  <div class="ds-example__skeleton">
    <div class="ds-example__skeletons-wrapper">
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
    <sl-skeleton effect="sheen" variant="circle" aria-label="Loading avatar"></sl-skeleton>
    <sl-skeleton effect="sheen" aria-label="Loading title"></sl-skeleton>
    <sl-skeleton effect="sheen" aria-label="Loading subtitle"></sl-skeleton>
    <sl-skeleton effect="sheen" aria-label="Loading description"></sl-skeleton>
    <sl-skeleton effect="sheen" aria-label="Loading description"></sl-skeleton>
  ```

</div>

</section>

<ds-install-info package="skeleton"></ds-install-info>

<section>

## Sizing

The skeleton component has `display: block` set by default, so it occupies the entire width of the container.
If you want to change the width you can simply use `inline-size` to manipulate the width e.g. `inline-size: 80%;`.
When you need to indicate that an avatar or any other element with a round shape is loading, you can use `variant="circle"` for such purposes.

</section>

{% include "../component-table.njk" %}
