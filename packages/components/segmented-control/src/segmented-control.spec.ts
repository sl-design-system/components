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

  describe('layout', () => {
    const layoutItems: SegmentedControlItem[] = [
      { label: 'One', value: 'one' },
      { label: 'Much longer label', value: 'two' },
      { label: 'Three', value: 'three' }
    ];

    it('should size all buttons to the width of the widest option by default', async () => {
      const container = await fixture(html`
        <div style="inline-size: 800px; inset: 0 auto auto 0; position: fixed">
          <sl-segmented-control .items=${layoutItems}></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;

      await new Promise(resolve => setTimeout(resolve));

      const [firstWidth, secondWidth, thirdWidth] = buttons().map(button =>
        Math.round(button.getBoundingClientRect().width)
      );

      expect(firstWidth).to.equal(secondWidth);
      expect(thirdWidth).to.equal(secondWidth);
      expect(Math.round(el.getBoundingClientRect().width)).to.be.lessThan(800);
    });

    it('should keep distributing the buttons evenly when stretched to full width', async () => {
      const container = await fixture(html`
        <div style="inline-size: 800px; inset: 0 auto auto 0; position: fixed">
          <sl-segmented-control .items=${layoutItems} style="width: 100%"></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;

      await new Promise(resolve => setTimeout(resolve));

      const [firstWidth, secondWidth, thirdWidth] = buttons().map(button =>
          Math.round(button.getBoundingClientRect().width)
        ),
        hostWidth = Math.round(el.getBoundingClientRect().width),
        listWidth = Math.round(el.renderRoot.querySelector('ul')!.getBoundingClientRect().width);

      expect(hostWidth).to.equal(800);
      expect(listWidth).to.equal(hostWidth);
      expect(firstWidth).to.equal(secondWidth);
      expect(thirdWidth).to.equal(secondWidth);
    });
  });

  it('should hide visible text in icon-only mode', async () => {
    el = await fixture(html`
      <sl-segmented-control .items=${items} icon-only></sl-segmented-control>
    `);

    expect(buttons().map(button => button.textContent?.trim())).to.deep.equal(['', '', '']);
    expect(buttons().map(button => button.getAttribute('aria-label'))).to.deep.equal([
      'List',
      'Grid',
      'Table'
    ]);
  });

  it('should use size-specific padding in icon-only mode', async () => {
    el = await fixture(html`
      <sl-segmented-control .items=${items} icon-only></sl-segmented-control>
    `);

    let styles = getComputedStyle(buttons()[0]);

    expect(styles.paddingBlockStart).to.equal('10px');
    expect(styles.paddingInlineStart).to.equal('10px');

    el = await fixture(html`
      <sl-segmented-control .items=${items} icon-only size="lg"></sl-segmented-control>
    `);

    styles = getComputedStyle(buttons()[0]);

    expect(styles.paddingBlockStart).to.equal('16px');
    expect(styles.paddingInlineStart).to.equal('16px');
  });
});
