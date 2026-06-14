---
title: Virtual list
layout: docs
eleventyNavigation:
  key: Virtual list
  parent: Utilities
---

`<sl-virtual-list>` efficiently renders very large lists by only rendering the items that are
currently visible (plus a small overscan buffer). This keeps the DOM small and scrolling smooth,
even with tens of thousands of items.

You provide the data through the `items` property and a `renderItem` function that returns the
markup for a single item.

## Usage

Because `items` and `renderItem` are properties (not attributes), the virtual list is configured
from JavaScript.

```html
<sl-virtual-list id="list" style="block-size: 400px; overflow: auto;"></sl-virtual-list>

<script type="module">
  import { html, render } from 'lit';

  const list = document.getElementById('list');

  list.items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `This is item number ${i}`
  }));

  list.renderItem = item => html`
    <div part="item-content">
      <p part="item-name">${item.name}</p>
      <p part="item-description">${item.description}</p>
    </div>
    <span part="item-id">#${item.id}</span>
  `;
</script>
```

## Options

estimateSize
: The estimated size (in pixels) of a single item. A good estimate improves the accuracy of the
  scrollbar before items are measured.

gap
: The gap, in pixels, between items.

overscan
: The number of extra items to render outside the visible area, which makes fast scrolling smoother.

## Scrolling programmatically

Use the `scrollToIndex` method to jump to a specific item.

```js
document.querySelector('sl-virtual-list').scrollToIndex(5000, { align: 'start' });
```

## Styling

Items are exposed through the `item` CSS part (and any parts you add in `renderItem`), so you can
style them from the outside.

```css
sl-virtual-list::part(item) {
  align-items: center;
  border-block-end: 1px solid var(--sl-color-border-plain);
  display: flex;
  gap: var(--sl-size-100);
  padding: var(--sl-size-150);
}
```

## API

`<sl-virtual-list>` is configured through the `items`, `renderItem`, `estimateSize`, `gap` and
`overscan` properties. See the
[source on GitHub](https://github.com/sl-design-system/components/tree/main/packages/components/virtual-list)
for the full API.
