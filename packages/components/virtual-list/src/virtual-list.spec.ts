import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type VirtualList } from './virtual-list.js';

/** Wait for a number of animation frames and the element update to settle. */
const settle = async (el: VirtualList, frames = 4): Promise<void> => {
  for (let i = 0; i < frames; i++) {
    await new Promise(resolve => requestAnimationFrame(resolve));
    await el.updateComplete;
  }
};

/** Poll until the element's scrollTop stabilizes across frames. */
const waitForScroll = async (el: VirtualList): Promise<void> => {
  await settle(el, 1);

  let previous = el.scrollTop;
  for (let i = 0; i < 15; i++) {
    await settle(el, 1);

    if (el.scrollTop === previous) {
      break;
    }

    previous = el.scrollTop;
  }
};

describe('sl-virtual-list', () => {
  let el: VirtualList<string>;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-virtual-list
          .items=${['Item 1', 'Item 2', 'Item 3']}
          style="line-height: 32px"></sl-virtual-list>
      `);
      await settle(el);
    });

    it('should have the items set', () => {
      expect(el.items).to.deep.equal(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should have no estimate size, gap, overscan or start index by default', () => {
      expect(el.estimateSize).to.be.undefined;
      expect(el.gap).to.be.undefined;
      expect(el.overscan).to.be.undefined;
      expect(el.startIndex).to.be.undefined;
    });

    it('should have a wrapper that spans the total size', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      expect(wrapper).to.exist;
      expect(wrapper).to.have.style('block-size', '96px');
    });

    it('should render an item element per item', () => {
      const items = Array.from(el.renderRoot.querySelectorAll('[part~="item"]'));

      expect(items).to.have.length(3);
      expect(items.map(i => i.textContent?.trim())).to.deep.equal(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should position items absolutely using transforms', () => {
      const items = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]'));

      expect(items[0]).to.have.style('position', 'absolute');
      expect(items[0].style.transform).to.equal('translateY(0px)');
      expect(items[1].style.transform).to.equal('translateY(32px)');
      expect(items[2].style.transform).to.equal('translateY(64px)');
    });

    it('should set the data-index attribute', () => {
      const items = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]'));

      expect(items.map(i => i.dataset['index'])).to.deep.equal(['0', '1', '2']);
    });
  });

  describe('large list', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list
          .items=${items}
          style="height: 320px; line-height: 32px; overflow: auto;"></sl-virtual-list>
      `);
      await settle(el);
    });

    it('should only render the visible items plus overscan', () => {
      const items = el.renderRoot.querySelectorAll('[part~="item"]');

      // 320px / 32px = 10 visible, plus 3 overscan.
      expect(items).to.have.length(10 + 3);
    });

    it('should have a wrapper spanning the total size', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      expect(wrapper).to.have.style('block-size', '32000px');
    });

    it('should render different items after scrolling', async () => {
      el.scrollTop = 3200;
      await settle(el);

      const indexes = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]')).map(i =>
        Number(i.dataset['index'])
      );

      expect(indexes).to.include(100);
      expect(Math.min(...indexes)).to.be.greaterThan(90);
    });
  });

  describe('renderItem', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 50 }, (_, i) => `Item ${i}`),
        renderItem = (item: string) => html`<div part="custom-item">${item}</div>`;

      el = await fixture(
        html`
<sl-virtual-list
          .items=${items}
          .renderItem=${renderItem}
          style="height: 320px; line-height: 32px; overflow: auto;"></sl-virtual-list>
`
      );
      await settle(el);
    });

    it('should render custom item content', () => {
      const customItems = el.renderRoot.querySelectorAll('[part="custom-item"]');

      expect(customItems.length).to.be.greaterThan(0);
    });
  });

  describe('gap', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-virtual-list
          .gap=${10}
          .items=${['Item 1', 'Item 2', 'Item 3']}
          style="line-height: 32px"></sl-virtual-list>
      `);
      await settle(el);
    });

    it('should add the gap between items', () => {
      const items = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]'));

      expect(items[0].style.transform).to.equal('translateY(0px)');
      expect(items[1].style.transform).to.equal('translateY(42px)');
      expect(items[2].style.transform).to.equal('translateY(84px)');
    });

    it('should include the gap in the total size', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      // 3 * 32 + 2 * 10 = 116
      expect(wrapper).to.have.style('block-size', '116px');
    });
  });

  describe('start index', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list
          .items=${items}
          start-index="200"
          style="height: 320px; line-height: 32px; overflow: auto;"></sl-virtual-list>
      `);
      await waitForScroll(el);
    });

    it('should start scrolled to the start index', () => {
      expect(el.scrollTop).to.be.closeTo(200 * 32, 64);
    });

    it('should render the item at the start index', () => {
      const indexes = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]')).map(i =>
        Number(i.dataset['index'])
      );

      expect(indexes).to.include(200);
    });
  });

  describe('sticky items', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list
          .items=${items}
          .isSticky=${(_: string, index: number) => index % 20 === 0}
          style="height: 320px; line-height: 32px; overflow: auto;"></sl-virtual-list>
      `);
      await settle(el);
    });

    it('should mark sticky items with the sticky part', () => {
      const sticky = el.renderRoot.querySelector('[part~="sticky"]');

      expect(sticky).to.exist;
      expect(sticky?.getAttribute('data-index')).to.equal('0');
    });

    it('should keep the previous sticky item rendered while scrolling past it', async () => {
      el.scrollTop = 32 * 25;
      await settle(el);

      const indexes = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]')).map(i =>
        Number(i.dataset['index'])
      );

      // Item 20 is the active sticky header even though it is above the viewport.
      expect(indexes).to.include(20);

      const sticky = el.renderRoot.querySelector('[part~="pinned"]') as HTMLElement;
      expect(sticky).to.exist;
      expect(sticky.dataset['index']).to.equal('20');
    });

    it('should pin the sticky header to the top of the viewport', async () => {
      el.scrollTop = 32 * 25;
      await settle(el);

      const pinned = el.renderRoot.querySelector('[part~="pinned"]') as HTMLElement,
        match = /translateY\(([-\d.]+)px\)/.exec(pinned.style.transform),
        translate = match ? Number(match[1]) : NaN;

      // The pinned header sits at the current scroll offset, not its natural position (640px).
      expect(translate).to.be.closeTo(el.scrollTop, 4);
    });
  });

  describe('scrollToIndex', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list
          .items=${items}
          style="height: 96px; line-height: 32px; overflow: auto;"></sl-virtual-list>
      `);
      await settle(el);
    });

    it('should scroll to a specific index', async () => {
      el.scrollToIndex(500, { align: 'start' });
      await waitForScroll(el);

      expect(el.scrollTop).to.be.closeTo(500 * 32, 64);
    });

    it('should scroll to the bottom', async () => {
      el.scrollToIndex(999, { align: 'end' });
      await waitForScroll(el);

      expect(el.scrollTop).to.be.closeTo(1000 * 32 - 96, 64);
    });

    it('should scroll back to the top', async () => {
      el.scrollToIndex(999, { align: 'start' });
      await waitForScroll(el);

      el.scrollToIndex(0, { align: 'start' });
      await waitForScroll(el);

      expect(el.scrollTop).to.equal(0);
    });

    it('should render the target item after scrolling', async () => {
      el.scrollToIndex(750, { align: 'start' });
      await waitForScroll(el);

      const indexes = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]')).map(i =>
        Number(i.dataset['index'])
      );

      expect(indexes).to.include(750);
    });
  });

  describe('scrollToOffset', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list
          .items=${items}
          style="height: 96px; line-height: 32px; overflow: auto;"></sl-virtual-list>
      `);
      await settle(el);
    });

    it('should scroll to a specific offset', async () => {
      el.scrollToOffset(1600);
      await waitForScroll(el);

      expect(el.scrollTop).to.be.closeTo(1600, 4);
    });
  });

  describe('initially hidden', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list
          .items=${items}
          style="display: none; height: 320px; line-height: 32px; overflow: auto;"></sl-virtual-list>
      `);
      await settle(el);
    });

    it('should render items once it becomes visible', async () => {
      // Nothing meaningful renders while hidden (the viewport has no size).
      el.style.display = 'block';
      await settle(el);

      const items = el.renderRoot.querySelectorAll('[part~="item"]');
      expect(items.length).to.be.greaterThanOrEqual(10);
    });
  });

  describe('dynamic sizes', () => {
    beforeEach(async () => {
      const items = Array.from({ length: 200 }, (_, i) => `Item ${i}`);

      el = await fixture(html`
        <sl-virtual-list
          .estimateSize=${32}
          .items=${items}
          .renderItem=${(item: string, index: number) =>
            html`<div style="height: ${index % 2 === 0 ? 80 : 32}px">${item}</div>`}
          style="height: 320px; overflow: auto;"></sl-virtual-list>
      `);
      await settle(el, 6);
    });

    it('should account for measured sizes in the total size', () => {
      // Average size > estimate, so total size should exceed 200 * 32.
      expect(el.virtualizer.getTotalSize()).to.be.greaterThan(200 * 32);
    });

    it('should keep items stacked without overlap', () => {
      const items = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="item"]')).slice(0, 4),
        tops = items.map(i => {
          const match = /translateY\(([-\d.]+)px\)/.exec(i.style.transform);
          return match ? Number(match[1]) : NaN;
        });

      for (let i = 1; i < tops.length; i++) {
        expect(tops[i]).to.be.greaterThan(tops[i - 1]);
      }
    });
  });
});
