import { LitElement, CSSResultGroup, type TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStatusStyles } from './component-status-style';

export type StatusType = 'planned' | 'draft' | 'preview' | 'new' | 'stable' | 'deprecated';

/**
 * Vertical tabs are getting parentElement as a source of tabs - `sections` with `h2` elements or `link-in-navigation` with `h2` elements.
 *
 * Example:
 *
 * <div>
 *   <section>
 *     <h2>First</h2>
 *     My first content
 *   </section>
 *   <section>
 *     <h2>Second</h2>
 *     My second content
 *   </section>
 *   <ds-vertical-tabs></ds-vertical-tabs>
 * </div>
 * */

@customElement('ds-component-status')
export class ComponentStatus extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = componentStatusStyles;

  @property() componentName = '';

  @property() status: StatusType = 'planned';

  @property() version = '';

  /** Used to render vertical links content - tagElement is a source of links text, H2 is the default */
  @property() tagElement = 'H2';



  get badgeVariant(): string { // TODO: badgeVariant
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
      console.log('status etc.', 'status:', this.status, 'version:', this.version, this.componentName);

    return html`
      <div class="wrapper">
            <div class="component-info">
              <div class="ds-heading-4 info">
                Status
                <sl-badge size="3xl" variant=${this.badgeVariant}>${this.status}</sl-badge>
              </div>
              <div class="ds-heading-4 info">
                Version
                <span class="link">
                  <a href="https://github.com/sl-design-system/components/releases/tag/%40sl-design-system%2F${this.componentName}%40${this.version}" target="_blank">
                      v${this.version}
                  </a>
                  <sl-icon name="far-arrow-up-right-from-square"></sl-icon>
                </span>
              </div>
              <slot></slot>
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
  } // TODO: badge  variant depending on status type
  // TODO: aria-hidden or label to sl-icon?

}

declare global {
  interface HTMLElementTagNameMap {
    'ds-component-status': ComponentStatus;
  }
}
