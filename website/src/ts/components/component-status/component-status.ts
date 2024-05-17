import {LitElement, CSSResultGroup, type TemplateResult, html, nothing} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStatusStyles } from './component-status-style';

/** status `new` should be used only in the navigation. */
export type StatusType = 'planned' | 'draft' | 'preview' | 'new' | 'stable' | 'deprecated';

@customElement('ds-component-status')
export class ComponentStatus extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = componentStatusStyles;

  @property() componentName = '';

  @property() status: StatusType = 'planned';

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
      <div class="wrapper">
            <div class="component-info">
              <div class="ds-heading-4 info">
                Status
                <ds-status status=${this.status}></ds-status>
              </div>
              ${this.version ? html`
                  <div class="ds-heading-4 info">
                    Version
                    <span class="link">
                  <a href="https://github.com/sl-design-system/components/releases/tag/%40sl-design-system%2F${this.componentName}%40${this.version}" target="_blank">
                      v${this.version}
                  </a>
                  <sl-icon name="far-arrow-up-right-from-square"></sl-icon>
                </span>
                  </div>`
                : nothing}
            </div>
            <div class="links">
              <sl-button-bar>
                <a class="ds-button" href="https://github.com/sl-design-system/components/blob/main/packages/components/${this.componentName}/CHANGELOG.md" target="_blank">
                  <sl-icon name="github"></sl-icon>
                  View changelog
                </a>
                <a class="ds-button" href="https://github.com/sl-design-system/components/tree/main/packages/components/${this.componentName}" target="_blank">
                  <sl-icon name="github"></sl-icon>
                  View code
                </a>
                <a class="ds-button" href="https://storybook.sanomalearning.design/?path=/story/components-${this.componentName}" target="_blank">
                  <sl-icon name="storybook"></sl-icon>
                  View Storybook
                </a>
              </sl-button-bar>
            </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-component-status': ComponentStatus;
  }
}
