import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './etsl-metadata-usage-widget.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-etsl-metadata-usage-widget': EtslMetadataUsageWidget;
  }
}

/** The three aggregate counts shown in the stat tiles above the table. */
export interface MetadataUsageTotals {
  total: number;
  used: number;
  unused: number;
}

/** One metadata field and how often it is used across the outline. */
export interface MetadataUsageEntry {
  id: string;
  category: string;
  field: string;
  usage: number | null; // null -> 'Unused' badge
}

/** Everything this widget renders: the three totals and the six table rows. */
export interface MetadataUsageWidgetModel {
  totals: MetadataUsageTotals;
  entries: MetadataUsageEntry[];
}

/**
 * Structural/presentation config, not domain data: which totals become tiles, in which order,
 * with which caption and (optional) decorative icon. The model carries the numbers only.
 */
interface StatTile {
  key: keyof MetadataUsageTotals;
  caption: string;
  /** Decorative only - the caption carries the meaning - so it is rendered `aria-hidden`. */
  icon?: string;
}

const STAT_TILES: readonly StatTile[] = [
  { key: 'total', caption: 'Total' },
  { key: 'used', caption: 'Used', icon: 'circle-check-solid' },
  { key: 'unused', caption: 'Unused', icon: 'triangle-exclamation-solid' }
] as const;

/**
 * Structural/presentation config: the table's fixed column set, in design order. The model
 * carries one field per column, so the headers never come in as data.
 */
const COLUMN_HEADERS = ['Metadata category', 'Metadata field', 'Usage'] as const;

/**
 * The body of the "Metadata Usage" dashboard widget: three stat tiles (Total / Used / Unused)
 * above a three-column table of metadata fields and their usage counts. A field that is not
 * used anywhere shows an "Unused" badge instead of a number.
 *
 * The card shell around this - the rounded surface and the "Metadata Usage | Remove widget"
 * header strip - belongs to the data-owning `sl-etsl-dashboard-page` root; this is a purely
 * presentational component that receives its slice of the dashboard model and renders it.
 * Nothing in it is interactive, so it emits no events.
 *
 * ```html
 * <sl-etsl-metadata-usage-widget .model=${model}></sl-etsl-metadata-usage-widget>
 * ```
 */
export class EtslMetadataUsageWidget extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-badge': Badge,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The metadata usage totals and per-field rows this widget renders. */
  @property({ attribute: false }) model?: MetadataUsageWidgetModel;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { totals, entries } = this.model;

    return html`
      <ul class="stats">
        ${STAT_TILES.map(
          ({ key, caption, icon }) => html`
            <li class=${key}>
              <span class="value">${totals[key]}</span>
              <span class="caption">
                ${icon
                  ? html`<sl-icon aria-hidden="true" name=${icon} size="md"></sl-icon>`
                  : nothing}
                ${caption}
              </span>
            </li>
          `
        )}
      </ul>
      <table>
        <caption>Metadata usage</caption>
        <thead>
          <tr>
            ${COLUMN_HEADERS.map(header => html`<th scope="col">${header}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${entries.map(
            entry => html`
              <tr>
                <td>${entry.category}</td>
                <td>${entry.field}</td>
                <td class="usage">
                  ${entry.usage === null
                    ? html`<sl-badge color="orange" size="lg">Unused</sl-badge>`
                    : entry.usage}
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}
