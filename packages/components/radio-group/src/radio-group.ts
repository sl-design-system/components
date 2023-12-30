import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { RadioButtonSize } from './radio.js';
import { localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import type { EventEmitter } from '@sl-design-system/shared';
import { EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { Radio } from './radio.js';
import styles from './radio-group.scss.js';

/**
 * A group of radio buttons.
 *
 * ```html
 *   <sl-radio-group>
 *     <sl-radio>Option 1</sl-radio>
 *     <sl-radio>Option 2</sl-radio>
 *     <sl-radio>Option 3</sl-radio>
 *   </sl-radio-group>
 * ```
 *
 * @slot default - A list of `sl-radio` elements.
 */
@localized()
export class RadioGroup extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** The initial state when the form was associated with the radio group. Used to reset the group. */
  #initialState: string | null = null;

  /** Observe the state of the radios. */
  #observer = new MutationObserver(mutations => {
    const { target } = mutations.find(m => m.attributeName === 'checked' && m.oldValue === null) || {};

    if (target instanceof Radio && target.value) {
      this.radios?.forEach(radio => (radio.checked = radio.value === target.value));
      this.value = target.value;
    }
  });

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Radio>(this, {
    focusInIndex: (elements: Radio[]) => {
      return elements.findIndex(el => {
        return this.value ? !el.disabled && el.value === this.value : !el.disabled;
      });
    },
    elementEnterAction: (el: Radio) => {
      this.value = el.value;
    },
    elements: () => this.radios ?? [],
    isFocusableElement: (el: Radio) => !el.disabled
  });

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** @private The slotted radios. */
  @queryAssignedElements() radios?: Radio[];

  /** Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<string | null>;

  /** Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** Whether the group is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The orientation of the radio options; when true, the radio buttons are displayed next to each other instead of below each other. */
  @property({ type: Boolean, reflect: true }) horizontal?: boolean;

  /** Whether the user is required to select an option in the group. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /** The size of the radio buttons in the group. */
  @property() size?: RadioButtonSize;

  /** The value for the radio group, to be used in forms. */
  @property() value: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this, { attributeFilter: ['checked'], attributeOldValue: true, subtree: true });

    this.internals.role = 'radiogroup';
    this.setFormControlElement(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  /** @ignore Stores the initial state of the radio group */
  formAssociatedCallback(): void {
    this.#initialState = this.value;
  }

  /** @ignore  Resets the radio group to the initial state */
  formResetCallback(): void {
    this.value = this.#initialState;
    this.changeEvent.emit(this.value);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('showValidity')) {
      const radio = this.radios?.find(radio => radio.value === this.value);
      if (radio) {
        radio.showValidity = this.showValidity;
      }
    }

    if (changes.has('required') || changes.has('value')) {
      this.radios?.forEach(radio => (radio.checked = radio.value === this.value));
      this.internals.setFormValue(this.value);
      this.internals.setValidity(
        { valueMissing: this.required && this.value === null },
        msg('An option must be selected.')
      );

      this.updateValidity();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled') && typeof this.disabled === 'boolean') {
      this.radios?.forEach(radio => (radio.disabled = !!this.disabled));
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
    }

    if (changes.has('size')) {
      this.radios?.forEach(radio => (radio.size = this.size || 'md'));
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
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
}
