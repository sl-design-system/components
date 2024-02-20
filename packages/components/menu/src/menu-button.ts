import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { anchor } from '@sl-design-system/shared';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { Menu } from './menu.js';
import styles from './menu-button.scss.js';

Icon.register(faAngleDown);

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
    this.#updateSelected();
  }

  override render(): TemplateResult {
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
        ${this.selects ? html`<span class="selected">${this.selected}</span>` : nothing}
        ${this.hasAttribute('icon-only') ? nothing : html`<sl-icon name="far-angle-down"></sl-icon>`}
      </sl-button>
      <sl-menu
        @toggle=${this.#onToggle}
        @sl-select=${this.#onSelect}
        ${anchor({ position: 'bottom-start' })}
        .selects=${this.selects}
      >
        <slot></slot>
      </sl-menu>
    `;
  }

  #onClick(): void {
    if (this.#popoverState !== 'open') {
      this.menu.showPopover();
      this.menu.focus();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && this.#popoverState !== 'open') {
      this.menu.showPopover();
      this.menu.focus();
    }
  }

  #onSelect(): void {
    this.#updateSelected();
    this.menu.hidePopover();
    this.button.focus();
  }

  #onToggle(event: ToggleEvent): void {
    this.#popoverState = event.newState;
  }

  #updateSelected(): void {
    if (this.selects === 'single') {
      this.selected = this.querySelector('sl-menu-item[selected]')?.textContent?.trim();
    }
  }
}
