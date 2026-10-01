import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './etsl-assets-widget.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-etsl-asset-type-select': SlEtslAssetTypeSelectEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-etsl-assets-widget': EtslAssetsWidget;
  }
}

/** The twelve asset types the Assets widget can show, in the design's reading order. */
export type AssetTypeId =
  | 'document'
  | 'picture'
  | 'audio'
  | 'video'
  | 'streaming'
  | 'explorit'
  | 'three-ships'
  | 'youtube'
  | 'geogebra'
  | 'sowiso'
  | 'mathtype'
  | 'chemtype';

/** One asset-type tile's slice of the domain model. */
export interface AssetTypeCount {
  id: AssetTypeId;
  label: string;
  count: number;
}

/** Everything the Assets widget body renders: the twelve asset-type counts. */
export interface AssetsWidgetModel {
  types: AssetTypeCount[];
}

/** Emitted when the user activates a tile's "See all" control. */
export type SlEtslAssetTypeSelectEvent = CustomEvent<AssetTypeId>;

/**
 * Structural/presentation config, not domain data.
 *
 * Seven of the twelve tiles show a third-party brand wordmark in Figma, delivered as a bitmap
 * behind an expiring CDN URL, and none of them is a registered icon in the editorial-suite
 * theme. Per the run brief no substitute artwork may be invented, so the wordmark is rendered
 * as plain text in the same 32px logo box. The casing follows the mark as drawn (e.g. `SOWISO`
 * is uppercase in the wordmark while its tile label reads `Sowiso`).
 *
 * The other five tiles (Document, Picture, Audio, Video, Streaming) use the Font Awesome glyphs
 * `file`, `image`, `volume`, `play` and `signal-stream`. None of those five is among the 54
 * icons the editorial-suite theme registers, so those tiles render an empty logo box that only
 * reserves the 32px height. Recorded as a Stage 4 discrepancy.
 */
const ASSET_WORDMARKS: Partial<Record<AssetTypeId, string>> = {
  explorit: 'Explorit',
  'three-ships': 'Three Ships',
  youtube: 'YouTube',
  geogebra: 'GeoGebra',
  sowiso: 'SOWISO',
  mathtype: 'MathType',
  chemtype: 'ChemType'
};

/**
 * The body of the ETSL dashboard's "Assets" widget: a 2-column x 6-row grid of twelve
 * asset-type tiles, each showing a logo box, a `Name (n)` label and a "See all" control.
 *
 * This is a presentational component. The widget card shell and its "Assets 39 | 4 asset
 * requests" header belong to the root `sl-etsl-dashboard-page`, which owns the data and passes
 * this component its slice of it. The tiles emit an event rather than navigating themselves.
 *
 * ```html
 * <sl-etsl-assets-widget .model=${model}></sl-etsl-assets-widget>
 * ```
 *
 * @fires sl-etsl-asset-type-select - Emitted when the user activates a tile's "See all" control.
 */
export class EtslAssetsWidget extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The twelve asset-type counts this widget body renders. */
  @property({ attribute: false }) model?: AssetsWidgetModel;

  /** Emits when the user activates a tile's "See all" control. */
  @event({ name: 'sl-etsl-asset-type-select' }) selectEvent!: EventEmitter<SlEtslAssetTypeSelectEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    return html`
      <ul class="tiles">
        ${this.model.types.map(({ id, label, count }) => {
          const wordmark = ASSET_WORDMARKS[id];

          return html`
            <li class="tile">
              <span class="logo" aria-hidden="true">${wordmark ?? nothing}</span>
              <span class="label">${label} (${count})</span>
              <sl-button
                fill="link"
                size="sm"
                aria-label="See all ${label} assets"
                ?disabled=${count === 0}
                @click=${() => this.#onSelect(id)}
              >
                See all
              </sl-button>
            </li>
          `;
        })}
      </ul>
    `;
  }

  #onSelect(id: AssetTypeId): void {
    this.selectEvent.emit(id);
  }
}
