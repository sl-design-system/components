import type { TemplateResult } from 'lit';
import { humanize } from '@sanomalearning/slds-core/utils/string.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

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

  override render(): TemplateResult {
    return html``;
  }

  renderHeaderCell(): TemplateResult {
    let label = this.header;

    if (!label && this.path) {
      label = humanize(this.path);
    } else if (!label) {
      label = 'No path set';
    }

    return html`<th>${label}</th>`;
  }

  renderContentCell(item: T): TemplateResult {
    if (this.renderer) {
      return html`<td>${this.renderer(item)}</td>`;
    } else {
      return html`<td>${this.path ? item[this.path] : 'No path set'}</td>`;
    }
  }
}
