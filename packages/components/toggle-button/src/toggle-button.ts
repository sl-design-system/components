import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './toggle-button.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-toggle-button': ToggleButton;
  }
}

export type ToggleButtonSize = 'sm' | 'md' | 'lg';
export type ToggleButtonFill = 'ghost' | 'outline';

/**
 * Let the user toggle between two states.
 *
 * ```html
 *  <sl-toggle-button>
 *    <sl-icon name="far-gear"></sl-icon>
      <sl-icon name="fas-gear" slot="pressed"></sl-icon>
    </sl-toggle-button>
 * ```
 *
 * @slot default - The icon shown in the default state of the button
 * @slot pressed - The icon shown in the pressed state of the button
 */
export class ToggleButton extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** @internal The default (non-pressed) icon. */
  @state() defaultIcon?: Icon;

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The variant of the toggle-button. */
  @property({ reflect: true }) fill?: ToggleButtonFill;

  /** @internal True when the user has slotted text in the  */
  @state() hasText?: boolean;

  /** The pressed state of the button. */
  @property({ type: Boolean, reflect: true }) pressed?: boolean;

  /** @internal The pressed icon. */
  @state() pressedIcon?: Icon;

  /** The size of the button. */
  @property({ reflect: true }) size?: ToggleButtonSize;

  /** @internal Emits when the button has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'button');

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('pressed')) {
      this.setAttribute('aria-pressed', (this.pressed ?? false).toString());
    }

    if (changes.has('defaultIcon') || changes.has('hasText') || changes.has('pressedIcon')) {
      this.toggleAttribute('icon-only', !this.hasText && !!this.defaultIcon && !!this.pressedIcon);
      this.toggleAttribute('text-only', this.hasText && !this.defaultIcon && !this.pressedIcon);
    }

    if (changes.has('defaultIcon') || changes.has('pressedIcon') || changes.has('size')) {
      [this.defaultIcon, this.pressedIcon].filter(Boolean).forEach(icon => {
        if (this.size) {
          icon!.size = this.size;
        }
      });
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot @slotchange=${this.#onIconSlotChange} name="default"></slot>
        <slot @slotchange=${this.#onIconSlotChange} name="pressed">
          <sl-icon name="check-solid"></sl-icon>
        </slot>
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    this.pressed = !this.pressed;
    this.toggleEvent.emit(this.pressed);
  }

  #onIconSlotChange(event: Event & { target: HTMLSlotElement }): void {
    if (event.target.matches('[name="default"]')) {
      this.defaultIcon = event.target
        .assignedElements({ flatten: true })
        .find((element): element is Icon => element instanceof Icon);
    } else {
      this.pressedIcon = event.target
        .assignedElements({ flatten: true })
        .find((element): element is Icon => element instanceof Icon);
    }

    if (this.parentElement?.tagName !== 'SL-TOGGLE-GROUP' && location.hostname === 'localhost') {
      this.removeAttribute('error');

      if (!this.pressedIcon) {
        console.error('There needs to be an sl-icon in the "pressed" slot for the component to work');
        this.setAttribute('error', '');
      } else if (this.defaultIcon && this.pressedIcon.name === this.defaultIcon.name) {
        console.error('Do not use the same icon for both states of the toggle button.');
        this.setAttribute('error', '');
      }
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.hasText = !!event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.textContent && node.textContent.trim().length > 0).length;
  }
}
