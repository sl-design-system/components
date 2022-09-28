import {html, LitElement, TemplateResult} from 'lit';
import {property, query} from "lit/decorators.js";

export class Input extends LitElement {
  static formAssociated = true;

  @property() placeholder?: string;

  @property() id!: string;

  @property() value = '';

  // @property() ariaLabelledby?: string;

  #internals: ElementInternals = this.attachInternals();

  #labels: Set<WeakRef<any>> = new Set<WeakRef<any>>;

  // invalid: boolean;

  // pristine: boolean;

  @property()
  validationError?: string;

  @query('input') input!: HTMLInputElement; //HTMLInputElement /*| null | undefined*/; //Input;
  // @query('.first-input') input?: HTMLInputElement;

  // input?: Input;

  // constructor() {
  //   super();
  //
  //   // this.invalid = false;
  //   // this.pristine = true;
  //   this.#internals = this.attachInternals();
  // }

  /*  get customErrorDisplay() {
      return this.hasAttribute('custom-error-display');
    }

    get validateOnChange() {
      return this.hasAttribute('validate-on-change');
    }

    get invalid() {
      return this.hasAttribute('invalid');
    }

    set invalid(isInvalid: boolean) {
      isInvalid && this.customErrorDisplay ? this.setAttribute('invalid', '') : this.removeAttribute('invalid');
    }*/

  // get value() {
  //   return this.input!.value;
  // }
  //
  // set value(value: string) {
  //   this.input!.value = value;
  //   this.#internals.setFormValue(value);
  // }
  /*
    get form() {
      return this.#internals.form;
    }

    get name() {
      return this.getAttribute('name');
    }

    get type() {
      return this.localName;
    }
    get validity() {
      return this.#internals.validity;
    }

    get validationMessage() {
      return this.#internals.validationMessage;
    }
    get willValidate() {
      return this.#internals.willValidate;
    }
    checkValidity() {
      return this.#internals.checkValidity();
    }
    reportValidity() {
      return this.#internals.reportValidity();
    }*/

  /*  get validity() {
      return this.#internals.validity;
    }
    get validationMessage() {
      return this.#internals.validationMessage;
    }
    get willValidate() {
      return this.#internals.willValidate;
    }
    checkValidity() {
      return this.#internals.checkValidity();
    }
    reportValidity() {
      return this.#internals.reportValidity();
    }

    get customErrorDisplay() {
      return this.hasAttribute('custom-error-display');
    }

    get validateOnChange() {
      return this.hasAttribute('validate-on-change');
    }*/

  /*  connectedCallback() {
      console.log('this.input', this.input, this.shadowRoot?.querySelector('input'));

      // this.input = this.shadowRoot?.querySelector('input');
      // set the required properties (constraints) on the internal
      // <input>
      [
        'type',
        'value',
        'placeholder',
        'required',
        'min',
        'max',
        'minLength',  // <-- camelCase!
        'maxLength',  // <-- camelCase!
        'pattern'
      ].forEach((attr) => {
        const attrValue = attr === 'required' ? this.hasAttribute(attr) : this.getAttribute(attr);

        if(attrValue !== null && attrValue !== undefined) {
          // this.input[attr] = [attrValue];
          // this.input?.setAttribute(attr, attrValue);
        }
      });

      this.input?.addEventListener('change', (e) => {
        if(this.validateOnChange) {
          this.pristine = false;
        }

        // we also want to dispatch a `change` event from
        // our custom element
        // const clone = new e.constructor(e.type, e);
        this.dispatchEvent(/!*clone*!/e);

        // set the element's validity whenever the value of the
        // <input> changes
        // this.validateInput();
      });

      this.addEventListener('invalid', (e) => {
        this.invalid = true;
        this.pristine = false;

        // when a custom error needs to be displayed,
        // prevent the native error from showing
        if(this.customErrorDisplay) {
          e.preventDefault();
        }
      });

      this.addEventListener('focus', () => this.input?.focus());

      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0');
      }

      // set the initial validity of the component
      // this.validateInput();
    }*/

  /*  validateInput() {
      // get the validity of the internal <input>
      const validState = this.input?.validity;

      // reset this.invalid before validating again
      this.invalid = false;

      // if the input is invalid, show the correct error
      if(!validState?.valid) {
        // loop through the error reasons
        for(let state in validState) {
          // get the name of the data attribute that holds the
          //error message
          const attr = `data-${state.toString()}`;
          // if there is an error and corresponding attribute holding
          // the message
  /!*        if(validState[state]) {
            this.validationError = state.toString();
            this.invalid = !this.pristine && !validState.valid;

            // get the correct error message
            const errorMessage = this.hasAttribute(attr) ?
              this.getAttribute(attr) : this.input?.validationMessage;
            // set the validity error reason and the corresponding
            // message
            this.#internals.setValidity(
              {[this.validationError]: true},
              errorMessage!
            );

            // when a custom error needs to be displayed,
            // dispatch the 'invalid' event manually so consuming code
            // can use this as a hook to get the correct error message
            // and display it
            if(this.invalid && this.customErrorDisplay) {
              this.dispatchEvent(new Event('invalid'));
            }
          }*!/
        }
      }
      else {
        this.#internals.setValidity({});
      }
    }*/

  firstUpdated(): void {
    console.log('this.input in render in firstUpdated', this.input, this.#internals.labels);
    // for (const label of this.#internals.labels) {
    //   label.addEventListener('click', doFocus)
    // }
    this.#internals.labels.forEach(label => {
      // label.addEventListener('click', this.onClick(event, this.input));
      label.addEventListener('click', (event: Event) => this.onClick(event, this.input));
      const ref = new WeakRef(label);
      console.log('ref', ref);
      this.#labels.add(ref);
    });
    console.log('this.#labels', this.#labels);
  }

  onClick(event: Event, input: HTMLInputElement): void {
    console.log('event', event, this.input/*, this.#internals.labels*/, input);
    (event.target as HTMLElement).focus();
    this.input?.focus();
    // event.stopPropagation();
  }

  render(): TemplateResult {
    // console.log('this.input in render', this.input, this, this.shadowRoot?.querySelector('input'));
    // this.#internals.labels
    // console.log('this.#internals.labels', this.#internals.labels[0], this.#internals.labels, (this.#internals.labels[0] as HTMLElement)?.innerText, (this.#internals.labels[0] as HTMLLabelElement)?.id);
    return html`<input .id="${(this.#internals.labels[0] as HTMLLabelElement)?.htmlFor}" aria-labelledby="${(this.#internals.labels[0] as HTMLLabelElement)?.id}" .placeholder="${this.placeholder}" value="${this.value}"/>`;
    // <input class="first-input" type="text"/>
    // <input .id="${(this.#internals.labels[0] as HTMLLabelElement)?.htmlFor}" aria-labelledby="${(this.#internals.labels[0] as HTMLLabelElement)?.id}" .placeholder="${this.placeholder}" value="${this.value}"/>
  }
  // aria-labelledby="${(this.#internals.labels[0] as HTMLLabelElement)?.htmlFor}"
  // <slot></slot>
  // <label for="${this.id}">labelka</label>
  // htmlFor
  // ${this.id}
  disconnectedCallback(): void {
    // label.removeEventListener('click', this.onClick(event, this.input));
    this.#internals.labels.forEach(label => {
      label.removeEventListener('click', (event: Event) => this.onClick(event, this.input));
    });
  }
}
