import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EventEmitter } from '../utils/decorators/index.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormControlMixin, HintMixin } from '../utils/mixins/index.js';
import { requiredValidator } from '../utils/index.js';
import { event } from '../utils/decorators/index.js';
import { EventsController, ValidationController, validationStyles } from '../utils/controllers/index.js';
import styles from './switch.scss.js';

export type SwitchSize = 'md' | 'lg';

export class Switch extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  #events = new EventsController(this);

  #validation = new ValidationController(this, {
    validators: [requiredValidator]
  });
  #initialState = false;

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** Emits when the checked state changes. */
  @event() change!: EventEmitter<boolean>;

  /** Whether the switch is on or off. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether the checkbox is invalid. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean;

  /** Button size. */
  @property({ reflect: true }) size: SwitchSize = 'md';

  /** The value for the switch. */
  @property() value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'switch';
    this.internals.ariaChecked = this.checked ? 'true' : 'false';

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this, 'keydown', this.#onKeydown);

    this.setFormControlElement(this);

    this.#validation.validate(this.checked ? this.value : undefined);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.internals.ariaChecked = this.checked ? 'true' : 'false';

      if (this.checked) {
        this.internals.states.add('--checked');
      } else {
        this.internals.states.delete('--checked');
      }
    }

    if (changes.has('checked') || changes.has('value')) {
      this.setFormValue(this.checked ? this.value : undefined);
    }
  }

  formAssociatedCallback(): void {
    this.#initialState = this.getAttribute('checked') === null ? false : true;
  }

  formResetCallback(): void {
    this.checked = this.#initialState;
    this.#validation.validate(this.checked ? this.value : undefined);
    this.change.emit(this.checked);
  }

  override render(): TemplateResult {
    return html`
      <label>
        <slot></slot>
        <div @click=${this.#onToggle} class="track"><div></div></div>
      </label>
      ${this.renderHint()} ${this.#validation.render()}
    `;
  }

  #onClick(event: Event): void {
    // If the user clicked the label, toggle the checkbox
    if (event.target === this) {
      this.renderRoot.querySelector<HTMLElement>('.track')?.click();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();

      this.renderRoot.querySelector<HTMLElement>('.track')?.click();
    }
  }

  #onToggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    this.#validation.validate(this.checked ? this.value : undefined);
    this.change.emit(this.checked);
  }
}
