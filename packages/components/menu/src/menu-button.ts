import { localized } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import {
  Button,
  type ButtonFill,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant
} from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  EventsController,
  type PopoverPosition,
  event
} from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { isForwardedDisabled } from '@sl-design-system/shared/helpers/forward-aria.js';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
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
 * Custom element that combines a button and a menu and automatically wires them up together.
 *
 * @csspart button - The button element.
 *
 * @slot default - The menu items should be slotted in the default slot.
 * @slot button - Any content for the button should be slotted here.
 */
@localized()
export class MenuButton extends ForwardAriaMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu': Menu
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: {
      handler: this.#onHostClick,
      options: { capture: true }
    },
    keydown: {
      handler: this.#onHostKeydown,
      options: { capture: true }
    }
  });

  /**
   * Flag indicating whether the popover was just closed. We need to know this so we can properly
   * handle button clicks that close the popover. If the popover was just closed, we don't want to
   * show it again when the button click event fires.
   */
  #popoverJustClosed = false;

  /** @internal The button. */
  @query('sl-button') button!: Button;

  /** @internal Emits when the menu opens or closes. The event detail is `true` when open and `false` when closed. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;
  /**
   * Whether the button is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean }) disabled?: boolean;

  /**
   * The fill of the button.
   *
   * @default 'outline'
   */
  @property() fill: ButtonFill = 'outline';

  /** @internal The menu. */
  @query('sl-menu') menu!: Menu;

  /**
   * The position of the menu relative to the button.
   *
   * @default 'bottom-start'
   */
  @property() position?: PopoverPosition;

  /**
   * The shape of the button.
   *
   * @default 'square'
   */
  @property() shape?: ButtonShape;

  /**
   * The size of the button.
   *
   * @default 'md'
   */
  @property() size?: ButtonSize;

  /** The tooltip text for the button invoking the menu. */
  @property() tooltip?: string;

  /**
   * The variant of the button.
   *
   * @default 'secondary'
   */
  @property() variant?: ButtonVariant;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setProxyTarget(this.button);

    this.button.setAttribute('aria-controls', this.menu.id);
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
        @pointerdown=${this.#onPointerDown}
        ?disabled=${this.disabled}
        aria-expanded="false"
        aria-haspopup="menu"
        exportparts="button:internal-button, tooltip"
        fill=${ifDefined(this.fill)}
        part="button"
        shape=${ifDefined(this.shape)}
        size=${ifDefined(this.size)}
        tooltip=${ifDefined(this.tooltip)}
        variant=${ifDefined(this.variant)}>
        <slot name="button"></slot>
        ${iconOnly ? nothing : html`<sl-icon name="angle-down"></sl-icon>`}
      </sl-button>
      <sl-menu
        @beforetoggle=${this.#onBeforeToggle}
        @click=${this.#onMenuClick}
        @keydown=${this.#onKeydownMenu}
        @sl-select=${this.#onSelect}
        @toggle=${this.#onToggle}
        .position=${this.position ?? 'bottom-start'}
        part="menu">
        <slot></slot>
      </sl-menu>
    `;
  }

  #onBeforeToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = true;
    }
  }

  #onClick(): void {
    if (this.#isDisabled() || this.#popoverJustClosed) {
      return;
    }

    this.menu.togglePopover();

    if (this.menu.matches(':popover-open')) {
      this.menu.focus();
    }
  }

  #onHostClick(event: Event): void {
    if (this.#isDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  #onHostKeydown(event: KeyboardEvent): void {
    if (this.#isDisabled() && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.#isDisabled()) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return;
    }

    if (event.key === 'Escape') {
      // Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the menu
      // does not close parent containers (such as dialogs).
      event.stopPropagation();
    } else if (event.key === 'ArrowDown' && !this.menu.matches(':popover-open')) {
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

  #onKeydownMenu(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the menu
      // does not close parent containers (such as dialogs).
      event.stopPropagation();
    }
  }

  #onMenuClick(event: Event): void {
    const menuItem = event.composedPath().find(el => el instanceof MenuItem);

    // Only hide the menu if the user clicked on a menu item
    if (menuItem) {
      const focusVisible = menuItem.matches(':focus-visible');

      // Pass the source, so we know if we need to focus the button in #onToggle
      this.menu.togglePopover({ source: menuItem });

      // Focus the button again after clicking a menu item
      this.button.focus({ focusVisible });
    }
  }

  #onPointerDown(event: PointerEvent): void {
    if (this.menu.matches(':popover-open')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  #onSelect(): void {
    this.menu.hidePopover();
  }

  #onToggle(event: ToggleEvent): void {
    this.toggleEvent.emit(event.newState === 'open');

    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;

      // Only focus the button again if there is no source, aka Escape was pressed
      if (!event.source && this.menu.matches(':focus-within')) {
        this.button.focus();
      }
    }
  }

  #isDisabled(): boolean {
    return this.disabled || !!isForwardedDisabled(this.button);
  }
}
