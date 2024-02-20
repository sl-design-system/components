import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { anchor } from '@sl-design-system/shared';
import { LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Menu } from './menu.js';

export class MenuButton extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-menu': Menu
    };
  }

  /** The state of the menu popover. */
  #popoverState?: string;

  /** The button. */
  @query('sl-button') button!: Button;

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean }) disabled?: boolean;

  /** The fill of the button. */
  @property() fill: ButtonFill = 'solid';

  /** The menu. */
  @query('sl-menu') menu!: Menu;

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
    return html`
      <sl-button
        @click=${this.#onClick}
        .disabled=${this.disabled}
        .fill=${this.fill}
        .size=${this.size}
        .variant=${this.variant}
      >
        <slot name="button"></slot>
      </sl-button>
      <sl-menu @toggle=${this.#onToggle} ${anchor({ position: 'bottom-start' })} .selects=${this.selects}>
        <slot></slot>
      </sl-menu>
    `;
  }

  #onClick(): void {
    if (this.#popoverState !== 'open') {
      this.menu.showPopover();
    }
  }

  #onToggle(event: ToggleEvent): void {
    this.#popoverState = event.newState;
  }
}
