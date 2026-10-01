import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { Tab, TabGroup } from '@sl-design-system/tabs';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './page-header.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a10-tab-change': SlA10TabChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a10-page-header': A10PageHeader;
  }
}

/** The four routes of the Functional management area. */
export type FamTabId = 'users' | 'downtime-events' | 'services' | 'metadata-usage';

/** The slice of the page's domain model this header renders. Owned by the page root. */
export interface PageHeaderModel {
  title: string;
}

/** Emitted with the id of the tab the user activated. */
export type SlA10TabChangeEvent = CustomEvent<FamTabId>;

/**
 * Structural/presentation config: the four routes never vary per user or per request, so they are
 * a module-level constant here rather than a field on `PageHeaderModel`.
 */
const FAM_TABS = [
  { id: 'users', label: 'Users' },
  { id: 'downtime-events', label: 'Downtime events' },
  { id: 'services', label: 'Services' },
  { id: 'metadata-usage', label: 'Metadata usage' }
] as const satisfies ReadonlyArray<{ id: FamTabId; label: string }>;

/**
 * The Functional management page header: a grey band carrying the page `<h1>` and, flush to the
 * band's bottom edge, the four-route tab strip.
 *
 * Presentational — it renders the `model` the page root gives it and emits when a tab is
 * activated; the root owns the data, the routing and the active route's content.
 *
 * The strip is a route switcher, so it carries `sl-tab` children and **no** `sl-tab-panel`: the
 * page renders the active route itself.
 *
 * Scoped child of the page root — it does not register a custom element of its own.
 *
 * ```html
 * <sl-a10-page-header .model=${model} active-tab="users"></sl-a10-page-header>
 * ```
 *
 * @fires sl-a10-tab-change - Emitted with the tab's id when the user activates a tab.
 */
export class A10PageHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-tab': Tab,
      'sl-tab-group': TabGroup
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Emits with the tab's id when the user activates a tab. */
  @event({ name: 'sl-a10-tab-change' }) tabChangeEvent!: EventEmitter<SlA10TabChangeEvent>;

  /**
   * The currently active route. Independent UI state rather than a `PageHeaderModel` field — the
   * page root drives it, and it changes without the data changing.
   *
   * @default 'users'
   */
  @property({ reflect: true, attribute: 'active-tab' }) activeTab: FamTabId = 'users';

  /** The page title shown as the band's `<h1>`. */
  @property({ attribute: false }) model!: PageHeaderModel;

  override render(): TemplateResult {
    // `model` is required, but a first paint can still beat the parent's property assignment.
    const { title } = this.model ?? { title: '' };

    return html`
      <header class="band">
        <h1>${title}</h1>
        <!--
          KNOWN ACCESSIBILITY GAP. The strip has no sl-tab-panel elements, so sl-tab-group cannot
          give its tabs an aria-controls (it removes the attribute when a tab has no matching
          panel), and the page root's content region cannot be aria-labelledby the active tab
          either: the tabs live in this component's shadow root and the content lives in the
          root's, and an IDREF cannot cross a shadow boundary. Recorded rather than papered over.

          The no-panels attribute is written here rather than left to the component: sl-tab-group
          sets it from the default slot's slotchange, which does not reliably fire for a slot that
          is empty from the start, and until it is set the (empty) panels container keeps 24px of
          padding that would push the strip off the band's bottom edge.
        -->
        <sl-tab-group @sl-tab-change=${this.#onTabChange} no-panels>
          ${FAM_TABS.map(
            tab => html`<sl-tab ?selected=${tab.id === this.activeTab}>${tab.label}</sl-tab>`
          )}
        </sl-tab-group>
      </header>
    `;
  }

  /**
   * `sl-tab-group` reports the *index* of the newly selected tab (`SlTabChangeEvent` is a
   * `CustomEvent<number>`), so map it back onto the stable route id before republishing it under
   * this component's own namespaced event.
   */
  #onTabChange(event: CustomEvent<number>): void {
    // -1 means "deselected"; `Array.at(-1)` would silently wrap around to the last tab.
    const tab = event.detail < 0 ? undefined : FAM_TABS.at(event.detail);

    if (!tab) {
      return;
    }

    this.activeTab = tab.id;
    this.tabChangeEvent.emit(tab.id);
  }
}
