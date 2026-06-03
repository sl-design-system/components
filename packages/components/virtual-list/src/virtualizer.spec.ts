import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Virtualizer } from './virtualizer.js';

describe('Virtualizer', () => {
  let scrollElement: HTMLElement, host: HTMLElement, virtualizer: Virtualizer;

  /** Create a scrollable container with a host inside it. */
  const createDom = (): void => {
    scrollElement = document.createElement('div');
    scrollElement.style.cssText = 'block-size: 320px; overflow: auto;';

    host = document.createElement('div');
    host.style.cssText = 'display: block; position: relative;';

    scrollElement.appendChild(host);
    document.body.appendChild(scrollElement);
  };

  /**
   * Mount the virtualizer and keep the host sized to the total size, mimicking
   * what the `<sl-virtual-list>` component does so the scroll container actually
   * has scrollable content.
   */
  const mountAndSize = (instance: Virtualizer, hostElement: HTMLElement): void => {
    instance.mount(hostElement);
    hostElement.style.blockSize = `${instance.getTotalSize()}px`;
  };

  afterEach(() => {
    virtualizer?.unmount();
    scrollElement?.remove();
  });

  describe('element scrolling', () => {
    beforeEach(() => {
      createDom();

      virtualizer = new Virtualizer({
        count: 1000,
        estimateSize: () => 32,
        getScrollElement: () => scrollElement,
        overscan: 3
      });
      mountAndSize(virtualizer, host);
    });

    it('should compute the total size', () => {
      expect(virtualizer.getTotalSize()).to.equal(1000 * 32);
    });

    it('should report the viewport size', () => {
      expect(virtualizer.viewportSize).to.equal(320);
    });

    it('should return the visible virtual items plus overscan', () => {
      const items = virtualizer.getVirtualItems();

      expect(items).to.have.length(10 + 3);
      expect(items[0].index).to.equal(0);
      expect(items.at(-1)!.index).to.equal(12);
    });

    it('should give each item a start, end, size and key', () => {
      const [first, second] = virtualizer.getVirtualItems();

      expect(first).to.include({ index: 0, key: 0, start: 0, end: 32, size: 32 });
      expect(second).to.include({ index: 1, start: 32, end: 64, size: 32 });
    });

    it('should update the virtual items after scrolling', async () => {
      scrollElement.scrollTop = 3200;
      await new Promise(resolve => requestAnimationFrame(resolve));

      const items = virtualizer.getVirtualItems();
      expect(items.map(i => i.index)).to.include(100);
    });

    it('should find the virtual item for an offset', () => {
      const item = virtualizer.getVirtualItemForOffset(3200);

      expect(item?.index).to.equal(100);
    });

    it('should not have a scroll margin for element scrolling', () => {
      expect(virtualizer.scrollMargin).to.equal(0);
    });

    it('should scroll to an index', async () => {
      virtualizer.scrollToIndex(500, { align: 'start' });
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(scrollElement.scrollTop).to.be.closeTo(500 * 32, 64);
    });

    it('should scroll to an offset', async () => {
      virtualizer.scrollToOffset(1600);
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(scrollElement.scrollTop).to.be.closeTo(1600, 4);
    });
  });

  describe('options', () => {
    beforeEach(() => {
      createDom();

      virtualizer = new Virtualizer({
        count: 10,
        estimateSize: () => 32,
        getScrollElement: () => scrollElement
      });
      virtualizer.mount(host);
    });

    it('should apply default options', () => {
      expect(virtualizer.options.gap).to.equal(0);
      expect(virtualizer.options.overscan).to.equal(3);
      expect(virtualizer.options.paddingStart).to.equal(0);
    });

    it('should recompute the total size when the count changes', () => {
      virtualizer.setOptions({
        count: 20,
        estimateSize: () => 32,
        getScrollElement: () => scrollElement
      });

      expect(virtualizer.getTotalSize()).to.equal(20 * 32);
    });

    it('should apply a gap between items', () => {
      virtualizer.setOptions({
        count: 10,
        estimateSize: () => 32,
        gap: 8,
        getScrollElement: () => scrollElement
      });

      const items = virtualizer.getVirtualItems();
      expect(items[1].start).to.equal(40);
      expect(virtualizer.getTotalSize()).to.equal(10 * 32 + 9 * 8);
    });

    it('should apply padding at the start', () => {
      virtualizer.setOptions({
        count: 10,
        estimateSize: () => 32,
        getScrollElement: () => scrollElement,
        paddingStart: 16
      });

      expect(virtualizer.getVirtualItems()[0].start).to.equal(16);
    });

    it('should use a custom item key', () => {
      virtualizer.setOptions({
        count: 10,
        estimateSize: () => 32,
        getItemKey: index => `key-${index}`,
        getScrollElement: () => scrollElement
      });

      expect(virtualizer.getVirtualItems()[0].key).to.equal('key-0');
    });
  });

  describe('sticky items', () => {
    beforeEach(() => {
      createDom();

      virtualizer = new Virtualizer({
        count: 1000,
        estimateSize: () => 32,
        getIsSticky: index => index % 20 === 0,
        getScrollElement: () => scrollElement,
        overscan: 1
      });
      mountAndSize(virtualizer, host);
    });

    it('should mark sticky items', () => {
      expect(virtualizer.getVirtualItems()[0].sticky).to.be.true;
    });

    it('should keep the active sticky item rendered above the viewport', async () => {
      scrollElement.scrollTop = 32 * 25;
      await new Promise(resolve => requestAnimationFrame(resolve));

      const indexes = virtualizer.getVirtualItems().map(i => i.index);
      expect(indexes).to.include(20);
      expect(Math.min(...indexes)).to.equal(20);
    });
  });

  describe('initially hidden', () => {
    beforeEach(() => {
      createDom();
      scrollElement.style.display = 'none';

      virtualizer = new Virtualizer({
        count: 1000,
        estimateSize: () => 32,
        getScrollElement: () => scrollElement
      });
      virtualizer.mount(host);
    });

    it('should render no items while hidden', () => {
      expect(virtualizer.getVirtualItems()).to.have.length(0);
    });

    it('should render items once visible', async () => {
      scrollElement.style.display = 'block';
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(virtualizer.getVirtualItems().length).to.be.greaterThanOrEqual(10);
    });
  });

  describe('window scrolling', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      container.className = 'test-window-scroll-container';
      container.style.cssText = 'padding-block-start: 200px; min-block-size: 4000px;';

      host = document.createElement('div');
      container.appendChild(host);
      document.body.appendChild(container);

      virtualizer = new Virtualizer({
        count: 1000,
        estimateSize: () => 32,
        getScrollElement: () => window
      });
      virtualizer.mount(host);
    });

    afterEach(() => {
      window.scrollTo(0, 0);
      container.remove();
    });

    it('should use the window inner height as the viewport size', () => {
      expect(virtualizer.viewportSize).to.equal(window.innerHeight);
    });

    it('should set the scroll margin to the host offset', () => {
      expect(virtualizer.scrollMargin).to.be.greaterThanOrEqual(200);
    });

    it('should offset the item start by the scroll margin', () => {
      expect(virtualizer.getVirtualItems()[0].start).to.be.greaterThanOrEqual(200);
    });
  });
});
