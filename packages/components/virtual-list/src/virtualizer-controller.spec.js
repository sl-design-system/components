var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { VirtualizerController } from './virtualizer-controller.js';
class TestHost extends LitElement {
  constructor() {
    super(...arguments);
    this.count = 100;
    this.virtualizer = new VirtualizerController(this, {
      count: this.count,
      estimateSize: () => 32,
      overscan: 3
    });
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('count') && this.virtualizer.instance.options.count !== this.count) {
      this.virtualizer.updateOptions({ count: this.count });
    }
  }
  render() {
    const virtualizer = this.virtualizer.instance,
      virtualItems = virtualizer.getVirtualItems();
    return html`
      <div style="block-size: ${virtualizer.getTotalSize()}px;">
        <div
          style="translate: 0px ${(virtualItems[0]?.start ?? 0) - (virtualizer.options.scrollMargin ?? 0)}px;">
          ${repeat(
            virtualItems,
            virtualItem => virtualItem.key,
            virtualItem => html`
              <div data-index=${virtualItem.index} ${ref(virtualizer.measureElement)}>
                Index ${virtualItem.index}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
__decorateClass([property({ type: Number })], TestHost.prototype, 'count', 2);
customElements.define('test-host', TestHost);
describe('VirtualizerController', () => {
  let host;
  beforeEach(async () => {
    host = await fixture(html`
      <test-host
        style="display: block; height: 320px; line-height: 32px; overflow: auto;"></test-host>
    `);
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
      await host.updateComplete;
    }
  });
  afterEach(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('.test-window-scroll-container').forEach(el => el.remove());
  });
  it('should render virtual items', () => {
    const items = Array.from(host.renderRoot.querySelectorAll('div[data-index]'));
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
    expect(items).to.have.length(10 + 3);
  });
  it('should support window scrolling with correct offset (scrollMargin)', async () => {
    const container = document.createElement('div');
    container.className = 'test-window-scroll-container';
    container.style.cssText = 'padding-top: 200px; min-height: 3000px; overflow: visible;';
    document.body.appendChild(container);
    const host2 = document.createElement('test-host');
    host2.count = 50;
    container.appendChild(host2);
    await host2.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await host2.updateComplete;
    const scrollMargin = host2.virtualizer.instance.options.scrollMargin ?? 0;
    expect(scrollMargin).to.be.greaterThanOrEqual(200);
    let items = Array.from(host2.renderRoot.querySelectorAll('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');
    window.scrollTo(0, scrollMargin);
    await new Promise(resolve => requestAnimationFrame(resolve));
    await host2.updateComplete;
    items = Array.from(host2.renderRoot.querySelectorAll('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');
  });
  it('should update scrollMargin when layout changes dynamically with window resize', async () => {
    const container = document.createElement('div');
    container.className = 'test-window-scroll-container';
    container.style.cssText = 'min-height: 3000px; overflow: visible; padding-top: 50px;';
    document.body.appendChild(container);
    const host2 = document.createElement('test-host');
    host2.count = 50;
    container.appendChild(host2);
    await host2.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    const initialScrollMargin = host2.virtualizer.instance.options.scrollMargin ?? 0;
    expect(initialScrollMargin).to.be.greaterThan(0);
    let items = Array.from(host2.renderRoot.querySelectorAll('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');
    container.style.paddingTop = '350px';
    window.dispatchEvent(new Event('resize'));
    await new Promise(resolve => requestAnimationFrame(resolve));
    await host2.updateComplete;
    const newScrollMargin = host2.virtualizer.instance.options.scrollMargin ?? 0;
    expect(newScrollMargin).to.be.greaterThan(initialScrollMargin);
    expect(newScrollMargin - initialScrollMargin).to.be.greaterThanOrEqual(280);
    window.scrollTo(0, newScrollMargin);
    await new Promise(resolve => requestAnimationFrame(resolve));
    await host2.updateComplete;
    items = Array.from(host2.renderRoot.querySelectorAll('div[data-index]'));
    expect(items.length).to.be.greaterThan(0);
    expect(items[0].getAttribute('data-index')).to.equal('0');
  });
  it('should reset scrollMargin to auto when the option is cleared', async () => {
    const container = document.createElement('div');
    container.className = 'test-window-scroll-container';
    container.style.cssText = 'min-height: 3000px; overflow: visible; padding-top: 200px;';
    document.body.appendChild(container);
    const host2 = document.createElement('test-host');
    host2.count = 50;
    container.appendChild(host2);
    await host2.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    const autoScrollMargin = host2.virtualizer.instance.options.scrollMargin ?? 0;
    expect(autoScrollMargin).to.be.greaterThanOrEqual(200);
    host2.virtualizer.updateOptions({ scrollMargin: 10 });
    expect(host2.virtualizer.instance.options.scrollMargin).to.equal(10);
    host2.virtualizer.updateOptions({ scrollMargin: void 0 });
    await host2.updateComplete;
    expect(host2.virtualizer.instance.options.scrollMargin).to.be.closeTo(autoScrollMargin, 1);
  });
});
//# sourceMappingURL=virtualizer-controller.spec.js.map
