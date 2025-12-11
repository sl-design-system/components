import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { EventsController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './breadcrumb-item.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-breadcrumb-item': BreadcrumbItem;
  }
}

/**
 * A breadcrumb item component - part of the breadcrumbs component.
 *
 * ```html
 *   <sl-breadcrumb-item>
 *     Breadcrumb label
 *   </sl-breadcrumb-item>
 * ```
 *
 * @slot default - The content to display inside the breadcrumb item.
 * @slot icon - Optional icon shown on the left side of the component.
 */
export class BreadcrumbItem extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { click: this.#onClick, keydown: this.#onKeydown });

  /**
   * Observe changes in size, so we can check whether we need to show tooltips
   * for truncated content.
   */
  #observer = new ResizeObserver(() => this.#updateTooltip());

  /** @internal The tooltip instance. */
  #tooltip?: Tooltip | (() => void);

  /** Whether this breadcrumb item represents the current page. */
  @property({ type: Boolean, reflect: true }) current?: boolean;

  /** Whether the breadcrumb item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Whether the breadcrumb item is not visible because it is collapsed. */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'link');
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

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('current')) {
      this.setAttribute('aria-current', this.current ? 'page' : 'false');
    }
    this.setAttribute('role', 'link');
    this.setAttribute('tabindex', this.current ? '-1' : '0');
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onClick(event: Event): void {
    if (this.disabled || this.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.click();
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const hasContent = event.target.assignedNodes({ flatten: true }).some(node => !!node.textContent?.trim());

    this.toggleAttribute('has-content', hasContent);
    this.#updateTooltip();
  }

  #updateTooltip(): void {
    const link = this.renderRoot.querySelector<HTMLAnchorElement | HTMLSpanElement>('[part="outer"]');

    if (!link) {
      return;
    }

    if (link.offsetWidth < link.scrollWidth) {
      this.#tooltip ||= Tooltip.lazy(
        link,
        tooltip => {
          this.#tooltip = tooltip;
          tooltip.position = 'bottom';
          tooltip.textContent = link.textContent?.trim() || '';
        },
        { context: this.shadowRoot! }
      );
    } else if (this.#tooltip instanceof Tooltip) {
      link.removeAttribute('aria-describedby');

      this.#tooltip.remove();
      this.#tooltip = undefined;
    } else if (this.#tooltip) {
      this.#tooltip();
      this.#tooltip = undefined;
    }
  }
}
