import { EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { iconGap } from '../icon-gap.js';
import styles from './nav-rail.css' with { type: 'css' };

/** Stable keys for the seven primary destinations. */
export type A7NavRailItemId =
  | 'home'
  | 'planner'
  | 'class'
  | 'tasks'
  | 'evaluation'
  | 'analytics'
  | 'administration';

export type SlA7MyportalNavSelectEvent = CustomEvent<{ itemId: A7NavRailItemId }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a7-myportal-nav-select': SlA7MyportalNavSelectEvent;
  }
}

/**
 * Structural config, not data: the primary navigation is app-global chrome, fixed in order and
 * membership, and is not part of any fetched record. Called out here as the conventions require.
 *
 * Every rail glyph is an exported SVG asset in the design and none of the seven is in the theme's
 * 34-icon registry, so all seven render as `iconGap(24)`.
 */
const NAV_ITEMS: ReadonlyArray<{ id: A7NavRailItemId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'planner', label: 'Planner' },
  { id: 'class', label: 'Class' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'evaluation', label: 'Evaluation' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'administration', label: 'Administration' }
];

/**
 * The portal's primary left navigation.
 *
 * Carries no model object: its only input is which item is active, which is a genuinely
 * independent scalar rather than a slice of domain data, so the conventions make it a plain
 * property.
 *
 * The design's eighth row — "Miniaturize", node `15878:180709` — is **deliberately not rendered**.
 * It sits at absolute y = 96 (menu frame) + 504 (footer frame) + 1274 = 1874, and its own content
 * begins 24px lower still, at 1898, against an artboard 1890 tall. It is clipped out of the
 * reference, so rendering it would put visible content where the ground truth has none.
 */
export class A7NavRail extends LitElement {
  static override styles: CSSResultGroup = styles;

  /** Which destination is currently active. */
  @property({ reflect: true, attribute: 'active-item' }) activeItem: A7NavRailItemId = 'home';

  /** Emits when a destination is activated. */
  @event({ name: 'sl-a7-myportal-nav-select' }) navSelectEvent!: EventEmitter<SlA7MyportalNavSelectEvent>;

  override render(): TemplateResult {
    return html`
      <nav aria-label="Primary">
        <ul>
          ${NAV_ITEMS.map(item => {
            const active = item.id === this.activeItem;

            return html`
              <li>
                <button
                  aria-current=${active ? 'page' : 'false'}
                  ?data-active=${active}
                  type="button"
                  @click=${() => this.navSelectEvent.emit({ itemId: item.id })}
                >
                  ${iconGap(24)}
                  <span>${item.label}</span>
                </button>
              </li>
            `;
          })}
        </ul>
      </nav>
    `;
  }
}
