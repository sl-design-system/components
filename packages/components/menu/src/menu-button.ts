import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { Menu } from './menu.js';

export class MenuButton extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-menu': Menu
    };
  }

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The fill of the button. */
  @property() fill: ButtonFill = 'solid';

  /** Determines whether if and how many menu items can be selected. */
  @property() selects?: 'single' | 'multiple';

  /** The size of the button. */
  @property() size: ButtonSize = 'md';

  /** The variant of the button. */
  @property() variant: ButtonVariant = 'default';

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
      <sl-menu .selects=${this.selects}>
        <slot></slot>
      </sl-menu>
    `;
  }

  #onClick(event: Event): void {
    console.log('click', event.target);
  }
}
