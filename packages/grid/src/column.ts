import type { TemplateResult } from 'lit';
import { humanize } from '@sanomalearning/slds-core/utils/string.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export class GridColumn<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  @property() header?: string;

  @property() path?: string;

  render(): TemplateResult {
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
    return html`<td>${this.path ? item[this.path] : 'No path set'}</td>`;
  }
}
