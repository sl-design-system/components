import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './ellipsis-text.scss.js';

/**
 * Small utility component to add ellipsis to text that overflows
 * its container. It also adds a tooltip with the full text.
 */
export class EllipsisText extends ScopedElementsMixin(LitElement) {
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

  /** The lazy tooltip. */
  #tooltip?: Tooltip | (() => void);

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    if (this.#tooltip instanceof Tooltip) {
      this.#tooltip.remove();
    } else if (this.#tooltip) {
      this.#tooltip();
    }

    this.#tooltip = undefined;

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  #onResize(): void {
    if (this.offsetWidth < this.scrollWidth) {
      this.#tooltip ||= Tooltip.lazy(
        this,
        tooltip => {
          this.#tooltip = tooltip;
          tooltip.position = 'bottom';
          tooltip.textContent = this.textContent?.trim() || '';
        },
        { context: this.shadowRoot! }
      );
    } else if (this.#tooltip instanceof Tooltip) {
      this.removeAttribute('aria-describedby');

      this.#tooltip.remove();
      this.#tooltip = undefined;
    } else if (this.#tooltip) {
      this.#tooltip();
      this.#tooltip = undefined;
    }
  }
}
