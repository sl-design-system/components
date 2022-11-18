import type { TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { getNameByPath, getValueByPath } from './utils.js';

export type GridColumnRenderer<T> = (model: T) => TemplateResult;

export class GridColumn<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  /** The label for the column header. */
  @property() header?: string;

  /** The path to the value for this column. */
  @property() path?: string;

  /** Renderer function for the column value of each cell. */
  @property({ attribute: false }) renderer?: GridColumnRenderer<T>;

  /** Whether this column is sticky when the user scrolls horizontally. */
  @property({ type: Boolean, reflect: true }) sticky?: boolean;

  renderHeaderCell(): TemplateResult {
    return html`<th>${this.header ?? getNameByPath(this.path)}</th>`;
  }

  renderContentCell(item: T): TemplateResult {
    if (this.renderer) {
      return html`<td>${this.renderer(item)}</td>`;
    } else {
      return html`<td>${this.path ? getValueByPath(item, this.path) : 'No path set'}</td>`;
    }
  }
}
