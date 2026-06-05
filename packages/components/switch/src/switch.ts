import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
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
  nothing
} from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './switch.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-switch': Switch;
  }
}

export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * A toggle switch.
 *
 * @customElement sl-switch
 *
 * @slot - Text label of the switch.s
 *
 * @cssstate checked - The switch is on.
 * @cssstate no-label - The switch has no label.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Switch<T = any> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** The initial state of the switch. */
  #initialState = false;

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /**
   * Whether the switch is on or off.
   *
   * @default false
   */
  @property({ type: Boolean }) checked?: boolean;

  /**
   * Whether the switch is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** Custom icon in "off" state. */
  @property({ reflect: true, attribute: 'icon-off' }) iconOff?: string;

  /** Custom icon in "on" state. */
  @property({ reflect: true, attribute: 'icon-on' }) iconOn?: string;

  /** @internal */
  readonly internals = this.attachInternals();

  /**
   * Whether the switch is required.
   *
   * @default false
   */
  @property({ type: Boolean }) override required?: boolean;

  /**
   * Whether the toggle should be shown _after_ the text.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) reverse?: boolean;

  /**
   * The size of the switch.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: SwitchSize;

  /** The value of the switch when the switch is checked. See the formValue property for easy access. */
  @property() override value?: T;

  override get formValue(): T | null {
    return this.checked ? ((this.value ?? true) as T) : null;
  }

  override set formValue(value: T | null) {
    this.checked = value === this.value || (this.value === undefined && value === true);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'switch';

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

  formAssociatedCallback(): void {
    this.#initialState = this.hasAttribute('checked');
  }

  formResetCallback(): void {
    this.checked = this.#initialState;
    this.changeEvent.emit(this.formValue);
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

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
      this.updateValidity();
    }
  }

  override render(): TemplateResult {
    const icon = this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark',
      size = this.size === 'md' ? 'xs' : 'md';

    return html`
      <slot @slotchange=${this.#onSlotChange}></slot>
      <div part="toggle">
        <div part="track" tabindex=${ifDefined(this.disabled ? undefined : '0')}>
          <div part="handle">
            ${this.size === 'sm' ? nothing : html`<sl-icon .name=${icon} .size=${size}></sl-icon>`}
          </div>
        </div>
      </div>
    `;
  }

  override updateInternalValidity(): void {
    if (this.validity.customError) {
      return;
    }

    if (this.required && !this.checked) {
      this.internals.setValidity(
        { valueMissing: true },
        msg('Please enable this switch.', { id: 'sl.switch.validation.valueMissing' })
      );
    } else {
      this.internals.setValidity({});
    }
  }

  override getLocalizedValidationMessage(): string {
    if (!this.validity.customError && this.validity.valueMissing) {
      return msg('Please enable this switch.', { id: 'sl.switch.validation.valueMissing' });
    }

    return super.getLocalizedValidationMessage();
  }

  #onBlur = (): void => {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  };

  #onClick = (event: Event): void => {
    if (this.disabled || this.ariaDisabled === 'true') {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    event.stopPropagation();

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
