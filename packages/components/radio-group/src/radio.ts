import { type FormControlShowValidity } from '@sl-design-system/form';
import { type Infotip } from '@sl-design-system/infotip';
import { EventsController } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './radio.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-radio': Radio;
  }
}

export type RadioButtonSize = 'md' | 'lg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Radio<T = any> extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** Whether the radio button is checked. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether this radio button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Indicates if the radio button shows it is (in)valid. */
  @property({ attribute: 'show-validity', reflect: true }) showValidity: FormControlShowValidity;

  @state() infotip?: Infotip;

  /**
   * The size of the radio button.
   *
   * @default md
   */
  @property({ reflect: true }) size?: RadioButtonSize;

  /** The value for this radio button. */
  @property() value?: T;

  override connectedCallback(): void {
    super.connectedCallback();

    // Make sure aria-checked is always set
    this.checked ??= false;

    this.setAttribute('role', 'radio');

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.setAttribute('aria-checked', Boolean(this.checked).toString());
    }

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper" class="wrapper">
        <div part="box">
          ${this.checked
            ? html`
                <svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="6"></circle>
                </svg>
              `
            : html`<svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24"></svg>`}
        </div>
        <span part="label">
          <slot @slotchange=${() => this.#onLabelSlotChange()}></slot>
        </span>
      </div>
      <slot name="infotip" @slotchange=${() => this.#onInfotipSlotChange()}></slot>
    `;
  }

  override firstUpdated(): void {
    this.#onLabelSlotChange();
    this.#onInfotipSlotChange();
  }

  #onClick(event: Event): void {
    console.log(
      'click',
      event.composedPath(),
      event
        .composedPath()
        .includes(this.renderRoot.querySelector('[part="wrapper"]') as HTMLElement)
    );
    if (
      this.disabled ||
      event.composedPath().includes(this.renderRoot.querySelector('sl-infotip') as HTMLElement)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = true;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #labelText(): string {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])'),
      nodes = slot?.assignedNodes({ flatten: true }) || [];

    return nodes
      .map(node => node.textContent?.trim() || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  #onLabelSlotChange(): void {
    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = this.#labelText();
    }
  }

  #onInfotipSlotChange(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="infotip"]'),
      assignedElements = slot?.assignedElements({ flatten: true }) || [];

    this.infotip =
      assignedElements.find(
        (el): el is Infotip => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP'
      ) || undefined;

    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');

      if (!this.infotip.describes) {
        this.infotip.describes = this.#labelText();
      }
    }
  }
}
