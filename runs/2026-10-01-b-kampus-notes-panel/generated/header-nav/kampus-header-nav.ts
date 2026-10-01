import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './kampus-header-nav.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-bknp-header-nav': BknpHeaderNav;
  }

  interface GlobalEventHandlersEventMap {
    'sl-bknp-nav-select': SlBknpNavSelectEvent;
    'sl-bknp-header-action': SlBknpHeaderActionEvent;
  }
}

/** The id of one of the three primary-nav entries. */
export type BknpNavId = 'learning-materials' | 'tests' | 'dashboard';

/** The id of one of the four trailing icon actions. */
export type BknpHeaderAction = 'search' | 'notifications' | 'help' | 'account';

/** The data `sl-bknp-header-nav` is fed by its data-owning parent. */
export interface HeaderNavModel {
  /** The currently active primary-nav entry. */
  activeNavId: BknpNavId;

  /** The unread notification count; the "3" badge is hidden when this is 0. */
  notificationCount: number;
}

/** The detail of the `sl-bknp-nav-select` event. */
export type SlBknpNavSelectEvent = CustomEvent<{ navId: BknpNavId }>;

/** The detail of the `sl-bknp-header-action` event. */
export type SlBknpHeaderActionEvent = CustomEvent<{ action: BknpHeaderAction }>;

/** Structural config: one entry in the fixed primary nav. Not part of the data model. */
interface NavEntryConfig {
  id: BknpNavId;
  label: string;
}

/** Structural config: one entry in the fixed trailing icon-action cluster. Not part of the model. */
interface HeaderActionConfig {
  id: BknpHeaderAction;
  label: string;
  /** Theme icon name; omitted when the theme has no matching glyph (see the component report). */
  icon?: string;
}

/**
 * Structural/presentation config owned by this component (not model input) — the design's three
 * nav entries never vary per user, so they're a local constant rather than a property.
 */
const NAV_ENTRIES: readonly NavEntryConfig[] = [
  { id: 'learning-materials', label: 'Learning materials' },
  { id: 'tests', label: 'Tests' },
  { id: 'dashboard', label: 'Dashboard' }
];

/**
 * Structural/presentation config: the fixed trailing icon-action cluster, in design order.
 *
 * The kampus theme's 55 registered icons (see the run's token-map.md) include `search` but have
 * no bell/question-mark/account glyph, so `notifications`, `help` and `account` render icon-less
 * (aria-label only) — see the component report for this discrepancy. No `@fortawesome/*` icon is
 * imported and no glyph is hand-drawn; both are forbidden for this run.
 */
const HEADER_ACTIONS: readonly HeaderActionConfig[] = [
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'help', label: 'Help' },
  { id: 'account', label: 'Account' }
];

/**
 * The Kampus global header bar: a "My page" home link, the primary nav (Learning materials /
 * Tests / Dashboard) and a trailing icon-action cluster (search, notifications, help, account).
 *
 * Presentational — it renders the fixed structural config above plus the `model` (active nav
 * entry, unread count) it is given, and emits when a nav entry or an action button is activated.
 * The host app owns routing/navigation; this renders a plain `:host`, not `<header>`/`role="banner"`.
 *
 * ```html
 * <sl-bknp-header-nav
 *   .model=${{ activeNavId: 'learning-materials', notificationCount: 3 }}>
 * </sl-bknp-header-nav>
 * ```
 *
 * @fires sl-bknp-nav-select - Emitted with the nav entry's id when it is activated.
 * @fires sl-bknp-header-action - Emitted with the action's id when an action button is activated.
 */
export class BknpHeaderNav extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Emits with the nav entry's id when it is activated. */
  @event({ name: 'sl-bknp-nav-select' }) navSelectEvent!: EventEmitter<SlBknpNavSelectEvent>;

  /** Emits with the action's id when a trailing action button is activated. */
  @event({ name: 'sl-bknp-header-action' }) headerActionEvent!: EventEmitter<SlBknpHeaderActionEvent>;

  /** The active nav entry and the unread notification count. */
  @property({ attribute: false }) model?: HeaderNavModel;

  override render(): TemplateResult {
    const activeNavId = this.model?.activeNavId,
      notificationCount = this.model?.notificationCount ?? 0;

    return html`
      <a class="home" href="#" @click=${(e: MouseEvent) => e.preventDefault()}>
        <sl-icon name="home-blank"></sl-icon>
        <span>My page</span>
      </a>

      <nav aria-label="Primary">
        <ul>
          ${NAV_ENTRIES.map(entry => {
            const active = entry.id === activeNavId;

            return html`
              <li>
                <a
                  aria-current=${ifDefined(active ? 'page' : undefined)}
                  class=${classMap({ active })}
                  href="#"
                  @click=${(e: MouseEvent) => this.#onNavClick(e, entry.id)}
                  >${entry.label}</a
                >
              </li>
            `;
          })}
        </ul>
      </nav>

      <div class="actions">
        ${HEADER_ACTIONS.map(action => this.#renderAction(action, notificationCount))}
      </div>
    `;
  }

  #renderAction(action: HeaderActionConfig, notificationCount: number): TemplateResult {
    const isNotifications = action.id === 'notifications',
      hasCount = isNotifications && notificationCount > 0,
      label = hasCount ? `${action.label}, ${notificationCount} unread` : action.label;

    return html`
      <span class="action">
        <sl-button
          aria-label=${label}
          fill="ghost"
          variant="inverted"
          @click=${() => this.#onActionClick(action.id)}>
          ${action.icon ? html`<sl-icon name=${action.icon}></sl-icon>` : nothing}
        </sl-button>
        ${hasCount
          ? html`
              <sl-badge aria-hidden="true" class="count" color="orange" emphasis="bold">
                ${notificationCount}
              </sl-badge>
            `
          : nothing}
      </span>
    `;
  }

  /**
   * Prevents the placeholder `href="#"` anchor's default navigation (no router is wired up in
   * this example) and emits `sl-bknp-nav-select`; the host app decides what happens next.
   */
  #onNavClick(e: MouseEvent, navId: BknpNavId): void {
    e.preventDefault();
    this.navSelectEvent.emit({ navId });
  }

  #onActionClick(action: BknpHeaderAction): void {
    this.headerActionEvent.emit({ action });
  }
}

if (!customElements.get('sl-bknp-header-nav')) {
  customElements.define('sl-bknp-header-nav', BknpHeaderNav);
}
