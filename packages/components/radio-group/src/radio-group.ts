import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '@sl-design-system/shared';
import { MutationController } from '@lit-labs/observers/mutation-controller.js';
import {
  EventsController,
  FormControlMixin,
  HintMixin,
  RovingTabindexController,
  ValidationController,
  hintStyles,
  requiredValidator,
  validationStyles
} from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedNodes } from 'lit/decorators.js';
import { Radio } from './radio.js';
import styles from './radio-group.scss.js';

/**
 * Radio group; treat a group of radio button as one form input with valitation, hints and errors
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
export class RadioGroup extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    focusout: this.#onFocusout
  });

  /** Observe the state of the radios. */
  #mutation = new MutationController(this, {
    callback: mutations => {
      const { target } = mutations.find(m => m.attributeName === 'checked' && m.oldValue === null) || {};

      if (target instanceof Radio && target.value) {
        this.buttons?.forEach(radio => (radio.checked = radio.value === target.value));
        this.value = target.value;
      }
    },
    config: {
      attributeFilter: ['checked'],
      attributeOldValue: true,
      subtree: true
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
    elements: () => this.buttons,
    isFocusableElement: (el: Radio) => !el.disabled
  });

  #validation = new ValidationController(this, {
    validators: [requiredValidator]
  });
  #initialState?: string;

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** @ignore The assigned nodes. */
  @queryAssignedNodes() defaultNodes?: Node[];

  /** The orientation of the radio options; when true, the radio buttons are displayed next to each other instead of below each other. */
  @property({ type: Boolean, reflect: true }) horizontal?: boolean;

  /** Custom validators. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the radio group, to be used in forms. */
  @property({ reflect: true }) value?: string;

  /** @private All included sl-radio components. */
  get buttons(): Radio[] {
    return this.defaultNodes?.filter((node): node is Radio => node instanceof Radio) || [];
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'radiogroup';

    this.setFormControlElement(this);

    this.buttons?.forEach(radio => (radio.checked = radio.value === this.value));
    // Run initial validation
    this.#validation.validate(this.value);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('value')) {
      this.buttons?.forEach(radio => (radio.checked = radio.value === this.value));
      this.setFormValue(this.value);
      this.#validation.validate(this.value);
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>
      ${this.renderHint()} ${this.#validation.render()}
    `;
  }

  /** @ignore Stores the initial state of the radio group */
  formAssociatedCallback(): void {
    this.#initialState = this.value;
  }

  /** @ignore  Resets the radio group to the initial state */
  formResetCallback(): void {
    this.value = this.#initialState;
  }

  #onClick(event: Event): void {
    event.preventDefault();

    this.#rovingTabindexController.focus();
  }

  #onFocusout(event: FocusEvent): void {
    if (!event.relatedTarget || !this.buttons.includes(event.relatedTarget as Radio)) {
      // This component is weird in that it doesn't actually contain the form controls,
      // those are the `<sl-radio>` custom elements in the light DOM. So run the validation
      // manually from here.
      this.#validation.validate(this.value);
    }
  }

  #onSlotchange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.buttons?.forEach(radio => (radio.checked = radio.value === this.value));
  }
}
