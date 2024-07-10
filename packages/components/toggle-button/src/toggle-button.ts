import { type Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
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
export class ToggleButton extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** @internal The slotted default icon. */
  @queryAssignedElements() defaultIcon?: Icon[];

  /** @internal The slotted pressed state icon. */
  @queryAssignedElements({ slot: 'pressed' }) pressedIcon?: Icon[];

  /** @internal Emits when the button item has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  /** Whether the toggle-button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The variant of the toggle-button. */
  @property({ reflect: true }) fill: ToggleButtonFill = 'ghost';

  /** The state of the toggle-button. */
  @property({ type: Boolean, reflect: true }) pressed = false;

  /** The size of the toggle-button component. */
  @property({ reflect: true }) size: ToggleButtonSize = 'md';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'button');
    this.setAttribute('aria-pressed', this.pressed.toString());
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);
    this.removeAttribute('error');
    if (this.pressedIcon?.length === 0) {
      console.error('There needs to be an sl-icon in the "pressed" slot for the component to work');
      this.setAttribute('error', 'true');
    }

    if (changes.has('size')) {
      this.#setIconProperties();
    }

    if (this.pressedIcon?.[0]?.name === this.defaultIcon?.[0]?.name) {
      console.error(
        this.pressedIcon?.[0].name,
        this.defaultIcon?.[0].getAttribute('name'),
        'Do not use the same icon for both states of the toggle button.'
      );
      this.setAttribute('error', 'true');
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotChange}></slot>
      <slot @slotchange=${this.#onSlotChange} name="pressed"></slot>
    `;
  }

  #onSlotChange(): void {
    this.#setIconProperties();
  }

  #onClick(event: Event): void {
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.pressed = !this.pressed;
    this.setAttribute('aria-pressed', this.pressed.toString());
    this.toggleEvent.emit(this.pressed);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #setIconProperties(): void {
    const nodes = [...(this.defaultIcon || []), ...(this.pressedIcon || [])];
    nodes.forEach(node => {
      node.size = this.size;
    });
  }
}
