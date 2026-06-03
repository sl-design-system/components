import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { VirtualizerController } from './virtualizer-controller.js';

class TestHost extends LitElement {
  @property({ type: Number }) count = 100;

  virtualizer = new VirtualizerController(this, {
    count: this.count,
    estimateSize: () => 32,
    overscan: 3
  });

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('count') && this.virtualizer.virtualizer.options.count !== this.count) {
      this.virtualizer.updateOptions({ count: this.count });
    }
  }

  override render(): TemplateResult {
    const virtualizer = this.virtualizer.virtualizer,
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
              style="position: absolute; inset-inline: 0; block-size: 32px; transform: translateY(${virtualItem.start -
              scrollMargin}px);"
              ${ref(virtualizer.measureElement)}>
              Index ${virtualItem.index}
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('test-host', TestHost);

describe('VirtualizerController', () => {
  let host: TestHost;

  const settle = async (frames = 3): Promise<void> => {
    for (let i = 0; i < frames; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
      await host.updateComplete;
    }
  };

  beforeEach(async () => {
    host = await fixture<TestHost>(html`
      <test-host
        style="display: block; height: 320px; line-height: 32px; overflow: auto;"></test-host>
    `);

    await settle();
  });

  afterEach(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('.test-window-scroll-container').forEach(el => el.remove());
  });

  it('should expose the virtualizer instance', () => {
    expect(host.virtualizer.virtualizer).to.exist;
    expect(host.virtualizer.virtualizer.options.count).to.equal(100);
  });

  it('should render virtual items', () => {
    const items = Array.from(host.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));

    expect(items.length).to.be.greaterThanOrEqual(10);
    expect(items.map(i => i.dataset['index'])).to.deep.equal(
      Array.from({ length: items.length }, (_, i) => i.toString())
    );
    expect(items.map(i => i.textContent?.trim())).to.deep.equal(
      Array.from({ length: items.length }, (_, i) => `Index ${i}`)
    );
  });

  it('should only render visible items plus overscan', () => {
    const items = host.renderRoot.querySelectorAll('div[data-index]');

    // 320px / 32px = 10 visible items, plus 3 overscan at the end.
    expect(items).to.have.length(10 + 3);
  });

  it('should report the total size', () => {
    expect(host.virtualizer.virtualizer.getTotalSize()).to.equal(100 * 32);
  });

  it('should update when the count changes', async () => {
    host.count = 10;
    await settle();

    expect(host.virtualizer.virtualizer.options.count).to.equal(10);
    expect(host.virtualizer.virtualizer.getTotalSize()).to.equal(10 * 32);

    const items = host.renderRoot.querySelectorAll('div[data-index]');
    expect(items).to.have.length(10);
  });

  it('should render more items when scrolling', async () => {
    host.scrollTop = 1000;
    await settle();

    const indexes = Array.from(host.renderRoot.querySelectorAll<HTMLElement>('div[data-index]')).map(i =>
      Number(i.dataset['index'])
    );

    expect(Math.min(...indexes)).to.be.greaterThan(20);
  });

  it('should support window scrolling with correct offset (scrollMargin)', async () => {
    const container = document.createElement('div');
    container.className = 'test-window-scroll-container';
    container.style.cssText = 'padding-top: 200px; min-height: 3000px; overflow: visible;';
    document.body.appendChild(container);

    const windowHost = document.createElement('test-host') as TestHost;
    windowHost.count = 50;
    container.appendChild(windowHost);
    await windowHost.updateComplete;

    await new Promise(resolve => requestAnimationFrame(resolve));
    await windowHost.updateComplete;

    const scrollMargin = windowHost.virtualizer.virtualizer.scrollMargin;
    expect(scrollMargin).to.be.greaterThanOrEqual(200);

    let items = Array.from(windowHost.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');

    window.scrollTo(0, scrollMargin);

    await new Promise(resolve => requestAnimationFrame(resolve));
    await windowHost.updateComplete;

    items = Array.from(windowHost.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');
  });
});
