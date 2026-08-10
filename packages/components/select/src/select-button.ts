import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type Option } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-button.scss.js';
import { type SelectFill, type SelectSize } from './select.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-button': SelectButton;
  }
}

/**
 * SelectButton is used internally by the Select component to display the selected option and handle
 * user interactions.
 *
 * @csspart placeholder - The placeholder text when no option is selected.
 * @csspart selected-option - The container for the selected option.
 */
export class SelectButton extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /** @internal */
  readonly internals = this.attachInternals();

  /** Will display a clear button when an option is selected. */
  @property({ type: Boolean, reflect: true }) clearable?: boolean;

  /** @internal Whether the clear button is focused. */
  @property({ type: Boolean, attribute: false }) clearFocused?: boolean;

  /** @internal Emits when the user clears the selection via Backspace or Delete. */
  @event({ name: 'sl-clear' }) clearEvent!: EventEmitter<SlClearEvent>;

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The fill of the select.
   *
   * @default 'outline'
   */
  @property({ reflect: true }) fill?: SelectFill;

  /** The width of the longest option. */
  @property({ type: Number, attribute: 'option-size' }) optionSize?: number;

  /** The placeholder for when there is no selected option. */
  @property() placeholder?: string;

  /** Mirrors the same property on the sl-select parent. */
  @property({ type: Boolean }) required?: boolean;

  /** The selected option. */
  @property({ attribute: false }) selected?: Option | null;

  /** The size of the parent select. */
  @property({ reflect: true }) size?: SelectSize;

  /** Indicates whether the control should indicate it is valid. */
  @property({ type: Boolean, attribute: 'show-valid', reflect: true }) showValid?: boolean;

  /** Mirrors the same property on the sl-select parent. */
  @property({ reflect: true, attribute: 'show-validity' }) showValidity: FormControlShowValidity;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'combobox');
    this.setAttribute('slot', 'button');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('clearable')) {
      if (this.clearable) {
        this.internals.states.add('clearable');
      } else {
        this.internals.states.delete('clearable');
      }
    }

    if (changes.has('clearFocused')) {
      if (this.clearFocused) {
        this.internals.states.add('clear-focused');
      } else {
        this.internals.states.delete('clear-focused');
      }
    }

    if (changes.has('selected')) {
      if (this.selected) {
        this.internals.states.add('has-selection');
      } else {
        this.internals.states.delete('has-selection');
      }
    }

    if (changes.has('required')) {
      if (this.required) {
        this.setAttribute('aria-required', 'true');
      } else {
        this.removeAttribute('aria-required');
      }
    }
  }

  override render(): TemplateResult {
    const hasSelected = !!this.selected;

    const inlineSize = this.optionSize ? `${this.optionSize}px` : '100%';

    return html`
      <div
        class="wrapper"
        part=${this.placeholder && !hasSelected ? 'placeholder' : 'selected-option'}
        style="inline-size: ${inlineSize}">
        ${hasSelected
          ? html`<span part="selected"><slot name="selected-content"></slot></span>`
          : this.placeholder || '\u00a0'}
      </div>
      <span class="status" aria-hidden="true">
        <sl-icon name="chevron-down"></sl-icon>
      </span>
    `;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (
      !this.disabled &&
      this.clearable &&
      this.selected &&
      ['Backspace', 'Delete'].includes(event.key)
    ) {
      event.preventDefault();
      event.stopPropagation();

      this.clearEvent.emit();
    }
  }
}
