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
        <div style="translate: 0px ${(virtualItems[0]?.start ?? 0) - (virtualizer.options.scrollMargin ?? 0)}px;">
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

  afterEach(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('.test-window-scroll-container').forEach(el => el.remove());
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

  it('should support window scrolling with correct offset (scrollMargin)', async () => {
    // Mount directly in document.body to ensure getScrollParent returns document.documentElement
    // The fixture creates a container which may prevent window scroll mode from activating
    const container = document.createElement('div');
    container.className = 'test-window-scroll-container';
    container.style.cssText = 'padding-top: 200px; min-height: 3000px; overflow: visible;';
    document.body.appendChild(container);

    const host = document.createElement('test-host') as TestHost;
    host.count = 50;
    container.appendChild(host);
    await host.updateComplete;

    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
    await host.updateComplete;

    // Verify scrollMargin is set correctly (should be at least 200px from padding-top)
    const scrollMargin = host.virtualizer.instance.options.scrollMargin ?? 0;
    expect(scrollMargin).to.be.greaterThanOrEqual(200);

    // First items should be visible before scrolling
    let items = Array.from(host.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');

    // Scroll the window to the host's offset - this is the critical test!
    // The bug occurred when window.scrollY reached the element's offset.
    window.scrollTo(0, scrollMargin);

    await new Promise(resolve => requestAnimationFrame(resolve));
    await host.updateComplete;

    items = Array.from(host.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');
  });

  it('should update scrollMargin when layout changes dynamically with window resize', async () => {
    const container = document.createElement('div');
    container.className = 'test-window-scroll-container';
    container.style.cssText = 'min-height: 3000px; overflow: visible; padding-top: 50px;';
    document.body.appendChild(container);

    const host = document.createElement('test-host') as TestHost;
    host.count = 50;
    container.appendChild(host);
    await host.updateComplete;

    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
    await host.updateComplete;

    const initialScrollMargin = host.virtualizer.instance.options.scrollMargin ?? 0;
    expect(initialScrollMargin).to.be.greaterThan(0);

    let items = Array.from(host.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');

    // Simulate a layout shift: increase container padding WITHOUT resizing window
    // This changes the host's position and should trigger scrollMargin update
    // via ResizeObserver on parent element
    container.style.paddingTop = '350px';

    // Dispatch resize event to trigger scrollMargin update
    // This mimics the real-world scenario where devtools opening causes window resize
    window.dispatchEvent(new Event('resize'));

    // Wait for ResizeObserver + rAF to update scrollMargin (may need multiple frames)
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
    await host.updateComplete;

    // scrollMargin should have been updated to reflect the new offset
    const newScrollMargin = host.virtualizer.instance.options.scrollMargin ?? 0;
    expect(newScrollMargin).to.be.greaterThan(initialScrollMargin);
    // Expect ~300px increase (350px - 50px padding change)
    expect(newScrollMargin - initialScrollMargin).to.be.greaterThanOrEqual(280);

    // Scroll window to a position where incorrect scrollMargin would cause issues
    window.scrollTo(0, newScrollMargin);

    await new Promise(resolve => requestAnimationFrame(resolve));
    await host.updateComplete;

    items = Array.from(host.renderRoot.querySelectorAll<HTMLElement>('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');
  });
});
