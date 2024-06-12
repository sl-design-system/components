import { BadgeSize } from '@sl-design-system/badge';
import { LitElement, type TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** status `new` should be used only in the navigation. */
export type StatusType = 'planned' | 'draft' | 'preview' | 'new' | 'stable' | 'deprecated';

@customElement('ds-status')
export class Status extends LitElement {
  @property() status: StatusType = 'planned';

  @property() size: BadgeSize = 'lg';

  @property() version = '';

  get badgeVariant(): string {
    switch (this.status) {
      case 'planned':
        return 'primary';
      case 'draft':
        return 'neutral';
      case 'preview':
        return 'info';
      case 'stable':
        return 'success';
      case 'deprecated':
        return 'danger';
      default:
        return 'primary';
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-badge size=${this.size} variant=${this.badgeVariant}>${this.status ? this.status : 'planned'}</sl-badge>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-status': Status;
  }
}
