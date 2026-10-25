import { msg } from '@lit/localize';
import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { getValueByPath } from '@sl-design-system/shared';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-drag-handle-column': GridDragHandleColumn;
  }
}

/**
 * A grid column that can be used to drag and drop rows.
 *
 * If you want drag and drop behavior to be conditional, you can use the `path` property to specify
 * a path to a value in the data item. If the value at that path is truthy, the row will be
 * draggable. If the value is falsy, the row will not be draggable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridDragHandleColumn<T = any> extends GridColumn<T> {
  /** @internal */
  override get baseScopedElements(): Record<string, typeof HTMLElement> {
    return { 'sl-icon': Icon };
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.grow = 0;
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('grid') && this.grid) {
      this.grid.draggableRows ??= 'between';
    }
  }

  override renderHeaderRow(index: number): TemplateResult {
    // Only the first header row gets the stable id and the label; other rows
    // (e.g. when a filter column adds a second header row) are empty placeholders.
    const first = index === 0;

    return html`
      <th
        aria-colindex=${String(this.columnIndex)}
        id=${ifDefined(first ? this.headerCellId : undefined)}
        part="header drag-handle"
        role=${this.headerRole}
        scope=${ifDefined(this.headerScope)}>
        ${
          first
            ? html`
                <span class="visually-hidden">${msg('Reorder', { id: 'sl.grid.reorder' })}</span>
              `
            : nothing
        }
      </th>
    `;
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
        @mousedown=${(event: Event & { target: HTMLElement }) =>
          this.#onStartDrag(event, item.data)}
        @touchstart=${(event: Event & { target: HTMLElement }) =>
          this.#onStartDrag(event, item.data)}
        aria-labelledby=${ifDefined(
          // The cell has no text, so name it by its group header(s) and the "Reorder" header
          this.groupHeaderIds.length > 0
            ? [...this.groupHeaderIds, this.headerCellId].join(' ')
            : undefined
        )}
        headers=${this.headerIds}
        part="data drag-handle ${draggable ? '' : 'fixed'}"
        role="cell">
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
