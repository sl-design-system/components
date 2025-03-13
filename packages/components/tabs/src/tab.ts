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
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { click: this.#onClick, keydown: this.#onKeydown });

  /** Whether the tab item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * When set, it will render the tab contents in a link tag. Use this when you
   * want to render the tab contents using a router and to make the tab
   * navigable by URL.
   */
  @property() href?: string;

  /**
   * Indicates if this tab is selected.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'tab');
    this.slot ||= 'tabs';
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes in tab', changes);

    if (changes.has('selected')) {
      this.setAttribute('aria-selected', Boolean(this.selected).toString());
    }
  }

  override render(): TemplateResult {
    return this.href && !this.disabled
      ? html`<a href=${this.href} part="outer" role="presentation" tabindex="-1">${this.renderContent()}</a>`
      : html`<div part="outer">${this.renderContent()}</div>`;
  }

  /** @ignore */
  renderContent(): TemplateResult {
    return html`
      <div part="inner">
        <slot @slotchange=${this.#onIconSlotChange} name="icon" part="icon"></slot>
        <slot @slotchange=${this.#onSlotChange} part="title"></slot>
        <slot name="badge" part="badge"></slot>
        <slot @slotchange=${this.#onSubtitleSlotChange} name="subtitle" part="subtitle"></slot>
      </div>
    `;
  }

  #onIconSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const hasIcon = event.target.assignedElements({ flatten: true }).length > 0;

    this.toggleAttribute('has-icon', hasIcon);
  }

  #onKeydown(event: KeyboardEvent): void {
    console.log('keydown event in tab', event, this.href, this.renderRoot.querySelector('a'));
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    } else if (this.href && ['Enter', ' '].includes(event.key)) {
      this.renderRoot.querySelector('a')?.click();
    }
  } // TODO: check with href...

  #onClick(event: Event): void {
    console.log('onClick event in tab', event, this.href, this.renderRoot.querySelector('a'), event.target);

    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    } else if (this.href) {
      // event.preventDefault();
      // event.stopPropagation();

      // TODO: when sl-tab, not sl-menu-item the click is being triggered twice, maybe add another parameter?
      this.renderRoot.querySelector('a')?.click();
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
