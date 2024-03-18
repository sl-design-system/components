import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './checkbox.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
  }
}

export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * A checkbox with 3 states; unchecked, checked and intermediate.
 *
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 */
@localized()
export class Checkbox<T = unknown> extends FormControlMixin(LitElement) {
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

  /** The initial state when the form was associated with the checkbox. Used to reset the checkbox. */
  #initialState = false;

  /** @private */
  readonly internals = this.attachInternals();

  /** Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** Whether the checkbox is checked. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether the checkbox is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** Whether the checkbox has the indeterminate state. */
  @property({ type: Boolean, reflect: true }) indeterminate?: boolean;

  /** Whether the checkbox is required. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /** The size of the checkbox. */
  @property({ reflect: true }) size: CheckboxSize = 'md';

  /**
   * The value of the checkbox when the checkbox is checked.
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

    this.internals.role = 'checkbox';
    this.setFormControlElement(this);
    this.#updateNoLabel();

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValueAndValidity);
  }

  /** @ignore Stores the initial state of the checkbox */
  formAssociatedCallback(): void {
    this.#initialState = this.hasAttribute('checked');
  }

  /** @ignore Resets the checkbox to the initial state */
  formResetCallback(): void {
    this.checked = this.#initialState;
    this.changeEvent.emit(this.formValue);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('checked') || changes.has('indeterminate')) {
      this.internals.ariaChecked = this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false';
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
    }

    if (changes.has('checked') || changes.has('required') || changes.has('value')) {
      this.#updateValueAndValidity();
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="outer">
        <div class="inner" .tabIndex=${this.disabled ? -1 : 0}>
          <svg
            aria-hidden="true"
            class=${classMap({ checked: !!this.checked, indeterminate: !!this.indeterminate })}
            part="svg"
            version="1.1"
            viewBox="0 0 24 24"
          >
            ${this.indeterminate
              ? svg`<path d="M4.1,12 9,12 20.3,12"></path>`
              : svg`<path d="M4.1,12.7 9,17.6 20.3,6.3"></path>`}
          </svg>
        </div>
      </div>
      <span class="label">
        <slot @slotchange=${() => this.#updateNoLabel()}></slot>
      </span>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = !this.checked;
    this.changeEvent.emit(this.formValue);
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

  #updateNoLabel(): void {
    const empty = Array.from(this.childNodes)
      .filter(
        node =>
          (node.nodeType === Node.ELEMENT_NODE && !(node as Element).hasAttribute('slot')) ||
          node.nodeType === Node.TEXT_NODE
      )
      .every(node => node.nodeType !== Node.ELEMENT_NODE && node.textContent?.trim() === '');

    this.toggleAttribute('no-label', empty);
  }

  #updateValueAndValidity(): void {
    this.internals.setFormValue(this.nativeFormValue);
    this.internals.setValidity({ valueMissing: !!this.required && !this.checked }, msg('Please check this box.'));

    this.updateValidity();
  }
}
