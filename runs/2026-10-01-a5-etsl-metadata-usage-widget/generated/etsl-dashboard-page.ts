import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Panel } from '@sl-design-system/panel';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  type AppHeaderModel,
  EtslAppHeader,
  type SlEtslNavTabSelectEvent
} from './app-header/etsl-app-header.js';
import {
  type AssetsWidgetModel,
  EtslAssetsWidget,
  type SlEtslAssetTypeSelectEvent
} from './assets-widget/etsl-assets-widget.js';
import {
  type ContentItemsWidgetModel,
  EtslContentItemsWidget,
  type SlEtslContentItemSelectEvent
} from './content-items-widget/etsl-content-items-widget.js';
import {
  EtslMetadataUsageWidget,
  type MetadataUsageWidgetModel
} from './metadata-usage-widget/etsl-metadata-usage-widget.js';
import { ETSL_DASHBOARD_DATA } from './mock-data.js';
import {
  EtslRecentlyEditedWidget,
  type RecentlyEditedWidgetModel,
  type SlEtslRecentlyEditedSelectEvent
} from './recently-edited-widget/etsl-recently-edited-widget.js';
import {
  EtslRecentlyPublishedWidget,
  type RecentlyPublishedWidgetModel
} from './recently-published-widget/etsl-recently-published-widget.js';
import {
  EtslReusedContentWidget,
  type ReusedContentWidgetModel,
  type SlEtslReusedOutlineSelectEvent
} from './reused-content-widget/etsl-reused-content-widget.js';
import styles from './etsl-dashboard-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-etsl-dashboard-page': EtslDashboardPage;
  }
}

/** The eight independently removable cards on the dashboard. */
export type EtslWidgetId =
  | 'assets'
  | 'content-items'
  | 'descriptive-metadata'
  | 'product-ids'
  | 'recently-edited'
  | 'metadata-usage'
  | 'recently-published'
  | 'reused-content';

/** The six facts shown in the "Descriptive metadata" sidebar card. */
export interface DescriptiveMetadata {
  created: string;
  author: string;
  /** The design reads `6-11-20244`; the typo is part of the transcribed content. */
  lastUpdated: string;
  lastUpdatedBy: string;
  outlineTemplateLastUpdated: string;
  language: string;
}

/** Everything the dashboard screen renders. Owned by this root and sliced out to the children. */
export interface EtslDashboardData {
  header: AppHeaderModel;
  assetsTotal: number;
  assetRequestCount: number;
  assets: AssetsWidgetModel;
  contentItemsTotal: number;
  contentItems: ContentItemsWidgetModel;
  descriptiveMetadata: DescriptiveMetadata;
  productIds: string[];
  recentlyEdited: RecentlyEditedWidgetModel;
  metadataUsage: MetadataUsageWidgetModel;
  recentlyPublished: RecentlyPublishedWidgetModel;
  reusedContent: ReusedContentWidgetModel;
}

/**
 * Structural/presentation config: the order and the labels of the six descriptive-metadata rows
 * never vary per project, so they are a local constant rather than a model field. The keys index
 * `DescriptiveMetadata`, so a renamed field is a type error rather than a blank row.
 */
const DESCRIPTIVE_METADATA_ROWS: Array<{ key: keyof DescriptiveMetadata; label: string }> = [
  { key: 'created', label: 'Created:' },
  { key: 'author', label: 'Author:' },
  { key: 'lastUpdated', label: 'Last updated:' },
  { key: 'lastUpdatedBy', label: 'Last updated by:' },
  { key: 'outlineTemplateLastUpdated', label: 'Outline template last updated:' },
  { key: 'language', label: 'Language:' }
];

/**
 * Structural/presentation config: the three right-rail actions. `icon` is the leading glyph, and
 * two of the three are deliberately absent — the design's `pen-to-square` (Outline editor) and
 * `magnifying-glass-plus` (Advanced search) are not among the 54 icons the editorial-suite theme
 * registers, so they are left out rather than substituted with a different glyph.
 */
const RAIL_ACTIONS = [
  { id: 'add-widget', label: 'Add widget', fill: 'solid', icon: 'plus', trailingIcon: undefined },
  {
    id: 'outline-editor',
    label: 'Outline editor',
    fill: 'outline',
    icon: undefined,
    trailingIcon: 'arrow-right'
  },
  {
    id: 'advanced-search',
    label: 'Advanced search',
    fill: 'outline',
    icon: undefined,
    trailingIcon: 'arrow-right'
  }
] as const;

/**
 * The Editorial Suite *Functional management → Dashboard* screen: the app chrome and route strip,
 * a 1200px content column with 120px gutters, and the eight widget cards — Assets, Content items,
 * the right rail (three primary actions + Descriptive metadata + Product IDs), and the lower
 * 2 × 2 band of Recently edited, Metadata Usage, Recently published and Reused content.
 *
 * This is the root/page component. It owns the data (a static mock transcribed from the design,
 * with a comment marking where the real fetch would go), hands each presentational child only its
 * own slice, and renders every `sl-panel` card shell itself so the card look is defined once. It
 * is also the terminal handler for the children's events and emits nothing of its own.
 *
 * It is the only component in this run that registers a custom element globally; the seven
 * children are reached through `scopedElements`.
 *
 * ```html
 * <sl-etsl-dashboard-page></sl-etsl-dashboard-page>
 * ```
 */
export class EtslDashboardPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-etsl-app-header': EtslAppHeader,
      'sl-etsl-assets-widget': EtslAssetsWidget,
      'sl-etsl-content-items-widget': EtslContentItemsWidget,
      'sl-etsl-metadata-usage-widget': EtslMetadataUsageWidget,
      'sl-etsl-recently-edited-widget': EtslRecentlyEditedWidget,
      'sl-etsl-recently-published-widget': EtslRecentlyPublishedWidget,
      'sl-etsl-reused-content-widget': EtslReusedContentWidget,
      'sl-icon': Icon,
      'sl-panel': Panel
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The dashboard's data. Defaults to the design's own content so the story renders the whole
   * page from `<sl-etsl-dashboard-page></sl-etsl-dashboard-page>` with no arguments.
   *
   * @default ETSL_DASHBOARD_DATA
   */
  @property({ attribute: false }) data: EtslDashboardData = ETSL_DASHBOARD_DATA;

  /** @internal Local UI state: the cards the user dismissed with "Remove widget". */
  @state() private removedWidgets = new Set<EtslWidgetId>();

  override render(): TemplateResult {
    const data = this.data;

    return html`
      <!-- A neutral wrapper, not <main>: the landmark belongs to the host application. -->
      <div class="page">
        <sl-etsl-app-header
          .model=${data.header}
          @sl-etsl-nav-tab-select=${this.#onNavTabSelect}
          active-tab="dashboard"
        ></sl-etsl-app-header>

        <div class="content">
          <div class="top-band">
            ${this.#renderAssetsPanel(data)} ${this.#renderContentItemsPanel(data)}
            <div class="rail">
              <div class="rail-actions">
                ${RAIL_ACTIONS.map(
                  action => html`
                    <sl-button
                      @click=${() => this.#onRailAction(action.id)}
                      class="rail-action"
                      fill=${action.fill}
                      variant="primary"
                    >
                      ${action.icon
                        ? html`<sl-icon name=${action.icon}></sl-icon>`
                        : nothing}${action.label}${action.trailingIcon
                        ? html`<sl-icon name=${action.trailingIcon}></sl-icon>`
                        : nothing}
                    </sl-button>
                  `
                )}
              </div>
              ${this.#renderDescriptiveMetadataPanel(data)} ${this.#renderProductIdsPanel(data)}
            </div>
          </div>

          <div class="lower-band">
            ${this.#renderRemovablePanel(
              'recently-edited',
              'Recently edited',
              html`
                <sl-etsl-recently-edited-widget
                  .model=${data.recentlyEdited}
                  @sl-etsl-recently-edited-select=${this.#onRecentlyEditedSelect}
                ></sl-etsl-recently-edited-widget>
              `
            )}
            ${this.#renderRemovablePanel(
              'metadata-usage',
              'Metadata Usage',
              html`
                <sl-etsl-metadata-usage-widget
                  .model=${data.metadataUsage}
                ></sl-etsl-metadata-usage-widget>
              `,
              'panel-inset-block'
            )}
            ${this.#renderRemovablePanel(
              'recently-published',
              'Recently published',
              html`
                <sl-etsl-recently-published-widget
                  .model=${data.recentlyPublished}
                ></sl-etsl-recently-published-widget>
              `
            )}
            ${this.#renderRemovablePanel(
              'reused-content',
              'Reused content',
              html`
                <sl-etsl-reused-content-widget
                  .model=${data.reusedContent}
                  @sl-etsl-reused-outline-select=${this.#onReusedOutlineSelect}
                ></sl-etsl-reused-content-widget>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  /** The Assets card: a rich header (title, total, rule, asset-request link) over the tile grid. */
  #renderAssetsPanel(data: EtslDashboardData): TemplateResult | typeof nothing {
    if (this.removedWidgets.has('assets')) {
      return nothing;
    }

    return html`
      <sl-panel aria-label="Assets" class="panel panel-assets" role="region">
        <div class="metric-heading" slot="heading">
          <span class="panel-title">Assets</span>
          <span class="metric">${data.assetsTotal}</span>
          <span aria-hidden="true" class="rule"></span>
        </div>
        <div class="panel-aside" slot="aside">
          <span class="request-count">${data.assetRequestCount}</span>
          <sl-button
            @click=${() => this.#onAssetRequests()}
            class="request-link"
            fill="link"
            variant="danger"
          >
            asset requests
          </sl-button>
        </div>
        <sl-etsl-assets-widget
          .model=${data.assets}
          @sl-etsl-asset-type-select=${this.#onAssetTypeSelect}
        ></sl-etsl-assets-widget>
      </sl-panel>
    `;
  }

  /** The Content items card: a rich header (title + total) over the two columns of bars. */
  #renderContentItemsPanel(data: EtslDashboardData): TemplateResult | typeof nothing {
    if (this.removedWidgets.has('content-items')) {
      return nothing;
    }

    return html`
      <sl-panel aria-label="Content items" class="panel panel-content-items" role="region">
        <div class="metric-heading" slot="heading">
          <span class="panel-title">Content items</span>
          <span class="metric">${data.contentItemsTotal}</span>
        </div>
        <sl-etsl-content-items-widget
          .model=${data.contentItems}
          @sl-etsl-content-item-select=${this.#onContentItemSelect}
        ></sl-etsl-content-items-widget>
      </sl-panel>
    `;
  }

  /**
   * The Descriptive metadata card. Six label/value pairs — a definition list rather than a child
   * component: there is no internal state, no interaction and no second consumer.
   */
  #renderDescriptiveMetadataPanel(data: EtslDashboardData): TemplateResult | typeof nothing {
    if (this.removedWidgets.has('descriptive-metadata')) {
      return nothing;
    }

    return html`
      <sl-panel aria-label="Descriptive metadata" class="panel panel-sidebar" role="region">
        <span class="panel-title" slot="heading">Descriptive metadata</span>
        <dl class="details">
          ${DESCRIPTIVE_METADATA_ROWS.map(
            ({ key, label }) => html`
              <div class="details-row">
                <dt>${label}</dt>
                <dd>${data.descriptiveMetadata[key]}</dd>
              </div>
            `
          )}
        </dl>
      </sl-panel>
    `;
  }

  /** The Product IDs card: six links in two columns of three, plus an icon-only dismiss action. */
  #renderProductIdsPanel(data: EtslDashboardData): TemplateResult | typeof nothing {
    if (this.removedWidgets.has('product-ids')) {
      return nothing;
    }

    return html`
      <sl-panel aria-label="Product IDs" class="panel panel-sidebar" role="region">
        <span class="panel-title" slot="heading">Product IDs</span>
        <div class="panel-aside" slot="aside">
          <sl-button
            @click=${() => this.#removeWidget('product-ids')}
            aria-label="Dismiss Product IDs"
            class="icon-action"
            fill="ghost"
          >
            <sl-icon name="xmark"></sl-icon>
          </sl-button>
        </div>
        <ul class="product-ids">
          ${data.productIds.map(
            (id, index) => html`
              <li><a href="#" @click=${(e: Event) => this.#onProductId(e, id, index)}>${id}</a></li>
            `
          )}
        </ul>
      </sl-panel>
    `;
  }

  /**
   * The four lower-band cards share one shell: a title and a ghost "Remove widget" action. The
   * four labels are identical, so each button carries a distinguishing accessible name.
   */
  #renderRemovablePanel(
    id: EtslWidgetId,
    title: string,
    body: TemplateResult,
    extraClass = ''
  ): TemplateResult | typeof nothing {
    if (this.removedWidgets.has(id)) {
      return nothing;
    }

    return html`
      <sl-panel aria-label=${title} class="panel ${extraClass}" role="region">
        <span class="panel-title" slot="heading">${title}</span>
        <div class="panel-aside" slot="aside">
          <sl-button
            @click=${() => this.#removeWidget(id)}
            aria-label="Remove ${title} widget"
            class="remove-widget"
            fill="ghost"
          >
            <sl-icon name="xmark"></sl-icon>
            Remove widget
          </sl-button>
        </div>
        ${body}
      </sl-panel>
    `;
  }

  #removeWidget(id: EtslWidgetId): void {
    // A new Set, because Lit compares state by identity and mutating in place would not re-render.
    this.removedWidgets = new Set([...this.removedWidgets, id]);
  }

  #onNavTabSelect(event: SlEtslNavTabSelectEvent): void {
    // This example app has no router; a real app would navigate to the selected route.
    console.info('Nav tab select', event.detail);
  }

  #onAssetTypeSelect(event: SlEtslAssetTypeSelectEvent): void {
    console.info('Asset type select', event.detail);
  }

  #onContentItemSelect(event: SlEtslContentItemSelectEvent): void {
    console.info('Content item select', event.detail);
  }

  #onRecentlyEditedSelect(event: SlEtslRecentlyEditedSelectEvent): void {
    console.info('Recently edited select', event.detail);
  }

  #onReusedOutlineSelect(event: SlEtslReusedOutlineSelectEvent): void {
    console.info('Reused outline select', event.detail);
  }

  #onAssetRequests(): void {
    console.info('Open asset requests');
  }

  #onRailAction(id: (typeof RAIL_ACTIONS)[number]['id']): void {
    console.info('Rail action', id);
  }

  #onProductId(event: Event, id: string, index: number): void {
    // `href="#"` keeps the link keyboard-reachable; the host app owns where it goes.
    event.preventDefault();
    console.info('Product id select', id, index);
  }
}

if (!customElements.get('sl-etsl-dashboard-page')) {
  customElements.define('sl-etsl-dashboard-page', EtslDashboardPage);
}
