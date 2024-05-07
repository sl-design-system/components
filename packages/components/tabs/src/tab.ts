import { EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tab.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tab': Tab;
  }
}

/**
 * A tab component - part of the tab group component.
 *
 * ```html
 *   <sl-tab>
 *     <sl-icon slot="icon" name="star" size="md"></sl-icon>
 *     Tab label
 *     <span slot="subtitle">Tab subtitle</span>
 *     <sl-badge slot="badge" size="lg" variant="danger">4</sl-badge>
 *   </sl-tab>
 * ```
 *
 * @slot default - A place for the tab group content.
 * @slot icon - Icon shown on the left side of the component.
 * @slot badge - A place for badge component.
 * @slot subtitle - Subtitle of the tab, containing additional information.
 */
export class Tab extends LitElement {
  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Event controller. */
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /** Whether the tab item is disabled. */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /**
   * When set, it will render the tab contents in a link tag. Use this when you want to render the tab contents using a router and to make the tab navigatable by URL.
   */
  @property() href?: string;

  /** Whether the tab item is selected. */
  @property({ reflect: true, type: Boolean }) selected?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'tab');
    this.slot ||= 'tabs';
  }

  override render(): TemplateResult {
    return this.href
      ? html`<a href=${this.href}>${this.renderContent()}</a>`
      : html`<div .tabIndex=${this.selected ? 0 : -1} class="wrapper">${this.renderContent()}</div>`;
  }

  /** @ignore */
  renderContent(): TemplateResult {
    return html`
      <slot name="icon" part="icon"></slot>
      <div class="content">
        <span class="title">
          <slot></slot>
          <slot name="badge" part="badge"></slot>
        </span>
        <slot @slotchange=${this.#onSlotchange} name="subtitle" part="subtitle"></slot>
      </div>
    `;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('selected')) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (!this.href || this.disabled) {
      return;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      // Enter automatically triggers a click event, but space does not
      this.renderRoot.querySelector<HTMLElement>('a[href]')?.click();
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const nodes = event.target.assignedNodes({ flatten: true }),
      hasSubtitle = nodes.some(node => !!node.textContent?.trim());

    this.toggleAttribute('has-subtitle', hasSubtitle);
  }
}
