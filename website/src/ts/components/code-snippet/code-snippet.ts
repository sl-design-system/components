import { CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { customElement, property, queryAssignedNodes } from 'lit/decorators.js';
import { codeSnippetStyles } from './code-snippet-style';

@customElement('ds-code-snippet')
export class CodeSnippet extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = codeSnippetStyles;

  @property() language?: string;

  /** @private The slotted code. */
  @queryAssignedNodes({ flatten: true }) code?: Node[];

  override render(): TemplateResult {
    return html`
      <pre class="language-${this.language}"><code class="language-${this.language}"><slot></slot></code></pre>
      <sl-button size="md" fill="outline" icon-only @click=${this.#copyCode} aria-label="Copy the code">
        <sl-icon name="far-copy"></sl-icon>
      </sl-button>
    `;
  }

  async #copyCode(): Promise<void> {
    if (!this.code) {
      return;
    }

    await navigator.clipboard.writeText(this.code?.map(node => node.nodeValue).join(''));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-code-snippet': CodeSnippet;
  }
}
