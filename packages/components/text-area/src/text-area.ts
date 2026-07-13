import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  ObserveAttributesMixin,
  event,
  getCharacterPluralSuffix,
  getPluralCategory
} from '@sl-design-system/shared';
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
import styles from './text-area.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-text-area': TextArea;
  }
}

export type TextAreaSize = 'md' | 'lg';

export type ResizeType = 'none' | 'vertical' | 'auto';

export type WrapType = 'soft' | 'hard';

let nextUniqueId = 0;

/**
 * Multi line text area component.
 *
 * @slot textarea - The slot for the textarea element
 */
@localized()
export class TextArea extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-describedby', 'aria-disabled', 'aria-label', 'aria-labelledby', 'aria-required']
) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe the textarea width. */
  #observer = new ResizeObserver(() => {
    // Workaround for "ResizeObserver loop completed with undelivered notifications."
    requestAnimationFrame(() => this.#setSize());
  });

  /** Timer used to debounce the screen reader character count announcement. */
  #announceTimer?: ReturnType<typeof setTimeout>;

  /** Tracks whether the current custom validity was set by the showCount logic. */
  #hasCountCustomValidity = false;

  /** Tracks whether visual showValidity was enabled by showCount overflow logic. */
  #countForcedShowValidity = false;

  /** Whether the showCount overflow message may be shown (after reportValidity was called). */
  #showCountMessage = false;

  /** ID used to connect the character count to the textarea via aria-describedby. */
  #countId = `sl-text-area-count-${nextUniqueId++}`;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<string>>;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** The textarea in the light DOM. */
  textarea!: HTMLTextAreaElement;

  /**
   * Specifies which type of data the browser can use to pre-fill the textarea.
   *
   * NOTE: Declare the type this way so it is backwards compatible with 4.9.5, which we still use in
   * `@sl-design-system/angular`.
   */
  @property() autocomplete?: typeof HTMLTextAreaElement.prototype.autocomplete;

  /** Whether the textarea is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the textarea. */
  @property() placeholder?: string;

  /** Whether you can interact with the textarea or if it is just a static, readonly display. */
  @property({ type: Boolean }) readonly?: boolean;

  /** Whether the textarea is a required field. */
  @property({ type: Boolean }) override required?: boolean;

  /** The way the textarea can be resized. */
  @property({ reflect: true }) resize: ResizeType = 'vertical';

  /**
   * The number of rows the textarea should have. For resize auto and vertical, this will determine
   * the _minimum_ height of the textarea. If not set, the component defaults to 3 rows.
   */
  @property({ type: Number }) rows?: number;

  /**
   * The maximum number of characters allowed. When set, a character counter appears below the
   * textarea showing how many characters remain. When 90% of the limit is reached the counter turns
   * caution (orange). When the limit is exceeded it turns to a danger state, shows how many
   * characters are over the limit, and marks the textarea as invalid. Exceeding the limit does not
   * block input; the user can still type or paste more text and then edit it down.
   */
  @property({ type: Number, attribute: 'show-count' }) showCount?: number;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the textarea.
   *
   * @default md
   */
  @property({ reflect: true }) size?: TextAreaSize;

  /** The value for the textarea. */
  @property() override value: string = '';

  /** The way text should be wrapped during form submission. */
  @property() wrap: WrapType = 'soft';

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.textarea) {
      this.textarea =
        this.querySelector<HTMLTextAreaElement>('textarea[slot="textarea"]') ||
        document.createElement('textarea');
      this.textarea.slot = 'textarea';
      this.#syncTextarea(this.textarea);

      if (!this.textarea.parentElement) {
        this.append(this.textarea);
      }
    }

    this.#observer.observe(this.textarea);
    this.setFormControlElement(this.textarea);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    clearTimeout(this.#announceTimer);

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const props: Array<keyof TextArea> = [
      'autocomplete',
      'disabled',
      'maxLength',
      'minLength',
      'placeholder',
      'readonly',
      'resize',
      'required',
      'rows',
      'wrap'
    ];

    if (props.some(prop => changes.has(prop))) {
      this.#syncTextarea(this.textarea);
    }

    const valueChangedProgrammatically = changes.has('value') && this.value !== this.textarea.value;

    if (valueChangedProgrammatically) {
      this.textarea.value = this.value?.toString() || '';
    }

    if (valueChangedProgrammatically || changes.has('showCount')) {
      this.#syncCountValidity();
      this.updateValidity();
    }

    this.#syncCountAriaDescription();
  }

  override render(): TemplateResult {
    return html`
      <slot name="suffix">
        ${this.showValidity === 'valid'
          ? html`<sl-icon class="valid" name="circle-check-solid"></sl-icon>`
          : nothing}
      </slot>
      <slot @input=${this.#onInput} @slotchange=${this.#onSlotchange} name="textarea"></slot>
      ${this.#isCountVisible()
        ? html`
            <span class="count" data-count-state=${this.#getCountState()} id=${this.#countId}>
              ${this.#getCountText()}
            </span>
          `
        : nothing}
    `;
  }

  override focus(): void {
    this.textarea.focus();
  }

  override reportValidity(): boolean {
    this.#showCountMessage = true;

    if (this.#hasCountCustomValidity) {
      this.requestUpdate();
    }

    return super.reportValidity();
  }

  override getLocalizedValidationMessage(): string {
    if (this.validity.tooShort) {
      const length = this.value.length;

      return msg(
        str`Please enter at least ${this.minLength} character${getCharacterPluralSuffix(
          this.minLength ?? 0
        )} (you currently have ${length} character${getCharacterPluralSuffix(length)}).`,
        { id: 'sl.common.validation.tooShort' }
      );
    }

    if (this.validity.customError) {
      // For showCount overflow we only want visual invalid state until reportValidity() is called.
      if (this.#hasCountCustomValidity && !this.#showCountMessage) {
        return '';
      }

      return this.validationMessage;
    }

    return super.getLocalizedValidationMessage();
  }

  #getCountState(): 'default' | 'caution' | 'danger' {
    const remaining = (this.showCount ?? 0) - this.value.length;

    if (remaining < 0) {
      return 'danger';
    } else if (remaining <= (this.showCount ?? 0) * 0.1) {
      return 'caution';
    }

    return 'default';
  }

  #isCountVisible(): boolean {
    return (
      this.showCount !== undefined && !(this.#hasCountCustomValidity && this.#showCountMessage)
    );
  }

  #syncCountAriaDescription(): void {
    if (!this.textarea) {
      return;
    }

    const ids = (this.textarea.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .filter(id => id !== this.#countId);

    if (this.#isCountVisible()) {
      ids.push(this.#countId);
    }

    if (ids.length > 0) {
      this.textarea.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this.textarea.removeAttribute('aria-describedby');
    }
  }

  #getCountText(): string {
    const remaining = (this.showCount ?? 0) - this.value.length;

    if (remaining < 0) {
      const over = -remaining;

      switch (getPluralCategory(over)) {
        case 'one':
          return msg(str`${over} character too many`, {
            id: 'sl.textArea.charCountTooMany_one'
          });
        case 'few':
          return msg(str`${over} characters too many`, {
            id: 'sl.textArea.charCountTooMany_few'
          });
        default:
          return msg(str`${over} characters too many`, {
            id: 'sl.textArea.charCountTooMany_many'
          });
      }
    }

    switch (getPluralCategory(remaining)) {
      case 'one':
        return msg(str`${remaining} character remaining`, {
          id: 'sl.textArea.charCountRemaining_one'
        });
      case 'few':
        return msg(str`${remaining} characters remaining`, {
          id: 'sl.textArea.charCountRemaining_few'
        });
      default:
        return msg(str`${remaining} characters remaining`, {
          id: 'sl.textArea.charCountRemaining_many'
        });
    }
  }

  #onBlur(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onInput({ target }: Event & { target: HTMLTextAreaElement }): void {
    this.value = target.value;
    this.updateState({ dirty: true });

    this.#syncCountValidity();

    this.updateValidity();
    this.#setSize();
    this.changeEvent.emit(this.value);

    if (this.showCount !== undefined) {
      clearTimeout(this.#announceTimer);
      this.#announceTimer = setTimeout(() => {
        announce(this.#getCountText(), 'polite');
      }, 1000);
    }
  }

  #syncCountValidity(): void {
    if (this.showCount === undefined) {
      if (this.#hasCountCustomValidity) {
        this.textarea.setCustomValidity('');
        this.#hasCountCustomValidity = false;
      }

      if (this.#countForcedShowValidity) {
        this.removeAttribute('show-validity');
        this.#countForcedShowValidity = false;
      }

      this.#showCountMessage = false;

      return;
    }

    if (this.value.length > this.showCount) {
      const over = this.value.length - this.showCount;
      let validationMessage: string;

      switch (getPluralCategory(over)) {
        case 'one':
          validationMessage = msg(str`Please remove at least ${over} character.`, {
            id: 'sl.textArea.validation.tooLong_one'
          });
          break;
        case 'few':
          validationMessage = msg(str`Please remove at least ${over} characters.`, {
            id: 'sl.textArea.validation.tooLong_few'
          });
          break;
        default:
          validationMessage = msg(str`Please remove at least ${over} characters.`, {
            id: 'sl.textArea.validation.tooLong_many'
          });
          break;
      }

      this.textarea.setCustomValidity(validationMessage);

      // Show visual invalid state immediately, but do not force reporting yet.
      this.setAttribute('show-validity', 'invalid');
      this.#countForcedShowValidity = true;
      this.#hasCountCustomValidity = true;
    } else if (this.#hasCountCustomValidity) {
      this.textarea.setCustomValidity('');
      this.#hasCountCustomValidity = false;

      if (this.#countForcedShowValidity) {
        this.removeAttribute('show-validity');
        this.#countForcedShowValidity = false;
      }
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textarea = elements.find(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textarea) {
      this.textarea = textarea;
      this.textarea.addEventListener('blur', () => this.#onBlur());
      this.textarea.addEventListener('focus', () => this.focusEvent.emit());
      this.#syncTextarea(this.textarea);

      this.setFormControlElement(this.textarea);
    }
  }

  #setSize(): void {
    if (this.resize === 'auto') {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
      this.textarea.style.resize = 'none';
    } else if (this.resize === 'vertical') {
      (this.textarea.style.height as string | undefined) = undefined;
    } else {
      this.textarea.style.removeProperty('height');
    }
  }

  #syncTextarea(textarea: HTMLTextAreaElement): void {
    textarea.autocomplete = this.autocomplete || 'off';
    textarea.autofocus = this.autofocus;
    textarea.disabled = !!this.disabled;
    textarea.id ||= `sl-text-area-${nextUniqueId++}`;
    textarea.placeholder = this.placeholder ?? '';
    textarea.readOnly = !!this.readonly;
    textarea.required = !!this.required;
    textarea.rows = this.rows && this.rows > 0 ? this.rows : 3;
    textarea.style.resize = this.resize ?? 'vertical';
    textarea.wrap = this.wrap ?? 'soft';

    textarea.style.setProperty('--_sl-text-area-rows', textarea.rows?.toString());

    this.setAttributesTarget(textarea);

    if (typeof this.maxLength === 'number') {
      textarea.setAttribute('maxlength', this.maxLength.toString());
    } else {
      textarea.removeAttribute('maxlength');
    }

    if (typeof this.minLength === 'number') {
      textarea.setAttribute('minlength', this.minLength.toString());
    } else {
      textarea.removeAttribute('minlength');
    }

    this.#setSize();
  }
}
