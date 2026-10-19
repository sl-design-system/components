import '@sl-design-system/icon/register.js';
import { type Select } from '@sl-design-system/select';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { type TemplateResult, html, nothing } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import './register.js';
import { type SegmentedControlItem } from './segmented-control-item.js';
import { type SegmentedControl } from './segmented-control.js';

interface ItemData {
  ariaDisabled?: boolean;
  icon?: string;
  label: string;
  selectedIcon?: string;
  value: string;
}

const items: ItemData[] = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
    { label: 'Table', value: 'table' }
  ],
  iconItems: ItemData[] = [
    { icon: 'far-list', label: 'List', selectedIcon: 'fas-list', value: 'list' },
    { icon: 'far-grid-2', label: 'Grid', selectedIcon: 'fas-grid-2', value: 'grid' },
    { icon: 'far-table', label: 'Table', value: 'table' }
  ],
  longItems: ItemData[] = [
    { label: 'Very long option one', value: 'one' },
    { label: 'Very long option two', value: 'two' },
    { label: 'Very long option three', value: 'three' }
  ];

const renderItems = (data: ItemData[]): TemplateResult[] =>
  data.map(
    ({ ariaDisabled, icon, label, selectedIcon, value }) => html`
      <sl-segmented-control-item aria-disabled=${ariaDisabled ? 'true' : nothing} value=${value}>
        ${icon ? html`<sl-icon name=${icon} slot="icon"></sl-icon>` : nothing}
        ${selectedIcon ? html`<sl-icon name=${selectedIcon} slot="selected-icon"></sl-icon>` : nothing}
        ${label}
      </sl-segmented-control-item>
    `
  );

/** Wait for the slot, the resize observer and the animation frame it schedules. */
const nextLayout = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 100));

describe('sl-segmented-control', () => {
  let el: SegmentedControl;

  const options = (): SegmentedControlItem[] =>
      Array.from(el.querySelectorAll<SegmentedControlItem>('sl-segmented-control-item')),
    buttons = (): HTMLButtonElement[] =>
      options().map(option => option.renderRoot.querySelector<HTMLButtonElement>('button')!),
    list = (): HTMLElement | null => el.renderRoot.querySelector<HTMLElement>('.list'),
    select = (): Select | null => el.renderRoot.querySelector<Select>('sl-select'),
    selectButton = (): HTMLElement | null =>
      select()?.querySelector<HTMLElement>('sl-select-button') ??
      select()?.renderRoot.querySelector<HTMLElement>('sl-select-button') ??
      null,
    settle = async (): Promise<void> => {
      await nextLayout();
      await el.updateComplete;
      await Promise.all(options().map(option => option.updateComplete));
    },
    setup = async (template: TemplateResult): Promise<HTMLElement> => {
      const root = await fixture<HTMLElement>(template);

      el = root.matches('sl-segmented-control')
        ? (root as unknown as SegmentedControl)
        : (root.querySelector('sl-segmented-control') as unknown as SegmentedControl);
      await settle();

      return root;
    };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('defaults', () => {
    beforeEach(async () => {
      await setup(html`<sl-segmented-control>${renderItems(items)}</sl-segmented-control>`);
    });

    it('should have the subtle emphasis by default', () => {
      expect(el.emphasis).to.equal('subtle');
      expect(el).to.have.attribute('emphasis', 'subtle');
    });

    it('should have the rect shape, md size and solid fill', () => {
      expect(el).to.have.attribute('shape', 'rect');
      expect(el).to.have.attribute('size', 'md');
      expect(el).to.have.attribute('fill', 'solid');
    });

    it('should render a list of options', () => {
      expect(list()).to.have.attribute('role', 'list');
      expect(options().map(option => option.getAttribute('role'))).to.deep.equal([
        'listitem',
        'listitem',
        'listitem'
      ]);
    });

    it('should select the first option', () => {
      expect(el.value).to.equal('list');
      expect(options().map(option => option.selected)).to.deep.equal([true, false, false]);
    });

    it('should set aria-current on the selected option only', () => {
      expect(buttons().map(b => b.getAttribute('aria-current'))).to.deep.equal([
        'true',
        'false',
        'false'
      ]);
    });

    it('should have a single tab stop', () => {
      expect(options().filter(option => option.tabIndex === 0)).to.have.length(1);
    });
  });

  describe('accessible name', () => {
    it('should use aria-label', async () => {
      await setup(html`
        <sl-segmented-control aria-label="View">${renderItems(items)}</sl-segmented-control>
      `);

      expect(list()).to.have.attribute('aria-label', 'View');
    });

    it('should resolve aria-labelledby', async () => {
      await setup(html`
        <div>
          <span id="label">Sort by</span>
          <sl-segmented-control aria-labelledby="label">${renderItems(items)}</sl-segmented-control>
        </div>
      `);

      expect(list()).to.have.attribute('aria-label', 'Sort by');
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      await setup(html`<sl-segmented-control>${renderItems(items)}</sl-segmented-control>`);
    });

    it('should select an option on click and emit sl-change', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      buttons()[1].click();
      await settle();

      expect(el.value).to.equal('grid');
      expect(options().map(option => option.selected)).to.deep.equal([false, true, false]);
      expect(onChange).to.have.been.calledOnce;
      expect((onChange.lastCall.args[0] as CustomEvent<string>).detail).to.equal('grid');
      expect(buttons().map(b => b.getAttribute('aria-current'))).to.deep.equal([
        'false',
        'true',
        'false'
      ]);
    });

    it('should not select an aria-disabled option', async () => {
      await setup(html`
        <sl-segmented-control>
          <sl-segmented-control-item value="list">List</sl-segmented-control-item>
          <sl-segmented-control-item aria-disabled="true" value="grid"
            >Grid</sl-segmented-control-item
          >
          <sl-segmented-control-item value="table">Table</sl-segmented-control-item>
        </sl-segmented-control>
      `);

      buttons()[1].click();
      await settle();

      expect(el.value).to.equal('list');
      expect(buttons()[1]).to.have.attribute('aria-disabled', 'true');
      expect(buttons()[1]).not.to.have.attribute('disabled');
      expect(options().map(option => option.selected)).to.deep.equal([true, false, false]);
    });

    it('should not mark any option as leaving on the first render', () => {
      expect(options().map(option => !!option.leaving)).to.deep.equal([false, false, false]);
    });

    it('should mark the previously selected option as leaving', async () => {
      buttons()[1].click();
      await settle();

      expect(options().map(option => !!option.leaving)).to.deep.equal([true, false, false]);

      buttons()[2].click();
      await settle();

      expect(options().map(option => !!option.leaving)).to.deep.equal([false, true, false]);
    });

    it('should honor an initially selected option', async () => {
      await setup(html`
        <sl-segmented-control value="table">${renderItems(items)}</sl-segmented-control>
      `);

      expect(el.value).to.equal('table');
      expect(options().map(option => option.selected)).to.deep.equal([false, false, true]);
      expect(buttons()[2]).to.have.attribute('aria-current', 'true');
    });

    it('should select an option when value is set programmatically', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      el.value = 'grid';
      await settle();

      expect(el.value).to.equal('grid');
      expect(options().map(option => option.selected)).to.deep.equal([false, true, false]);
      expect(buttons()[1]).to.have.attribute('aria-current', 'true');
      expect(onChange).not.to.have.been.called;
    });

    it('should select an option when the value attribute is set', async () => {
      el.setAttribute('value', 'table');
      await settle();

      expect(el.value).to.equal('table');
      expect(options().map(option => option.selected)).to.deep.equal([false, false, true]);
    });
  });

  describe('dev-mode icon validation', () => {
    it('should warn when an icon-only item has no icon', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await setup(html`
        <sl-segmented-control icon-only>
          <sl-segmented-control-item value="list">List</sl-segmented-control-item>
        </sl-segmented-control>
      `);

      expect(consoleError.mock.calls).to.deep.equal([
        ['There needs to be an sl-icon in the "icon" slot for an icon-only segmented control item.']
      ]);
    });

    it('should warn when selected-icon is used without icon', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await setup(html`
        <sl-segmented-control>
          <sl-segmented-control-item value="list">
            <sl-icon name="fas-list" slot="selected-icon"></sl-icon>
            List
          </sl-segmented-control-item>
        </sl-segmented-control>
      `);

      expect(consoleError.mock.calls).to.deep.equal([
        [
          'Do not use an sl-icon in the "selected-icon" slot without also setting an sl-icon in the "icon" slot.'
        ]
      ]);
    });

    it('should warn when the icon and selected-icon are the same', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await setup(html`
        <sl-segmented-control>
          <sl-segmented-control-item value="list">
            <sl-icon name="far-list" slot="icon"></sl-icon>
            <sl-icon name="far-list" slot="selected-icon"></sl-icon>
            List
          </sl-segmented-control-item>
        </sl-segmented-control>
      `);

      expect(consoleError.mock.calls).to.deep.equal([
        ['Do not use the same icon for both states of a segmented control item.']
      ]);
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      await setup(html`<sl-segmented-control>${renderItems(items)}</sl-segmented-control>`);
    });

    it('should focus the first option with tab', async () => {
      await userEvent.tab();

      expect(document.activeElement).to.equal(options()[0]);
    });

    it('should move focus with the arrow keys', async () => {
      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');

      expect(document.activeElement).to.equal(options()[1]);

      await userEvent.keyboard('{ArrowLeft}');

      expect(document.activeElement).to.equal(options()[0]);
    });

    it('should allow keyboard focus on an aria-disabled option', async () => {
      await setup(html`
        <sl-segmented-control>
          <sl-segmented-control-item value="list">List</sl-segmented-control-item>
          <sl-segmented-control-item aria-disabled="true" value="grid"
            >Grid</sl-segmented-control-item
          >
          <sl-segmented-control-item value="table">Table</sl-segmented-control-item>
        </sl-segmented-control>
      `);

      options()[1].focus();
      expect(document.activeElement).to.equal(options()[1]);
      expect(buttons()[1]).to.have.attribute('aria-disabled', 'true');
    });
  });

  describe('layout', () => {
    const layoutItems: ItemData[] = [
      { label: 'One', value: 'one' },
      { label: 'Much longer label', value: 'two' },
      { label: 'Three', value: 'three' }
    ];

    it('should size all options to the width of the widest option by default', async () => {
      await setup(html`
        <div style="inline-size: 800px; inset: 0 auto auto 0; position: fixed">
          <sl-segmented-control>${renderItems(layoutItems)}</sl-segmented-control>
        </div>
      `);

      const [first, second, third] = buttons().map(b =>
        Math.round(b.getBoundingClientRect().width)
      );

      expect(first).to.equal(second);
      expect(third).to.equal(second);
      expect(Math.round(el.getBoundingClientRect().width)).to.be.lessThan(800);
    });

    it('should keep distributing the options evenly when stretched to full width', async () => {
      await setup(html`
        <div style="inline-size: 800px; inset: 0 auto auto 0; position: fixed">
          <sl-segmented-control style="width: 100%"
            >${renderItems(layoutItems)}</sl-segmented-control
          >
        </div>
      `);

      const [first, second, third] = buttons().map(b =>
        Math.round(b.getBoundingClientRect().width)
      );

      expect(Math.round(el.getBoundingClientRect().width)).to.equal(800);
      expect(Math.round(list()!.getBoundingClientRect().width)).to.equal(800);
      expect(first).to.equal(second);
      expect(third).to.equal(second);
    });
  });

  describe('styling', () => {
    it('should pass the emphasis, shape and size to the options', async () => {
      await setup(html`
        <sl-segmented-control emphasis="bold" shape="pill" size="lg">
          ${renderItems(items)}
        </sl-segmented-control>
      `);

      expect(options().every(option => option.emphasis === 'bold')).to.be.true;
      expect(options().every(option => option.shape === 'pill')).to.be.true;
      expect(options().every(option => option.size === 'lg')).to.be.true;

      el.size = 'md';
      await settle();

      expect(options().every(option => option.size === 'md')).to.be.true;
    });

    it('should center the underline of the selected option in subtle emphasis', async () => {
      await setup(html`<sl-segmented-control>${renderItems(items)}</sl-segmented-control>`);

      const button = buttons()[0],
        underline = getComputedStyle(button.querySelector('.fill')!, '::after'),
        buttonWidth = button.getBoundingClientRect().width,
        left = parseFloat(underline.left) + parseFloat(underline.marginLeft),
        width = parseFloat(underline.width);

      expect(underline.display).not.to.equal('none');
      expect(width).to.equal(32);
      expect(Math.round(left)).to.equal(Math.round((buttonWidth - width) / 2));
    });

    it('should not show the underline in bold emphasis', async () => {
      await setup(html`
        <sl-segmented-control emphasis="bold">${renderItems(items)}</sl-segmented-control>
      `);

      const underline = getComputedStyle(buttons()[0].querySelector('.fill')!, '::after');

      expect(underline.display).to.equal('none');
    });
  });

  describe('icons', () => {
    const iconNames = (): Array<string | undefined> =>
      options().map(option => {
        const slot =
          option.selected && option.querySelector('[slot="selected-icon"]')
            ? 'selected-icon'
            : 'icon';

        return option.querySelector<HTMLElement & { name?: string }>(`[slot="${slot}"]`)?.name;
      });

    beforeEach(async () => {
      await setup(html`<sl-segmented-control>${renderItems(iconItems)}</sl-segmented-control>`);
    });

    it('should show the selected icon on the selected option', () => {
      const [first, second] = options(),
        visible = (option: SegmentedControlItem, name: string): boolean =>
          getComputedStyle(option.renderRoot.querySelector(`slot[name="${name}"]`)!).display !==
          'none';

      expect(visible(first, 'selected-icon')).to.be.true;
      expect(visible(first, 'icon')).to.be.false;
      expect(visible(second, 'selected-icon')).to.be.false;
      expect(visible(second, 'icon')).to.be.true;
      expect(iconNames()).to.deep.equal(['fas-list', 'far-grid-2', 'far-table']);
    });

    it('should swap the icons when the selection changes', async () => {
      buttons()[1].click();
      await settle();

      expect(iconNames()).to.deep.equal(['far-list', 'fas-grid-2', 'far-table']);
    });

    it('should keep the icon when there is no selected icon', async () => {
      buttons()[2].click();
      await settle();

      const icon = options()[2].renderRoot.querySelector('slot[name="icon"]')!;

      expect(getComputedStyle(icon).display).not.to.equal('none');
    });
  });

  describe('icon only', () => {
    it('should hide visible text and use it as the accessible name', async () => {
      await setup(html`
        <sl-segmented-control icon-only>${renderItems(iconItems)}</sl-segmented-control>
      `);

      const labels = options().map(option => option.renderRoot.querySelector('.label')!);

      expect(labels.map(label => getComputedStyle(label).display)).to.deep.equal([
        'none',
        'none',
        'none'
      ]);
      expect(buttons().map(button => button.getAttribute('aria-label'))).to.deep.equal([
        'List',
        'Grid',
        'Table'
      ]);
    });

    it('should use size-specific padding in icon-only mode', async () => {
      await setup(html`
        <sl-segmented-control icon-only>${renderItems(iconItems)}</sl-segmented-control>
      `);

      let styles = getComputedStyle(buttons()[0]);
      expect(styles.paddingBlockStart).to.equal('10px');
      expect(styles.paddingInlineStart).to.equal('10px');

      await setup(html`
        <sl-segmented-control icon-only size="lg">${renderItems(iconItems)}</sl-segmented-control>
      `);

      styles = getComputedStyle(buttons()[0]);
      expect(styles.paddingBlockStart).to.equal('16px');
      expect(styles.paddingInlineStart).to.equal('16px');
    });
  });

  describe('overflow', () => {
    let container: HTMLElement;

    beforeEach(async () => {
      container = await setup(html`
        <div style="inline-size: 150px">
          <sl-segmented-control aria-label="Options"
            >${renderItems(longItems)}</sl-segmented-control
          >
        </div>
      `);
    });

    it('should render a select when the options do not fit', () => {
      expect(select()).to.exist;
    });

    it('should hide the options from view and assistive technology', () => {
      expect(list()).to.have.attribute('aria-hidden', 'true');
      expect(list()).to.have.attribute('inert');
      expect(getComputedStyle(options()[0]).visibility).to.equal('hidden');
    });

    it('should not exceed the available width', () => {
      expect(el.getBoundingClientRect().width).to.be.at.most(150);
    });

    it('should keep the natural width of the select, even when the control fills the width', async () => {
      container = await setup(html`
        <div style="inline-size: 400px">
          <sl-segmented-control style="width: 100%">${renderItems(longItems)}</sl-segmented-control>
        </div>
      `);

      expect(select()).to.exist;
      expect(Math.round(el.getBoundingClientRect().width)).to.equal(400);
      expect(Math.round(select()!.getBoundingClientRect().width)).to.be.lessThan(400);
    });

    it('should let the select fill the width using the select part', async () => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync('.full-width::part(select) { display: flex; inline-size: 100%; }');
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

      try {
        container = await setup(html`
          <div style="inline-size: 400px">
            <sl-segmented-control class="full-width" style="width: 100%">
              ${renderItems(longItems)}
            </sl-segmented-control>
          </div>
        `);

        expect(Math.round(select()!.getBoundingClientRect().width)).to.equal(400);
        expect(Math.round(selectButton()!.getBoundingClientRect().width)).to.equal(400);
      } finally {
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== sheet);
      }
    });

    it('should render an option in the select for every item', () => {
      const selectOptions = Array.from(select()!.querySelectorAll('sl-option'));

      expect(selectOptions.map(option => option.textContent?.trim())).to.deep.equal([
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

    it('should pass the size and shape to the select', async () => {
      el.size = 'lg';
      el.shape = 'pill';
      await settle();

      expect(select()).to.have.attribute('size', 'lg');
      expect(select()).to.have.attribute('shape', 'pill');
    });

    it('should keep the same height for the select and the options', async () => {
      const selectHeight = el.getBoundingClientRect().height;

      container.style.inlineSize = '1000px';
      await settle();

      expect(select()).not.to.exist;
      expect(el.getBoundingClientRect().height).to.equal(selectHeight);
    });

    it('should render the options when they fit', async () => {
      await setup(html`
        <div style="inline-size: 1000px">
          <sl-segmented-control>${renderItems(items)}</sl-segmented-control>
        </div>
      `);

      expect(select()).not.to.exist;
      expect(list()).not.to.have.attribute('aria-hidden');
    });

    it('should switch back to the options when more space becomes available', async () => {
      container.style.inlineSize = '1000px';
      await settle();

      expect(select()).not.to.exist;
      expect(getComputedStyle(options()[0]).visibility).to.equal('visible');
    });

    it('should switch to the select again when space shrinks', async () => {
      container.style.inlineSize = '1000px';
      await settle();

      expect(select()).not.to.exist;

      container.style.inlineSize = '150px';
      await settle();

      expect(select()).to.exist;
    });

    it('should switch back to the options inside a table cell that sizes to its content', async () => {
      const wrapper = await setup(html`
        <div style="inline-size: 150px">
          <table>
            <tr>
              <td>
                <sl-segmented-control>${renderItems(longItems)}</sl-segmented-control>
              </td>
            </tr>
          </table>
        </div>
      `);

      expect(select()).to.exist;

      wrapper.style.inlineSize = '1000px';
      await settle();

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

      expect(options().map(option => option.selected)).to.deep.equal([false, true, false]);
      expect(onChange).to.have.been.calledOnce;
      expect(changeEvent.target).to.equal(el);
      expect(changeEvent.detail).to.equal('two');
    });

    it('should keep the selected value and not animate when switching back to the options', async () => {
      el.value = 'table';
      await settle();

      container.style.inlineSize = '1000px';
      await settle();
      await settle();

      expect(el.value).to.equal('table');
      expect(options().map(option => !!option.leaving)).to.deep.equal([false, false, false]);
    });
  });
});
