# @sl-design-system/virtual-list

Virtual list component for efficiently rendering large lists.

## Features

- 🚀 Efficient rendering of large lists using virtualization
- 📦 Powered by `@tanstack/virtual-core`
- 🎯 Reactive Lit controller for easy integration
- 🔧 Customizable item rendering
- 📏 Configurable item sizing and gaps

## Usage

### Basic Example

```typescript
import '@sl-design-system/virtual-list/register.js';
import { html } from 'lit';

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

html`
  <sl-virtual-list
    .items=${items}
    .renderItem=${(item) => html`<div>${item}</div>`}
    estimate-size="50"
  >
  </sl-virtual-list>
`;
```

### Using VirtualizerController

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
    const virtualizer = this.#virtualizer.instance,
      virtualItems = virtualizer.getVirtualItems();

    return html`
      <div style="height: ${virtualizer.getTotalSize()}px; overflow: auto;">
        <div style="translate: 0px ${virtualItems[0]?.start ?? 0}px">
          ${repeat(
            virtualItems,
            virtualItem => virtualItem.key,
            virtualItem => {
              const item = this.items[virtualItem.index];

              return html`
                <div data-index=${virtualItem.index} ${ref(virtualizer.measureElement)}>
                  ${item}
                </div>
              `;
            }
          )}
        </div>
      </div>
    `;
  }
}
```
