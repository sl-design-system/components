import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '@sl-design-system/shared';
import {
  EventsController,
  FormControlMixin,
  HintMixin,
  ValidationController,
  hintStyles,
  validationStyles
} from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './textarea.scss.js';

export type TextareaSize = 'md' | 'lg';

export type ResizeType = 'none' | 'vertical' | 'auto'; // TODO: add auto?
// 'none' | 'both' | 'horizontal' | 'vertical';

let nextUniqueId = 0;

/**
 * Single line text input component.
 *
 * @slot textarea - The slot for the textarea element
 */
export class Textarea extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  // #onKeydown = (): void => {
  //   this.#clicked = false;
  // };
  //
  // #onFocusin = (): void => {
  //   if (!this.#clicked) {
  //     this.focusVisible = true;
  //   }
  // };
  //
  // #onFocusout = (): void => {
  //   this.#clicked = false;
  //   this.focusVisible = false;
  // };
  //
  // #onMousedown = (): void => {
  //   this.#clicked = true;
  //   this.focusVisible = false;
  // };

  #events = new EventsController(this, {
    click: this.#onClick
  });

  #validation = new ValidationController(this, {
    target: () => this.textarea
  });

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** The textarea in the light DOM. */
  textarea!: HTMLTextAreaElement;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether you can interact with the textarea or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Custom validators specified by the user. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the textarea. */
  @property() value?: string;

  /** Whether the textarea is valid. */
  @property({ type: Boolean, reflect: true }) valid?: boolean;

  /** Whether the textarea should get valid styles when is valid. */
  @property({ type: Boolean, reflect: true }) showValid = false;

  /** Textarea size. */
  @property({ reflect: true }) resize: ResizeType = 'vertical'; // TODO: add auto? auto or autogrow?

  /** Textarea size. */
  @property({ reflect: true }) size: TextareaSize = 'md';

  // TODO resize vertical / horizontal /  none? maybe vertical by default?

  // /** The number of rows. */
  // @property({ type: Number }) rows = 3; // TODO: min-block-size instead?

  // /** Whether the input has focus visible. */
  // @property({ type: Boolean, reflect: true, attribute: 'focus-visible-within' }) focusVisible = false;
  //
  // /** @private used for focusVisible */
  // #clicked = false;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.textarea) {
      this.textarea =
        this.querySelector<HTMLTextAreaElement>('textarea[slot="input"]') || document.createElement('textarea');
      this.textarea.id ||= `sl-textarea-${nextUniqueId++}`;
      this.textarea.slot = 'textarea';

      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      }

      if (!this.textarea.parentElement) {
        this.append(this.textarea);
      }

      this.setFormControlElement(this.textarea);

      this.#validation.validate(this.value);
    }

    console.log(
      'setSize in connectedCallback',
      this.textarea.scrollHeight,
      (this as HTMLElement).scrollHeight,
      (this as HTMLElement).clientHeight,
      this.textarea.clientHeight,
      this.textarea.getBoundingClientRect().height,
      this.textarea.getBoundingClientRect().top,
      this.textarea.getBoundingClientRect().right
    );
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('maxLength')) {
      if (this.maxLength) {
        this.textarea.setAttribute('maxlength', this.maxLength.toString());
      } else {
        this.textarea.removeAttribute('maxlength');
      }
    }

    if (changes.has('minLength')) {
      if (this.minLength) {
        this.textarea.setAttribute('minlength', this.minLength.toString());
      } else {
        this.textarea.removeAttribute('minlength');
      }
    }

    if (changes.has('placeholder')) {
      if (this.placeholder) {
        this.textarea.setAttribute('placeholder', this.placeholder);
      } else {
        this.textarea.removeAttribute('placeholder');
      }
    }

    // if (changes.has('rows')) {
    //   if (this.rows) {
    //     this.textarea.setAttribute('rows', this.rows.toString());
    //   } else {
    //     this.textarea.removeAttribute('rows');
    //   }
    // }

    if (changes.has('readonly')) {
      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      } else {
        this.textarea.removeAttribute('readonly');
      }
    }

    if (changes.has('value') && this.value !== this.textarea.value) {
      this.textarea.value = this.value || '';
    }

    // if (changes.has('resize')) {
    //   if (this.resize) {
    //     this.textarea.style.resize = this.resize;
    //   } else {
    //     this.textarea.style.resize = 'vertical';
    //   }
    // }

    // resize

    // TODO: set height auto for other resizes than auto

    console.log(
      'setSize in updated',
      this.textarea.scrollHeight,
      (this as HTMLElement).scrollHeight,
      (this as HTMLElement).clientHeight,
      this.textarea.clientHeight,
      this.textarea.getBoundingClientRect().height,
      this.textarea.getBoundingClientRect().top,
      this.textarea.getBoundingClientRect().right
    );
  }

  // TODO: add focus-visible-within attribute

  override render(): TemplateResult {
    console.log(
      'setSize in render',
      this.textarea.scrollHeight,
      (this as HTMLElement).scrollHeight,
      (this as HTMLElement).clientHeight,
      this.textarea.clientHeight,
      this.textarea.getBoundingClientRect().height,
      this.textarea.getBoundingClientRect().top,
      this.textarea.getBoundingClientRect().right
    );
    return html`
      <div @input=${this.#onInput} class="wrapper">
        <slot @slotchange=${this.#onSlotchange} name="textarea"></slot>
        <slot name="suffix">
          <sl-icon class="invalid-icon" name="triangle-exclamation-solid" size=${this.size}></sl-icon>
          ${this.valid
            ? html`<sl-icon class="valid-icon" name="circle-check-solid" size=${this.size}></sl-icon>`
            : null}
        </slot>
      </div>
      ${this.#validation.render() ? this.#validation.render() : this.renderHint()}
    `; //         <span>Place for icon</span>
  }

  // <sl-icon name="face-smile" size="lg"></sl-icon>

  // <sl-icon class="invalid-icon" name="fas-triangle-exclamation" size=${this.size}></sl-icon>
  //           ${this.valid ? html`<sl-icon class="valid-icon" name="fas-circle-check" size=${this.size}></sl-icon>` : null}

  // @keydown=${this.#onKeydown}
  // @focusin=${this.#onFocusin}
  // @focusout=${this.#onFocusout}
  // @mousedown=${this.#onMousedown}

  // TODO: set valid when showValid and textarea is valid

  #onClick(event: Event): void {
    if (event.target === this.textarea) {
      event.preventDefault();

      this.textarea.focus();
    }
  }

  #onInput({ target }: Event & { target: HTMLTextAreaElement }): void {
    this.value = target.value;
    this.#validation.validate(this.value);

    if (this.resize === 'auto') {
      this.#setSize();
    }
  }

  #setSize(): void {
    console.log(
      'setSize',
      this.textarea.offsetHeight,
      this.textarea.scrollHeight,
      this.textarea.clientHeight,
      (this as HTMLElement).scrollHeight,
      (this as HTMLElement).clientHeight,
      this.textarea.getBoundingClientRect().height,
      this.textarea.getBoundingClientRect().top,
      this.textarea.getBoundingClientRect().right
    );
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    //this.textarea.style.resize = 'none';
    // (this as HTMLElement).style.height = 'auto';
    // (this as HTMLElement).style.height = `${(this as HTMLElement).scrollHeight}px`;
    // const wrapper = this.renderRoot.querySelector<HTMLElement>('.wrapper');
    // if (wrapper) {
    //   wrapper.style.height = 'auto';
    //   wrapper.style.height = `${(this as HTMLElement).scrollHeight}px`;
    // }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textareas = elements.filter(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement && el !== this.textarea
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textareas.length) {
      this.textarea = textareas[0];
      this.textarea.id ||= `sl-textarea-${nextUniqueId++}`;

      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      }

      this.setFormControlElement(this.textarea);
    }
  }
}
