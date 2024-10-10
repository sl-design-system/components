import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, LocaleMixin, event } from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './select-month.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-month': SelectMonth;
  }
}

export class SelectMonth extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the user selects a month. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<number>>;

  override render(): TemplateResult {
    return html`qwer`;
  }
}
