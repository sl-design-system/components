import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './etsl-recently-edited-widget.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-etsl-recently-edited-select': SlEtslRecentlyEditedSelectEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-etsl-recently-edited-widget': EtslRecentlyEditedWidget;
  }
}

/** Which part of the outline a recently edited entry belongs to. */
export type OutlinePart = 'content-item' | 'section';

/** One row of the "Recently edited" table. */
export interface RecentlyEditedEntry {
  id: string;
  title: string;
  outlinePart: OutlinePart;
  editedAt: string;
}

/** The slice of the dashboard data the "Recently edited" widget body renders. */
export interface RecentlyEditedWidgetModel {
  entries: RecentlyEditedEntry[];
}

/** Emitted when the user activates a recently edited entry's title link; the detail is the entry id. */
export type SlEtslRecentlyEditedSelectEvent = CustomEvent<string>;

/**
 * Structural/presentation config, not domain data: the three columns in the order the design
 * shows them. The table is always these three columns, so they are a component-internal constant
 * rather than a model input.
 */
const COLUMNS = ['Title', 'Outline part', 'Edit date'] as const;

/** The human readable label per outline part. Presentation, so it lives here and not in the model. */
const OUTLINE_PART_LABELS: Record<OutlinePart, string> = {
  'content-item': 'Content item',
  section: 'Section'
};

/**
 * The body of the ETSL dashboard's "Recently edited" widget: a static three column table of the
 * six most recently edited outline parts, with the title of each rendered as a link.
 *
 * The card shell and its "Recently edited" / "Remove widget" header belong to the root
 * `sl-etsl-dashboard-page`; this component renders the table only. It is presentational — it
 * receives its `model` from the data owning root and emits an event instead of navigating.
 *
 * A plain `<table>` rather than `sl-grid`: `sl-grid` is a virtualizing data grid configured
 * through column child components, while this is six static rows with a row rule and link cells.
 *
 * ```html
 * <sl-etsl-recently-edited-widget .model=${model}></sl-etsl-recently-edited-widget>
 * ```
 *
 * @fires sl-etsl-recently-edited-select - Emitted when the user activates an entry's title link.
 */
export class EtslRecentlyEditedWidget extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The recently edited entries this widget lists. */
  @property({ attribute: false }) model?: RecentlyEditedWidgetModel;

  /** Emits when the user activates an entry's title link. */
  @event({ name: 'sl-etsl-recently-edited-select' })
  selectEvent!: EventEmitter<SlEtslRecentlyEditedSelectEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    return html`
      <table>
        <caption>
          Recently edited
        </caption>
        <thead>
          <tr>
            ${COLUMNS.map(column => html`<th scope="col">${column}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${this.model.entries.map(
            entry => html`
              <tr>
                <td>
                  <a href="#" @click=${(event: Event) => this.#onSelect(event, entry.id)}
                    >${entry.title}</a
                  >
                </td>
                <td>${OUTLINE_PART_LABELS[entry.outlinePart]}</td>
                <td>${entry.editedAt}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  #onSelect(event: Event, id: string): void {
    // The link is a placeholder for the host application's route; this component only reports
    // the intent.
    event.preventDefault();

    this.selectEvent.emit(id);
  }
}
