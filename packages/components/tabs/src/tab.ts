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
 * @slot default - a place for the tab group content.
 * @slot icon - icon shown on the left side of the component.
 * @slot badge - a place for badge component.
 * @slot subtitle - subtitle of the tab, containing additional information
 */
export class Tab extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether the tab item is disabled */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /**
   * When set, it will render the tab contents in a link tag. Use this when
   * you want to render the tab contents using a router and to make the tab
   * navigatable by URL.
   */
  @property() href?: string;

  /** Whether the tab item is selected */
  @property({ reflect: true, type: Boolean }) selected?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'tab');
    this.slot ||= 'tabs';
  }

  override render(): TemplateResult {
    return this.href
      ? html`<a href=${this.href}>${this.renderContent()}</a>`
      : html`<div class="wrapper">${this.renderContent()}</div>`;
  } // @click="#onClick"

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

    console.log(
      'changes in updated in tab',
      changes,
      this.renderRoot,
      this.renderRoot.querySelector('[href]'),
      this.selected
    );

    if (changes.has('selected')) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
      /*      if (
        this.renderRoot.querySelector('[href]') &&
        this.selected &&
        this.getAttribute('aria-selected') === 'true' &&
        this.href
      ) {
        console.log(
          'changes in updated in tab --- in selected',
          this.renderRoot.querySelector('[href]'),
          (this.renderRoot.querySelector('[href]') as HTMLAnchorElement).hash,
          changes['selected'],
          this.selected,
          this.renderRoot.querySelector('[href]') instanceof HTMLAnchorElement
        );
        // (this.renderRoot.querySelector('[href]') as HTMLAnchorElement).click();
      }*/
      // this.#onClick(this);

      // if (this.renderRoot.querySelector('a')) {
      //   this.renderRoot.querySelector('a').click(); // TODO: trigger href change
      // }
    }
  }

  // #onClick(event: Event): void {
  //   console.log('event', event);
  // }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const nodes = event.target.assignedNodes({ flatten: true }),
      hasSubtitle = nodes.some(node => !!node.textContent?.trim());

    this.toggleAttribute('has-subtitle', hasSubtitle);
  }
}
