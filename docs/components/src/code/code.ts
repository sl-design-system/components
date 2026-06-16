import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { CopyButton } from '../copy-button/copy-button.js';
import styles from './code.css' with { type: 'css' };

export class Code extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'doc-copy-button': CopyButton
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The source code to be copied to the clipboard. */
  @state() source?: string;

  override render(): TemplateResult {
    return html`
      <code part="code"><slot @slotchange=${this.#onSlotChange}></slot></code>
      <doc-copy-button .content=${this.source}></doc-copy-button>
    `;
  }

  #onSlotChange(): void {
    this.source = this.textContent?.trim() ?? '';
  }
}
