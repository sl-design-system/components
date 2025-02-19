import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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

  /** Whether the tab item is disabled. */
  @property({ type: Boolean }) disabled?: boolean;

  /**
   * When set, it will render the tab contents in a link tag. Use this when you want to render the tab contents using a router and to make the tab navigatable by URL.
   */
  @property() href?: string;

  /** Whether the tab item is selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  /** Emits when the user selects the tab. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<void>>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.slot ||= 'tabs';
  }

  override render(): TemplateResult {
    return this.href && !this.disabled
      ? html`<a aria-selected=${ifDefined(this.selected)} href=${this.href} role="tab">${this.renderContent()}</a>`
      : html`
          <button
            @click=${this.#onClick}
            @keydown=${this.#onKeydown}
            aria-selected=${ifDefined(this.selected)}
            ?disabled=${this.disabled}
            role="tab"
          >
            ${this.renderContent()}
          </button>
        `;
  }

  /** @ignore */
  renderContent(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onIconSlotChange} name="icon" part="icon"></slot>
      <div class="content">
        <span class="title">
          <slot @slotchange=${this.#onSlotChange}></slot>
          <slot name="badge" part="badge"></slot>
        </span>
        <slot @slotchange=${this.#onSubtitleSlotChange} name="subtitle" part="subtitle"></slot>
      </div>
    `;
  }

  #onClick(): void {
    this.selectEvent.emit();
  }

  #onIconSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const hasIcon = event.target.assignedElements({ flatten: true }).length > 0;

    this.toggleAttribute('has-icon', hasIcon);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const hasTitle = event.target.assignedNodes({ flatten: true }).some(node => !!node.textContent?.trim());

    this.toggleAttribute('has-title', hasTitle);
  }

  #onSubtitleSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const hasSubtitle = event.target.assignedNodes({ flatten: true }).some(node => !!node.textContent?.trim());

    this.toggleAttribute('has-subtitle', hasSubtitle);
  }
}
