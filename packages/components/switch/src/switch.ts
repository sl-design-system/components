import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EventEmitter } from '@sl-design-system/shared';
import {
  EventsController,
  FormControlMixin,
  HintMixin,
  ValidationController,
  event,
  requiredValidator,
  validationStyles
} from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './switch.scss.js';

export type SwitchSize = 'sm' | 'md' | 'lg';

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

  /** Custom icon in "off" state. */
  @property({ reflect: true }) iconOff?: string;

  /** Custom icon in "on" state. */
  @property({ reflect: true }) iconOn?: string;

  /** Button size. */
  @property({ reflect: true }) size: SwitchSize = 'md';

  /** The value for the switch. */
  @property() value?: string;

  @queryAssignedElements() label?: string;

  get icon(): string {
    return this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark';
  }

  get iconSize(): string {
    return this.size === 'md' ? 'xs' : 'md';
  }

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

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    console.log(this.label, event.target.assignedNodes({ flatten: false }));
  }

  override render(): TemplateResult {
    return html`
      <div class="text">
        <sl-label .size=${this.size}><slot @slotchange=${this.#onSlotChange}></slot></sl-label>
        ${this.renderHint()} ${this.#validation.render()}
      </div>
      <div class="toggle">
        <div @click=${this.#onToggle} class="track">
          <div>${this.size !== 'sm' ? html`<sl-icon .name=${this.icon} .size=${this.iconSize}></sl-icon>` : ``}</div>
        </div>
      </div>
    `;
  }

  #onClick(event: Event): void {
    // If the user clicked the label, toggle the switch

    // TODO: make sure this only happens with clicks on the toggle and the label?
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
