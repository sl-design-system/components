import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CopyButton } from '../copy-button/copy-button.js';
import styles from './heading.css' with { type: 'css' };

export class Heading extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'doc-copy-button': CopyButton
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The heading level to render (2 or 3). */
  @property({ type: Number }) level: 2 | 3 = 2;

  /** @internal The URL to be copied to the clipboard. */
  @state() url?: string;

  override render(): TemplateResult {
    return html`
      ${this.level === 2
        ? html`<h2><slot @slotchange=${this.#onSlotChange}></slot></h2>`
        : html`<h3><slot @slotchange=${this.#onSlotChange}></slot></h3>`}
      <doc-copy-button .content=${this.url}></doc-copy-button>
    `;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const anchor = event.target
      .assignedElements({ flatten: true })
      .find((el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement && el.hasAttribute('href'));

    if (anchor?.href) {
      this.url = anchor.href;
    }
  }
}
