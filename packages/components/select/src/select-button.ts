import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-button.scss.js';
import { type SelectSize } from './select.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-button': SelectButton;
  }
}

/**
 * SelectButton is used internally by the Select component to display the selected
 * option and handle user interactions.
 *
 * @csspart placeholder - The placeholder text when no option is selected.
 * @csspart selected-option - The container for the selected option.
 */
@localized()
export class SelectButton extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /** Will display a clear button when an option is selected. */
  @property({ type: Boolean, reflect: true }) clearable?: boolean;

  /** @internal Emits when the user clicks the clear button. */
  @event({ name: 'sl-clear' }) clearEvent!: EventEmitter<SlClearEvent>;

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

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

    let inlineSize = '100%';

    if (this.optionSize) {
      const shouldAccountForClearButton = this.clearable && !this.selected,
        clearButtonTotalWidth =
          4 /* clear button margin: margin-inline-start: var(--sl-size-050) */ +
          34 /* clear button width: block-size: calc(1lh + (var(--sl-size-100) - var(--sl-size-borderWidth-default)) * 2);  */ +
          4; /* status icon padding: difference between the padding-inline-start with and without the clear button */

      inlineSize = `${this.optionSize + (shouldAccountForClearButton ? clearButtonTotalWidth : 0)}px`;
    }

    return html`
      <div
        class="wrapper"
        part=${this.placeholder && !hasSelected ? 'placeholder' : 'selected-option'}
        style="inline-size: ${inlineSize}"
      >
        ${hasSelected
          ? html`<span part="selected"><slot name="selected-content"></slot></span>`
          : this.placeholder || '\u00a0'}
      </div>
      ${!this.disabled && this.clearable && this.selected
        ? html`
            <button
              @click=${this.#onClick}
              aria-label=${msg('Clear selection', { id: 'sl.select.clearSelection' })}
              tabindex="-1"
            >
              <sl-icon name="circle-xmark"></sl-icon>
              <sl-icon name="circle-xmark-solid"></sl-icon>
            </button>
          `
        : nothing}
      <span class="status">
        <sl-icon name="chevron-down"></sl-icon>
      </span>
    `;
  }

  #onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.clearEvent.emit();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (!this.disabled && this.clearable && this.selected && ['Backspace', 'Delete'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.clearEvent.emit();
    }
  }
}
