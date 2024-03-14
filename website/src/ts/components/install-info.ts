import { LitElement, type TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ds-install-info')
export class InstallInfo extends LitElement {
  @property() package?: string;

  override render(): TemplateResult {
    return html`
      <section>
        <h2>Installation</h2>

        <p>With npm</p>
        <ds-code-snippet language="bash"> npm install @sl-design-system/${this.package}</ds-code-snippet>

        <p>With yarn</p>
        <ds-code-snippet language="bash"> yarn add @sl-design-system/${this.package}</ds-code-snippet>
      </section>
    `;
  }

  static override styles = css`
    h2 {
      font: var(--typography-h2);
      margin-block: var(--typography-h2-margin-block);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-install-info': InstallInfo;
  }
}
