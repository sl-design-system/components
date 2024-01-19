import type { TemplateResult } from 'lit';
import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { html } from 'lit';
import { GridColumn } from './column.js';

Icon.register(faGripDotsVertical);

export class GridDragHandleColumn extends GridColumn {
  override connectedCallback(): void {
    super.connectedCallback();

    this.grow = 0;
    this.scopedElements = { 'sl-icon': Icon };
  }

  override renderHeader(): TemplateResult {
    return html`<th part="header drag-handle"></th>`;
  }

  override renderData(): TemplateResult {
    return html`
      <td part="data drag-handle">
        <sl-icon name="fas-grip-dots-vertical" class="drag-handle"></sl-icon>
      </td>
    `;
  }
}
