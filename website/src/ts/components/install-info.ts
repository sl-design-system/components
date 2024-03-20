import { LitElement, PropertyValues, type TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ds-install-info')
export class InstallInfo extends LitElement {
  @property() package?: string;
  @property({ attribute: 'link-in-navigation', type: Boolean }) linkInNavigation = false;

  override render(): TemplateResult {
    return html`
      <section>
        <h2>
          ${this.linkInNavigation
            ? html`<a class="header-anchor" href="#installation">Installation</a>`
            : html`Installation`}
        </h2>

        <p>With npm</p>
        <ds-code-snippet language="bash"> npm install @sl-design-system/${this.package}</ds-code-snippet>

        <p>With yarn</p>
        <ds-code-snippet language="bash"> yarn add @sl-design-system/${this.package}</ds-code-snippet>
      </section>
    `;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('linkInNavigation')) {
      if (this.linkInNavigation) {
        this.setAttribute('link-in-navigation-text', 'Installation');
        this.setAttribute('id', 'installation');
      }
    }
  }

  static override styles = css`
    :host {
      display: block;
    }

    h2 {
      font: var(--typography-h2);
      margin-block: var(--typography-h2-margin-block);
    }

    a.header-anchor {
      color: inherit;
      font-size: inherit;
      text-decoration: none;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-install-info': InstallInfo;
  }
}
