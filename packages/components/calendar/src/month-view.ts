import { localized, msg } from '@lit/localize';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './month-view.scss.js';

@localized()
export class MonthView extends LocaleMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Will render a column with the week numbers when true. */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  /** @internal The translated days of the week. */
  @state() weekDays: Array<{ long: string; short: string }> = [];

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('locale')) {
      console.log('locale changed');
    }
  }

  override render(): TemplateResult {
    return html`
      <table>
        ${this.renderHeader()}
        <tbody></tbody>
      </table>
    `;
  }

  renderHeader(): TemplateResult {
    return html`
      <thead>
        <tr>
          ${this.showWeekNumbers ? html`<th part="week-number">${msg('wk')}</th>` : nothing}
          ${this.weekDays.map(day => html`<th aria-label=${day.long} part="week-day">${day.short}</th>`)}
        </tr>
      </thead>
    `;
  }
}
