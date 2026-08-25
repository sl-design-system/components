import { type FormControlShowValidity } from '@sl-design-system/form';
import { type Infotip } from '@sl-design-system/infotip';
import { EventsController } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './radio.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-radio': Radio;
  }
}

export type RadioButtonSize = 'md' | 'lg';

/**
 * A radio button with 2 states; unchecked and checked.
 *
 * @csspart svg - The svg element that contains the radio button circle.
 * @csspart box - The box element that contains the radio button background and border.
 * @csspart wrapper - The wrapper element that carries the radio role.
 * @csspart label - The label of the radio button.
 *
 * @slot default - Text label of the radio button. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot infotip - The slot for the infotip element
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Radio<T = any> extends LitElement {
  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** Whether the radio button is checked. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether this radio button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Indicates if the radio button shows it is (in)valid. */
  @property({ attribute: 'show-validity', reflect: true }) showValidity: FormControlShowValidity;

  @state() infotip?: Infotip;

  /** @internal The wrapper element that carries the radio role. */
  @query('[part="wrapper"]') private wrapper!: HTMLElement;

  /**
   * The size of the radio button.
   *
   * @default md
   */
  @property({ reflect: true }) size?: RadioButtonSize;

  /** The value for this radio button. */
  @property() value?: T;

  #tabIndex = 0;

  override get tabIndex(): number {
    return this.#tabIndex;
  }

  override set tabIndex(value: number) {
    const oldValue = this.#tabIndex;
    this.#tabIndex = value;

    // Sync wrapper tabIndex immediately when host tabIndex changes
    // This ensures RovingTabindexController changes are reflected in the wrapper
    if (this.wrapper && oldValue !== value) {
      this.wrapper.tabIndex = value;
    }

    // Always serialize tabIndex to the attribute to match native behavior
    this.setAttribute('tabindex', value.toString());
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Make sure aria-checked is always set
    this.checked ??= false;

    // Initialize host tabIndex (will be overridden by RovingTabindexController in groups)
    // Use the setter to ensure attribute is serialized
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    } else {
      // Read existing attribute value
      this.#tabIndex = parseInt(this.getAttribute('tabindex') || '0', 10);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.wrapper) {
      if (changes.has('checked')) {
        this.wrapper.setAttribute('aria-checked', Boolean(this.checked).toString());
      }

      // Manage host tabIndex based on disabled state (when not in a group)
      // RovingTabindexController will override this when in a group
      if (changes.has('disabled')) {
        this.tabIndex = this.disabled ? -1 : 0;
      }

      // Always ensure wrapper tabIndex is synced (especially on first render)
      this.wrapper.tabIndex = this.tabIndex;
    }
  }

  override render(): TemplateResult {
    return html`
      <div
        part="wrapper"
        role="radio"
        aria-checked=${Boolean(this.checked)}
        aria-disabled=${this.disabled ? 'true' : 'false'}>
        <div part="box">
          ${this.checked
            ? html`
                <svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="6"></circle>
                </svg>
              `
            : html`<svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24"></svg>`}
        </div>
        <span part="label">
          <slot @slotchange=${() => this.#onLabelSlotChange()}></slot>
        </span>
      </div>
      <slot name="infotip" @slotchange=${() => this.#onInfotipSlotChange()}></slot>
    `;
  }

  override firstUpdated(): void {
    this.#onLabelSlotChange();
    this.#onInfotipSlotChange();
  }

  override focus(): void {
    this.wrapper?.focus();
  }

  override blur(): void {
    this.wrapper?.blur();
  }

  #onClick(event: Event): void {
    if (this.disabled || (this.infotip && event.composedPath().includes(this.infotip))) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = true;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #labelText(): string {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])'),
      nodes = slot?.assignedNodes({ flatten: true }) || [];

    return nodes
      .map(node => node.textContent?.trim() || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  #onLabelSlotChange(): void {
    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = this.#labelText();
    }
  }

  #onInfotipSlotChange(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="infotip"]'),
      assignedElements = slot?.assignedElements({ flatten: true }) || [];

    this.infotip =
      assignedElements.find(
        (el): el is Infotip => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP'
      ) || undefined;

    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');

      if (!this.infotip.describes) {
        this.infotip.describes = this.#labelText();
      }
    }
  }
}
