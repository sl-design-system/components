import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EventEmitter } from '@sl-design-system/shared';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { msg } from '@lit/localize';
import { Error, FormControlMixin, Hint } from '@sl-design-system/form';
import { event } from '@sl-design-system/shared';
import { LitElement, html, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './checkbox.scss.js';

export type CheckboxSize = 'md' | 'lg';

/**
 * A checkbox with 3 states; unchecked, checked and intermediate.
 *
 * @csspart wrapper - The checkbox's wrapper
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 */
export class Checkbox extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-error': Error,
      'sl-hint': Hint
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [FormControlMixin.styles, styles];

  /** The initial state when the form was associated with the checkbox. Used to reset the checkbox. */
  #initialState = false;

  /** @private */
  readonly internals = this.attachInternals();

  /** Emits when the checked state changes. */
  @event() change!: EventEmitter<boolean>;

  /** Whether the checkbox is checked. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Whether the checkbox is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the checkbox has the indeterminate state. */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Whether the checkbox is required. */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * The size of the checkbox
   * @type {'md' | 'lg'}
   */
  @property({ reflect: true }) size: CheckboxSize = 'md';

  /** The value for the checkbox, to be used in forms. */
  @property() value: string | null = null;

  /** @ignore */
  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'checkbox';
    this.setFormControlElement(this);
    this.#updateNoLabel();
  }

  /** @ignore Stores the initial state of the checkbox */
  formAssociatedCallback(): void {
    this.#initialState = this.hasAttribute('checked');
  }

  /** @ignore Resets the checkbox to the initial state */
  formResetCallback(): void {
    this.checked = this.#initialState;
    this.change.emit(this.checked);
  }

  /** @ignore */
  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('checked') || changes.has('required') || changes.has('value')) {
      this.internals.setFormValue(this.checked ? this.value : null);
      this.internals.setValidity({ valueMissing: !!this.required && !this.checked }, msg('Please check this box'));
      this.updateValidity();
    }
  }

  /** @ignore */
  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked') || changes.has('indeterminate')) {
      this.internals.ariaChecked = this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false';
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
    }
  }

  /** @ignore */
  override render(): TemplateResult {
    return html`
      <div @click=${this.#onClick} @keydown=${this.#onKeydown} class="wrapper" part="wrapper">
        <div class="outer">
          <div class="inner" .tabIndex=${this.disabled ? -1 : 0}>
            <svg
              aria-hidden="true"
              class=${classMap({ checked: this.checked, indeterminate: this.indeterminate })}
              focusable="false"
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
        <span class="label">
          <slot @slotchange=${() => this.#updateNoLabel()}></slot>
        </span>
      </div>

      <sl-error .size=${this.size}></sl-error>
      <sl-hint .size=${this.size}></sl-hint>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = !this.checked;
    this.change.emit(this.checked);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #updateNoLabel(): void {
    const empty = Array.from(this.childNodes)
      .filter(
        node =>
          (node.nodeType === Node.ELEMENT_NODE && !(node as Element).hasAttribute('slot')) ||
          node.nodeType === Node.TEXT_NODE
      )
      .every(node => node.nodeType !== Node.ELEMENT_NODE && node.textContent?.trim() === '');

    this.toggleAttribute('no-label', empty);
  }
}
