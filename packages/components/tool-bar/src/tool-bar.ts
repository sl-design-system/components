import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tool-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}

export class ToolBar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** If true, the tool-bar is disabled and cannot be interacted with. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'toolbar');
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    const elements = event.target.assignedElements({ flatten: true });

    console.log(elements);
  }
}
