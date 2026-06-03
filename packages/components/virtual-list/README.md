# @sl-design-system/virtual-list

Virtual list component for efficiently rendering large vertical lists.

## Features

- 🚀 Efficient rendering of large lists using virtualization
- 📦 Zero external dependencies (no `@tanstack/virtual-core` or `@lit-labs/virtualizer`)
- 🎯 Reactive Lit controller for easy integration
- 🪟 Works with both element (`overflow`) and window scrolling
- 🙈 Works even when the list is initially hidden
- 📌 Supports sticky items
- 🔧 Customizable item rendering, sizing and gaps

## Usage

### Basic example

```typescript
import '@sl-design-system/virtual-list/register.js';
import { html } from 'lit';

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

html`
  <sl-virtual-list
    .items=${items}
    .renderItem=${(item: string) => html`<div>${item}</div>`}
    estimate-size="50">
  </sl-virtual-list>
`;
```

### Start index

Render the list scrolled to a specific item:

```typescript
html`<sl-virtual-list .items=${items} start-index="500"></sl-virtual-list>`;
```

### Sticky items

Items can be made sticky. A sticky item stays pinned to the top of the viewport until the next
sticky item pushes it out:

```typescript
html`
  <sl-virtual-list
    .items=${items}
    .isSticky=${(item: string, index: number) => index % 10 === 0}>
  </sl-virtual-list>
`;
```

### Scrolling programmatically

```typescript
const list = document.querySelector('sl-virtual-list');

list.scrollToIndex(500, { align: 'start' });
list.scrollToOffset(1000, { behavior: 'smooth' });
```

### Using VirtualizerController

The `VirtualizerController` can be used to build your own virtualized component:

```typescript
import { VirtualizerController } from '@sl-design-system/virtual-list';
import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ref } from 'lit/directives/ref.js';

class MyElement extends LitElement {
  items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

  #virtualizer = new VirtualizerController(this, {
    count: 1000,
    estimateSize: () => 50
  });

  render() {
    const virtualizer = this.#virtualizer.virtualizer,
      virtualItems = virtualizer.getVirtualItems(),
      scrollMargin = virtualizer.scrollMargin;

    return html`
      <div style="block-size: ${virtualizer.getTotalSize()}px; position: relative;">
        ${repeat(
          virtualItems,
          virtualItem => virtualItem.key,
          virtualItem => html`
            <div
              data-index=${virtualItem.index}
              style="position: absolute; inset-inline: 0; transform: translateY(${virtualItem.start -
              scrollMargin}px);"
              ${ref(virtualizer.measureElement)}>
              ${this.items[virtualItem.index]}
            </div>
          `
        )}
      </div>
    `;
  }
}
```
