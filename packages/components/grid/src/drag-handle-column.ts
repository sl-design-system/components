import type { PropertyValues, TemplateResult } from 'lit';
import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { html } from 'lit';
import { GridColumn } from './column.js';

Icon.register(faGripDotsVertical);

export class GridDragHandleColumn extends GridColumn {
  override connectedCallback(): void {
    super.connectedCallback();

    this.grow = 0;
    this.scopedElements = { ...this.scopedElements, 'sl-icon': Icon };
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('grid') && this.grid) {
      this.grid.draggableRows ??= 'between';
    }
  }

  override renderHeader(): TemplateResult {
    return html`<th part="header drag-handle"></th>`;
  }

  override renderData(): TemplateResult {
    // FIXME: Once `pointerdown` works properly in WebKit, use that instead
    // of `mousedown` and `touchstart`. See https://bugs.webkit.org/show_bug.cgi?id=267852
    return html`
      <td @mousedown=${this.#onStartDrag} @touchstart=${this.#onStartDrag} part="data drag-handle">
        <sl-icon name="fas-grip-dots-vertical" class="drag-handle"></sl-icon>
      </td>
    `;
  }

  #onStartDrag(event: Event & { target: HTMLElement }): void {
    event.target.closest('tr')?.setAttribute('draggable', 'true');
  }
}
