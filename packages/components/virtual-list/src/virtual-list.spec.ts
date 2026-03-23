import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { VirtualList } from './virtual-list.js';

describe('sl-virtual-list', () => {
  let el: VirtualList<string>;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-virtual-list .items=${['Item 1', 'Item 2', 'Item 3']} style="line-height: 32px"></sl-virtual-list>`
      );
    });

    it('should have an empty items array by default', () => {
      expect(el.items).to.deep.equal(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should have a wrapper', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      expect(wrapper).to.exist;
      expect(wrapper).to.have.style('block-size', '96px');
    });

    it('should render a container', () => {
      const container = el.renderRoot.querySelector('[part="container"]');

      expect(container).to.exist;
      expect(container).to.have.style('gap', '0px');
      expect(container).to.have.style('translate', '0px');
    });

    it('should render item elements', () => {
      const items = Array.from(el.renderRoot.querySelectorAll('[part="item"]'));

      expect(items).to.exist;
      expect(items).to.have.length(3);
      expect(items.map(i => i.textContent?.trim())).to.deep.equal(['Item 1', 'Item 2', 'Item 3']);
    });
  });

  describe('renderItem', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 50 }, (_, i) => `Item ${i}`),
        renderItem = (item: string) => html`<div part="custom-item">${item}</div>`;

      el = await fixture(html`<sl-virtual-list .items=${items} .renderItem=${renderItem}></sl-virtual-list>`);
    });

    it('should render custom items', () => {
      const customItems = el.renderRoot.querySelectorAll('[part="custom-item"]');

      expect(customItems).to.exist;
      expect(customItems.length).to.be.greaterThan(0);
    });
  });

  describe('scrollToIndex', () => {
    /** Wait for the virtualizer scroll reconciliation to settle. */
    const waitForScroll = async (): Promise<void> => {
      // Wait an initial frame for the scroll to be applied
      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      // Then poll until scrollTop stabilizes across consecutive frames
      let prevScrollTop = el.scrollTop;

      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
        await el.updateComplete;

        if (el.scrollTop === prevScrollTop) break;
        prevScrollTop = el.scrollTop;
      }
    };

    beforeEach(async () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list .items=${items} style="height: 96px; line-height: 32px; overflow: auto;"></sl-virtual-list>
      `);

      // Wait for the virtualizer to stabilize; items initially measure with
      // offsetHeight 0 during Lit's commit phase and the ResizeObserver needs
      // multiple animation frames to correct them.
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
        await el.updateComplete;
      }
    });

    it('should scroll to a specific index', async () => {
      el.scrollToIndex(500, { align: 'start' });
      await waitForScroll();

      expect(el.scrollTop).to.be.closeTo(500 * 32, 2000);
    });

    it('should scroll to the bottom', async () => {
      el.scrollToIndex(999, { align: 'end' });
      await waitForScroll();

      expect(el.scrollTop).to.be.closeTo(1000 * 32 - 96, 2000);
    });

    it('should scroll to the top', async () => {
      el.scrollToIndex(999, { align: 'start' });
      await waitForScroll();

      el.scrollToIndex(0, { align: 'start' });
      await waitForScroll();

      expect(el.scrollTop).to.equal(0);
    });
  });
});
