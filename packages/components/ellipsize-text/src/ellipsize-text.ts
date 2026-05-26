import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './ellipsize-text.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-ellipsize-text': EllipsizeText;
  }
}

/**
 * Small utility component to add ellipsis to text that overflows its container. It also adds a
 * tooltip with the full text.
 */
export class EllipsizeText extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe size changes. */
  #observer = new ResizeObserver(() => this.#onResize());

  /** @internal Whether the tooltip is visible. */
  @state() tooltip?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot id="slot"></slot>
      ${this.tooltip
        ? html`<sl-tooltip for="slot">${this.textContent?.trim()}</sl-tooltip>`
        : nothing}
    `;
  }

  #onResize(): void {
    this.tooltip = this.offsetWidth < this.scrollWidth;
  }
}
