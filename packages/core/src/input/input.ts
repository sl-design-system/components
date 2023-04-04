import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '../utils/index.js';
import { LitElement, html, svg } from 'lit';
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
    // console.log('key and active element', event, document.activeElement, event.target, event.target === this.input);
    // if (key !== 'Tab') {
    //    this.input.focus();
    // }
    // TODO: shift tab doesn't work

    this.#clicked = false;

    // this.focusVisible = false;

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

  // #onInvalid = (event: Event): void => {
  //   console.log('oninvalid in input', event.target, event, this.invalid);
  //   // this.invalid = (event.target as HTMLInputElement).validity.valid;
  //   // this.invalid
  //   // this.#clicked = true;
  //   // // event.stopPropagation();
  //   // this.focusVisible = false;
  // };

  // #onBlur = (event: Event): void => {
  //   console.log('on blur', event);
  //   this.input.blur();
  //   this.focusVisible = false;
  // };

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

  /** Minimum value. Only applies to number input type.	*/
  @property({ type: Number, attribute: 'min' }) min?: number;

  /** Maximum value. Only applies to number input type. */
  @property({ type: Number, attribute: 'max' }) max?: number;

  /** Specifies the interval between legal numbers for an input field. Only applies to number input type */
  @property({ type: Number, attribute: 'step' }) step?: number;

  /** Validation using pattern. */
  @property() pattern?: string;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether the input is invalid. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean; // = false;

  /** Whether the input is valid. */
  @property({ type: Boolean, reflect: true }) valid?: boolean; // = false;

  /** Whether the input should get valid styles when is valid. */
  @property({ type: Boolean, reflect: true }) showValid = false;

  /** Whether the input has focus visible. */
  @property({ type: Boolean, reflect: true, attribute: 'focus-visible-within' }) focusVisible = false;

  /** Whether you can interact with the input or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Input size. */
  @property({ reflect: true }) size: InputSize = 'md'; // TODO: use input size attribute a change this one to eg. variant

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'tel' | 'text' | 'url' = 'text'; // TODO: password type will be added in the future

  // TODO: add multiple attribute for email type?

  // TODO: add spellcheck attribute https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url#spellcheck

  /** Custom validators specified by the user. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the input. */
  @property() value?: string;

  // get invalid(): boolean {
  //   return this.hasAttribute('invalid');
  // }
  //
  // set invalid(isInvalid: boolean) {
  //   isInvalid ? this.setAttribute('invalid', '') : this.removeAttribute('invalid');
  // }

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
      if (this.readonly) {
        this.input.readOnly = this.readonly;
      }
      // if (this.invalid) {
      //   // !this.input.
      //   // this.setValidity({ badInput: true }, 'null');
      //   this.input.setAttribute('invalid', '');
      //   console.log('this.invalid', this.invalid);
      // }
      // if (this.min) {
      //   console.log('min 1', this.min);
      //   this.input.min = this.min.toString();
      //   this.input.setAttribute('min', this.min.toString());
      // }
      //
      // if (this.max) {
      //   this.input.max = this.max.toString();
      // }

      this.input.addEventListener('keydown', this.#onKeydown);

      if (!this.input.parentElement) {
        this.append(this.input);
      }

      this.setFormControlElement(this.input);

      // console.log('this.input.checkValidity()', this.input.checkValidity(), this.checkValidity());

      this.#validation.validate(this.value);

      console.log('this.input.checkValidity() 2', this.input.checkValidity(), this.checkValidity());
      // this.invalid = !this.#validation.validity.valid;
      this.valid = this.showValid ? this.#validation.validity.valid : false; // TODO: emitting when valid? or use only in the story as an example
    }

    // this.checkValidity();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes in updated', changes);

    if (changes.has('invalid')) {
      console.log('invalid in changes', this.invalid, this.input);
      // this.internals.setValidity();
      // this.input.
      // this.invalid = !this.input.validity.valid;
      // this.invalid = this.input.hasAttribute('invalid');
      // this.invalid = changes;
      // if (this.autocomplete) {
      //   this.input.setAttribute('autocomplete', this.autocomplete);
      // } else {
      //   this.input.removeAttribute('autocomplete');
      // }
    }

    if (changes.has('autocomplete')) {
      if (this.autocomplete) {
        this.input.setAttribute('autocomplete', this.autocomplete);
      } else {
        this.input.removeAttribute('autocomplete');
      }
    }

    if (changes.has('maxLength')) {
      if (this.maxLength) {
        console.log('maxlength if', this.maxLength);
        this.input.setAttribute('maxlength', this.maxLength.toString());
      } else {
        this.input.removeAttribute('maxlength');
      }
    }

    if (changes.has('minLength')) {
      console.log('minlength', this.minLength);
      if (this.minLength) {
        this.input.setAttribute('minlength', this.minLength.toString());
      } else {
        this.input.removeAttribute('minlength');
      }
    }

    if (changes.has('min')) {
      console.log('min in changes', this.min, this.type, this.type === 'number', this.min && this.type === 'number');
      // if (this.min?.toString()) {
      //   console.log('min in if 111', this.min);
      // }
      // if (this.min /*&& this.type === 'number'*/) {
      //   console.log('min in if', this.min);
      //   this.input.setAttribute('min', this.min.toString());
      // } else {
      //   console.log('min in else', this.min);
      //   this.input.removeAttribute('min');
      // } // TODO: sth is not working?

      const min = this.min?.toString();
      if (min) {
        this.input.setAttribute('min', min);
      } else {
        console.log('min in else', this.min);
        this.input.removeAttribute('min');
      }
    }

    if (changes.has('max')) {
      const max = this.max?.toString();
      if (max) {
        this.input.setAttribute('max', max);
      } else {
        this.input.removeAttribute('max');
      }
      // if (this.max) {
      //   this.input.setAttribute('max', this.max.toString());
      // } else {
      //   this.input.removeAttribute('max');
      // }
    }

    if (changes.has('step')) {
      const step = this.step?.toString();
      if (step) {
        this.input.setAttribute('step', step);
      } else {
        this.input.removeAttribute('step');
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

    if (changes.has('readonly')) {
      if (this.readonly) {
        this.input.readOnly = this.readonly;
      } else {
        this.input.removeAttribute('readonly');
      }
    }

    if (changes.has('type')) {
      this.input.type = this.type;
    }

    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value || '';
    }
  }

  // @invalid=${this.#onInvalid}

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper" @blur="${this.#onBlur}">
        <slot name="prefix"></slot>
        <slot
          @slotchange=${this.#onSlotchange}
          name="input"
          @keydown=${this.#onKeydown}
          @focusin=${this.#onFocusin}
          @focusout=${this.#onFocusout}
          @mousedown=${this.#onMousedown}
          .min=${this.min}
        ></slot>
        ${!this.input.validity.valid}
        <slot name="suffix">
          ${this.invalid
            ? svg`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><path fill="#E5454A" d="M8 .875C3.83984.875.5 4.24414.5 8.375c0 4.1602 3.33984 7.5 7.5 7.5 4.1309 0 7.5-3.3398 7.5-7.5 0-4.13086-3.3691-7.5-7.5-7.5Zm-.70312 4.45312c0-.38085.29296-.70312.70312-.70312.38086 0 .70312.32227.70312.70312v3.75c0 .41016-.32226.70313-.70312.70313-.41016 0-.70312-.29297-.70312-.70313v-3.75ZM8 12.5938c-.52734 0-.9375-.4102-.9375-.9083 0-.498.41016-.9082.9375-.9082.49805 0 .9082.4102.9082.9082 0 .4981-.41015.9083-.9082.9083Z"/></svg>`
            : null}
          ${this.valid
            ? svg`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><path fill="#28854E" d="M14.2695 3.98047c.3809.35156.3809.9668 0 1.31836L6.76953 12.7988c-.35156.3809-.9668.3809-1.31836 0l-3.75-3.74997c-.38086-.35156-.38086-.9668 0-1.31836.35156-.38086.9668-.38086 1.31836 0L6.0957 10.8066l6.8555-6.82613c.3515-.38086.9668-.38086 1.3183 0Z"/></svg>`
            : null}
        </slot>
      </div>
      ${this.invalid} ${this.hasAttribute('invalid')} ${this.input.hasAttribute('invalid')} ${this.renderHint()} input
      valid: ${this.input.validity.valid} ${this.#validation.render()}
    `;
  } // TODO: different icon for invalid and valid states, slot for suffix icon/element in default state
  // TODO: use sl-icon instead of plain SVGs

  #onClick(event: Event): void {
    console.log('onclick', event.target, document.activeElement);
    this.focusVisible = false;

    if (event.target === this.input) {
      event.preventDefault();

      this.input.focus();
    }
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
    this.#validation.validate(this.value);
    console.log('this.internals?.validity.valid', this.#validation.validity.valid);
    // this.invalid = !this.#validation.validity.valid; // TODO not working on required and empty input
    console.log('this.invalid', this.invalid);
    this.valid = this.showValid ? this.#validation.validity.valid : false; // TODO: emitting when valid? or use only in the story as an example
  }

  #onBlur({ target }: Event & { target: HTMLInputElement }): void {
    console.log('invalid and target', this.hasAttribute('invalid'), target);
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
      if (this.readonly) {
        this.input.readOnly = this.readonly;
      }
      // if (this.min) {
      //   this.input.min = this.min.toString();
      // }
      this.input.addEventListener('keydown', this.#onKeydown);

      this.setFormControlElement(this.input);
    }
  }
}
