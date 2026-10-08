import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './register.js';
import { type SegmentedControl, type SegmentedControlItem } from './segmented-control.js';

const items: SegmentedControlItem[] = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
  { label: 'Table', value: 'table' }
];

describe('sl-segmented-control', () => {
  let el: SegmentedControl;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(el.renderRoot.querySelectorAll<HTMLButtonElement>('button'));

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-segmented-control .items=${items}></sl-segmented-control>`);
    });

    it('should have the subtle emphasis by default', () => {
      expect(el.emphasis).to.equal('subtle');
      expect(el).to.have.attribute('emphasis', 'subtle');
    });

    it('should have the rect shape, md size and solid fill', () => {
      expect(el.shape).to.equal('rect');
      expect(el.size).to.equal('md');
      expect(el.fill).to.equal('solid');
      expect(el).to.have.attribute('shape', 'rect');
      expect(el).to.have.attribute('size', 'md');
      expect(el).to.have.attribute('fill', 'solid');
    });

    it('should render an unordered list of buttons', () => {
      const list = el.renderRoot.querySelector('ul');

      expect(list).to.exist;
      expect(list?.querySelectorAll(':scope > li > button')).to.have.length(3);
    });

    it('should select the first option', () => {
      expect(el.value).to.equal('list');
    });

    it('should set aria-current on the selected option only', () => {
      expect(buttons().map(b => b.getAttribute('aria-current'))).to.deep.equal([
        'true',
        'false',
        'false'
      ]);
    });

    it('should have a single tab stop', () => {
      expect(buttons().filter(b => b.tabIndex === 0)).to.have.length(1);
      expect(buttons()[0].tabIndex).to.equal(0);
    });
  });

  describe('accessible name', () => {
    it('should use aria-label', async () => {
      el = await fixture(html`
        <sl-segmented-control .items=${items} aria-label="View"></sl-segmented-control>
      `);

      expect(el.renderRoot.querySelector('ul')).to.have.attribute('aria-label', 'View');
    });

    it('should resolve aria-labelledby', async () => {
      const container = await fixture(html`
        <div>
          <span id="label">Sort by</span>
          <sl-segmented-control .items=${items} aria-labelledby="label"></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('ul')).to.have.attribute('aria-label', 'Sort by');
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-segmented-control .items=${items}></sl-segmented-control>`);
    });

    it('should select an option on click and emit sl-change', async () => {
      let detail: string | undefined;

      el.addEventListener('sl-change', (e: Event) => (detail = (e as CustomEvent<string>).detail));

      buttons()[1].click();
      await el.updateComplete;

      expect(el.value).to.equal('grid');
      expect(detail).to.equal('grid');
      expect(buttons().map(b => b.getAttribute('aria-current'))).to.deep.equal([
        'false',
        'true',
        'false'
      ]);
    });

    it('should honor an initial value', async () => {
      el = await fixture(html`
        <sl-segmented-control .items=${items} value="table"></sl-segmented-control>
      `);

      expect(buttons()[2]).to.have.attribute('aria-current', 'true');
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-segmented-control .items=${items}></sl-segmented-control>`);
    });

    it('should focus the first button with tab', async () => {
      await userEvent.tab();

      expect(el.shadowRoot?.activeElement).to.equal(buttons()[0]);
    });

    it('should move focus with the arrow keys', async () => {
      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.equal(buttons()[1]);

      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.equal(buttons()[0]);
    });
  });
});
