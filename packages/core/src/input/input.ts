import {CSSResultGroup, css, html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query} from "lit/decorators.js";
import styles from './input.scss.js';

let nextUniqueId = 0;

export class Input extends LitElement {
  /** @private */
  static styles: CSSResultGroup = styles;

/*  static styles = css`
    :host {
      display: block;
    }

    input {
      margin-top: 3px;
      border: 1px solid #d3d3d3;
      border-radius: 3px;
      padding: 5px 7px;
      // box-shadow: 0 0 0 3px hsla(207, 95%, calc(55% - 8%), 0.25);
    }

    input:focus-visible {
      box-shadow: 0 0 0 3px hsla(207, 95%, calc(55% - 8%), 0.25);
      border-color: hsl(207, 95%, calc(55% - 8% * 2));
      outline: none;
    }

    :host([invalid]) > input {
       border-color: #ed1d23; //red;
       border-radius: 3px;
    }

    .with-error {
      display: none;
      color: #ed1d23; //#ff0000;
      padding: 5px 0;
    }

    :host([invalid]) > .with-error {
      display: block; // inline-block;
      // margin-top: 5px;
    }
  `;*/

  static formAssociated = true;

  @property() placeholder = '';

  @property() id!: string;

  // @property() value = '';

  #internals: ElementInternals = this.attachInternals();

  #labels: Set<WeakRef<Node>> = new Set<WeakRef<Node>>;

  #validationAttributes = [
    'type',
    'value',
    'placeholder',
    'required',
    'min',
    'max',
    'minLength',
    'maxLength',
    'pattern'
  ];

  // invalid: boolean;
  // pristine: boolean;

  // @property() invalid = false;

  @property() pristine = true;

  @property() validationError?: string;

  @query('input') input!: HTMLInputElement;

  // @event() invalidState!: EventEmitter<string | undefined>;

  // input?: Input;

  get validity(): ValidityState {
    return this.#internals.validity;
  }

  get validationMessage(): string {
    return this.#internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.#internals.willValidate;
  }

  checkValidity(): boolean {
    console.log('checkValidity goes --- this.#internals.checkValidity()', this.#internals.checkValidity());
    return this.#internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.#internals.reportValidity();
  }

  get value(): string {
    return this.input.value;
  }

  set value(value: string) {
    console.log('value in set', value);
    this.input.value = value;
    this.#internals.setFormValue(value);
  }

  get form(): HTMLFormElement | null {
    return this.#internals.form;
  }

  get validateOnChange(): boolean {
    return this.hasAttribute('validate-on-change');
  }

  get customErrorDisplay(): boolean {
    return this.hasAttribute('custom-error-display');
  }

  get invalid(): boolean {
    return this.hasAttribute('invalid');
  }

  set invalid(isInvalid: boolean) {
    console.log('isInvalid in invalid', isInvalid);
    isInvalid && this.customErrorDisplay ? this.setAttribute('invalid', '') : this.removeAttribute('invalid');
  }

/*  connectedCallback() {
    super.connectedCallback();
  }*/


  firstUpdated(): void {
    this.invalid = false;
    this.pristine = true;

    this.#validationAttributes.forEach((attr) => {
      const attrValue = attr === 'required' ? this.hasAttribute(attr) : this.getAttribute(attr);

      console.log('attrValue', attr, attrValue/*attrValue*/);

      if(attrValue !== null && attrValue !== undefined) {
        // this.input[attr] = attrValue;
        this.input.setAttribute(attr, attrValue.toString());
      }
    });


    this.input.addEventListener('change', (e) => {
      if(this.validateOnChange) {
        this.pristine = false;
      }

      // we also want to dispatch a `change` event from
      // our custom element
      const clone = new Event(e.type, e); //e.constructor(e.type, e);
      this.dispatchEvent(clone);

      console.log('idzie change event', e, clone);

      // set the element's validity whenever the value of the
      // <input> changes
      this.validateInput();
    });

    this.addEventListener('invalid', (e) => {
      this.invalid = true;
      this.pristine = false;

      console.log('idzie invalid event', e);

      // when a custom error needs to be displayed,
      // prevent the native error from showing
      if(this.customErrorDisplay) {
        e.preventDefault();
      }
    });

    console.log('this.form, this.value', this.form, this.value, this.input.value);
    console.log('this.input in render in firstUpdated', this.input, this.#internals, this.#internals.labels);
    this.#internals.labels.forEach(label => {
      (label as HTMLLabelElement).id = `sl-input-label-${nextUniqueId++}`;
      label.addEventListener('click', (event: Event) => this.onClick(event));
      const ref = new WeakRef(label);
      this.#labels.add(ref);
    });

    const label = (this.#internals.labels[0] as HTMLLabelElement);
    this.input.setAttribute('aria-labelledby', label.id);
    this.input.setAttribute('aria-label', label.innerText);
    this.setAttribute('aria-labelledby', label.id);

    this.validateInput();
  }

  willUpdate(changes: PropertyValues<this>): void {
    console.log('changes in willUpdate', changes);
  }

  onClick(event: Event): void {
    this.input.focus();
    event.preventDefault();
  }

  render(): TemplateResult {
    console.log('in render', this.#internals.labels, (this.#internals.labels[0] as HTMLLabelElement), (this.#internals.labels[0] as HTMLLabelElement)?.id, this.validationMessage);
    // console.log('this.input in render', this.input, this, this.shadowRoot?.querySelector('input'));
    // this.#internals.labels
    // console.log('this.#internals.labels', this.#internals.labels[0], this.#internals.labels, (this.#internals.labels[0] as HTMLElement)?.innerText, (this.#internals.labels[0] as HTMLLabelElement)?.id);
    return html`<input .id="${this.id}" aria-labelledby="${(this.#internals.labels[0] as HTMLLabelElement)?.id}" .placeholder="${this.placeholder}"/>
    <div class="with-error">${this.validationMessage}</div>`;
    // value="${this.value}"
    // .id="${(this.#internals.labels[0] as HTMLLabelElement)?.htmlFor}"

    // <input class="first-input" type="text"/>
    // <input .id="${(this.#internals.labels[0] as HTMLLabelElement)?.htmlFor}" aria-labelledby="${(this.#internals.labels[0] as HTMLLabelElement)?.id}" .placeholder="${this.placeholder}" value="${this.value}"/>
  }

  validateInput(): void {
    const validState = this.input.validity;
    this.invalid = false;

    if (!validState.valid) {
      for (let state in validState) {
      //   for (let state of Array.of(validState)) {
      //     for (let state = 1; state <= Array.of(validState).length; state++) {
        // get the name of the data attribute that holds the
        //error message
        const attr = `data-${state.toString()}`;
        // if there is an error and corresponding attribute holding
        // the message
        console.log('attr in validateInput --------', attr, state, /*Array.of(validState)[state],*/ validState, Array.of(validState), [state], this.#internals.validationMessage, this.#internals);


        // let test = getKeyValue(validState)(state);
        const temp = validState[state as keyof ValidityState]
        console.log('....temp', temp);

        if(/*temp*/ validState[state as keyof ValidityState]) {
          this.validationError = state.toString();
          this.invalid = !this.pristine && !validState.valid;
          console.log('!this.pristine, !validState.valid', this.pristine, !this.pristine, !validState.valid, !this.pristine && !validState.valid);

          const errorMessage = this.hasAttribute(attr) ?
            this.getAttribute(attr) : this.input.validationMessage;
          console.log('errorMessage', errorMessage);
          console.log('this.validationError', this.validationError, errorMessage);

          this.#internals.setValidity(
            {[this.validationError]: true},
            errorMessage?.toString()
          );
          console.log('attr in validateInput after setValidity', attr, state, /*Array.of(validState)[state],*/ validState, this.#internals.validationMessage, this.#internals);
          console.log('this.invalid', this.invalid, this.customErrorDisplay);

          // when a custom error needs to be displayed,
          // dispatch the 'invalid' event manually so consuming code
          // can use this as a hook to get the correct error message
          // and display it
          if(this.invalid /*&& this.customErrorDisplay*/) { /*&& this.customErrorDisplay*/
            this.dispatchEvent(new Event('invalid'));
          }
        }

        // this.dispatchEvent(new Event('onValidate'));
      }
    }
    else {
      this.#internals.setValidity({});
    }
    // this.checkValidity();
  }

  disconnectedCallback(): void {
    this.#labels.forEach(label => {
      label.deref()?.removeEventListener('click', (event: Event) => this.onClick(event));
    });
  }
}
