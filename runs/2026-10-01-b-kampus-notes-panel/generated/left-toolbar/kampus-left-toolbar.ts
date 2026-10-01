import '@sl-design-system/badge/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './kampus-left-toolbar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-bknp-tool-select': SlBknpToolSelectEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-bknp-left-toolbar': BknpLeftToolbar;
  }
}

/** The identifier of a tool in the chapter tool rail. */
export type BknpToolId = 'contents' | 'edit-content' | 'assignments' | 'notes' | 'access-key';

/** A badge overlaid on a tool's (currently empty) glyph slot. */
export interface BknpToolBadge {
  /** The tool this badge belongs to. */
  toolId: BknpToolId;

  /** The number to show in the badge; when absent, a bare dot marker is shown instead. */
  count?: number;
}

/** The data this component needs to render the chapter tool rail. */
export interface ToolRailModel {
  /** The URL of the current user's profile photo. */
  userPhotoUrl: string;

  /** The accessible alternative text for the user's profile photo. */
  userPhotoAlt: string;

  /** The id of the currently active tool. */
  activeToolId: BknpToolId;

  /** Badges to overlay on specific tools (e.g. unread/count indicators). */
  badges: BknpToolBadge[];
}

/** Emitted when the user picks a different tool in the rail. */
export type SlBknpToolSelectEvent = CustomEvent<{ toolId: BknpToolId }>;

/** Structural config: the five tools, in display order, with their fixed captions. */
interface ToolDef {
  id: BknpToolId;
  caption: string;
}

const TOOLS: ToolDef[] = [
  { id: 'contents', caption: 'Contents' },
  { id: 'edit-content', caption: 'Edit content' },
  { id: 'assignments', caption: 'Assignments' },
  { id: 'notes', caption: 'Notes' },
  { id: 'access-key', caption: 'Access key' }
];

/**
 * The left-hand chapter tool rail: a user photo above five tool entries
 * (contents, edit content, assignments, notes, access key), the active one
 * highlighted. Switches a panel rather than navigating, so each entry is a
 * `<button>`, not a link.
 *
 * None of the five tool glyphs exists in the kampus theme's icon set, so this
 * component intentionally renders each entry caption-only — see the class's
 * `render()` for where a glyph would go.
 *
 * ```html
 * <sl-bknp-left-toolbar .model=${model}></sl-bknp-left-toolbar>
 * ```
 *
 * @fires sl-bknp-tool-select - Emitted when the user picks a tool in the rail.
 */
export class BknpLeftToolbar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The data needed to render the rail: the user photo and the active/badged tools.
   */
  @property({ attribute: false }) model?: ToolRailModel;

  /** @internal */
  @event({ name: 'sl-bknp-tool-select' }) toolSelectEvent!: EventEmitter<SlBknpToolSelectEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { userPhotoUrl, userPhotoAlt, activeToolId, badges } = this.model;

    return html`
      <img
        class="user-photo"
        src=${userPhotoUrl}
        alt=${userPhotoAlt}
        width="74"
        height="80"
      />
      <nav aria-label="Chapter tools">
        <ul>
          ${TOOLS.map(tool => this.#renderTool(tool, activeToolId, badges))}
        </ul>
      </nav>
    `;
  }

  #renderTool(tool: ToolDef, activeToolId: BknpToolId, badges: BknpToolBadge[]): TemplateResult {
    const active = tool.id === activeToolId;
    const badge = badges.find(({ toolId }) => toolId === tool.id);

    return html`
      <li>
        <button
          type="button"
          class=${classMap({ active })}
          aria-pressed=${active ? 'true' : nothing}
          aria-label=${this.#ariaLabel(tool, badge)}
          @click=${() => this.#onSelect(tool.id)}
        >
          <span class="glyph" aria-hidden="true">
            <!--
              Intentionally empty: the kampus theme's 55-icon set has no glyph for
              "contents" / "edit-content" / "assignments" / "notes" / "access-key".
              The box is kept at the glyph's normal size so the rail's vertical
              rhythm matches the design even with no icon rendered.
            -->
            ${badge
              ? badge.count != null
                ? html`<sl-badge class="badge" color="orange" size="sm" aria-hidden="true">${badge.count}</sl-badge>`
                : html`<span class="dot" aria-hidden="true"></span>`
              : nothing}
          </span>
          <span class="caption">${tool.caption}</span>
        </button>
      </li>
    `;
  }

  #onSelect(toolId: BknpToolId): void {
    this.toolSelectEvent.emit({ toolId });
  }

  #ariaLabel(tool: ToolDef, badge?: BknpToolBadge): string {
    if (!badge) {
      return tool.caption;
    }

    return badge.count != null ? `${tool.caption}, ${badge.count} new` : `${tool.caption}, new`;
  }
}

// Guarded global define — this run mints `sl-bknp-*` tags; see the resume addendum
// in IMPL-BRIEF.md for why (a sibling run already minted an unprefixed/differently
// prefixed `left-toolbar` from the same Figma component).
if (!customElements.get('sl-bknp-left-toolbar')) {
  customElements.define('sl-bknp-left-toolbar', BknpLeftToolbar);
}
