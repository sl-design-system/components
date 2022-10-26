import type { TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export class GridColumn<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  @property() path?: string;

  render(): TemplateResult {
    return html``;
  }

  renderHeaderCell(): TemplateResult {
    return html`<th>${this.path}</th>`;
  }

  renderContentCell(item: T): TemplateResult {
    return html`<td>${this.path ? item[this.path] : 'No path set'}</td>`;
  }
}
