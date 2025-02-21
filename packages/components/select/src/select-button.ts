import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-button.scss.js';
import { type SelectSize } from './select.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-button': SelectButton;
  }
}

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

  /** The placeholder for when there is no selected option.s */
  @property() placeholder?: string;

  /** The selected option. */
  @property({ attribute: false }) selected?: Option | null;

  /** The size of the parent select. */
  @property({ reflect: true }) size?: SelectSize;

  /** Mirrors the same property on the sl-select parent. */
  @property({ type: Boolean }) required?: boolean;

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

    if (changes.has('placeholder') || changes.has('selected')) {
      if (this.placeholder && !this.selected) {
        this.setAttribute('aria-placeholder', this.placeholder);
      } else {
        this.removeAttribute('aria-placeholder');
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
    let selected: string | HTMLElement | undefined = undefined;

    if (this.selected?.childElementCount) {
      selected = this.selected.cloneNode(true) as HTMLElement;
      selected.removeAttribute('selected');
      selected.part.add('selected');
    } else {
      selected = this.selected?.textContent?.trim();
    }

    const showPlaceholder = this.placeholder && !selected;

    return html`
      <div aria-hidden=${ifDefined(showPlaceholder ? true : undefined)} class=${showPlaceholder ? 'placeholder' : ''}>
        ${selected || this.placeholder || '\u00a0'}
      </div>
      ${!this.disabled && this.clearable && this.selected
        ? html`
            <button @click=${this.#onClick} aria-label=${msg('Clear selection')} tabindex="-1">
              <sl-icon name="circle-xmark" size="sm"></sl-icon>
              <sl-icon name="circle-xmark-solid" size="sm"></sl-icon>
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
