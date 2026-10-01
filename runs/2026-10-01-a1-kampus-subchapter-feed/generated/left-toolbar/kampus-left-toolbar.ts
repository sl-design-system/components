import { type EventEmitter, event } from '@sl-design-system/shared';
import { LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type ToolId, type ToolbarModel } from '../models.js';
import styles from './kampus-left-toolbar.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a1-kampus-left-toolbar': A1KampusLeftToolbar;
  }

  interface GlobalEventHandlersEventMap {
    'sl-toolbar-tool-select': SlToolbarToolSelectEvent;
  }
}

/** The detail of the `sl-toolbar-tool-select` event. */
export type SlToolbarToolSelectEvent = CustomEvent<{ toolId: ToolId }>;

/** Structural config: one rail entry. Not part of the data model — see `ToolbarModel`. */
interface ToolbarToolConfig {
  id: ToolId;
  label: string;
  icon: () => TemplateResult;
}

/**
 * Structural/presentation config owned by this component (not model input) — the design's five
 * rail entries, in design order, never vary per user; only the badge counts and the active id
 * are data (`ToolbarModel`). Icons are small inline SVGs (see the five-rules brief: the Kampus
 * theme has no registered icon set covering these glyphs, so `sl-icon` would render nothing).
 */
const TOOLBAR_TOOLS: ToolbarToolConfig[] = [
  { id: 'contents', label: 'Contents', icon: renderContentsIcon },
  { id: 'edit-content', label: 'Edit content', icon: renderEditContentIcon },
  { id: 'assignments', label: 'Assignments', icon: renderAssignmentsIcon },
  { id: 'notes', label: 'Notes', icon: renderNotesIcon },
  { id: 'access-key', label: 'Access key', icon: renderAccessKeyIcon }
];

function renderContentsIcon(): TemplateResult {
  return html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <circle cx="3.5" cy="6" r="0.75" fill="currentColor" stroke="none"></circle>
      <circle cx="3.5" cy="12" r="0.75" fill="currentColor" stroke="none"></circle>
      <circle cx="3.5" cy="18" r="0.75" fill="currentColor" stroke="none"></circle>
      <line x1="7.5" y1="6" x2="20.5" y2="6"></line>
      <line x1="7.5" y1="12" x2="20.5" y2="12"></line>
      <line x1="7.5" y1="18" x2="20.5" y2="18"></line>
    </svg>
  `;
}

function renderEditContentIcon(): TemplateResult {
  return html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M13 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7"></path>
      <line x1="5.5" y1="9" x2="12" y2="9"></line>
      <line x1="5.5" y1="13" x2="10" y2="13"></line>
      <path d="m21.3 5.7-3-3-8.3 8.3-.7 3.7 3.7-.7 8.3-8.3a1 1 0 0 0 0-1.4z"></path>
    </svg>
  `;
}

function renderAssignmentsIcon(): TemplateResult {
  return html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="5" y="4" width="14" height="17" rx="1.5"></rect>
      <rect x="9" y="2.5" width="6" height="3" rx="1"></rect>
      <path d="m9 13 2 2 4-4.5"></path>
    </svg>
  `;
}

function renderNotesIcon(): TemplateResult {
  return html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="5" y="3" width="14" height="18" rx="1.5"></rect>
      <line x1="8" y1="8" x2="16" y2="8"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
      <line x1="8" y1="16" x2="13" y2="16"></line>
    </svg>
  `;
}

function renderAccessKeyIcon(): TemplateResult {
  return html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="8" cy="8" r="4"></circle>
      <line x1="11" y1="11" x2="21" y2="21"></line>
      <line x1="16" y1="16" x2="19" y2="13"></line>
      <line x1="18.5" y1="18.5" x2="21" y2="16"></line>
    </svg>
  `;
}

/**
 * The 74px-wide vertical tool rail down the left edge of the Kampus subchapter feed page:
 * Contents, Edit content, Assignments, Notes and Access key, each an icon above a centred
 * label, with an optional count badge. Presentational — the page passes in its `model` (which
 * tool is active, and which tools carry a badge count) and handles the emitted tool-select
 * event to update its own selection state.
 *
 * ```html
 * <sl-a1-kampus-left-toolbar
 *   .model=${{ activeToolId: 'contents', badges: { 'edit-content': 4, assignments: 1 } }}
 * ></sl-a1-kampus-left-toolbar>
 * ```
 *
 * @fires sl-toolbar-tool-select - Emitted when a rail entry is activated, with the selected tool's id.
 */
export class A1KampusLeftToolbar extends LitElement {
  /** @internal */
  static override styles = styles;

  /** @internal Emits when a rail entry is activated. */
  @event({ name: 'sl-toolbar-tool-select' }) toolSelectEvent!: EventEmitter<SlToolbarToolSelectEvent>;

  /** Which tool is active, and which tools carry a badge count. */
  @property({ attribute: false }) model?: ToolbarModel;

  override render(): TemplateResult {
    const activeToolId = this.model?.activeToolId;
    const badges = this.model?.badges ?? {};

    return html`
      <ul role="toolbar" aria-orientation="vertical" aria-label="Tools" @keydown=${this.#onKeydown}>
        ${TOOLBAR_TOOLS.map(tool => {
          const active = tool.id === activeToolId;
          const count = badges[tool.id];
          const accessibleName = count ? `${tool.label}, ${count} items` : tool.label;

          return html`
            <li>
              <button
                type="button"
                tabindex=${active ? 0 : -1}
                aria-pressed=${active ? 'true' : 'false'}
                aria-label=${accessibleName}
                @click=${() => this.#onToolClick(tool.id)}
              >
                <span class="icon-wrap">
                  ${tool.icon()} ${count ? html`<span class="badge">${count}</span>` : nothing}
                </span>
                <span class="label">${tool.label}</span>
              </button>
            </li>
          `;
        })}
      </ul>
    `;
  }

  #onToolClick(toolId: ToolId): void {
    this.toolSelectEvent.emit({ toolId });
  }

  /**
   * Roving focus for the vertical toolbar: Up/Down (and Home/End) move DOM focus between the
   * five entries. The `tabindex="0"` stop itself tracks the active tool (see `render`), not the
   * last-focused entry — arrow-key browsing doesn't change the selection, only a click/activation
   * does (via the emitted `sl-toolbar-tool-select` event, handled by the data-owning parent).
   */
  #onKeydown(e: KeyboardEvent): void {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      return;
    }

    const buttons = [...this.renderRoot.querySelectorAll<HTMLButtonElement>('button')],
      currentIndex = buttons.findIndex(button => button === this.shadowRoot?.activeElement);

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowUp':
        nextIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex === -1 || currentIndex === buttons.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = buttons.length - 1;
        break;
    }

    e.preventDefault();
    buttons[nextIndex]?.focus();
  }
}

if (!customElements.get('sl-a1-kampus-left-toolbar')) {
  customElements.define('sl-a1-kampus-left-toolbar', A1KampusLeftToolbar);
}
