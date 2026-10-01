import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './a3mp-side-nav.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a3mp-nav-select': SlA3mpNavSelectEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a3mp-side-nav': A3mpSideNav;
  }
}

/** Emitted when a side-nav item (or the "Miniaturize" collapse control) is activated. */
export type SlA3mpNavSelectEvent = CustomEvent<{ itemId: string }>;

/** One primary navigation item rendered as a row in the side nav. */
export interface SideNavItem {
  /** Stable key, e.g. `'home'`. */
  id: string;
  /** The label as drawn, e.g. `'Home'`. */
  label: string;
  /** Exactly one item is selected. */
  selected: boolean;
}

/** The data this component renders; owned/fetched by the page, passed in here. */
export interface SideNavModel {
  /** The primary navigation items, in display order. */
  items: SideNavItem[];
  /** The label of the collapse control pinned to the bottom, as drawn: `'Miniaturize'`. */
  collapseLabel: string;
}

/**
 * Maps a `SideNavItem.id` to the design's icon glyph name. Structural/presentation config — not
 * part of the model (see component-conventions.md). Assumes the data owner uses these ids for the
 * seven fixed items this run draws (`Home`, `Planner`, `Class`, `Tasks`, `Evaluation`,
 * `Analytics`, `Administration`); report this assumption if the owner's ids differ.
 *
 * None of these eight glyphs (seven here + the collapse glyph rendered separately below) is a
 * Font Awesome icon — each is an exported SVG asset in the design, and this pipeline has no
 * asset-export step. Every one is therefore omitted below, with its 24x24 footprint preserved so
 * label positions don't shift; see the per-icon comment in `#renderItem`.
 */
const ICON_NAME_BY_ID: Record<string, string> = {
  home: 'icon-home',
  planner: 'icon-planner',
  class: 'icon-group',
  tasks: 'icon-practice',
  evaluation: 'icon-evaluate',
  analytics: 'icon-analytics',
  administration: 'icon-admin'
};

/**
 * The 240px primary side navigation: a column of icon + label items with one selected item, and
 * a "Miniaturize" collapse control pinned to the bottom of the column.
 *
 * Presentational — the page owns the `model` (items + collapse label) and handles the emitted
 * `sl-a3mp-nav-select` event, fired with the activated item's id (`'collapse'` for the
 * miniaturize control).
 *
 * ```html
 * <sl-a3mp-side-nav
 *   .model=${{ items: [{ id: 'home', label: 'Home', selected: true }, ...], collapseLabel: 'Miniaturize' }}>
 * </sl-a3mp-side-nav>
 * ```
 *
 * @fires sl-a3mp-nav-select - Emitted with the activated item's `id` when a row or the collapse
 * control is activated.
 */
export class A3mpSideNav extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a nav item or the collapse control is activated. */
  @event({ name: 'sl-a3mp-nav-select' }) navSelectEvent!: EventEmitter<SlA3mpNavSelectEvent>;

  /**
   * The items and collapse-control label to render, passed in by the page that owns the data.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: SideNavModel;

  override render(): TemplateResult {
    const items = this.model?.items ?? [];

    return html`
      <nav aria-label="Primary">
        <ul>
          ${items.map(item => this.#renderItem(item))}
        </ul>
        <button class="item collapse" type="button" @click=${() => this.#onSelect('collapse')}>
          <!-- Icon omitted: the design's collapse glyph (Figma frame "15280") is an exported SVG
               asset, not a Font Awesome name, and there is no asset-export step in this pipeline.
               Its 24x24 footprint is preserved so the label position holds. -->
          <span class="icon" aria-hidden="true"></span>
          <span class="label">${this.model?.collapseLabel}</span>
        </button>
      </nav>
    `;
  }

  #renderItem(item: SideNavItem): TemplateResult {
    const iconName = ICON_NAME_BY_ID[item.id];

    return html`
      <li>
        <button
          aria-current=${ifDefined(item.selected ? 'page' : undefined)}
          class=${item.selected ? 'item selected' : 'item'}
          type="button"
          @click=${() => this.#onSelect(item.id)}>
          <!-- Icon omitted: the design's '${iconName}' glyph is an exported SVG asset, not a
               Font Awesome name, and there is no asset-export step in this pipeline. Its 24x24
               footprint is preserved so the label position holds. -->
          <span class="icon" aria-hidden="true"></span>
          <span class="label">${item.label}</span>
        </button>
      </li>
    `;
  }

  #onSelect(itemId: string): void {
    this.navSelectEvent.emit({ itemId });
  }
}

// Guarded global registration. Without this the module runs, the class is defined, the type
// check passes — and `<sl-a3mp-side-nav>` stays an inert unknown element with no shadow root.
if (!customElements.get('sl-a3mp-side-nav')) {
  customElements.define('sl-a3mp-side-nav', A3mpSideNav);
}
