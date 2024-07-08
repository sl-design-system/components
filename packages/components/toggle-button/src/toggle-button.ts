import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
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
  /** @private */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** @internal Emits when the button item has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  /** The size of the toggle-button component. */
  @property({ reflect: true }) size: ToggleButtonSize = 'md';

  /** The variant of the toggle-button. */
  @property({ reflect: true }) fill: ToggleButtonFill = 'ghost';

  /** The state of the toggle-button. */
  @property({ type: Boolean, reflect: true }) pressed = false;

  /** Whether the toggle-button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  @property({ type: Boolean, reflect: true, attribute: 'single-icon' }) singleIcon?: boolean = true;

  /** The original tabIndex before disabled. */
  private originalTabIndex = 0;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotChange} class="default"></slot>
      <slot @slotchange=${this.#onSlotChange} name="pressed"></slot>
    `;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      if (this.disabled) {
        this.originalTabIndex = this.tabIndex;
      }
      this.tabIndex = this.disabled ? -1 : this.originalTabIndex;
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const assignedNodes = event.target.assignedNodes({ flatten: true });
    if (event.target.matches('[name="pressed"]')) {
      this.singleIcon = assignedNodes.length > 0 ? false : true;
    }
    this.#setIconProperties(assignedNodes);
  }

  #onClick(event: Event): void {
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.pressed = !this.pressed;
    this.setAttribute('aria-pressed', this.pressed ? 'true' : 'false');
    this.toggleEvent.emit(this.pressed);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #setIconProperties(assignedNodes: Node[]): void {
    const filteredNodes = assignedNodes.filter(node => {
      return node.nodeType === Node.ELEMENT_NODE || (node.textContent && node.textContent.trim().length > 0);
    });

    filteredNodes.forEach(node => {
      const el = node as HTMLElement;
      if (el.nodeName === 'SL-ICON') {
        el.setAttribute('size', this.size);
      }
    });
  }
}
