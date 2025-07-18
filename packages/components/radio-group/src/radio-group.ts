import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { type EventEmitter, EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './radio-group.scss.js';
import { type Radio, type RadioButtonSize } from './radio.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-radio-group': RadioGroup;
  }
}

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};

/**
 * A group of radio buttons.
 *
 * ```html
 *   <sl-radio-group>
 *     <sl-radio value="1">Option 1</sl-radio>
 *     <sl-radio value="2">Option 2</sl-radio>
 *     <sl-radio value="3">Option 3</sl-radio>
 *   </sl-radio-group>
 * ```
 *
 * @slot default - A list of `sl-radio` elements.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RadioGroup<T = any> extends FormControlMixin(LitElement) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** The initial state when the form was associated with the radio group. Used to reset the group. */
  #initialState?: T;

  /**
   * Stores the initial value of the radio group when it is first rendered.
   * Used to determine if the value has changed since initialization and to manage event emission, avoiding unnecessary events on the first render.
   */
  #initialValue?: T;

  /**
   * Indicates whether the component is rendering for the first time.
   * Used to track the initial render and preventing unnecessary event emission.
   */
  #isInitialRender = true;

  /** When an option is checked, update the state. */
  #observer = new MutationObserver(mutations => {
    const { target } = mutations.find(m => m.attributeName === 'checked' && m.oldValue === null) || {};

    this.#observer.disconnect();
    this.#setSelectedOption(target as Radio<T>);
    this.#observer.observe(this, OBSERVER_OPTIONS);
  });

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Radio<T>>(this, {
    direction: () => (this.horizontal ? 'horizontal' : 'vertical'),
    focusInIndex: (elements: Array<Radio<T>>) => {
      return elements.findIndex(el => {
        return this.value ? !el.disabled && el.value === this.value : !el.disabled;
      });
    },
    elementEnterAction: (el: Radio<T>) => {
      this.value = el.value;
    },
    elements: () => this.radios ?? [],
    isFocusableElement: (el: Radio) => !el.disabled
  });

  /** @internal Element internals. */
  readonly internals = this.attachInternals();

  /** @internal The slotted radios. */
  @queryAssignedElements() radios?: Array<Radio<T>>;

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | undefined>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** Whether the group is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** The orientation of the radio options; when true, the radio buttons are displayed next to each other instead of below each other. */
  @property({ type: Boolean, reflect: true }) horizontal?: boolean;

  /** Whether the user is required to select an option in the group. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the radio buttons in the group.
   * @default md
   */
  @property() size?: RadioButtonSize;

  /** The value for the radio group, to be used in forms. */
  @property() override value?: T;

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'radiogroup';
    this.setFormControlElement(this);

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValueAndValidity);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  /** @ignore Stores the initial state of the radio group */
  formAssociatedCallback(): void {
    this.#initialState = this.value;
  }

  /** @ignore Resets the radio group to the initial state */
  formResetCallback(): void {
    this.value = this.#initialState;

    this.#observer.disconnect();
    this.#setSelectedOption(this.radios?.find(radio => radio.value === this.value));
    this.#observer.observe(this, OBSERVER_OPTIONS);
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#observer.observe(this, OBSERVER_OPTIONS);

    this.#updateValueAndValidity();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('disabled') && typeof this.disabled === 'boolean') {
      this.radios?.forEach(radio => (radio.disabled = !!this.disabled));
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';

      this.#updateValueAndValidity();
    }

    if (changes.has('showValidity')) {
      const radio = this.radios?.find(radio => radio.value === this.value);
      if (radio) {
        radio.showValidity = this.showValidity;
      }
    }

    if (changes.has('size')) {
      this.radios?.forEach(radio => (radio.size = this.size));
    }

    if (changes.has('value')) {
      if (this.#isInitialRender) {
        this.#initialValue = this.value;
        this.#isInitialRender = false;
      }

      this.#observer.disconnect();
      this.radios?.forEach(radio => (radio.checked = radio.value === this.value));
      this.#observer.observe(this, OBSERVER_OPTIONS);
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onSlotchange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.radios?.forEach(radio => {
      radio.checked = radio.value === this.value;

      if (typeof this.disabled === 'boolean') {
        radio.disabled = this.disabled;
      }

      if (this.size) {
        radio.size = this.size;
      }
    });
  }

  #setSelectedOption(option?: Radio<T>, emitEvent = true): void {
    this.radios?.forEach(radio => (radio.checked = radio.value === option?.value));
    this.value = option?.value;

    if (emitEvent) {
      if (!this.#initialValue) {
        this.changeEvent.emit(this.value);
      }
      this.updateState({ dirty: true });
    }

    this.#updateValueAndValidity();
    this.#initialValue = undefined;
  }

  #updateValueAndValidity(): void {
    this.internals.setFormValue(this.nativeFormValue);
    this.internals.setValidity(
      { valueMissing: this.required && !this.radios?.some(radio => radio.checked) },
      msg('Please select an option.', { id: 'sl.radioGroup.validation.valueMissing' })
    );

    this.updateValidity();
  }
}
