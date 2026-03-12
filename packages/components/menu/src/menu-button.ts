import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import {
  Button,
  type ButtonFill,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant
} from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { EventsController, ObserveAttributesMixin, type PopoverPosition } from '@sl-design-system/shared';
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
export class MenuButton extends ObserveAttributesMixin(ScopedElementsMixin(LitElement), ['aria-label']) {
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

  /** Observe changes to aria-describedby, aria-labelledby and aria-disabled attributes. */
  #observer = new MutationObserver(() => {
    this.#updateAriaReferences();
    this.#delegateAriaDisabled();
    this.requestUpdate();
  });

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

  /** The state of the menu popover. */
  #popoverState?: string;

  /** @internal The button. */
  @query('sl-button') button!: Button;

  /**
   * Whether the button is disabled; when set no interaction is possible.
   * @default false
   */
  @property({ type: Boolean }) disabled?: boolean;

  /**
   * The fill of the button.
   * @default 'outline'
   */
  @property() fill: ButtonFill = 'outline';

  /** @internal The menu. */
  @query('sl-menu') menu!: Menu;

  /**
   * The position of the menu relative to the button.
   * @default 'bottom-start'
   */
  @property() position?: PopoverPosition;

  /**
   * The shape of the button.
   * @default 'square'
   */
  @property() shape?: ButtonShape;

  /**
   * The size of the button.
   * @default 'md'
   */
  @property() size?: ButtonSize;

  /** Flag to prevent recursion during aria-disabled delegation. */
  #isDelegating = false;

  /** The aria-disabled state of the button. */
  #ariaDisabled: string | null = null;

  /**
   * The aria-disabled state of the button.
   * @default null
   */
  override get ariaDisabled(): string | null {
    return this.#ariaDisabled;
  }

  override set ariaDisabled(value: string | null) {
    this.#ariaDisabled = value;

    if (this.button) {
      this.button.ariaDisabled = this.disabled ? 'true' : value;
    } else if (value !== null) {
      this.setAttribute('aria-disabled', value);
    } else if (this.hasAttribute('aria-disabled')) {
      this.removeAttribute('aria-disabled');
    }
  }

  /**
   * The variant of the button.
   * @default 'secondary'
   */
  @property() variant?: ButtonVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this, {
      attributes: true,
      attributeFilter: ['aria-describedby', 'aria-labelledby', 'aria-disabled']
    });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.button.ariaDisabled = this.disabled ? 'true' : this.ariaDisabled;
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setAttributesTarget(this.button);

    this.button.setAttribute('aria-controls', this.menu.id);
    this.menu.anchorElement = this.button;

    requestAnimationFrame(() => {
      this.#updateAriaReferences();
      this.#delegateAriaDisabled();
    });
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
        aria-expanded="false"
        aria-haspopup="menu"
        fill=${ifDefined(this.fill)}
        part="button"
        shape=${ifDefined(this.shape)}
        size=${ifDefined(this.size)}
        variant=${ifDefined(this.variant)}
      >
        <slot name="button"></slot>
        ${iconOnly ? nothing : html`<sl-icon name="angle-down"></sl-icon>`}
      </sl-button>
      <sl-menu
        @click=${this.#onMenuClick}
        @keydown=${this.#onKeydownMenu}
        @toggle=${this.#onToggle}
        @sl-select=${this.#onSelect}
        .position=${this.position ?? 'bottom-start'}
        part="menu"
      >
        <slot></slot>
      </sl-menu>
    `;
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

  #onClick(): void {
    if (this.#isDisabled()) {
      return;
    }

    this.menu.togglePopover();
  }

  #isDisabled(): boolean {
    if (this.disabled) {
      return true;
    }

    const hostAriaDisabled = this.ariaDisabled ?? this.getAttribute('aria-disabled'),
      ariaDisabled = hostAriaDisabled ?? this.button?.ariaDisabled ?? null;
    return ariaDisabled !== null && ariaDisabled !== 'false';
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
    } else if (this.#popoverState !== 'open' && event.key === 'ArrowDown') {
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
    } else if (event.newState === 'open' && this.button.matches(':focus-within')) {
      // If the menu is opening and the button is focused, move focus to the menu
      this.menu.focus();
    }
  }

  /**
   * Update aria-describedby and aria-labelledby references on the button.
   * Sets Element.ariaDescribedByElements and Element.ariaLabelledByElements properties
   * to work across shadow DOM boundaries (e.g. with tooltips).
   */
  #updateAriaReferences(): void {
    if (!this.button) {
      return;
    }

    // Temporarily stop observing so removing attributes from the host doesn't retrigger this method
    this.#observer.disconnect();

    if (this.hasAttribute('aria-describedby')) {
      this.#setAriaReference('aria-describedby', 'ariaDescribedByElements');
    } else {
      this.button.ariaDescribedByElements = null;
      this.button.removeAttribute('aria-describedby');
    }

    if (this.hasAttribute('aria-labelledby')) {
      this.#setAriaReference('aria-labelledby', 'ariaLabelledByElements');
    } else {
      this.button.ariaLabelledByElements = null;
      this.button.removeAttribute('aria-labelledby');
    }

    this.#observer.observe(this, {
      attributes: true,
      attributeFilter: ['aria-describedby', 'aria-labelledby', 'aria-disabled']
    });
  }

  /** Delegate the aria-disabled attribute to the internal button and remove it from the host. */
  #delegateAriaDisabled(): void {
    if (this.#isDelegating || !this.button) {
      return;
    }

    const value = this.getAttribute('aria-disabled');
    if (value !== null) {
      // Normalize presence-only / empty-string to 'true' to reflect a "true" aria-disabled state
      const normalizedValue = value === '' ? 'true' : value;

      this.#isDelegating = true;
      this.button.ariaDisabled = normalizedValue;
      // Keep the component's ariaDisabled property in sync with the delegated value
      this.ariaDisabled = normalizedValue;
      this.removeAttribute('aria-disabled');
      this.#isDelegating = false;
    }
  }

  /** Set an aria reference on the button using Element properties. */
  #setAriaReference(attribute: string, property: 'ariaDescribedByElements' | 'ariaLabelledByElements'): void {
    const ariaValue = this.getAttribute(attribute);

    // Clear if attribute was removed or if the attribute only contained whitespace
    if (!ariaValue || !ariaValue.trim()) {
      this.button[property] = null;
      this.button.removeAttribute(attribute);
      this.removeAttribute(attribute);
      return;
    }

    // Query elements from the root node (to find elements outside shadow DOM)
    const elements = ariaValue
      .trim()
      .split(/\s+/)
      .map(id => (this.getRootNode() as ParentNode).querySelector(`#${id}`))
      .filter((el): el is Element => el !== null);

    if (elements.length === 0) {
      this.button[property] = null;
      this.button.removeAttribute(attribute);
    } else {
      // Set the Element property: ariaLabelledByElements/ariaDescribedByElements to get it working with shadow DOM boundary.
      // Setting this property adds empty aria-labelledby/aria-describedby to the element,
      // If we removed it by setting aria-labelledby/aria-describedby with ids, it would break the connection for the assistive technologies.
      // See: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes#setting_the_property_and_attribute
      this.button[property] = elements;
    }

    this.removeAttribute(attribute);
  }
}
