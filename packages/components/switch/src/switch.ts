import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EventEmitter } from '@sl-design-system/shared';
import { FormControlMixin } from '@sl-design-system/form';
import { EventsController, event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './switch.scss.js';

export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * A toggle switch.
 *
 * ```html
 *   <sl-switch>Foo</sl-switch>
 * ```
 *
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 */
export class Switch extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout,
    keydown: this.#onKeydown
  });

  /** The initial state of the switch. */
  #initialState = false;

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<boolean>;

  /** Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** Whether the switch is on or off. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether the switch is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Custom icon in "off" state. */
  @property({ reflect: true, attribute: 'icon-off' }) iconOff?: string;

  /** Custom icon in "on" state. */
  @property({ reflect: true, attribute: 'icon-on' }) iconOn?: string;

  /** Whether the toggle should be shown *after* the text. */
  @property({ type: Boolean, reflect: true }) reverse?: boolean;

  /**
   * The size of the switch.
   * @type { 'sm' | 'md' | 'lg'}
   */
  @property({ reflect: true }) size: SwitchSize = 'md';

  /** The value for the switch, to be used in forms. */
  @property() value: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'switch';

    this.setFormControlElement(this);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  /** @ignore Stores the initial state of the switch */
  formAssociatedCallback(): void {
    this.#initialState = this.hasAttribute('checked');
  }

  /** @ignore  Resets the switch to the initial state */
  formResetCallback(): void {
    this.checked = this.#initialState;
    this.changeEvent.emit(this.checked);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.internals.ariaChecked = this.checked ? 'true' : 'false';
    }

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }

    if (changes.has('checked') || changes.has('value')) {
      this.internals.setFormValue(this.checked ? this.value : null);
    }
  }

  override render(): TemplateResult {
    const icon = this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark',
      size = this.size === 'md' ? 'xs' : 'md';

    return html`
      <slot></slot>
      <div class="toggle">
        <div class="track" .tabIndex=${this.disabled ? -1 : 0}>
          <div>${this.size === 'sm' ? nothing : html`<sl-icon .name=${icon} .size=${size}></sl-icon>`}</div>
        </div>
      </div>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = !this.checked;
    this.changeEvent.emit(this.checked);
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }
}
