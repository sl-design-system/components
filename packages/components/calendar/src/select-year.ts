import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './select-year.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-year': SelectYear;
  }
}

@localized()
export class SelectYear extends ScopedElementsMixin(LitElement) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the user selects a year. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<number>>;

  /** The current year. */
  @property({ type: Number }) year = new Date().getFullYear();

  /** @internal The year you can select from. */
  @state() years: number[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.#setYears(this.year - 5, this.year + 6);
  }

  override render(): TemplateResult {
    return html`
      <div class="header">
        <span class="current-range">${this.years.at(0)}-${this.years.at(-1)}</span>
        <sl-button @click=${this.#onPrevious} aria-label=${msg('Go back')} fill="ghost" variant="primary">
          <sl-icon name="far-chevron-left"></sl-icon>
        </sl-button>
        <sl-button @click=${this.#onNext} aria-label=${msg('Go forward')} fill="ghost" variant="primary">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <ol class="years">
        ${this.years.map(
          year => html`
            <li>
              <sl-button
                @click=${() => this.#onClick(year)}
                .fill=${this.year === year ? 'solid' : 'ghost'}
                .variant=${this.year === year ? 'primary' : 'default'}
              >
                ${year}
              </sl-button>
            </li>
          `
        )}
      </ol>
    `;
  }

  #onClick(year: number): void {
    this.selectEvent.emit(year);
  }

  #onPrevious(): void {
    this.#setYears(this.years[0] - 12, this.years[0] - 1);
  }

  #onNext(): void {
    this.#setYears(this.years[this.years.length - 1] + 1, this.years[this.years.length - 1] + 12);
  }

  #setYears(start: number, end: number): void {
    this.years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
