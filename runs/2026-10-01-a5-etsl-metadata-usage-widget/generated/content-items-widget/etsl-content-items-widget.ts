import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './etsl-content-items-widget.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-etsl-content-items-widget': EtslContentItemsWidget;
  }

  interface GlobalEventHandlersEventMap {
    'sl-etsl-content-item-select': SlEtslContentItemSelectEvent;
  }
}

/** One labelled determinate bar: the metric's name, how many content items use it, and the
 * measured bar length. `percent` is deliberately *not* derived from `count` — the design's bar
 * lengths are hand-set and do not scale linearly with the count (manifest OQ9). */
export interface ContentItemMetric {
  label: string;
  count: number;
  percent: number;
}

/** The 26 content-item metrics this widget body renders. */
export interface ContentItemsWidgetModel {
  metrics: ContentItemMetric[];
}

/** Emitted with the metric's label when one of the bar labels is activated. */
export type SlEtslContentItemSelectEvent = CustomEvent<string>;

/**
 * How many metrics go in the first column. Structural/presentation configuration, so it lives in
 * the component rather than in the model: the design lays its 26 bars out as 13 + 13.
 */
const FIRST_COLUMN_LENGTH = 13;

/**
 * The body of the ETSL dashboard's "Content items" widget: the design's 26 labelled determinate
 * bars, laid out in two columns of 13. The card shell and its "Content items 164" header belong
 * to the root `sl-etsl-dashboard-page`; this component renders only the list itself.
 *
 * This is a presentational component — it receives its `model` from the data-owning root and
 * emits a select event when a label is activated; the root decides what happens next.
 *
 * The bars are hand-rolled `<div>`s rather than `<sl-progress-bar>` on purpose (manifest OQ2):
 * `ProgressBar.updated()` announces every value change assertively, so 26 of them would fire 26
 * assertive live-region announcements on first render; the design's indicator colour is only
 * reachable through the component's private `--_fill-color`; and `progress-bar.css` styles its
 * label with the bare `--sl-text-new-heading-sm` token, which does not exist in the
 * editorial-suite theme.
 *
 * ```html
 * <sl-etsl-content-items-widget .model=${model}></sl-etsl-content-items-widget>
 * ```
 *
 * @fires sl-etsl-content-item-select - Emitted with the metric's label when a bar label is activated.
 */
export class EtslContentItemsWidget extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The content-item metrics to render; 26 of them in the design. */
  @property({ attribute: false }) model?: ContentItemsWidgetModel;

  /** Emits the metric's label when one of the bar labels is activated. */
  @event({ name: 'sl-etsl-content-item-select' })
  contentItemSelectEvent!: EventEmitter<SlEtslContentItemSelectEvent>;

  override render(): TemplateResult {
    const metrics = this.model?.metrics ?? [];

    return html`
      ${this.#renderColumn(metrics.slice(0, FIRST_COLUMN_LENGTH), 0)}
      ${this.#renderColumn(metrics.slice(FIRST_COLUMN_LENGTH), FIRST_COLUMN_LENGTH)}
    `;
  }

  #renderColumn(metrics: ContentItemMetric[], offset: number): TemplateResult | typeof nothing {
    if (metrics.length === 0) {
      return nothing;
    }

    return html`<ul>
      ${metrics.map((metric, index) => this.#renderMetric(metric, offset + index))}
    </ul>`;
  }

  #renderMetric(metric: ContentItemMetric, index: number): TemplateResult {
    const labelId = `metric-${index}`,
      // Built as one string so lit does not introduce template whitespace around it; the label
      // itself keeps the design's own typos ("asnwer", the double space in "Multiple  response")
      // and `white-space: pre-wrap` in the stylesheet keeps that double space visible.
      text = `${metric.label} (${metric.count})`;

    return html`
      <li>
        <a href="#" id=${labelId} @click=${(e: Event) => this.#onSelect(e, metric)}>${text}</a>
        <div class="track">
          <div
            aria-labelledby=${labelId}
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow=${metric.percent}
            class="indicator"
            role="progressbar"
            style="inline-size: ${metric.percent}%"
          ></div>
        </div>
      </li>
    `;
  }

  #onSelect(event: Event, metric: ContentItemMetric): void {
    event.preventDefault();

    this.contentItemSelectEvent.emit(metric.label);
  }
}
