import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './switch.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-switch': Switch;
  }
}

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
export class Switch<T = unknown> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout,
    keydown: this.#onKeydown
  });

  /** The initial state of the switch. */
  #initialState = false;

  /** @internals Element internals. */
  readonly internals = this.attachInternals();

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** Whether the switch is on or off. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether the switch is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** Custom icon in "off" state. */
  @property({ reflect: true, attribute: 'icon-off' }) iconOff?: string;

  /** Custom icon in "on" state. */
  @property({ reflect: true, attribute: 'icon-on' }) iconOn?: string;

  /** Whether the toggle should be shown *after* the text. */
  @property({ type: Boolean, reflect: true }) reverse?: boolean;

  /** The size of the switch. */
  @property({ reflect: true }) size: SwitchSize = 'md';

  /**
   * The value of the switch when the switch is checked.
   * See the formValue property for easy access.
   */
  @property() override value?: T;

  override get formValue(): T | null {
    return this.checked ? ((this.value ?? true) as T) : null;
  }

  override set formValue(value: T | null) {
    this.checked = value === true || value === this.value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // this.internals.role = 'switch';

    this.setFormControlElement(this);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  /** @ignore Stores the initial state of the switch */
  formAssociatedCallback(): void {
    this.#initialState = this.hasAttribute('checked');
  }

  /** @ignore Resets the switch to the initial state */
  formResetCallback(): void {
    this.checked = this.#initialState;
    this.changeEvent.emit(this.formValue);
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#updateValue();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.internals.ariaChecked = this.checked ? 'true' : 'false';
    }

    // if (changes.has('disabled')) {
    //   this.tabIndex = this.disabled ? -1 : 0;
    // }
  }

  override render(): TemplateResult {
    const icon = this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark',
      size = this.size === 'md' ? 'xs' : 'md';

    console.log('switch', this, this.getAttribute('aria-describedby'), this.hasAttribute('aria-describedby'));

    // if (this.hasAttribute('aria-describedby')) {
    //   this.internals.ariaDescription =  this.getAttribute('aria-describedby');
    // }

    return html`
      <slot id="label"></slot>
      <div class="toggle">
        <div
          class="track"
          role="switch"
          .tabIndex=${this.disabled ? -1 : 0}
          aria-checked=${this.checked ? 'true' : 'false'}
          aria-labelledby="label"
          aria-describedby=${this.getAttribute('aria-describedby')}
        >
          <div>${this.size === 'sm' ? nothing : html`<sl-icon .name=${icon} .size=${size}></sl-icon>`}</div>
        </div>
      </div>
    `;
  } // TODO: aria-disabled aria-required...

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = !this.checked;
    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });

    this.#updateValue();
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #updateValue(): void {
    this.internals.setFormValue(this.nativeFormValue);

    this.updateValidity();
  }
}

// TODO: what about aria-label added by a user?
// not working with aria-describedby yet
