import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Badge, type BadgeColor } from '@sl-design-system/badge';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './etsl-recently-published-widget.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-etsl-recently-published-widget': EtslRecentlyPublishedWidget;
  }
}

/** The outcome of a single publication run. */
export type PublicationStatus = 'success' | 'failure';

/** One row of the "Recently published" table. */
export interface PublicationEntry {
  id: string;
  name: string;
  environment: string;
  /**
   * Pre-formatted for display (`dd-mm-yyyy at HH:mm`). No `Intl` locale produces this shape, so
   * the data owner formats it — a documented exception to "no presentation in the model".
   */
  publishedAt: string;
  status: PublicationStatus;
}

/** Everything this widget body renders. Owned and supplied by the dashboard page. */
export interface RecentlyPublishedWidgetModel {
  publications: PublicationEntry[];
}

/**
 * Structural/presentation config, not domain data: the column set and its order are fixed by the
 * design, so they live here rather than in the model.
 */
const COLUMNS = ['Name', 'Environment', 'Publication date', 'Publication status'] as const;

/**
 * Structural/presentation config: the badge label, colour and glyph are derived from the model's
 * stable `status` key. `statusLabel` is deliberately NOT a model field.
 *
 * On the icons: the Code Connect snippets returned for both the Success and the Failure badge
 * name `<sl-icon name="fas-backpack">`. That glyph is not registered by the editorial-suite theme
 * and it contradicts the reference render, which shows a check and an exclamation — placeholder
 * mapping data. `circle-check-solid` / `triangle-exclamation-solid` are used instead; both are in
 * the theme's 54-icon registry and both match the design.
 */
const STATUS_META: Record<PublicationStatus, { label: string; badgeColor: BadgeColor; icon: string }> = {
  success: { label: 'Success', badgeColor: 'green', icon: 'circle-check-solid' },
  failure: { label: 'Failure', badgeColor: 'red', icon: 'triangle-exclamation-solid' }
};

/**
 * The body of the ETSL dashboard's "Recently published" widget: a four-column table of recent
 * publication runs, each with a Success / Failure status badge.
 *
 * Presentational only — the card shell, its heading and the "Remove widget" action belong to the
 * data-owning `sl-etsl-dashboard-page`, which passes this component its slice of the model.
 *
 * ```html
 * <sl-etsl-recently-published-widget .model=${model}></sl-etsl-recently-published-widget>
 * ```
 */
export class EtslRecentlyPublishedWidget extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-badge': Badge,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The publication runs to list. */
  @property({ attribute: false }) model?: RecentlyPublishedWidgetModel;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    return html`
      <table>
        <caption>Recently published</caption>
        <thead>
          <tr>
            ${COLUMNS.map(column => html`<th scope="col">${column}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${this.model.publications.map(publication => this.renderRow(publication))}
        </tbody>
      </table>
    `;
  }

  /** Renders one publication run. */
  private renderRow({ id, name, environment, publishedAt, status }: PublicationEntry): TemplateResult {
    const { label, badgeColor, icon } = STATUS_META[status];

    return html`
      <tr data-publication-id=${id}>
        <td>${name}</td>
        <td>${environment}</td>
        <td>${publishedAt}</td>
        <td>
          <sl-badge color=${badgeColor} size="lg">
            <sl-icon name=${icon} aria-hidden="true"></sl-icon>
            ${label}
          </sl-badge>
        </td>
      </tr>
    `;
  }
}
