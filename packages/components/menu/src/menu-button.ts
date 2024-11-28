import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type PopoverPosition } from '@sl-design-system/shared';
import { ObserveAttributesMixin } from '@sl-design-system/shared/mixins.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './menu-button.scss.js';
import { MenuItem } from './menu-item.js';
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
 * @csspart button - The button element.
 *
 * @slot default - The menu items should be slotted in the default slot.
 * @slot button - Any content for the button should be slotted here.
 */
@localized()
export class MenuButton extends ObserveAttributesMixin(ScopedElementsMixin(LitElement), [
  'aria-disabled',
  'aria-label'
]) {
  /** @internal */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-disabled', 'aria-label'];
  }

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu': Menu
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The state of the menu popover. */
  #popoverState?: string;

  /** @internal The button. */
  @query('sl-button') button!: Button;

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean }) disabled?: boolean;

  /** The fill of the button. */
  @property() fill: ButtonFill = 'outline';

  /** @internal The menu. */
  @query('sl-menu') menu!: Menu;

  /** The position of the menu relative to the button. */
  @property() position?: PopoverPosition;

  /** The size of the button. */
  @property() size: ButtonSize = 'md';

  /** The variant of the button. */
  @property() variant: ButtonVariant = 'default';

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setAttributesTarget(this.button);

    this.button.setAttribute('aria-details', this.menu.id);
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
        ?disabled=${this.disabled}
        aria-expanded="false"
        fill=${ifDefined(this.fill)}
        part="button"
        size=${ifDefined(this.size)}
        variant=${ifDefined(this.variant)}
      >
        <slot name="button"></slot>
        ${iconOnly ? nothing : html`<sl-icon name="angle-down"></sl-icon>`}
      </sl-button>
      <sl-menu
        @click=${this.#onMenuClick}
        @toggle=${this.#onToggle}
        @sl-select=${this.#onSelect}
        .position=${this.position ?? 'bottom-start'}
        part="listbox"
      >
        <slot></slot>
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

  #onMenuClick(event: Event & { target: HTMLElement }): void {
    // Only hide the menu if the user clicked on a menu item
    if (event.composedPath().find(el => el instanceof MenuItem)) {
      this.menu.hidePopover();
    }
  }

  #onSelect(): void {
    this.menu.hidePopover();
  }

  #onToggle(event: ToggleEvent): void {
    this.#popoverState = event.newState;

    if (event.newState === 'closed' && this.menu.matches(':focus-within')) {
      this.button.focus();
    }
  }
}
