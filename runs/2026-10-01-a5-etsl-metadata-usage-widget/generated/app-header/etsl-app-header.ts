import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { Tab, TabGroup } from '@sl-design-system/tabs';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './etsl-app-header.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-etsl-nav-tab-select': SlEtslNavTabSelectEvent;
  }
}

/** The seven routes in the Functional management page header. */
export type EtslNavTabId =
  | 'dashboard'
  | 'publications'
  | 'export'
  | 'asset-request'
  | 'metadata-imports'
  | 'metadata-exports'
  | 'connected-outlines';

/** The slice of the dashboard's domain model this header renders. Owned by the page root. */
export interface AppHeaderModel {
  pageTitle: string;
  projectName: string;
  user: { displayName: string; initials: string };
}

/** Emitted with the id of the nav tab the user activated. */
export type SlEtslNavTabSelectEvent = CustomEvent<EtslNavTabId>;

/**
 * Structural/presentation config: the seven tabs never vary per user or per project, so they are
 * a local constant rather than a model field.
 */
const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'publications', label: 'Publications' },
  { id: 'export', label: 'Export' },
  { id: 'asset-request', label: 'Asset request' },
  { id: 'metadata-imports', label: 'Metadata imports' },
  { id: 'metadata-exports', label: 'Metadata exports' },
  { id: 'connected-outlines', label: 'Connected outlines' }
] as const;

/**
 * Structural constant: the product wordmark. The design uses a Figma CDN bitmap with a 7-day
 * signed URL, which is not a durable asset — rendered as styled text instead.
 */
const WORDMARK = 'Editorial Suite';

/** Structural constant: the accessible name of the top bar's project switcher. */
const PROJECTS_LABEL = 'Projects';

/**
 * The Editorial Suite app chrome: the dark top bar (wordmark, project switcher, signed-in user)
 * above the light title band that carries the page `<h1>` and the seven-tab route strip.
 *
 * Presentational — it renders the `model` the page gives it and emits when a tab is activated;
 * the host app owns routing and the `banner`/`navigation` landmarks, so this renders plain
 * `<div>`s rather than `<header>`/`<nav>`.
 *
 * The tab strip is a route switcher: `sl-tab-group` carries `sl-tab` children only and no
 * `sl-tab-panel` — the page renders the active route's content itself.
 *
 * Scoped child of the page root: it does not register a custom element of its own.
 *
 * ```html
 * <sl-etsl-app-header .model=${model} active-tab="dashboard"></sl-etsl-app-header>
 * ```
 *
 * @fires sl-etsl-nav-tab-select - Emitted with the tab's id when the user activates a nav tab.
 */
export class EtslAppHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-icon': Icon,
      'sl-tab': Tab,
      'sl-tab-group': TabGroup
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Emits with the tab's id when the user activates a nav tab. */
  @event({ name: 'sl-etsl-nav-tab-select' })
  navTabSelectEvent!: EventEmitter<SlEtslNavTabSelectEvent>;

  /**
   * The currently active route.
   *
   * @default 'dashboard'
   */
  @property({ attribute: 'active-tab', reflect: true }) activeTab: EtslNavTabId = 'dashboard';

  /** The page title and the identity shown in the chrome. */
  @property({ attribute: false }) model?: AppHeaderModel;

  override render(): TemplateResult {
    const { pageTitle, projectName, user } = this.model ?? {
      pageTitle: '',
      projectName: '',
      user: { displayName: '', initials: '' }
    };

    return html`
      <div class="bar">
        <span class="wordmark">${WORDMARK}</span>
        <div class="bar-end">
          <button
            @click=${this.#onProjectsClick}
            aria-label=${PROJECTS_LABEL}
            class="projects"
            title=${ifDefined(projectName || undefined)}
            type="button">
            <!--
              The design's leading glyph for this control is "book-circle-arrow-up", which the
              editorial-suite theme does not register. It is left out rather than substituted.
            -->
            <sl-icon name="chevron-down" size="xs"></sl-icon>
          </button>
          <sl-avatar
            display-initials=${user.initials}
            display-name=${user.displayName}
            image-only
            size="md"></sl-avatar>
        </div>
      </div>
      <div class="band">
        <h1>${pageTitle}</h1>
        <sl-tab-group @sl-tab-change=${this.#onTabChange}>
          ${NAV_TABS.map(
            tab => html`<sl-tab ?selected=${tab.id === this.activeTab}>${tab.label}</sl-tab>`
          )}
        </sl-tab-group>
      </div>
    `;
  }

  /**
   * `sl-tab-group` reports the index of the newly selected tab; map it back onto the route id and
   * republish it under this component's own, namespaced event.
   */
  #onTabChange(e: CustomEvent<number>): void {
    // -1 means "deselected"; `Array.at(-1)` would silently wrap around to the last tab.
    const tab = e.detail < 0 ? undefined : NAV_TABS.at(e.detail);

    if (!tab) {
      return;
    }

    this.activeTab = tab.id;
    this.navTabSelectEvent.emit(tab.id);
  }

  /** The project switcher is chrome the host app owns; nothing to do here yet. */
  #onProjectsClick(): void {
    // Intentionally empty — opening the project switcher is the host app's concern, and the spec
    // defines no event for it.
  }
}
