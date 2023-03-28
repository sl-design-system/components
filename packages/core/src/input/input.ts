import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '../utils/index.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsController, ValidationController, validationStyles } from '../utils/controllers/index.js';
import { FormControlMixin, HintMixin } from '../utils/mixins/index.js';
import styles from './input.scss.js';

export type InputSize = 'md' | 'lg';

let nextUniqueId = 0;

/**
 * Single line text input component.
 *
 * @slot prefix - Content shown before the input
 * @slot input - The slot for the input element
 * @slot suffix - Content shown after the input
 */
export class Input extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  #onKeydown = (event: Event): void => {
    //{ key }: KeyboardEvent
    console.log('key and active element', event, document.activeElement, event.target, event.target === this.input);
    // if (key !== 'Tab') {
    //    this.input.focus();
    // }
    // TODO: shift tab doesn't work

    this.#clicked = false;

    this.focusVisible = false;

    // if ((event as KeyboardEvent).shiftKey && (event as KeyboardEvent).key === 'Tab') {
    //   console.log('shift + tab');
    //   this.input.blur();
    // }
    /*    this.focusVisible = true;


    if (event.target === this.input) {
      this.focusVisible = true;
      // this.input.focus();
      // requestAnimationFrame(() => {
      // this.focusVisible = false;
      // });
      if (
        ((event as KeyboardEvent).shiftKey && (event as KeyboardEvent).key === 'Tab') ||
        ((event as KeyboardEvent).key === 'Tab')
      ) {
        // this.#onBlur(event);
        this.focusVisible = false;
      }
    } /!*else {
      this.focusVisible = true;
    }*!/*/

    /*    if (!this.disabled) {
      if (
        //((event as KeyboardEvent).shiftKey && (event as KeyboardEvent).key === 'Tab') ||
        !((event as KeyboardEvent).key === 'Tab')
      ) {
        // event.preventDefault();
        //
        // this.input.focus();

        // console.log('shift + tab or tab', document.activeElement, this.input);
        // event.stopPropagation();
        // this.input.blur();
        // this.blur();
        // this.input.focus();
        // requestAnimationFrame(() => {
        //   this.focusVisible = true;
        // });
        // this.focusVisible = true;
        // alert((document.activeElement as HTMLInputElement).value);
        console.log('shift + tab or tab', document.activeElement, this.input);
      } else {
        console.log('focus goes', document.activeElement, this.input);
        // this.input.focus();
        this.focusVisible = false;
      }

      // event.stopPropagation();
      // this.input.focus();
      // if ((event as KeyboardEvent).key === 'Enter') {
      //   console.log('input blur');
      //   this.input.blur();
      // } else {
      //   this.input.focus();
      // }
    } // TODO what about blur and tab key?*/

    // if ((event as KeyboardEvent).key === 'Enter') {
    //   console.log('input blur');
    //   this.input.blur();
    // }

    if ((event as KeyboardEvent).key === 'Enter') {
      this.input.form?.requestSubmit();
    }
  };

  #onFocusin = (event: Event): void => {
    console.log('onfocusin', event.target, document.activeElement, event.type, event);
    if (!this.#clicked) {
      this.focusVisible = true;
    }
  };

  #onFocusout = (event: Event): void => {
    console.log('onfocusin', event.target, document.activeElement);
    this.#clicked = false;
    this.focusVisible = false;
  };

  #onMousedown = (event: Event): void => {
    console.log('onmousedown', event.target, document.activeElement);
    this.#clicked = true;
    // event.stopPropagation();
    this.focusVisible = false;
  };

  #onBlur = (event: Event): void => {
    console.log('on blur', event);
    this.input.blur();
    this.focusVisible = false;
  };

  #events = new EventsController(this, {
    click: this.#onClick //,
    // keydown: this.#onKeydown //,
    // blur: this.#onBlur
  });

  #validation = new ValidationController(this, {
    target: () => this.input
  });

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** Specifies which type of data the browser can use to pre-fill the input. */
  @property() autocomplete?: string;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Validation using pattern. */
  @property() pattern?: string;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether the input is invalid. */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** Whether the input is valid. */
  @property({ type: Boolean, reflect: true }) valid = false;

  /** Whether the input should get valid styles when is valid. */
  @property({ type: Boolean, reflect: true }) showValid = false;

  /** Whether the input has focus visible. */
  @property({ type: Boolean, reflect: true }) focusVisible = false;

  /** Input size. */
  @property({ reflect: true }) size: InputSize = 'md';

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url' = 'text'; // TODO: password type will be added in the future

  /** Custom validators specified by the user. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the input. */
  @property() value?: string;

  /** @private */
  #clicked = false;

  // TODO: invalid state?

  // TODO: valid styles on demand?

  override connectedCallback(): void {
    super.connectedCallback();

    // if (!this.hasAttribute('tabindex')) {
    //   this.tabIndex = 0;
    // }

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.autocomplete ||= this.autocomplete || 'off';
      this.input.id ||= `sl-input-${nextUniqueId++}`;
      this.input.slot = 'input';
      this.input.addEventListener('keydown', this.#onKeydown);

      if (!this.input.parentElement) {
        this.append(this.input);
      }

      this.setFormControlElement(this.input);

      this.#validation.validate(this.value);
      this.invalid = !this.#validation.validity.valid;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('autocomplete')) {
      if (this.autocomplete) {
        this.input.setAttribute('autocomplete', this.autocomplete);
      } else {
        this.input.removeAttribute('autocomplete');
      }
    }

    if (changes.has('maxLength')) {
      if (this.maxLength) {
        this.input.setAttribute('maxlength', this.maxLength.toString());
      } else {
        this.input.removeAttribute('maxlength');
      }
    }

    if (changes.has('minLength')) {
      if (this.minLength) {
        this.input.setAttribute('minlength', this.minLength.toString());
      } else {
        this.input.removeAttribute('minlength');
      }
    }

    if (changes.has('pattern')) {
      if (this.pattern) {
        this.input.setAttribute('pattern', this.pattern);
      } else {
        this.input.removeAttribute('pattern');
      }
    }

    if (changes.has('placeholder')) {
      if (this.placeholder) {
        this.input.setAttribute('placeholder', this.placeholder);
      } else {
        this.input.removeAttribute('placeholder');
      }
    }

    if (changes.has('type')) {
      this.input.type = this.type;
    }

    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper">
        <slot name="prefix"></slot>
        <slot
          @slotchange=${this.#onSlotchange}
          name="input"
          @keydown=${this.#onKeydown}
          @focusin=${this.#onFocusin}
          @focusout=${this.#onFocusout}
          @mousedown=${this.#onMousedown}
        ></slot>
        <slot name="suffix"></slot>
      </div>
      ${this.renderHint()} ${this.#validation.render()}
    `;
  } // TODO: different icon for invalid and valid states, slot for suffix icon/element in default state

  #onClick(event: Event): void {
    console.log('onclick', event.target, document.activeElement);
    this.focusVisible = false;

    if (event.target === this.input) {
      // this.focusVisible = false;
      event.preventDefault();

      this.input.focus();
      // this.focusVisible = false;
    }
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
    this.#validation.validate(this.value);
    console.log('this.internals?.validity.valid', this.#validation.validity.valid);
    this.invalid = !this.#validation.validity.valid; // TODO not working on required and empty input
    console.log('this.invalid', this.invalid);
    this.valid = this.showValid ? this.#validation.validity.valid : false; // TODO: emitting when valid? or use only in the story as an example
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    console.log('event on slothcnage', event);
    const elements = event.target.assignedElements({ flatten: true }),
      inputs = elements.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && el !== this.input);

    // Handle the scenario where a custom input is being slotted after `connectedCallback`
    if (inputs.length) {
      this.input.removeEventListener('keydown', this.#onKeydown);

      this.input = inputs.at(0) as HTMLInputElement;
      this.input.autocomplete ||= this.autocomplete || 'off';
      this.input.id ||= `sl-input-${nextUniqueId++}`;
      this.input.addEventListener('keydown', this.#onKeydown);

      this.setFormControlElement(this.input);
    }
  }
}
