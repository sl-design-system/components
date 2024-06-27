import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlFocusEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './toggle-button.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-toggle-button': ToggleButton;
  }
}

export type ToggleButtonEmphasis = 'subtle' | 'bold';
export type ToggleButtonSize = 'sm' | 'md' | 'lg';
export type ToggleButtonFill = 'ghost' | 'outline';

/**
 * Show totals at a glance or labels contents with a tag.
 *
 * ```html
 * <sl-toggle-button>99+</sl-toggle-button>
 * ```
 *
 * @slot default - Contents of the toggle-button
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

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** The size of the toggle-button component. */
  @property({ reflect: true }) size: ToggleButtonSize = 'md';

  /** The variant of the toggle-button. */
  @property({ reflect: true }) fill: ToggleButtonFill = 'ghost';

  /** The variant of the toggle-button. */
  @property({ type: Boolean, reflect: true }) pressed = false;

  /** Whether the switch is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotChange} class="default"></slot>
      <slot @slotchange=${this.#onSlotChange} name="pressed"></slot>
    `;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const assignedNodes = event.target.assignedNodes({ flatten: true });
    this.#setIconProperties(assignedNodes);
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.pressed = !this.pressed;
    this.toggleEvent.emit(this.pressed);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #hasOnlyIconAsChild(el: HTMLElement): boolean {
    return (
      (el.textContent || '').trim().length === 0 && el.children.length === 1 && el.children[0].nodeName === 'SL-ICON'
    );
  }

  #setIconProperties(assignedNodes: Node[]): void {
    const filteredNodes = assignedNodes.filter(node => {
      return node.nodeType === Node.ELEMENT_NODE || (node.textContent && node.textContent.trim().length > 0);
    });

    let hasIcon = false;

    filteredNodes.forEach(node => {
      const el = node as HTMLElement;
      if (el.nodeName === 'SL-ICON') {
        el.setAttribute('size', this.size);
      } else if (this.#hasOnlyIconAsChild(el)) {
        (el.children[0] as HTMLElement).setAttribute('size', this.size);
      }
    });

    if (filteredNodes.length === 1) {
      const el = filteredNodes[0] as HTMLElement;
      // This button is icon-only if it only contains an icon.
      hasIcon = el.nodeName === 'SL-ICON' || this.#hasOnlyIconAsChild(el);
    }

    this.toggleAttribute('icon-only', hasIcon);
  }
}
