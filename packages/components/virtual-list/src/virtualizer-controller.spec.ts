import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { VirtualizerController } from './virtualizer-controller.js';

class TestHost extends LitElement {
  @property({ type: Number }) count = 100;

  virtualizer = new VirtualizerController(this, {
    count: this.count,
    estimateSize: () => 32,
    overscan: 3
  });

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('count') && this.virtualizer.instance.options.count !== this.count) {
      this.virtualizer.updateOptions({ count: this.count });
    }
  }

  override render(): TemplateResult {
    const virtualizer = this.virtualizer.instance,
      virtualItems = virtualizer.getVirtualItems();

    return html`
      <div style="block-size: ${virtualizer.getTotalSize()}px;">
        <div style="translate: 0px ${virtualItems[0]?.start ?? 0}px;">
          ${repeat(
            virtualItems,
            virtualItem => virtualItem.key,
            virtualItem => html`
              <div data-index=${virtualItem.index} ${ref(virtualizer.measureElement)}>Index ${virtualItem.index}</div>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('test-host', TestHost);

describe('VirtualizerController', () => {
  let host: TestHost;

  beforeEach(async () => {
    host = await fixture<TestHost>(
      html`<test-host style="display: block; height: 320px; line-height: 32px; overflow: auto;"></test-host>`
    );
  });

  it('should render virtual items', () => {
    const items = Array.from(host.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));

    expect(items.length).to.be.greaterThanOrEqual(10);
    expect(items.map(i => i.dataset['index'])).to.deep.equal(
      Array.from({ length: items.length }, (_, i) => i.toString())
    );
    expect(items.map(i => i.textContent)).to.deep.equal(Array.from({ length: items.length }, (_, i) => `Index ${i}`));
  });

  it('should only render visible items plus overscan', () => {
    const items = host.renderRoot.querySelectorAll('div[data-index]');

    expect(items).to.have.length(10 + 3);
  });
});
