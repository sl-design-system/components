import { localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { type EventEmitter, EventsController, ObserveAttributesMixin, event } from '@sl-design-system/shared';
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

let nextUniqueId = 0;

/**
 * A checkbox with 3 states; unchecked, checked and intermediate.
 *
 * @csspart - outer - The outer container of the checkbox
 * @csspart - inner - The inner container of the checkbox
 * @csspart - label - The label of the checkbox
 *
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot input - The slot for the input element
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Checkbox<T = any> extends ObserveAttributesMixin(FormControlMixin(LitElement), [
  'aria-disabled',
  'aria-label',
  'aria-labelledby'
]) {
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

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /**
   * Whether the checkbox is checked.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /**
   * Whether the checkbox is disabled; when set no interaction is possible.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /**
   * Whether the checkbox has the indeterminate state.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate?: boolean;

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  /**
   * Whether the checkbox is required.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /**
   * When set will cause the control to show it is valid after reportValidity is called.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the checkbox.
   * @default 'md'
   */
  @property({ reflect: true }) size?: CheckboxSize;

  /**
   * The value of the checkbox when the checkbox is checked.
   * See the formValue property for easy access.
   */
  @property() override value?: T;

  override get formValue(): T | null {
    return this.checked ? ((this.value ?? true) as T) : null;
  }

  override set formValue(value: T | null) {
    this.checked = value === this.value || (this.value === undefined && value === true);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.slot = 'input';
      this.input.type = 'checkbox';
      this.#syncInput(this.input);

      if (!this.input.parentElement) {
        this.append(this.input);
      }

      // This is a workaround because we can't style the inner part based on :focus-visible and ::slotted
      const style = document.createElement('style');
      style.innerHTML = `
        sl-checkbox:has(input:focus-visible)::part(inner) {
          outline-color: var(--sl-color-border-focused);
          transition: 200ms ease-in-out;
          transition-property: background, border-color, color, outline-color;
        }
      `;
      this.append(style);
    }

    this.setFormControlElement(this.input);

    this.#onLabelSlotChange();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const props: Array<keyof Checkbox> = ['checked', 'disabled', 'indeterminate', 'required'];

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
    return html`
      <slot @keydown=${this.#onKeydown} @slotchange=${this.#onInputSlotChange} name="input"></slot>
      <div part="outer">
        <div part="inner">
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
      <span part="label">
        <slot name="label"></slot>
        <slot @slotchange=${() => this.#onLabelSlotChange()} style="display: none"></slot>
      </span>
    `;
  }

  override focus(): void {
    this.input.focus();
  }

  override blur(): void {
    this.input.blur();
  }

  override getLocalizedValidationMessage(): string {
    if (!this.validity.customError && this.validity.valueMissing) {
      return msg('Please check this box.', { id: 'sl.checkbox.validation.valueMissing' });
    }

    return super.getLocalizedValidationMessage();
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    const label = event.composedPath().find((el): el is HTMLLabelElement => el instanceof HTMLLabelElement);
    if (label?.parentElement === this) {
      this.input.click();

      event.preventDefault();
      event.stopPropagation();

      // Return early to prevent the checkbox from being toggled twice
      return;
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
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join(' ');
    if (label.length > 0) {
      this.#label ||= document.createElement('label');
      this.#label.htmlFor = this.input.id;
      this.#label.id ||= `sl-checkbox-label-${nextUniqueId++}`;
      this.#label.setAttribute('aria-hidden', 'true');
      this.#label.slot = 'label';
      this.#label.append(...nodes);
      this.append(this.#label);
    }

    requestAnimationFrame(() => {
      if (this.input.labels?.length) {
        this.input.setAttribute(
          'aria-labelledby',
          Array.from(this.input.labels)
            .map(label => label.id)
            .join(' ')
        );
      }
    });

    this.toggleAttribute('no-label', label.length === 0);
  }

  #syncInput(input: HTMLInputElement): void {
    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-checkbox-${nextUniqueId++}`;
    input.required = !!this.required;

    input.checked = !!this.checked;
    input.indeterminate = !!this.indeterminate;
    input.setAttribute('aria-checked', this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false');

    this.setAttributesTarget(input);
  }
}
