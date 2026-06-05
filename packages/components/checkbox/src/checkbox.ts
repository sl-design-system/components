import { localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { type EventEmitter, event } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  svg
} from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './checkbox.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
  }
}

export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * A checkbox with 3 states; unchecked, checked and intermediate.
 *
 * @customElement sl-checkbox
 *
 * @slot - Text label of the checkbox.
 *
 * @csspart outer - The outer container of the checkbox.
 * @csspart inner - The inner container of the checkbox.
 * @csspart label - The label of the checkbox.
 *
 * @cssstate checked - The checkbox is checked.
 * @cssstate indeterminate - The checkbox is in the indeterminate state.
 * @cssstate no-label - The checkbox has no label.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Checkbox<T = any> extends FormControlMixin(LitElement) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /**
   * Whether the checkbox is checked.
   *
   * @default false
   */
  @property({ type: Boolean }) checked?: boolean;

  /**
   * Whether the checkbox is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /**
   * Whether the checkbox has the indeterminate state.
   *
   * @default false
   */
  @property({ type: Boolean }) indeterminate?: boolean;

  /** @internal */
  readonly internals = this.attachInternals();

  /**
   * Whether the checkbox is required.
   *
   * @default false
   */
  @property({ type: Boolean }) override required?: boolean;

  /**
   * When set will cause the control to show it is valid after reportValidity is called.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the checkbox.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: CheckboxSize;

  /**
   * The value of the checkbox when the checkbox is checked. See the formValue property for easy
   * access.
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

    this.internals.role = 'checkbox';

    if (this.#eventController.signal.aborted) {
      this.#eventController = new AbortController();
    }

    const { signal } = this.#eventController;

    this.addEventListener('blur', this.#onBlur, { signal });
    this.addEventListener('click', this.#onClick, { signal });
    this.addEventListener('focus', this.#onFocus, { signal });
    this.addEventListener('keydown', this.#onKeydown, { signal });

    this.setFormControlElement(this);
  }

  override disconnectedCallback(): void {
    this.#eventController.abort();

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.internals.ariaChecked = Boolean(this.checked).toString();
    this.internals.ariaRequired = this.required ? 'true' : 'false';

    const slot = this.shadowRoot?.querySelector('slot');
    if (slot) {
      this.#updateNoLabelState(slot);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.internals.ariaChecked = Boolean(this.checked).toString();

      if (this.checked) {
        this.internals.states.add('checked');
      } else {
        this.internals.states.delete('checked');
      }

      this.updateValidity();
    }

    if (changes.has('disabled')) {
      this.updateValidity();
    }

    if (changes.has('indeterminate')) {
      if (this.indeterminate) {
        this.internals.ariaChecked = 'mixed';
        this.internals.states.add('indeterminate');
      } else {
        this.internals.ariaChecked = Boolean(this.checked).toString();
        this.internals.states.delete('indeterminate');
      }
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
      this.updateValidity();
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="outer">
        <div part="inner" tabindex=${ifDefined(this.disabled ? undefined : '0')}>
          <svg
            aria-hidden="true"
            class=${classMap({ checked: !!this.checked, indeterminate: !!this.indeterminate })}
            part="svg"
            version="1.1"
            viewBox="0 0 24 24">
            ${this.indeterminate
              ? svg`<path d="M4.1,12 9,12 20.3,12"></path>`
              : svg`<path d="M4.1,12.7 9,17.6 20.3,6.3"></path>`}
          </svg>
        </div>
      </div>
      <span part="label">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </span>
    `;
  }

  override updateInternalValidity(): void {
    if (this.validity.customError) {
      return;
    }

    if (this.required && !this.checked) {
      this.internals.setValidity(
        { valueMissing: true },
        msg('Please check this box.', { id: 'sl.checkbox.validation.valueMissing' })
      );
    } else {
      this.internals.setValidity({});
    }
  }

  override getLocalizedValidationMessage(): string {
    if (!this.validity.customError && this.validity.valueMissing) {
      return msg('Please check this box.', { id: 'sl.checkbox.validation.valueMissing' });
    }

    return super.getLocalizedValidationMessage();
  }

  #onBlur = (): void => {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  };

  #onClick = (event: Event) => {
    if (this.disabled || this.ariaDisabled === 'true') {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    this.checked = !this.checked;
    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });
  };

  #onFocus = (): void => {
    this.focusEvent.emit();
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.#onClick(event);
    }
  };

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.#updateNoLabelState(event.target);
  }

  #updateNoLabelState(slot: HTMLSlotElement): void {
    const text = slot
      .assignedNodes({ flatten: true })
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');

    if (text) {
      this.internals.states.delete('no-label');
    } else {
      this.internals.states.add('no-label');
    }
  }
}
