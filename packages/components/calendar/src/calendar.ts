import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { LocaleMixin } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './calendar.scss.js';
import { MonthView } from './month-view.js';

Icon.register(faChevronLeft);

@localized()
export class Calendar extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-format-date': FormatDate,
      'sl-icon': Icon,
      'sl-month-view': MonthView
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The month that the calendar opens on. */
  @property({ converter: dateConverter }) month = new Date();

  override render(): TemplateResult {
    return html`
      <div part="header">
        <sl-button @click=${this.#onToggleMonthYear} part="current-month-year" fill="link">
          <sl-format-date .date=${this.month} month="long" year="numeric"></sl-format-date>
        </sl-button>
        <sl-button @click=${this.#onPrevious} aria-label=${msg('Previous month')} fill="ghost" variant="primary">
          <sl-icon name="far-chevron-left"></sl-icon>
        </sl-button>
        <sl-button @click=${this.#onNext} aria-label=${msg('Next month')} fill="ghost" variant="primary">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <sl-month-view .locale=${this.locale} .month=${this.month}></sl-month-view>
    `;
  }

  #onPrevious(): void {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() - 1);
  }

  #onNext(): void {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() + 1);
  }

  #onToggleMonthYear(): void {
    console.log('Toggle month/year');
  }
}
