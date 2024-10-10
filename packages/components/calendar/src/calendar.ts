import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { LocaleMixin } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './calendar.scss.js';
import { MonthView } from './month-view.js';

Icon.register(faChevronLeft);

@localized()
export class Calendar extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-month-view': MonthView
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`
      <div part="header">
        <sl-button @click=${this.#onToggleMonthYear} part="current-month-year" fill="link">October 2024</sl-button>
        <sl-button @click=${this.#onPrevious} aria-label=${msg('Previous month')} fill="ghost" variant="primary">
          <sl-icon name="far-chevron-left"></sl-icon>
        </sl-button>
        <sl-button @click=${this.#onNext} aria-label=${msg('Next month')} fill="ghost" variant="primary">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <sl-month-view .locale=${this.locale}></sl-month-view>
    `;
  }

  #onPrevious(): void {
    console.log('Previous month');
  }

  #onNext(): void {
    console.log('Next month');
  }

  #onToggleMonthYear(): void {
    console.log('Toggle month/year');
  }
}
