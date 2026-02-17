import { type CSSResultGroup, LitElement, PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './menu-item-group.scss.js';
import { MenuItem } from './menu-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-item-group': MenuItemGroup;
  }
}

/**
 * A group of menu items, use this if you want to group menu items in a menu with
 * other menu items.
 *
 * @slot default - The menu items within a group.
 * @slot header - The header of the group.
 */
export class MenuItemGroup extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The slotted menu items. */
  #menuItems: MenuItem[] = [];

  /** The optional heading for the group. */
  @property() heading?: string;

  /** Determines whether if and how many menu items can be selected within this group. */
  @property() selects?: 'single' | 'multiple';

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'group';
    this.#updateAriaLabel();
  }

  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has('heading')) {
      this.#updateAriaLabel();
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot name="header" @slotchange=${this.#onHeaderSlotchange}
          >${this.heading ? html`<div class="heading" aria-hidden="true">${this.heading}</div>` : nothing}</slot
        >
        <slot @slotchange=${this.#onSlotchange} @sl-select=${this.#onSelect}></slot>
      </div>
    `;
  }

  #updateAriaLabel(): void {
    const slottedHeader = this.querySelector('[slot="header"]');
    const headerText = slottedHeader?.textContent?.trim();

    if (headerText) {
      this.setAttribute('aria-label', headerText);
    } else if (this.heading) {
      this.setAttribute('aria-label', this.heading);
    } else {
      this.removeAttribute('aria-label');
    }
  }

  #onHeaderSlotchange(): void {
    this.#updateAriaLabel();
  }

  #onSelect(event: Event): void {
    if (!this.selects) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.selects === 'single') {
      this.#menuItems.forEach(item => {
        if (item !== event.target) {
          item.selected = false;
        }
      });
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.#menuItems = event.target
      .assignedElements({ flatten: true })
      .filter((element): element is MenuItem => element instanceof MenuItem);
  }
}
