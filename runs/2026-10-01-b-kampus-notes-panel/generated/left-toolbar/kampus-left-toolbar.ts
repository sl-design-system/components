import { type EventEmitter, event } from '@sl-design-system/shared';
import { LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './kampus-left-toolbar.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-kampus-left-toolbar': KampusLeftToolbar;
  }

  interface GlobalEventHandlersEventMap {
    'sl-kampus-tool-select': SlKampusToolSelectEvent;
  }
}

/** The stable id of one of the five entries in the chapter tool rail. */
export type KampusToolId = 'contents' | 'edit-content' | 'assignments' | 'notes' | 'access-key';

/**
 * A badge overlay for one rail entry. `count` absent renders a bare dot marker (e.g. "Edit
 * content" has unread activity but no number); `count` present renders a numbered circle (e.g.
 * "Assignments" reads "1").
 */
export interface KampusToolBadge {
  toolId: KampusToolId;
  count?: number;
}

/** The data this rail needs from its data-owning parent. */
export interface ToolRailModel {
  userPhotoUrl: string;
  userPhotoAlt: string;
  activeToolId: KampusToolId;
  badges: KampusToolBadge[];
}

/** The detail of the `sl-kampus-tool-select` event. */
export type SlKampusToolSelectEvent = CustomEvent<{ toolId: KampusToolId }>;

/**
 * Structural/presentation config owned by this component (not model input): the rail's five
 * fixed entries, in design order. Captions only — no `icon` field, because the kampus theme's
 * 55-icon set (see `token-map.md` for this run) has no glyph for "contents", "edit-content",
 * "assignments", "notes" or "access-key". Per this batch's icon rule a missing icon is left out
 * and recorded as a Stage 4 discrepancy — never a `@fortawesome` import (not installed; throws
 * at load and blanks the page) and never a hand-drawn inline-SVG substitute (invented artwork in
 * a pixel-compared region corrupts the measurement — a recorded finding from an earlier run in
 * this batch).
 */
const TOOLS: ReadonlyArray<{ id: KampusToolId; caption: string }> = [
  { id: 'contents', caption: 'Contents' },
  { id: 'edit-content', caption: 'Edit content' },
  { id: 'assignments', caption: 'Assignments' },
  { id: 'notes', caption: 'Notes' },
  { id: 'access-key', caption: 'Access key' }
];

/**
 * The 74px-wide vertical tool rail below the Kampus chapter page header: a user photo, then
 * five stacked entries (Contents, Edit content, Assignments, Notes, Access key), each a caption
 * below a reserved icon slot (see the module doc above for why the slot is currently empty),
 * with an optional badge overlay. Presentational — the page passes in `model` (user photo,
 * active entry, badges) and handles the emitted `sl-kampus-tool-select` event to update its own
 * active-tool state.
 *
 * ```html
 * <sl-kampus-left-toolbar
 *   .model=${{
 *     userPhotoUrl: '/assets/kampus/user.jpg',
 *     userPhotoAlt: 'Matti Meikäläinen',
 *     activeToolId: 'notes',
 *     badges: [{ toolId: 'edit-content' }, { toolId: 'assignments', count: 1 }]
 *   }}
 * ></sl-kampus-left-toolbar>
 * ```
 *
 * @fires sl-kampus-tool-select - Emitted when a rail entry is activated, with the selected entry's id.
 */
export class KampusLeftToolbar extends LitElement {
  /** @internal */
  static override styles = styles;

  /** @internal Emits when a rail entry is activated. */
  @event({ name: 'sl-kampus-tool-select' }) toolSelectEvent!: EventEmitter<SlKampusToolSelectEvent>;

  /** The user photo, the active entry, and which entries carry a badge. */
  @property({ attribute: false }) model?: ToolRailModel;

  override render(): TemplateResult {
    const userPhotoUrl = this.model?.userPhotoUrl,
      userPhotoAlt = this.model?.userPhotoAlt,
      activeToolId = this.model?.activeToolId,
      badges = this.model?.badges ?? [];

    return html`
      <nav aria-label="Chapter tools">
        ${userPhotoUrl
          ? html`
              <!-- No asset-export step in this pipeline: this 404s in the harness by design (see
                   IMPL-BRIEF.md, correction G2). Explicit width/height keep the layout from
                   reflowing when it does. -->
              <img class="user-photo" src=${userPhotoUrl} alt=${userPhotoAlt ?? ''} width="74" height="80" />
            `
          : nothing}
        <ul>
          ${TOOLS.map(tool => {
            const active = tool.id === activeToolId;
            const badge = badges.find(b => b.toolId === tool.id);
            const accessibleName = badge
              ? badge.count !== undefined
                ? `${tool.caption}, ${badge.count}`
                : `${tool.caption}, new`
              : tool.caption;

            return html`
              <li>
                <button
                  type="button"
                  class=${active ? 'active' : ''}
                  aria-pressed=${active ? 'true' : 'false'}
                  aria-label=${accessibleName}
                  @click=${() => this.#onToolClick(tool.id)}
                >
                  <span class="icon-slot">
                    <!-- Intentionally empty — see the module doc: the theme has no icon for this
                         entry. Reserved so the row keeps the height it would have with an icon. -->
                    ${badge
                      ? badge.count !== undefined
                        ? html`<span class="badge" aria-hidden="true">${badge.count}</span>`
                        : html`<span class="badge dot" aria-hidden="true"></span>`
                      : nothing}
                  </span>
                  <span class="caption">${tool.caption}</span>
                </button>
              </li>
            `;
          })}
        </ul>
      </nav>
    `;
  }

  #onToolClick(toolId: KampusToolId): void {
    this.toolSelectEvent.emit({ toolId });
  }
}

if (!customElements.get('sl-kampus-left-toolbar')) {
  customElements.define('sl-kampus-left-toolbar', KampusLeftToolbar);
}
