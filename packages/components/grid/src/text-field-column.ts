import { msg } from '@lit/localize';
import {
  type ListDataSourceDataItem,
  ListDataSourcePlaceholder
} from '@sl-design-system/data-source';
import { type Path, type PathKeys, getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { TextField } from '@sl-design-system/text-field';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-text-field-column': GridTextFieldColumn;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridTextFieldColumn<T = any> extends GridColumn<T> {
  /** @internal */
  override get baseScopedElements(): Record<string, typeof HTMLElement> {
    return { 'sl-text-field': TextField };
  }

  override renderData(item: ListDataSourceDataItem<T>): TemplateResult {
    const classes = this.getClasses(item.data),
      labelledBy =
        this.groupHeaderIds.length > 0
          ? [...this.groupHeaderIds, this.headerCellId].join(' ')
          : undefined,
      value = getValueByPath(item.data, this.path!);
    if (this.grid?.keyboardNavigation === 'arrows') {
      const unavailable = item.id === ListDataSourcePlaceholder,
        emptyLabel = msg('Edit empty cell', { id: 'sl.grid.editEmptyCell' }),
        label = String(value ?? '').trim() || emptyLabel;
      return html`
        <td
          aria-colindex=${String(this.columnIndex)}
          aria-labelledby=${ifDefined(labelledBy)}
          class=${ifDefined(classes.join(' ') || undefined)}
          data-grid-column=${this.headerCellId}
          headers=${this.headerIds}
          part="data text-field"
          role="gridcell">
          <button
            aria-describedby="grid-edit-instructions"
            aria-disabled=${String(unavailable)}
            aria-label=${label}
            data-grid-edit
            type="button"
            .textContent=${label}></button>
          <input
            @sl-grid-edit-commit=${(event: Event) => {
              const input = event.currentTarget as HTMLInputElement,
                button = input.previousElementSibling as HTMLButtonElement | null,
                nextLabel = input.value.trim() || emptyLabel;
              this.#setValue(item.data, input.value);
              if (button) {
                button.ariaLabel = nextLabel;
                button.textContent = nextLabel;
              }
              this.grid?.requestUpdate();
            }}
            aria-label=${this.getFormControlLabel(item.data)}
            data-grid-editor
            ?disabled=${unavailable}
            hidden
            type="text"
            .value=${String(value ?? '')} />
        </td>
      `;
    }
    return html`
      <td
        aria-colindex=${String(this.columnIndex)}
        aria-labelledby=${ifDefined(labelledBy)}
        class=${ifDefined(classes.join(' ') || undefined)}
        headers=${this.headerIds}
        part="data text-field"
        role="cell">
        <sl-text-field
          @sl-change=${(event: SlChangeEvent<string>) => this.#onChange(event, item.data)}
          aria-label=${this.getFormControlLabel(item.data)}
          .value=${value}></sl-text-field>
      </td>
    `;
  }

  #onChange(event: SlChangeEvent<string>, item: T): void {
    this.#setValue(item, event.detail);
  }

  #setValue(item: T, value: string): void {
    setValueByPath(item, this.path!, value as Path<T, PathKeys<T>>);
  }
}
