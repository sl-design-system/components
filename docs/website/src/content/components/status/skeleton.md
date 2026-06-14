---
title: Skeleton
layout: docs
eleventyNavigation:
  key: Skeleton
  parent: Status
---

`<sl-skeleton>` is a placeholder that mimics the shape of content while it is loading. Showing the
rough layout up front reduces the perceived loading time and avoids large layout shifts when the
real content arrives.

Size a skeleton with regular CSS (`width`/`height` or `inline-size`/`block-size`) so it matches the
content it stands in for.

## Usage

```html
<sl-skeleton style="width: 200px; height: 1rem;"></sl-skeleton>
```

## Examples

### Effects

The `effect` attribute controls the loading animation: `shimmer` (default), `sheen`, `pulse` or
`none`.

```html {.example .show-source .vertical}
<sl-skeleton effect="none" style="width: 80%; height: 1rem;"></sl-skeleton>
<sl-skeleton effect="shimmer" style="width: 80%; height: 1rem;"></sl-skeleton>
<sl-skeleton effect="sheen" style="width: 80%; height: 1rem;"></sl-skeleton>
<sl-skeleton effect="pulse" style="width: 80%; height: 1rem;"></sl-skeleton>
```

### Shapes

Use `variant="circle"` for avatars and other round content. By default the skeleton is rectangular.

```html {.example .show-source .horizontal}
<sl-skeleton variant="circle" style="width: 2.5rem; height: 2.5rem;"></sl-skeleton>
<sl-skeleton style="width: 200px; height: 1rem;"></sl-skeleton>
```

### Composing a placeholder

Combine several skeletons to mirror the layout of the content that is loading.

```html {.example .show-source}
<div style="display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 0.5rem 0.75rem; width: 60%;">
  <sl-skeleton variant="circle" style="width: 2.5rem; height: 2.5rem;"></sl-skeleton>
  <sl-skeleton style="height: 1.25rem;"></sl-skeleton>
  <sl-skeleton style="grid-column: 1 / -1; height: 1rem;"></sl-skeleton>
  <sl-skeleton style="grid-column: 1 / -1; width: 80%; height: 1rem;"></sl-skeleton>
  <sl-skeleton style="grid-column: 1 / -1; width: 60%; height: 1rem;"></sl-skeleton>
</div>
```

## API

See the [API reference](/api-reference/sl-skeleton) for all attributes and properties.
