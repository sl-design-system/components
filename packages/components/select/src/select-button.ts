import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-button.scss.js';
import { type SelectSize } from './select.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-clear': SlClearEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-select-button': SelectButton;
  }
}

export type SlClearEvent = CustomEvent<void>;

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
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /** Indicates whether the control should indicate it is valid. */
  @property({ type: Boolean, attribute: 'show-valid', reflect: true }) showValid?: boolean;

  /** Mirrors the same property on the sl-select parent. */
  @property({ reflect: true, attribute: 'show-validity' }) showValidity: FormControlShowValidity;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'combobox');
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

    return html`
      <div class=${this.placeholder && !selected ? 'placeholder' : ''}>${selected || this.placeholder || '\u00a0'}</div>
      ${this.clearable && this.selected
        ? html`
            <button @click=${this.#onClick} aria-label=${msg('Clear selection')}>
              <sl-icon name="xmark"></sl-icon>
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
}
