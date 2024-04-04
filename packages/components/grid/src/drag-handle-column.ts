import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { getValueByPath } from '@sl-design-system/shared';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-drag-handle-column': GridDragHandleColumn;
  }
}

Icon.register(faGripDotsVertical);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridDragHandleColumn<T = any> extends GridColumn<T> {
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

  override renderData(item: T): TemplateResult {
    let draggable = true;

    if (this.path) {
      draggable = !!getValueByPath(item, this.path);
    }

    // FIXME: Once `pointerdown` works properly in WebKit, use that instead
    // of `mousedown` and `touchstart`. See https://bugs.webkit.org/show_bug.cgi?id=267852
    return html`
      <td
        @mousedown=${this.#onStartDrag}
        @touchstart=${this.#onStartDrag}
        part="data drag-handle ${draggable ? '' : 'fixed'}"
      >
        ${draggable ? html`<sl-icon name="fas-grip-dots-vertical"></sl-icon>` : nothing}
      </td>
    `;
  }

  #onStartDrag(event: Event & { target: HTMLElement }): void {
    event.target.closest('tr')?.setAttribute('draggable', 'true');
  }
}
