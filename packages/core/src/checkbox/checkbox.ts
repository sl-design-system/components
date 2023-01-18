import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EventEmitter } from '../utils/decorators/event.js';
import { LitElement, html, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsController } from '../utils/controllers/events.js';
import { event } from '../utils/decorators/event.js';
import { FormControlMixin, requiredValidator, validationStyles } from '../utils/form-control/index.js';
import styles from './checkbox.scss.js';

export class Checkbox extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static formControlValidators = [requiredValidator];

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  /** Events controller. */
  #events = new EventsController(this);

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** Emits when the checked state changes. */
  @event() change!: EventEmitter<boolean>;

  /** Whether the checkbox is checked. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Whether the checkbox has the indeterminate state. */
  @property({ type: Boolean }) indeterminate = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'checkbox';

    this.setFormControlElement(this);

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this, 'keydown', this.#onKeydown);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked') || changes.has('indeterminate')) {
      this.internals.ariaChecked = this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false';

      if (this.indeterminate) {
        this.internals.states.add('--indeterminate');
      } else {
        this.internals.states.delete('--indeterminate');
      }

      if (this.checked) {
        this.internals.states.add('--checked');
      } else {
        this.internals.states.delete('--checked');
      }
    }

    if (changes.has('checked') || changes.has('value')) {
      this.setValue(this.value);
    }
  }

  override render(): TemplateResult {
    return html`
      <div @click=${this.#onToggle} class="wrapper">
        <span class="box">
          <svg version="1.1" aria-hidden="true" focusable="false" part="svg" viewBox="0 0 24 24">
            ${this.indeterminate
              ? svg`<path d="M4.1,12 9,12 20.3,12"></path>`
              : svg`<path d="M4.1,12.7 9,17.6 20.3,6.3"></path>`}
          </svg>
        </span>
        <slot></slot>
      </div>
      ${this.renderHint()} ${this.renderValidation()}
    `;
  }

  // override resetFormControl(): void {
  //   this.checked = this.hasAttribute('checked');
  // }

  override shouldFormValueUpdate(): boolean {
    return this.checked;
  }

  #onClick(event: Event): void {
    // If the user clicked the label, toggle the checkbox
    if (event.target === this) {
      this.renderRoot.querySelector<HTMLElement>('.wrapper')?.click();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();

      this.checked = !this.checked;
      this.change.emit(this.checked);
    }
  }

  #onToggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.checked = !this.checked;
    this.change.emit(this.checked);
  }
}
