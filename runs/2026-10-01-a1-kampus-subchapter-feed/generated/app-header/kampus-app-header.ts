import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import { type AppHeaderActionId, type AppNavId } from '../models.js';
import styles from './kampus-app-header.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-kampus-app-header': KampusAppHeader;
  }

  interface GlobalEventHandlersEventMap {
    'sl-app-nav-select': SlAppNavSelectEvent;
    'sl-app-header-action': SlAppHeaderActionEvent;
  }
}

/** The detail of the `sl-app-nav-select` event. */
export type SlAppNavSelectEvent = CustomEvent<{ id: AppNavId }>;

/** The detail of the `sl-app-header-action` event. */
export type SlAppHeaderActionEvent = CustomEvent<{ action: AppHeaderActionId }>;

/** Structural config: one entry in the fixed primary nav. Not part of the data model. */
interface NavItemConfig {
  id: AppNavId;
  label: string;
}

/** Structural config: one entry in the fixed right-hand icon cluster. Not part of the data model. */
interface HeaderActionConfig {
  id: AppHeaderActionId;
  label: string;
  glyph: TemplateResult;
}

// Inline SVG glyphs (`fill="currentColor"`, 512x512 viewBox). This Figma file publishes no Code
// Connect mappings and the Kampus theme's own icon set has no search/bell/help/account glyphs, so
// `sl-icon` would render nothing — see the run's IMPLEMENTER-BRIEF.md, rule 1. Exact path fidelity
// is not the point here, only presence and size.
const HOME_GLYPH = html`
  <svg aria-hidden="true" class="glyph" viewBox="0 0 512 512">
    <path
      d="M280.37 148.26 96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.94-16.06V368a16
        16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300
        L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47 488 182.56V44.05a12 12 0 0 0-12-12h-56
        a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31
        A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6
        l25.5-31a12 12 0 0 0-1.7-16.93z"
      fill="currentColor" />
  </svg>
`;

const SEARCH_GLYPH = html`
  <svg aria-hidden="true" class="glyph" viewBox="0 0 512 512">
    <path
      d="M505 442.7 405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0
        208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7
        99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 0-34zM208 336c-70.7 0-128-57.3-128-128
        S137.3 80 208 80s128 57.3 128 128-57.3 128-128 128z"
      fill="currentColor" />
  </svg>
`;

const BELL_GLYPH = html`
  <svg aria-hidden="true" class="glyph" viewBox="0 0 512 512">
    <path
      d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32
        -20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32
        s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29
        -6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32
        .05-7.55-2.61-15.27-8.61-21.71z"
      fill="currentColor" />
  </svg>
`;

const HELP_GLYPH = html`
  <svg aria-hidden="true" class="glyph" viewBox="0 0 512 512">
    <path
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3
        h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8l-32.2 18.6c-.2 12.1-10.2 21.8-22.4
        21.8c-12.4 0-22.4-10-22.4-22.4v-12.4c0-8 4.3-15.4 11.3-19.4l43.9-25.4c4.7-2.7 7.6-7.7
        7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.1 11.7-16.9
        17.9-28.6 13.8s-17.9-16.9-13.8-28.6l.4-1.2zM224 384a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"
      fill="currentColor" />
  </svg>
`;

const ACCOUNT_GLYPH = html`
  <svg aria-hidden="true" class="glyph" viewBox="0 0 512 512">
    <path
      d="M399 384.2C376.9 345.8 335.4 320 288 320h-64c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2
        63.8 143 63.8s107.8-24.7 143-63.8zM256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zm0
        128a80 80 0 1 0 0 160 80 80 0 1 0 0-160z"
      fill="currentColor" />
  </svg>
`;

/**
 * Structural/presentation config owned by this component (not model input) — the design's four
 * nav items never vary per user, so they're a local constant rather than a property. `my-page`
 * additionally renders the home glyph; see `render()`.
 */
const NAV_ITEMS: NavItemConfig[] = [
  { id: 'my-page', label: 'My page' },
  { id: 'learning-materials', label: 'Learning materials' },
  { id: 'tests', label: 'Tests' },
  { id: 'dashboard', label: 'Dashboard' }
];

/** Structural/presentation config: the fixed right-hand icon cluster, in design order. */
const HEADER_ACTIONS: HeaderActionConfig[] = [
  { id: 'search', label: 'Search', glyph: SEARCH_GLYPH },
  { id: 'notifications', label: 'Notifications', glyph: BELL_GLYPH },
  { id: 'help', label: 'Help', glyph: HELP_GLYPH },
  { id: 'account', label: 'Account', glyph: ACCOUNT_GLYPH }
];

/**
 * The persistent Kampus top bar: a home link back to "My page", the primary nav
 * (Learning materials / Tests / Dashboard), and a right-hand icon cluster (search,
 * notifications, help, account).
 *
 * Presentational — it renders its fixed structural config plus the `activeNavId` /
 * `notificationCount` it is given, and emits when a nav item or an icon action is activated; the
 * host app owns routing/navigation and the `role="banner"` landmark, so this renders a plain
 * `<div>`, not `<header>`.
 *
 * ```html
 * <sl-kampus-app-header active-nav-id="learning-materials" .notificationCount=${3}>
 * </sl-kampus-app-header>
 * ```
 *
 * @fires sl-app-nav-select - Emitted with the nav item's id when it is clicked.
 * @fires sl-app-header-action - Emitted with the action's id when an icon-cluster button is
 *   clicked.
 */
export class KampusAppHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-badge': Badge
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Emits with the nav item's id when it is clicked. */
  @event({ name: 'sl-app-nav-select' }) navSelectEvent!: EventEmitter<SlAppNavSelectEvent>;

  /** Emits with the action's id when an icon-cluster button is clicked. */
  @event({ name: 'sl-app-header-action' }) headerActionEvent!: EventEmitter<SlAppHeaderActionEvent>;

  /**
   * The currently active primary-nav item.
   *
   * @default 'learning-materials'
   */
  @property({ attribute: 'active-nav-id', reflect: true }) activeNavId?: AppNavId =
    'learning-materials';

  /** The unread notification count; the badge is hidden when this is 0 or undefined. */
  @property({ type: Number, attribute: 'notification-count' }) notificationCount?: number;

  override render(): TemplateResult {
    const activeId = this.activeNavId ?? 'learning-materials';

    return html`
      <div class="bar">
        <nav aria-label="Kampus">
          <ul>
            ${NAV_ITEMS.map(item => {
              const active = item.id === activeId;

              return html`
                <li class=${classMap({ home: item.id === 'my-page' })}>
                  <a
                    class=${classMap({ active })}
                    aria-current=${ifDefined(active ? 'page' : undefined)}
                    href="#"
                    @click=${(e: MouseEvent) => this.#onNavClick(e, item.id)}>
                    ${item.id === 'my-page' ? HOME_GLYPH : nothing}
                    <span>${item.label}</span>
                  </a>
                </li>
              `;
            })}
          </ul>
        </nav>
        <div class="actions">${HEADER_ACTIONS.map(action => this.#renderAction(action))}</div>
      </div>
    `;
  }

  #renderAction(action: HeaderActionConfig): TemplateResult {
    if (action.id === 'notifications') {
      const count = this.notificationCount,
        hasCount = typeof count === 'number' && count > 0,
        label = hasCount ? `${action.label}, ${count} unread` : action.label;

      return html`
        <button
          aria-label=${label}
          class="action"
          type="button"
          @click=${() => this.#onActionClick(action.id)}>
          ${action.glyph}
          ${hasCount
            ? html`
                <sl-badge aria-hidden="true" class="count" color="orange" emphasis="bold">
                  ${count}
                </sl-badge>
              `
            : nothing}
        </button>
      `;
    }

    return html`
      <button
        aria-label=${action.label}
        class="action"
        type="button"
        @click=${() => this.#onActionClick(action.id)}>
        ${action.glyph}
      </button>
    `;
  }

  /**
   * Prevents the placeholder `href="#"` anchor's default navigation (no router is wired up in
   * this example) and emits `sl-app-nav-select`; the host app decides what happens next.
   */
  #onNavClick(e: MouseEvent, id: AppNavId): void {
    e.preventDefault();
    this.navSelectEvent.emit({ id });
  }

  #onActionClick(action: AppHeaderActionId): void {
    this.headerActionEvent.emit({ action });
  }
}

if (!customElements.get('sl-kampus-app-header')) {
  customElements.define('sl-kampus-app-header', KampusAppHeader);
}
