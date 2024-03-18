import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type PopoverPosition } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './menu-button.scss.js';
import { Menu } from './menu.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-button': MenuButton;
  }
}

/**
 * Custom element that combines a button and a menu and automatically wires them up
 * together.
 *
 * @slot default - The menu items should be slotted in the default slot.
 * @slot button - Any content for the button should be slotted here.
 */
@localized()
export class MenuButton extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu': Menu
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The state of the menu popover. */
  #popoverState?: string;

  /** The button. */
  @query('sl-button') button!: Button;

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean }) disabled?: boolean;

  /** The fill of the button. */
  @property() fill: ButtonFill = 'outline';

  /** The menu. */
  @query('sl-menu') menu!: Menu;

  /** Returns the string to be used when there is more than 1 item selected. */
  @property({ attribute: false }) pluralize?: (count: number) => string;

  /** The position of the menu relative to the button. */
  @property() position?: PopoverPosition;

  /** The text representing the selected menuitem(s). */
  @state() selected?: string;

  /** Determines whether if and how many menu items can be selected. */
  @property() selects?: 'single' | 'multiple';

  /** The size of the button. */
  @property() size: ButtonSize = 'md';

  /** The variant of the button. */
  @property() variant: ButtonVariant = 'default';

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.menu.anchorElement = this.button;
  }

  override render(): TemplateResult {
    // Check if the button only contains an icon; we have to look in the light DOM for this,
    // since we render our own icon in the shadow DOM.
    const assignedElements = Array.from(this.children).filter(el => el.slot === 'button'),
      iconOnly = assignedElements.length === 1 && assignedElements[0].nodeName === 'SL-ICON';

    return html`
      <sl-button
        @click=${this.#onClick}
        @keydown=${this.#onKeydown}
        .disabled=${this.disabled}
        .fill=${this.fill}
        .size=${this.size}
        .variant=${this.variant}
      >
        <slot name="button"></slot>
        ${this.selects && this.selected ? html`<span class="selected">${this.selected}</span>` : nothing}
        ${iconOnly ? nothing : html`<sl-icon name="angle-down"></sl-icon>`}
      </sl-button>
      <sl-menu
        @click=${this.#onMenuClick}
        @toggle=${this.#onToggle}
        @sl-select=${this.#onSelect}
        .position=${this.position ?? 'bottom-start'}
        .selects=${this.selects}
      >
        <slot @slotchange=${this.#onSlotchange}></slot>
      </sl-menu>
    `;
  }

  #onClick(): void {
    this.menu.togglePopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.#popoverState !== 'open' && event.key === 'ArrowDown') {
      this.menu.showPopover();
      this.menu.focus();
    } else {
      const actualPlacement = this.menu.getAttribute('actual-placement');

      if (actualPlacement?.startsWith('top') && event.key === 'ArrowUp') {
        this.menu.focusLastItem();
      } else if (actualPlacement?.startsWith('bottom') && event.key === 'ArrowDown') {
        this.menu.focus();
      }
    }
  }

  #onMenuClick(): void {
    this.menu.hidePopover();
  }

  #onSelect(): void {
    this.#updateSelected();
    this.menu.hidePopover();
  }

  #onSlotchange(): void {
    this.#updateSelected();
  }

  #onToggle(event: ToggleEvent): void {
    this.#popoverState = event.newState;

    if (event.newState === 'closed') {
      this.button.focus();
    }
  }

  #updateSelected(): void {
    if (this.selects === 'single') {
      this.selected = this.querySelector('sl-menu-item[selected]')?.textContent?.trim();
    } else if (this.selects === 'multiple') {
      const count = this.querySelectorAll('sl-menu-item[selected]').length;

      if (count > 1) {
        this.selected = this.pluralize?.(count) ?? msg(str`${count} selected`);
      } else {
        this.selected = this.querySelector('sl-menu-item[selected]')?.textContent?.trim();
      }
    }
  }
}
