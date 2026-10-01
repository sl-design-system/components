import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, event } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import { type TocEntry, type TocModel } from '../models.js';
import styles from './kampus-toc-sidebar.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-kampus-toc-sidebar': KampusTocSidebar;
  }

  interface GlobalEventHandlersEventMap {
    'sl-toc-select': SlTocSelectEvent;
    'sl-toc-close': SlTocCloseEvent;
  }
}

/** The detail of the `sl-toc-select` event. */
export type SlTocSelectEvent = CustomEvent<{ id: string }>;

/** The detail of the `sl-toc-close` event; it carries no payload. */
export type SlTocCloseEvent = CustomEvent<void>;

// Inline SVG glyphs (`fill="currentColor"`, 512x512 viewBox). This Figma file publishes no Code
// Connect mappings and the Kampus theme's own icon set has no plus/close glyphs, so `sl-icon`
// would render nothing — see the run's IMPLEMENTER-BRIEF.md, rule 1. Exact path fidelity is not
// the point here, only presence and size.
const PLUS_GLYPH = html`
  <svg aria-hidden="true" class="glyph" viewBox="0 0 512 512">
    <path
      d="M256 80a32 32 0 0 1 32 32v112h112a32 32 0 0 1 0 64H288v112a32 32 0 0 1-64
        0V288H112a32 32 0 0 1 0-64h112V112a32 32 0 0 1 32-32z"
      fill="currentColor" />
  </svg>
`;

const CLOSE_GLYPH = html`
  <svg aria-hidden="true" class="glyph" viewBox="0 0 512 512">
    <path
      d="M143 143a32 32 0 0 1 45 0l68 68 68-68a32 32 0 0 1 45 45l-68 68 68 68a32 32 0 0 1
        -45 45l-68-68-68 68a32 32 0 0 1-45-45l68-68-68-68a32 32 0 0 1 0-45z"
      fill="currentColor" />
  </svg>
`;

/**
 * The 360px-wide Table-of-Contents panel for the Kampus subchapter feed page: a header with a
 * close action, "Expand all" / "Collapse all" controls, and a nested entry list.
 *
 * Presentational — the data-owning `sl-subchapter-feed-page` passes in the entry tree as `model`
 * and the currently-selected entry id as `selectedId`, and handles the emitted select/close
 * events. Which entries are expanded is local UI state, seeded once from each `TocEntry.expanded`
 * and then mutated by the expand/collapse-all controls and the per-row expander buttons.
 *
 * ```html
 * <sl-kampus-toc-sidebar .model=${{ entries }} selected-id="subchapter-1"></sl-kampus-toc-sidebar>
 * ```
 *
 * @fires sl-toc-select - Emitted with the entry's id when a row's label is activated.
 * @fires sl-toc-close - Emitted when the close (×) button is activated.
 */
export class KampusTocSidebar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Tracks which `model` instance `#expandedIds` was last seeded from. */
  #seededModel?: TocModel;

  /** Emits with the entry's id when a row's label is activated. */
  @event({ name: 'sl-toc-select' }) selectEvent!: EventEmitter<SlTocSelectEvent>;

  /** Emits when the close (×) button is activated. */
  @event({ name: 'sl-toc-close' }) closeEvent!: EventEmitter<SlTocCloseEvent>;

  /** The entry tree this sidebar renders. */
  @property({ attribute: false }) model?: TocModel;

  /** The id of the currently-selected entry, owned by the parent. */
  @property({ attribute: 'selected-id' }) selectedId?: string;

  /** @internal Local UI state: the ids of the currently-expanded entries. */
  @state() private expandedIds = new Set<string>();

  protected override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('model') && this.model && this.model !== this.#seededModel) {
      this.#seededModel = this.model;
      this.expandedIds = this.#collectExpandedIds(this.model.entries);
    }
  }

  override render(): TemplateResult {
    const entries = this.model?.entries ?? [];

    return html`
      <div class="header">
        <h2 class="title">Table of Contents</h2>
        <sl-button aria-label="Close" fill="ghost" shape="pill" @click=${this.#onClose}>
          ${CLOSE_GLYPH}
        </sl-button>
      </div>
      <div class="actions">
        <sl-button fill="link" variant="primary" @click=${this.#onExpandAll}>Expand all</sl-button>
        <sl-button fill="link" variant="primary" @click=${this.#onCollapseAll}>
          Collapse all
        </sl-button>
      </div>
      <nav aria-label="Table of contents">${this.#renderList(entries, 0)}</nav>
    `;
  }

  #renderList(entries: TocEntry[], level: number): TemplateResult {
    return html`
      <ul class=${classMap({ nested: level > 0 })}>
        ${entries.map(entry => this.#renderEntry(entry, level))}
      </ul>
    `;
  }

  #renderEntry(entry: TocEntry, level: number): TemplateResult {
    const hasChildren = !!entry.children?.length,
      expanded = this.expandedIds.has(entry.id),
      selected = entry.id === this.selectedId,
      groupId = `toc-group-${entry.id}`;

    return html`
      <li class=${classMap({ child: level > 0 })} style="--_level: ${level}">
        <div class=${classMap({ row: true, selected })}>
          ${hasChildren
            ? html`
                <button
                  aria-controls=${groupId}
                  aria-expanded=${expanded}
                  class="expander"
                  type="button"
                  @click=${() => this.#onToggle(entry.id)}>
                  ${PLUS_GLYPH}
                </button>
              `
            : level > 0
              ? html`<span aria-hidden="true" class="expander static">${PLUS_GLYPH}</span>`
              : nothing}
          <button
            aria-current=${ifDefined(selected ? 'page' : undefined)}
            class="label"
            type="button"
            @click=${() => this.#onSelect(entry.id)}>
            ${entry.label}
          </button>
        </div>
        ${hasChildren && expanded
          ? html`<div id=${groupId}>${this.#renderList(entry.children!, level + 1)}</div>`
          : nothing}
      </li>
    `;
  }

  #collectExpandedIds(entries: TocEntry[]): Set<string> {
    const ids = new Set<string>();

    const walk = (list: TocEntry[]): void => {
      for (const entry of list) {
        if (entry.expanded) {
          ids.add(entry.id);
        }

        if (entry.children?.length) {
          walk(entry.children);
        }
      }
    };

    walk(entries);

    return ids;
  }

  #collectExpandableIds(entries: TocEntry[]): Set<string> {
    const ids = new Set<string>();

    const walk = (list: TocEntry[]): void => {
      for (const entry of list) {
        if (entry.children?.length) {
          ids.add(entry.id);
          walk(entry.children);
        }
      }
    };

    walk(entries);

    return ids;
  }

  #onToggle(id: string): void {
    const expandedIds = new Set(this.expandedIds);

    if (expandedIds.has(id)) {
      expandedIds.delete(id);
    } else {
      expandedIds.add(id);
    }

    this.expandedIds = expandedIds;
  }

  #onExpandAll(): void {
    this.expandedIds = this.#collectExpandableIds(this.model?.entries ?? []);
  }

  #onCollapseAll(): void {
    this.expandedIds = new Set();
  }

  #onSelect(id: string): void {
    this.selectEvent.emit({ id });
  }

  #onClose(): void {
    this.closeEvent.emit();
  }
}

// This is the top-level element for this component, so - unlike its scoped `sl-button` child
// above - it registers itself globally, guarded so re-importing this module doesn't throw (it's
// rendered standalone here and also composed by the sibling `sl-subchapter-feed-page`).
if (!customElements.get('sl-kampus-toc-sidebar')) {
  customElements.define('sl-kampus-toc-sidebar', KampusTocSidebar);
}
