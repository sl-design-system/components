import { msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, RovingTabindexController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-month.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-month': SelectMonth;
  }
}

export class SelectMonth extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #rovingTabindexController = new RovingTabindexController(this, {
    direction: 'grid',
    directionLength: 3,
    elements: (): HTMLElement[] => Array.from(this.renderRoot.querySelectorAll('sl-button')),
    focusInIndex: elements => elements.findIndex(el => el.hasAttribute('aria-pressed')),
    listenerScope: (): HTMLElement => this.renderRoot.querySelector('ol')!
  });

  /** The month/year to display. */
  @property({ converter: dateConverter }) month = new Date();

  /** @internal The months to display. */
  @state() months: Array<{ short: string; long: string; value: number }> = [];

  /** @internal Emits when the user selects a month. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.renderRoot.querySelector<HTMLElement>('sl-button[aria-pressed]')?.focus();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('locale')) {
      const formatShort = new Intl.DateTimeFormat(this.locale, { month: 'short' }),
        formatLong = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' });

      this.months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(this.month.getFullYear(), i, 1);

        return {
          short: formatShort.format(date),
          long: formatLong.format(date),
          value: i
        };
      });
    }
  }

  override render(): TemplateResult {
    const currentMonth = this.month.getMonth(),
      currentYear = this.month.getFullYear();

    return html`
      <div part="header">
        <span class="current-year">${currentYear}</span>
        <sl-button
          @click=${this.#onPrevious}
          aria-label=${msg(str`Previous year, ${currentYear - 1}`)}
          fill="ghost"
          variant="primary"
        >
          <sl-icon name="chevron-left"></sl-icon>
        </sl-button>
        <sl-button
          @click=${this.#onNext}
          aria-label=${msg(str`Next year, ${currentYear + 1}`)}
          fill="ghost"
          variant="primary"
        >
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <ol class="months">
        ${this.months.map(
          ({ short, long, value }) => html`
            <li>
              <sl-button
                @click=${() => this.#onClick(value)}
                .fill=${currentMonth === value ? 'solid' : 'ghost'}
                .variant=${currentMonth === value ? 'primary' : 'default'}
                aria-label=${long}
                aria-pressed=${ifDefined(currentMonth === value ? 'true' : undefined)}
              >
                ${short}
              </sl-button>
            </li>
          `
        )}
      </ol>
    `;
  }

  #onClick(month: number): void {
    this.selectEvent.emit(new Date(this.month.getFullYear(), month));
  }

  #onNext(): void {
    this.month = new Date(this.month.getFullYear() + 1, this.month.getMonth(), this.month.getDate());
  }

  #onPrevious(): void {
    this.month = new Date(this.month.getFullYear() - 1, this.month.getMonth(), this.month.getDate());
  }
}
