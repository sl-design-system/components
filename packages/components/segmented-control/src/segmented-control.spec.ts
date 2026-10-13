import { type Select } from '@sl-design-system/select';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it, onTestFinished } from 'vitest';
import { userEvent } from 'vitest/browser';
import './register.js';
import { type SegmentedControl, type SegmentedControlItem } from './segmented-control.js';

const items: SegmentedControlItem[] = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
  { label: 'Table', value: 'table' }
];

const longItems: SegmentedControlItem[] = [
  { label: 'Very long option one', value: 'one' },
  { label: 'Very long option two', value: 'two' },
  { label: 'Very long option three', value: 'three' }
];

/** Wait for the resize observer and the animation frame it schedules. */
const nextLayout = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 100));

describe('sl-segmented-control', () => {
  let el: SegmentedControl;

  const list = (): HTMLUListElement | null =>
      el.renderRoot.querySelector<HTMLUListElement>('.content ul'),
    buttons = (): HTMLButtonElement[] =>
      Array.from(el.renderRoot.querySelectorAll<HTMLButtonElement>('.content button')),
    select = (): Select | null => el.renderRoot.querySelector<Select>('sl-select'),
    selectButton = (): HTMLElement | null =>
      select()?.querySelector<HTMLElement>('sl-select-button') ??
      select()?.renderRoot.querySelector<HTMLElement>('sl-select-button') ??
      null;

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
      expect(list()).to.exist;
      expect(list()?.querySelectorAll(':scope > li > button')).to.have.length(3);
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
    });

    it('should hide the measurement elements from assistive technology', () => {
      expect(el.renderRoot.querySelector('.measure')).to.have.attribute('aria-hidden', 'true');
      expect(el.renderRoot.querySelector('.sizer')).to.have.attribute('aria-hidden', 'true');
    });
  });

  describe('accessible name', () => {
    it('should use aria-label', async () => {
      el = await fixture(html`
        <sl-segmented-control .items=${items} aria-label="View"></sl-segmented-control>
      `);

      expect(list()).to.have.attribute('aria-label', 'View');
    });

    it('should resolve aria-labelledby', async () => {
      const container = await fixture(html`
        <div>
          <span id="label">Sort by</span>
          <sl-segmented-control .items=${items} aria-labelledby="label"></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;

      expect(list()).to.have.attribute('aria-label', 'Sort by');
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-segmented-control .items=${items}></sl-segmented-control>`);
    });

    it('should select an option on click and emit sl-change', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      buttons()[1].click();
      await el.updateComplete;

      expect(el.value).to.equal('grid');
      expect(onChange).to.have.been.calledOnce;
      expect((onChange.lastCall.args[0] as CustomEvent<string>).detail).to.equal('grid');
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
      await nextLayout();

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
      await nextLayout();

      const [firstWidth, secondWidth, thirdWidth] = buttons().map(button =>
          Math.round(button.getBoundingClientRect().width)
        ),
        hostWidth = Math.round(el.getBoundingClientRect().width),
        listWidth = Math.round(list()!.getBoundingClientRect().width);

      expect(hostWidth).to.equal(800);
      expect(listWidth).to.equal(hostWidth);
      expect(firstWidth).to.equal(secondWidth);
      expect(thirdWidth).to.equal(secondWidth);
    });
  });

  describe('icon only', () => {
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

  describe('overflow', () => {
    let container: HTMLElement;

    beforeEach(async () => {
      container = await fixture(html`
        <div style="inline-size: 150px">
          <sl-segmented-control .items=${longItems} aria-label="Options"></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;
      await nextLayout();
      await el.updateComplete;
    });

    it('should render a select when the buttons do not fit', () => {
      expect(select()).to.exist;
      expect(list()).not.to.exist;
    });

    it('should not exceed the available width', () => {
      expect(el.getBoundingClientRect().width).to.be.at.most(150);
    });

    it('should keep the natural width of the select by default', async () => {
      container = await fixture(html`
        <div style="inline-size: 400px">
          <sl-segmented-control .items=${longItems}></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;
      await nextLayout();
      await el.updateComplete;

      expect(select()).to.exist;
      expect(Math.round(select()!.getBoundingClientRect().width)).to.be.lessThan(400);
    });

    it('should keep the natural width of the select when the control fills the width', async () => {
      container = await fixture(html`
        <div style="inline-size: 400px">
          <sl-segmented-control .items=${longItems} style="width: 100%"></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;
      await nextLayout();
      await el.updateComplete;

      expect(select()).to.exist;
      expect(Math.round(el.getBoundingClientRect().width)).to.equal(400);
      expect(Math.round(select()!.getBoundingClientRect().width)).to.be.lessThan(400);
    });

    it('should let the select be stretched using the select part', async () => {
      const style = document.createElement('style');
      style.textContent = '.stretch::part(select) { display: flex; inline-size: 100%; }';
      document.head.append(style);
      onTestFinished(() => style.remove());

      container = await fixture(html`
        <div style="inline-size: 400px">
          <sl-segmented-control
            .items=${longItems}
            class="stretch"
            style="width: 100%"></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;
      await nextLayout();
      await el.updateComplete;

      expect(select()).to.exist;
      expect(Math.round(el.getBoundingClientRect().width)).to.equal(400);
      expect(Math.round(select()!.getBoundingClientRect().width)).to.equal(400);
      expect(Math.round(selectButton()!.getBoundingClientRect().width)).to.equal(400);
    });

    it('should keep the same height for the select as for the buttons', async () => {
      const selectHeight = el.getBoundingClientRect().height;

      container.style.inlineSize = '1000px';
      await nextLayout();
      await el.updateComplete;

      expect(list()).to.exist;
      expect(el.getBoundingClientRect().height).to.equal(selectHeight);
    });

    it('should pass the size and shape to the select', async () => {
      el.size = 'lg';
      el.shape = 'pill';
      await el.updateComplete;

      expect(select()).to.have.attribute('size', 'lg');
      expect(select()).to.have.attribute('shape', 'pill');
    });

    it('should render an option for every item', () => {
      const options = Array.from(select()!.querySelectorAll('sl-option'));

      expect(options.map(option => option.textContent?.trim())).to.deep.equal([
        'Very long option one',
        'Very long option two',
        'Very long option three'
      ]);
    });

    it('should pass the accessible name to the select', async () => {
      await select()!.updateComplete;

      // The select moves the aria-label from the host to its internal button.
      expect(select()!.ariaLabel).to.equal('Options');
    });

    it('should render the buttons when the buttons fit', async () => {
      container = await fixture(html`
        <div style="inline-size: 1000px">
          <sl-segmented-control .items=${items}></sl-segmented-control>
        </div>
      `);

      el = container.querySelector('sl-segmented-control')!;
      await nextLayout();
      await el.updateComplete;

      expect(list()).to.exist;
      expect(select()).not.to.exist;
    });

    it('should switch back to the buttons when more space becomes available', async () => {
      expect(select()).to.exist;

      container.style.inlineSize = '1000px';
      await nextLayout();
      await el.updateComplete;

      expect(list()).to.exist;
      expect(select()).not.to.exist;
    });

    it('should switch to the select again when space shrinks', async () => {
      container.style.inlineSize = '1000px';
      await nextLayout();
      await el.updateComplete;

      expect(list()).to.exist;

      container.style.inlineSize = '150px';
      await nextLayout();
      await el.updateComplete;

      expect(select()).to.exist;
    });

    it('should switch back to the buttons inside a table cell that sizes to its content', async () => {
      const wrapper = await fixture<HTMLElement>(html`
        <div style="inline-size: 150px">
          <table>
            <tr>
              <td>
                <sl-segmented-control .items=${longItems}></sl-segmented-control>
              </td>
            </tr>
          </table>
        </div>
      `);

      el = wrapper.querySelector('sl-segmented-control')!;
      await nextLayout();
      await el.updateComplete;

      expect(select()).to.exist;

      wrapper.style.inlineSize = '1000px';
      await nextLayout();
      await el.updateComplete;

      expect(list()).to.exist;
      expect(select()).not.to.exist;
    });

    it('should update the value and emit a single sl-change when the select changes', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      select()!.dispatchEvent(
        new CustomEvent('sl-change', { bubbles: true, composed: true, detail: 'two' })
      );
      await el.updateComplete;

      const changeEvent = onChange.lastCall.args[0] as CustomEvent<string>;

      expect(el.value).to.equal('two');
      expect(onChange).to.have.been.calledOnce;
      expect(changeEvent.target).to.equal(el);
      expect(changeEvent.detail).to.equal('two');
    });

    it('should keep the selected value when switching back to the buttons', async () => {
      el.value = 'three';
      await el.updateComplete;

      container.style.inlineSize = '1000px';
      await nextLayout();
      await el.updateComplete;

      expect(buttons()[2]).to.have.attribute('aria-current', 'true');
    });
  });
});
