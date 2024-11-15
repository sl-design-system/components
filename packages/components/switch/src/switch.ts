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

let nextUniqueId = 0;

/**
 * A toggle switch.
 *
 * ```html
 *   <sl-switch>Foo</sl-switch>
 * ```
 *
 * @slot default - Text label of the switch. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot input - The slot for the input element
 */
export class Switch<T = unknown> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-label', 'aria-labelledby'];
  }

  //static override observedAttributes = [...(super.observedAttributes || []), 'slot'];

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

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  // /** Observe aria-label, aria-labelledby... */
  // #observer = new MutationObserver(mutations => {
  //   // const { target } = mutations.find(m => m.attributeName === 'checked' && m.oldValue === null) || {};
  //   //
  //   // this.#observer.disconnect();
  //   // this.#setSelectedOption(target as Radio<T>);
  //   // this.#observer.observe(this, OBSERVER_OPTIONS);
  //   console.log('mutations', mutations);
  //
  //   for (const mutation of mutations) {
  //     console.log('mutation', mutation, mutation.target, (mutation.target as HTMLElement).ariaLabel);
  //     if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
  //       const ariaLabel = this.getAttribute('aria-label');
  //       const input = this.shadowRoot?.querySelector('input');
  //       console.log('ariaLabel in mutation observer', ariaLabel, input, this.input);
  //       if (input && ariaLabel) {
  //         input.setAttribute('aria-label', ariaLabel);
  //       }
  //     }
  //   }
  // });

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

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  override get formValue(): T | null {
    return this.checked ? ((this.value ?? true) as T) : null;
  }

  override set formValue(value: T | null) {
    this.checked = value === true || value === this.value;
  }

  // static override get observedAttributes() {
  //   return ['aria-label', 'aria-labelledby'];
  // }
  //
  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(
      'pre super attr changed',
      name,
      oldValue,
      newValue,
      this.input,
      this.shadowRoot?.querySelector('input'),
      this.renderRoot?.querySelector('input')
    );
    super.attributeChangedCallback(name, oldValue, newValue);
    console.log(
      'attr changed',
      name,
      oldValue,
      newValue,
      this.input,
      this.shadowRoot?.querySelector('input'),
      this.renderRoot?.querySelector('input'),
      this.shadowRoot
    );

    requestAnimationFrame(() => {
      console.log(
        'RAF attr changed',
        name,
        oldValue,
        newValue,
        this.input,
        this.shadowRoot?.querySelector('input'),
        this.renderRoot?.querySelector('input'),
        this.shadowRoot
      );
      // if (this.input) {
      //   if (name === 'aria-label') {
      //     this.input.setAttribute('aria-label', newValue || '');
      //     // this.removeAttribute('aria-label');
      //   } else if (name === 'aria-labelledby') {
      //     this.input.setAttribute('aria-labelledby', newValue || '');
      //     // this.removeAttribute('aria-labelledby');
      //   }
      // }

      if (this.input && (name === 'aria-label' || name === 'aria-labelledby')) {
        this.#updateAriaAttributes();
      }
    });

    // const input = this.shadowRoot.querySelector('input');
    // if (input) {
    //   if (name === 'aria-label') {
    //     input.setAttribute('aria-label', newValue);
    //   } else if (name === 'aria-labelledby') {
    //     input.setAttribute('aria-labelledby', newValue);
    //   }
    // }

    if (this.isConnected) {
      //   // Guarding with `isConnected` can be used here, but we also
      //   // need to synchronise this state in the `connectedCallback` as well.
      //   // this.update();
      //
      console.log('attr changed connected', name, oldValue, newValue, this.input);
    }
  }

  #updateAriaAttributes() {
    const input = this.shadowRoot?.querySelector('input');
    console.log('input in update', input, this.input);
    if (this.input) {
      const ariaLabel = this.getAttribute('aria-label');
      const ariaLabelledby = this.getAttribute('aria-labelledby');
      if (ariaLabel !== null) {
        this.input.setAttribute('aria-label', ariaLabel);
        this.removeAttribute('aria-label');
      }
      if (ariaLabelledby !== null) {
        this.input.setAttribute('aria-labelledby', ariaLabelledby);
        this.removeAttribute('aria-labelledby');
      }
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // this.internals.role = 'switch';

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.slot = 'input';
      this.input.type = 'checkbox';
      this.input.role = 'switch';
      this.#syncInput(this.input);

      if (!this.input.parentElement) {
        this.append(this.input);
      }

      // This is a workaround because we can't style the inner part based on :focus-visible and ::slotted
      const style = document.createElement('style');
      style.innerHTML = `
        sl-switch:has(input:focus-visible)::part(track) {
          outline: var(--_focus-outline);
          transition: var(--_transition);
          transition-property: background, border-color, color, filter, outline-color;        }
      `;
      this.append(style);
    }

    this.setFormControlElement(this.input /*this*/); // TODO: this.input instead of this?

    // if (!this.hasAttribute('tabindex')) {
    //   this.tabIndex = this.disabled ? -1 : 0;
    // }

    this.#onLabelSlotChange();

    // this.#observer.observe(this, { attributes: true, subtree: false }); // , attributeFilter: ['aria-label']
  }

  override disconnectedCallback(): void {
    // this.#observer.disconnect();
    super.disconnectedCallback();
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

    // if (changes.has('checked')) {
    //   this.internals.ariaChecked = this.checked ? 'true' : 'false';
    // }

    const props: Array<keyof Switch> = ['checked', 'disabled']; // required???

    if (props.some(prop => changes.has(prop))) {
      this.#syncInput(this.input);
    }

    if (changes.has('disabled')) {
      this.updateValidity();
    }

    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value?.toString() || '';
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
      <slot></slot>
      <slot @slotchange=${() => this.#onLabelSlotChange()} style="display: none"></slot>
      <slot @keydown=${this.#onKeydown} @slotchange=${this.#onInputSlotChange} name="input"></slot>
      <div class="toggle">
        <div part="track" aria-checked=${this.checked ? 'true' : 'false'}>
          <div>${this.size === 'sm' ? nothing : html`<sl-icon .name=${icon} .size=${size}></sl-icon>`}</div>
        </div>
      </div>
    `;
  } // TODO: aria-disabled aria-required...

  override focus(): void {
    this.input.focus();
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    if (event.target instanceof HTMLLabelElement) {
      this.input.click();
    }

    // event.preventDefault();
    event.stopPropagation();

    this.checked = !this.checked;
    this.input.checked = this.checked;
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
      event.preventDefault();
      event.stopPropagation();
      this.#onClick(event);
    }
  }

  #updateValue(): void {
    this.internals.setFormValue(this.nativeFormValue);

    this.updateValidity();
  }

  #onInputSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      input = elements.find((el): el is HTMLInputElement => el instanceof HTMLInputElement);

    // Handle the scenario where a custom input is being slotted after `connectedCallback`
    if (input) {
      this.input = input;
      this.#syncInput(this.input);

      this.setFormControlElement(this.input);
    }
  }

  #onLabelSlotChange(): void {
    const nodes = Array.from(this.childNodes).filter(
      node =>
        node.nodeType === Node.TEXT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE &&
          !(node as Element).hasAttribute('slot') &&
          !(node instanceof HTMLStyleElement))
    );

    console.log('nodes and label', nodes, this.#label);

    if (!nodes.length && this.#label) {
      // Prevent an infinite loop
      return;
    }

    const label = nodes.map(node => (node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() : node)).join(' ');
    if (label.length > 0) {
      this.#label ||= document.createElement('label');
      this.#label.htmlFor = this.input.id;
      this.#label.slot = '';
      this.#label.append(...nodes);
      this.append(this.#label);
    }

    console.log('this.#label', this.#label, label);

    //  this.toggleAttribute('no-label', label.length === 0);
  }

  #syncInput(input: HTMLInputElement): void {
    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-switch-${nextUniqueId++}`;
    /** input type checkbox with role switch:  https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/ */
    input.role = 'switch';

    input.checked = !!this.checked;
    input.setAttribute('aria-checked', this.checked ? 'true' : 'false');
  }
}

// TODO: what about aria-label added by a user?
// not working with aria-describedby yet

// TODO: improve aria-describedby when should be double id inserted
// TODO: unit testing
