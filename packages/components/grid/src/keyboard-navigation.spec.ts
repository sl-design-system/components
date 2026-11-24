import { type Button } from '@sl-design-system/button';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { type TextField } from '@sl-design-system/text-field';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { type Grid } from './grid.js';
import './register.js';
import { waitForGridToRenderData } from './utils.js';

async function mount(
  count = 2
): Promise<{ grid: Grid; items: Array<{ name: string; note: string }> }> {
  const items = Array.from({ length: count }, (_, index) => ({
    name: `Item ${index + 1}`,
    note: 'Original'
  }));

  const wrapper = await fixture<HTMLDivElement>(html`
    <div>
      <button id="before">Before</button>
      <div id="scroller" style="max-block-size: 260px; overflow: auto">
        <sl-grid
          aria-label="Items"
          keyboard-navigation="arrows"
          keyboard-page-size="5"
          .items=${items}>
          <sl-grid-column path="name" width="140"></sl-grid-column>
          <sl-grid-text-field-column path="note" width="160"></sl-grid-text-field-column>
          <sl-grid-column
            header="Actions"
            width="260"
            .renderer=${() => html`
              <button type="button" disabled>Unavailable</button>
              <button type="button">Open</button>
              <a href="#more">More</a>
            `}></sl-grid-column>
        </sl-grid>
      </div>
      <button id="after">After</button>
    </div>
  `);

  const grid = wrapper.querySelector('sl-grid')!;
  await waitForGridToRenderData(grid);
  wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

  return { grid, items };
}

describe('sl-grid arrow navigation', () => {
  it('has one tab stop and restores the last cell from either direction', async () => {
    const { grid } = await mount();

    await userEvent.tab();

    expect(grid.shadowRoot!.activeElement).toBe(grid.thead.rows[0].cells[0]);

    await userEvent.keyboard('{ArrowLeft}{ArrowDown}{End}');
    const actions = grid.tbody.rows[0].querySelector('[data-grid-access]');

    expect(grid.shadowRoot!.activeElement).toBe(actions);

    await userEvent.tab();

    expect(document.activeElement?.id).toBe('after');

    await userEvent.tab({ shift: true });

    expect(grid.shadowRoot!.activeElement).toBe(actions);

    await userEvent.tab({ shift: true });

    expect(document.activeElement?.id).toBe('before');
  });

  it('commits with Enter, discards with Escape and keeps Tab inside the editor', async () => {
    const { grid, items } = await mount();

    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}{Enter}');

    const editor = grid.tbody.querySelector<TextField>('[data-grid-editor]')!,
      button = grid.tbody.querySelector('[data-grid-edit]');

    expect(grid.shadowRoot!.activeElement).toBe(editor.input);

    await userEvent.keyboard('{End} changed{Tab}');

    expect(grid.shadowRoot!.activeElement).toBe(editor.input);

    await userEvent.keyboard('{Escape}');

    expect(items[0].note).toBe('Original');
    expect(grid.shadowRoot!.activeElement).toBe(button);

    await userEvent.keyboard('{Enter}{End} saved{Enter}');

    expect(items[0].note).toBe('Original saved');
    expect(grid.shadowRoot!.activeElement).toBe(button);
    expect(button?.textContent?.trim()).toBe('Original saved');
  });

  it('enters on the first enabled action and reaches disabled actions without wrapping', async () => {
    const { grid } = await mount();

    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{End}');

    const cell = grid.tbody.rows[0].cells[2],
      entry = cell.querySelector<HTMLElement>('[data-grid-access]')!,
      [disabled, enabled] = cell.querySelectorAll('button'),
      link = cell.querySelector('a'),
      { x, y } = enabled.getBoundingClientRect();

    await userEvent.keyboard('{Enter}');

    expect(grid.shadowRoot!.activeElement).toBe(enabled);
    expect(entry.checkVisibility({ visibilityProperty: true })).toBe(false);
    expect(enabled.getBoundingClientRect()).toMatchObject({ x, y });

    await userEvent.tab({ shift: true });
    await userEvent.tab({ shift: true });

    expect(grid.shadowRoot!.activeElement).toBe(disabled);
    expect(disabled.getAttribute('aria-disabled')).toBe('true');

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(grid.shadowRoot!.activeElement).toBe(link);

    await userEvent.keyboard('{Escape}');

    expect(grid.shadowRoot!.activeElement).toBe(entry);
    expect(disabled.disabled).toBe(true);
  });

  it('shows the placeholder for an empty cell without saving it as the value', async () => {
    const item = { note: '' },
      grid = await fixture<Grid>(html`
        <sl-grid keyboard-navigation="arrows" .items=${[item]}>
          <sl-grid-text-field-column
            path="note"
            placeholder="Add a note"
            width="180"></sl-grid-text-field-column>
        </sl-grid>
      `);
    await waitForGridToRenderData(grid);

    const entry = grid.tbody.querySelector<Button>('[data-grid-edit]')!,
      editor = grid.tbody.querySelector<TextField>('[data-grid-editor]')!;

    expect(entry.textContent?.trim()).toBe('Add a note');

    entry.focus();
    await userEvent.keyboard('{Enter}');

    expect(grid.shadowRoot!.activeElement).toBe(editor.input);
    expect(editor.input.placeholder).toBe('Add a note');
    expect(editor.input.value).toBe('');

    await userEvent.keyboard('{Enter}');

    expect(item.note).toBe('');
    expect(entry.textContent?.trim()).toBe('Add a note');

    await userEvent.keyboard('{Enter}Paid{Enter}');

    expect(item.note).toBe('Paid');
    expect(entry.textContent?.trim()).toBe('Paid');
  });

  it('edits a single native text input through its value button and restores cancelled changes', async () => {
    const item = { note: 'Original' },
      grid = await fixture<Grid>(html`
        <sl-grid keyboard-navigation="arrows" .items=${[item]}>
          <sl-grid-column
            header="Note"
            width="220"
            .renderer=${() => html`
              <input
                aria-label="Note"
                .value=${item.note}
                @input=${(event: Event) => (item.note = (event.target as HTMLInputElement).value)} />
            `}></sl-grid-column>
        </sl-grid>
      `);
    await waitForGridToRenderData(grid);

    const cell = grid.tbody.rows[0].cells[0],
      entry = cell.querySelector<Button>('[data-grid-access]')!,
      input = cell.querySelector('input')!;

    grid.thead.rows[0].cells[0].focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(grid.shadowRoot!.activeElement).toBe(entry);
    expect(entry.textContent).toBe('Original');
    expect(entry.button.getAttribute('aria-label')).toBe('Original');
    expect(input.checkVisibility()).toBe(false);

    await userEvent.keyboard('{Space}{End} draft{Tab}');

    expect(grid.shadowRoot!.activeElement).toBe(input);

    await userEvent.keyboard('{Escape}');

    expect(grid.shadowRoot!.activeElement).toBe(entry);
    expect(input.value).toBe('Original');
    expect(item.note).toBe('Original');

    await userEvent.keyboard('{Enter}{End} saved{Enter}');

    expect(grid.shadowRoot!.activeElement).toBe(entry);
    expect(entry.textContent).toBe('Original saved');
    expect(item.note).toBe('Original saved');

    await userEvent.keyboard('{Enter}');
    await userEvent.clear(input);
    await userEvent.keyboard('{Enter}');

    expect(entry.button.getAttribute('aria-label')).toBe('Edit empty cell');
  });

  it('skips CSS-hidden controls on entry and when tabbing in either direction', async () => {
    const grid = await fixture<Grid>(html`
      <sl-grid keyboard-navigation="arrows" .items=${[{}]}>
        <sl-grid-column
          header="Actions"
          width="250"
          .renderer=${() => html`
            <button style="visibility: hidden">Hidden first</button>
            <button>Open</button>
            <span style="visibility: hidden"><button>Hidden middle</button></span>
            <button>More</button>
          `}></sl-grid-column>
      </sl-grid>
    `);
    await waitForGridToRenderData(grid);

    const [, open, , more] = grid.tbody.rows[0].querySelectorAll('button');

    grid.thead.rows[0].cells[0].focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');

    expect(grid.shadowRoot!.activeElement).toBe(open);

    await userEvent.tab();

    expect(grid.shadowRoot!.activeElement).toBe(more);

    await userEvent.tab({ shift: true });

    expect(grid.shadowRoot!.activeElement).toBe(open);
  });

  it('lets a menu consume the first Escape before leaving the cell', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button type="button">Before</button>
        <sl-grid keyboard-navigation="arrows" .items=${[{}]}>
          <sl-grid-column
            header="Actions"
            width="300"
            .scopedElements=${{ 'sl-menu-button': MenuButton, 'sl-menu-item': MenuItem }}
            .renderer=${() => html`
              <sl-menu-button>
                <span slot="button">Options</span>
                <sl-menu-item>Download</sl-menu-item>
              </sl-menu-button>
              <button type="button">Archive</button>
            `}>
          </sl-grid-column>
        </sl-grid>
      </div>
    `);

    const grid = wrapper.querySelector('sl-grid')!;
    await waitForGridToRenderData(grid);

    const menuButton = grid.tbody.querySelector('sl-menu-button')!;
    await menuButton.updateComplete;

    wrapper.querySelector('button')!.focus();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{Enter}{ArrowDown}');

    await expect.poll(() => menuButton.menu.matches(':popover-open')).toBe(true);

    await userEvent.keyboard('{Escape}');

    await expect.poll(() => menuButton.menu.matches(':popover-open')).toBe(false);
    await expect.poll(() => grid.shadowRoot!.activeElement).toBe(menuButton);

    await userEvent.keyboard('{Escape}');

    expect(grid.shadowRoot!.activeElement?.hasAttribute('data-grid-access')).toBe(true);

    await userEvent.keyboard('{Enter}{ArrowDown}');

    await expect.poll(() => menuButton.menu.matches(':popover-open')).toBe(true);

    const cell = grid.tbody.rows[0].cells[0],
      access = cell.querySelector<HTMLElement>('[data-grid-access]')!;

    await userEvent.tab({ shift: true });

    expect(access.hidden).toBe(true);
    expect(cell.contains(grid.shadowRoot!.activeElement)).toBe(true);

    await userEvent.tab();

    expect(grid.shadowRoot!.activeElement).toBe(cell.querySelector('button'));
    expect(menuButton.menu.matches(':popover-open')).toBe(false);

    await userEvent.tab();

    expect(grid.shadowRoot!.activeElement).toBe(cell.querySelector('button'));

    await userEvent.keyboard('{Escape}');

    expect(grid.shadowRoot!.activeElement).toBe(access);
  });

  it('keeps the column when paging and focuses an offscreen row with Ctrl+End', async () => {
    const { grid } = await mount(200);

    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}{PageDown}');

    const focusedRow = (): string | null | undefined =>
      grid.shadowRoot!.activeElement?.closest('tr')?.getAttribute('index');

    await expect.poll(focusedRow).toBe('5');
    expect(grid.shadowRoot!.activeElement?.hasAttribute('data-grid-edit')).toBe(true);

    await userEvent.keyboard('{Control>}{End}{/Control}');

    await expect.poll(focusedRow).toBe('199');
    expect(grid.shadowRoot!.activeElement?.hasAttribute('data-grid-access')).toBe(true);

    await userEvent.tab();
    grid.parentElement!.scrollTop = 0;

    await expect.poll(() => grid.tbody.querySelector('tr[index="199"]')).toBeNull();

    await userEvent.tab({ shift: true });

    await expect.poll(focusedRow).toBe('199');
  });

  it('activates a control clicked directly with the mouse inside a multi-control cell', async () => {
    const { grid } = await mount();

    const cell = grid.tbody.rows[0].cells[2],
      [, openButton] = cell.querySelectorAll('button');

    let clicked = false;
    openButton.addEventListener('click', () => {
      clicked = true;
    });

    await userEvent.click(openButton);

    expect(clicked).toBe(true);
    expect(cell.querySelector<HTMLElement>('[data-grid-access]')?.hidden).toBe(true);
    expect(grid.shadowRoot!.activeElement).toBe(openButton);
  });

  it('manages sl-grid-select-column controls and lets the select consume the first Escape', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="before" type="button">Before</button>
        <sl-grid keyboard-navigation="arrows" .items=${[{ status: 'Open' }]}>
          <sl-grid-select-column
            header="Status"
            path="status"
            width="200"
            .options=${['Open', 'Closed']}></sl-grid-select-column>
        </sl-grid>
        <button id="after" type="button">After</button>
      </div>
    `);

    const grid = wrapper.querySelector('sl-grid')!;
    await waitForGridToRenderData(grid);

    const select = grid.tbody.querySelector('sl-select')!;
    await select.updateComplete;
    grid.requestUpdate();
    await grid.updateComplete;

    wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');

    const access = grid.tbody.rows[0].querySelector<Button>('[data-grid-access]')!;

    expect(grid.shadowRoot!.activeElement).toBe(access);
    expect(access.button.getAttribute('aria-label')).toBe('Edit Status, row 1');

    await userEvent.tab();

    expect(document.activeElement?.id).toBe('after');

    await userEvent.tab({ shift: true });

    expect(grid.shadowRoot!.activeElement).toBe(access);

    await userEvent.keyboard('{Enter}');

    expect(grid.shadowRoot!.activeElement).toBe(select.button);

    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => select.listbox?.matches(':popover-open')).toBe(true);

    await userEvent.keyboard('{Escape}');

    await expect.poll(() => select.listbox?.matches(':popover-open')).toBe(false);
    expect(grid.shadowRoot!.activeElement).toBe(select.button);

    await userEvent.keyboard('{Escape}');

    expect(grid.shadowRoot!.activeElement).toBe(access);
  });

  it('focuses the cell and preserves native disabled on a single disabled button while adding aria-disabled', async () => {
    let clicked = false;

    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="before" type="button">Before</button>
        <sl-grid keyboard-navigation="arrows" .items=${[{}]}>
          <sl-grid-column
            header="Action"
            width="160"
            .renderer=${() => html`
              <button
                @click=${() => {
                  clicked = true;
                }}
                disabled
                type="button">
                Archive
              </button>
            `}></sl-grid-column>
        </sl-grid>
      </div>
    `);

    const grid = wrapper.querySelector('sl-grid')!;
    await waitForGridToRenderData(grid);

    const cell = grid.tbody.rows[0].cells[0],
      button = cell.querySelector('button')!;

    wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');

    expect(grid.shadowRoot!.activeElement).toBe(cell);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');

    await userEvent.keyboard('{Enter} ');

    expect(clicked).toBe(false);
  });

  it('manages nested focusable descendants and supports Shift+Tab back to the parent control', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="before" type="button">Before</button>
        <sl-grid keyboard-navigation="arrows" .items=${[{}]}>
          <sl-grid-column
            header="Details"
            width="240"
            .renderer=${() => html`
              <details open>
                <summary>Summary <a href="#nested">Nested link</a></summary>
              </details>
            `}></sl-grid-column>
        </sl-grid>
        <button id="after" type="button">After</button>
      </div>
    `);

    const grid = wrapper.querySelector('sl-grid')!;
    await waitForGridToRenderData(grid);

    const cell = grid.tbody.rows[0].cells[0],
      summary = cell.querySelector('summary')!,
      link = cell.querySelector('a')!;

    expect(link.getAttribute('tabindex')).toBe('-1');

    wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{Enter}');

    expect(grid.shadowRoot!.activeElement).toBe(summary);

    await userEvent.tab();

    expect(grid.shadowRoot!.activeElement).toBe(link);

    await userEvent.tab({ shift: true });

    expect(grid.shadowRoot!.activeElement).toBe(summary);
  });

  it('moves focus to the bulk actions toolbar on Tab when a row is selected', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="before" type="button">Before</button>
        <sl-grid keyboard-navigation="arrows" .items=${[{ name: 'Item 1' }]}>
          <sl-grid-selection-column width="40"></sl-grid-selection-column>
          <sl-grid-column path="name" width="140"></sl-grid-column>
        </sl-grid>
        <button id="after" type="button">After</button>
      </div>
    `);

    const grid = wrapper.querySelector('sl-grid')!;
    await waitForGridToRenderData(grid);

    wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown} ');

    await expect.poll(() => grid.dataSource?.selected).toBe(1);

    await userEvent.tab();
    const cancelSelection = grid.shadowRoot!.querySelector('[part="bulk-actions"] sl-button');

    expect(grid.shadowRoot!.activeElement).toBe(cancelSelection);
  });

  it('keeps arrow navigation working while the bulk actions are shown', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="before" type="button">Before</button>
        <sl-grid keyboard-navigation="arrows" .items=${[{ name: 'Item 1' }, { name: 'Item 2' }]}>
          <sl-grid-selection-column width="40"></sl-grid-selection-column>
          <sl-grid-column path="name" width="140"></sl-grid-column>
        </sl-grid>
      </div>
    `);

    const grid = wrapper.querySelector('sl-grid')!;
    await waitForGridToRenderData(grid);

    wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown} ');

    await expect
      .poll(() => grid.shadowRoot!.querySelector('[part="bulk-actions"]')?.matches(':popover-open'))
      .toBe(true);

    await userEvent.keyboard('{ArrowRight}');

    expect(grid.shadowRoot!.activeElement).toBe(grid.tbody.rows[0].cells[1]);

    await userEvent.keyboard('{ArrowDown}');

    expect(grid.shadowRoot!.activeElement).toBe(grid.tbody.rows[1].cells[1]);
  });

  it('names the actions of a group row after the group', async () => {
    const dataSource = new ArrayListDataSource(
      [
        { name: 'Item 1', group: 'Group A' },
        { name: 'Item 2', group: 'Group A' }
      ],
      { groupBy: 'group' }
    );

    const grid = await fixture<Grid>(html`
      <sl-grid keyboard-navigation="arrows" .dataSource=${dataSource}>
        <sl-grid-selection-column width="40"></sl-grid-selection-column>
        <sl-grid-column path="name" width="140"></sl-grid-column>
      </sl-grid>
    `);
    await waitForGridToRenderData(grid);

    const access = grid.tbody.querySelector<Button>('tr[part~="group"] [data-grid-access]')!;
    await access.updateComplete;

    expect(access.button.getAttribute('aria-label')).toBe('Actions for Group A');
  });

  it('saves the edit when focus leaves the cell', async () => {
    const { grid, items } = await mount();

    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}{Enter}{End} changed');
    await userEvent.click(grid.tbody.rows[1].cells[0]);

    expect(items[0].note).toBe('Original changed');
    expect(grid.tbody.querySelector<TextField>('[data-grid-editor]')?.hidden).toBe(true);
  });
});
