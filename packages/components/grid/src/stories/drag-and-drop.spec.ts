import { type Person } from '@sl-design-system/example-data';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { describe, expect, it } from 'vitest';
import { type Grid } from '../grid.js';
import { waitForGridToRenderData } from '../utils.js';
import { OnTop } from './drag-and-drop.stories.js';

describe('Grid/Drag and drop/On Top', () => {
  for (const [sourceIndex, targetIndex, expectedOrder] of [
    [0, 1, ['Bob', 'Alice', 'Carol']],
    [2, 0, ['Alice', 'Carol', 'Bob']],
    [0, 2, ['Alice', 'Bob', 'Carol']]
  ] as const) {
    it(`should ${targetIndex !== 2 ? `move row ${sourceIndex} after an allowed` : 'ignore a Regular'} target`, async () => {
      const people = [
        { firstName: 'Alice', membership: 'Premium' },
        { firstName: 'Bob', membership: 'Premium' },
        { firstName: 'Carol', membership: 'Regular' }
      ] as Person[];
      const context = { loaded: { people } } as Parameters<NonNullable<typeof OnTop.render>>[1];
      const content = await fixture<HTMLElement>(OnTop.render!({}, context));
      const el = content.parentElement!.querySelector<Grid<Person>>('sl-grid')!;
      await waitForGridToRenderData(el);

      const rows = el.renderRoot.querySelectorAll('tbody tr');
      const transfer = new DataTransfer();
      const dispatch = (row: Element, type: string) =>
        row.dispatchEvent(
          new DragEvent(type, {
            bubbles: true,
            composed: true,
            cancelable: true,
            dataTransfer: transfer
          })
        );

      rows[sourceIndex]
        .querySelector('[part~="drag-handle"]')!
        .dispatchEvent(
          new MouseEvent('mousedown', { bubbles: true, composed: true, cancelable: true })
        );
      dispatch(rows[sourceIndex], 'dragstart');
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      dispatch(rows[targetIndex], 'dragover');
      expect(rows[targetIndex].classList.contains('drop-target')).to.equal(targetIndex !== 2);
      dispatch(rows[targetIndex], 'drop');
      dispatch(rows[sourceIndex], 'dragend');

      await expect
        .poll(() =>
          Array.from(el.renderRoot.querySelectorAll('tbody tr'), row =>
            row.querySelector('td:nth-child(2)')?.textContent?.trim()
          )
        )
        .to.deep.equal(expectedOrder);
    });
  }
});
