import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlTabChangeEvent, Tab, TabGroup } from '@sl-design-system/tabs';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './etsl-reused-content-widget.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-etsl-reused-outline-select': SlEtslReusedOutlineSelectEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-etsl-reused-content-widget': EtslReusedContentWidget;
  }
}

/** Which of the widget's two tabs is showing. */
export type ReusedContentTabId = 'source-items' | 'linked-items';

/** One row of the "Reused content" table. */
export interface ReusedOutlineEntry {
  id: string;
  outlineName: string;
  projectName: string;
  linkedItemCount: number;
}

/** The slice of the dashboard data the "Reused content" widget body renders. */
export interface ReusedContentWidgetModel {
  sourceItems: ReusedOutlineEntry[];
  linkedItems: ReusedOutlineEntry[];
}

/** Emitted when the user activates an outline link; the detail is the entry id. */
export type SlEtslReusedOutlineSelectEvent = CustomEvent<string>;

/**
 * Structural/presentation config, not domain data: the two tabs in the order the design shows
 * them. The index in this array is also the index `sl-tab-group` reports in its `sl-tab-change`
 * event, so it is the single source of truth for both directions.
 */
const TABS: ReadonlyArray<{ id: ReusedContentTabId; label: string }> = [
  { id: 'source-items', label: 'Outlines with source items' },
  { id: 'linked-items', label: 'Outlines with linked items' }
];

/**
 * Structural/presentation config, not domain data: the three columns in the order the design
 * shows them. Both tabs render the same three columns.
 */
const COLUMNS = ['Source outline', 'Project name', 'Linked items in current outline'] as const;

/**
 * The body of the ETSL dashboard's "Reused content" widget: a two tab strip above a static
 * three column table of the outlines that reuse content from the current one.
 *
 * The card shell and its "Reused content" / "Remove widget" header belong to the root
 * `sl-etsl-dashboard-page`; this component renders the tab strip and the table only. It is
 * presentational - it receives its `model` from the data owning root and emits an event instead
 * of navigating - but it does own its own tab state, which is pure UI state the root has no
 * use for, so there is deliberately no tab change event.
 *
 * The strip is `sl-tab-group` + `sl-tab` with **no** `sl-tab-panel`: only one tab's rows are
 * ever in the DOM, and the table is re-rendered on tab change rather than both panels being
 * kept alive. Because the table therefore sits outside the tab group, it carries its own
 * `role="region"` named after the active tab so a screen reader user still knows what changed.
 *
 * A plain `<table>` rather than `sl-grid`: `sl-grid` is a virtualizing data grid configured
 * through column child components, while this is five static rows with a row rule and link
 * cells.
 *
 * ```html
 * <sl-etsl-reused-content-widget .model=${model}></sl-etsl-reused-content-widget>
 * ```
 *
 * @fires sl-etsl-reused-outline-select - Emitted when the user activates an outline link.
 */
export class EtslReusedContentWidget extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-tab': Tab,
      'sl-tab-group': TabGroup
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The tab whose rows are currently rendered.
   *
   * @default 'source-items'
   */
  @property({ attribute: 'active-tab', reflect: true }) activeTab: ReusedContentTabId =
    'source-items';

  /** The source and linked outline entries this widget lists. */
  @property({ attribute: false }) model?: ReusedContentWidgetModel;

  /** Emits when the user activates an outline link. */
  @event({ name: 'sl-etsl-reused-outline-select' })
  selectEvent!: EventEmitter<SlEtslReusedOutlineSelectEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const activeTab = TABS.find(tab => tab.id === this.activeTab) ?? TABS[0],
      entries =
        activeTab.id === 'source-items' ? this.model.sourceItems : this.model.linkedItems;

    return html`
      <sl-tab-group @sl-tab-change=${this.#onTabChange}>
        ${TABS.map(tab => html`<sl-tab ?selected=${tab.id === activeTab.id}>${tab.label}</sl-tab>`)}
      </sl-tab-group>

      <div aria-label=${activeTab.label} role="region">
        <table>
          <caption>
            Reused content
          </caption>
          <thead>
            <tr>
              ${COLUMNS.map(column => html`<th scope="col">${column}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${entries.length
              ? entries.map(
                  entry => html`
                    <tr>
                      <td>
                        <a href="#" @click=${(event: Event) => this.#onSelect(event, entry.id)}
                          >${entry.outlineName}</a
                        >
                      </td>
                      <td>${entry.projectName}</td>
                      <td>${entry.linkedItemCount}</td>
                    </tr>
                  `
                )
              : html`
                  <tr>
                    <td colspan=${COLUMNS.length}>No outlines with linked items</td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `;
  }

  #onTabChange(event: SlTabChangeEvent): void {
    // The tab strip is the widget's own UI state, so the change stops here; the root has no
    // use for it. The detail is the index into the slotted tabs, which is `TABS`' own order.
    event.stopPropagation();

    this.activeTab = (TABS[event.detail] ?? TABS[0]).id;
  }

  #onSelect(event: Event, id: string): void {
    // The link is a placeholder for the host application's route; this component only reports
    // the intent.
    event.preventDefault();

    this.selectEvent.emit(id);
  }
}
