import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
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
  static override styles: CSSResultGroup = styles;

  /** Whether this breadcrumb item represents the current page. */
  @property({ type: Boolean, reflect: true }) current?: boolean;

  /** Whether the breadcrumb item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('current')) {
      this.setAttribute('aria-current', this.current ? 'page' : 'false');
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const hasContent = event.target.assignedNodes({ flatten: true }).some(node => !!node.textContent?.trim());

    this.toggleAttribute('has-content', hasContent);
  }
}
