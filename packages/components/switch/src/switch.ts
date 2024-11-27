import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, ObserveAttributesMixin, event } from '@sl-design-system/shared';
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
export class Switch<T = unknown> extends ObserveAttributesMixin(FormControlMixin(ScopedElementsMixin(LitElement))) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-disabled', 'aria-label', 'aria-labelledby'];
  }

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
    this.checked = value === this.value || (this.value === undefined && value === true);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.setObservedAttributes(['aria-disabled', 'aria-label', 'aria-labelledby']);

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

    this.setFormControlElement(this.input);

    this.#onLabelSlotChange();
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

    this.updateValidity();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const props: Array<keyof Switch> = ['checked', 'disabled'];

    if (props.some(prop => changes.has(prop))) {
      this.#syncInput(this.input);
    }

    if (changes.has('disabled')) {
      this.updateValidity();
    }

    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value?.toString() || '';
    }
  }

  override render(): TemplateResult {
    const icon = this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark',
      size = this.size === 'md' ? 'xs' : 'md';

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
  }

  override focus(): void {
    this.input.focus();
  }

  override blur(): void {
    this.input.blur();
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    if (event.target instanceof HTMLLabelElement) {
      this.input.click();
    }

    event.stopPropagation();

    this.checked = !this.checked;
    this.input.checked = this.checked;
    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });
    this.updateValidity();
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

    if (!nodes.length && this.#label) {
      // Prevent an infinite loop
      return;
    }

    const label = nodes
      .map(node => (node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() : node))
      .join(' ')
      .trim();
    if (label.length > 0) {
      this.#label ||= document.createElement('label');
      this.#label.htmlFor = this.input.id;
      this.#label.slot = '';
      this.#label.append(...nodes);
      this.append(this.#label);
    }

    this.toggleAttribute('no-label', label.length === 0);
  }

  #syncInput(input: HTMLInputElement): void {
    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-switch-${nextUniqueId++}`;
    /** input type checkbox with role switch:  https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/ */
    input.role = 'switch';

    input.checked = !!this.checked;
    input.setAttribute('aria-checked', this.checked ? 'true' : 'false');

    this.setTargetElement(input);
  }
}
