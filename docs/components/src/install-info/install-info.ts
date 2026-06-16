import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './install-info.css' with { type: 'css' };

export class InstallInfo extends LitElement {
  /** @internal */
  static styles: CSSResultGroup = styles;

  /** The package name (without the @sl-design-system/ prefix). */
  @property() package?: string;

  override render(): TemplateResult {
    const command = `npm install @sl-design-system/${this.package}`;

    return html`
      <div class="panel">
        <code
          ><span class="command">npm install</span> <span class="scope">@sl-design-system/</span
          ><span class="package">${this.package}</span></code
        >
        <button class="copy" type="button" aria-label="Copy ${command}" @click=${() => this.#copy(command)}>
          Copy
        </button>
      </div>
    `;
  }

  async #copy(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  }
}
