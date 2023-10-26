import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { EventEmitter } from '@sl-design-system/shared';
import type { IconSize } from '@sl-design-system/icon';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Icon } from '@sl-design-system/icon';
import { FormControlMixin, HintMixin, event, hintStyles } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './switch.scss.js';

export type SwitchOrientation = 'horizontal' | 'vertical';

export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * A toggle switch.
 *
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 */
export class Switch extends FormControlMixin(HintMixin(ScopedElementsMixin(LitElement))) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [hintStyles, styles];

  /** The initial state of the switch. Used for when a parent form is reset. */
  #initialState = false;

  /** @private */
  readonly internals = this.attachInternals();

  /** Emits when the checked state changes. */
  @event() change!: EventEmitter<boolean>;

  /** Whether the switch is on or off. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Whether the text input is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Custom icon in "off" state. */
  @property({ reflect: true }) iconOff?: string;

  /** Custom icon in "on" state. */
  @property({ reflect: true }) iconOn?: string;

  /** Whether the switch is invalid. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean;

  /**
   * The orientation of the switch.
   * @type {'horizontal' | 'vertical'}
   */
  @property({ reflect: true }) orientation: SwitchOrientation = 'horizontal';

  /**
   * The size of the switch.
   * @type { 'sm' | 'md' | 'lg'}
   */
  @property({ reflect: true }) size: SwitchSize = 'md';

  /** The value for the switch, to be used in forms. */
  @property() value: string | null = null;

  /** @private The name of the icon, factoring in state and custom icons. */
  get icon(): string {
    return this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark';
  }

  /** @private The size of the icon, depending on the size of the switch. */
  get iconSize(): IconSize {
    return this.size === 'md' ? 'xs' : 'md';
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.classList.add('no-label');

    this.setAttribute('error-size', this.size);
    this.hintSize = this.size;

    this.internals.role = 'switch';

    this.setFormControlElement(this);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  /** @ignore Stores the initial state of the switch */
  formAssociatedCallback(): void {
    this.#initialState = this.getAttribute('checked') !== null;
  }

  /** @ignore Resets the switch to the initial state */
  formResetCallback(): void {
    this.checked = this.#initialState;
    this.change.emit(this.checked);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.internals.ariaChecked = this.checked ? 'true' : 'false';
    }

    if (changes.has('disabled')) {
      this.internals.ariaDisabled = this.disabled ? 'true' : 'false';
    }

    if (changes.has('checked') || changes.has('value')) {
      this.internals.setFormValue(this.checked ? this.value : null);
    }

    if (changes.has('size')) {
      this.setAttribute('error-size', this.size);
    }
  }

  override render(): TemplateResult {
    return html`
      <div @click=${this.#onClick} @keydown=${this.#onKeydown} class="wrapper" part="wrapper">
        <slot class="input-label" @slotchange=${this.#onSlotchange}></slot>
        <div class="toggle">
          <div class="track">
            <div>
              ${this.size !== 'sm' ? html`<sl-icon .name=${this.icon} .size=${this.iconSize}></sl-icon>` : nothing}
            </div>
          </div>
        </div>
      </div>

      <div class="hint" part="hint">${this.renderHintSlot()}</div>
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

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = [
      ...event.target.assignedNodes({ flatten: true }),
      ...event.target.assignedElements({ flatten: true })
    ];

    if (elements.length === 0) {
      this.classList.add('no-label');
    } else {
      this.classList.remove('no-label');
    }
  }
}
