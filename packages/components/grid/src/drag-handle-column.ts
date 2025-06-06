import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { getValueByPath } from '@sl-design-system/shared';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-drag-handle-column': GridDragHandleColumn;
  }
}

/**
 * A grid column that can be used to drag and drop rows.
 *
 * If you want drag and drop behavior to be conditional, you can use the `path` property to specify a path
 * to a value in the data item. If the value at that path is truthy, the row will be draggable.
 * If the value is falsy, the row will not be draggable.
 */
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

  override renderHeaderRow(): TemplateResult {
    return html`<th part="header drag-handle" role="columnheader"></th>`;
  }

  override renderData(item: ListDataSourceDataItem<T>): TemplateResult {
    let draggable = true;

    if (this.path) {
      draggable = !!getValueByPath(item.data, this.path);
    }

    // FIXME: Once `pointerdown` works properly in WebKit, use that instead
    // of `mousedown` and `touchstart`. See https://bugs.webkit.org/show_bug.cgi?id=267852
    return html`
      <td
        @mousedown=${(event: Event & { target: HTMLElement }) => this.#onStartDrag(event, item.data)}
        @touchstart=${(event: Event & { target: HTMLElement }) => this.#onStartDrag(event, item.data)}
        part="data drag-handle ${draggable ? '' : 'fixed'}"
      >
        ${draggable ? html`<sl-icon name="grip-lines"></sl-icon>` : nothing}
      </td>
    `;
  }

  #onStartDrag(event: Event & { target: HTMLElement }, item: T): void {
    if (!this.path || getValueByPath(item, this.path)) {
      // In order for native drag and drop to work, the row must have the `draggable` attribute.
      event.target.closest('tr')?.setAttribute('draggable', 'true');
    }
  }
}
