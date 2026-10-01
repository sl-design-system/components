import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type AppHeaderModel, type NavId } from '../types.js';
import styles from './group-details-app-header.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-b-sesame-group-details-nav-select': SlBSesameGroupDetailsNavSelectEvent;
    'sl-b-sesame-group-details-profile-select': SlBSesameGroupDetailsProfileSelectEvent;
    'sl-b-sesame-group-details-switch-school': SlBSesameGroupDetailsSwitchSchoolEvent;
  }
}

/** Emitted when a top-level navigation item is activated. */
export type SlBSesameGroupDetailsNavSelectEvent = CustomEvent<{ navId: NavId }>;

/** Emitted when the "Switch school" control is activated. */
export type SlBSesameGroupDetailsSwitchSchoolEvent = CustomEvent<void>;

/** Emitted when the avatar/profile control is activated. */
export type SlBSesameGroupDetailsProfileSelectEvent = CustomEvent<void>;

/**
 * Structural, not data: the navigation is the same on every screen of the product, so the item
 * list is a constant here and the model carries only which one is current.
 */
const NAV_ITEMS: ReadonlyArray<{ id: NavId; label: string }> = [
  { id: 'learning-materials', label: 'Learning materials' },
  { id: 'groups', label: 'Groups' },
  { id: 'users', label: 'Users' },
  { id: 'licenses', label: 'Licenses' }
];

/**
 * The application chrome at the top of the "Group details" page: the wordmark, the primary
 * navigation, the signed-in user's avatar, and — on a second row — the active school and a
 * control to switch it.
 *
 * Presentational: it renders the model the page gives it and emits when something is activated.
 * Scoped child of the page root; it registers no custom element of its own.
 *
 * Two of the glyphs this header draws — `school-flag` and `gear` (the avatar badge) — are **not**
 * in the theme's icon registry. They are omitted, with their 16x16 footprint preserved, and
 * recorded as Stage 4 discrepancies. Nothing is drawn in their place.
 *
 * @fires sl-b-sesame-group-details-nav-select - Emitted with the navigation id that was activated.
 * @fires sl-b-sesame-group-details-switch-school - Emitted when "Switch school" is activated.
 * @fires sl-b-sesame-group-details-profile-select - Emitted when the avatar is activated.
 */
export class GroupDetailsAppHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-avatar': Avatar, 'sl-button': Button, 'sl-icon': Icon };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The wordmark, navigation state, user and active school. */
  @property({ attribute: false }) model?: AppHeaderModel;

  /** @internal Emits when a navigation item is activated. */
  @event({ name: 'sl-b-sesame-group-details-nav-select' })
  navSelectEvent!: EventEmitter<SlBSesameGroupDetailsNavSelectEvent>;

  /** @internal Emits when "Switch school" is activated. */
  @event({ name: 'sl-b-sesame-group-details-switch-school' })
  switchSchoolEvent!: EventEmitter<SlBSesameGroupDetailsSwitchSchoolEvent>;

  /** @internal Emits when the avatar is activated. */
  @event({ name: 'sl-b-sesame-group-details-profile-select' })
  profileSelectEvent!: EventEmitter<SlBSesameGroupDetailsProfileSelectEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html`${nothing}`;
    }

    return html`
      <div class="nav-bar">
        <div class="gutter">
          <!-- The wordmark is an image asset in Figma and the pipeline has no export step, so it
               renders as text at the asset's measured width. See the run's OQ-6. -->
          <span class="wordmark">${model.brandName}</span>

          <nav aria-label="Main">
            <ul>
              ${NAV_ITEMS.map(
                item => html`
                  <li>
                    <a
                      aria-current=${item.id === model.activeNavId ? 'page' : nothing}
                      class=${item.id === model.activeNavId ? 'active' : ''}
                      href="#"
                      @click=${(event: Event) => this.#onNavClick(event, item.id)}
                      >${item.label}</a
                    >
                  </li>
                `
              )}
            </ul>
          </nav>

          <button class="profile" type="button" @click=${this.#onProfileClick}>
            <sl-avatar
              .displayInitials=${model.user.initials}
              .displayName=${model.user.name}
              size="lg"
            >
              <!-- The subheader is sl-avatar's DEFAULT slot. There is no slot="subheader":
                   avatar.ts documents "@slot - The subheading of the avatar." A named slot here
                   is silently dropped, which is how the role went missing in iteration 0.

                   size="lg", not the design's 32px circle, and that is a forced trade.
                   avatar.css hides this slot outright at sm AND md:
                     :host(:where([size='sm'], [size='md'])) { slot:not([name]) { display: none } }
                   and md is the only size whose picture is 32px (--sl-size-400). The design
                   draws a 32px circle WITH a subheader, a combination sl-avatar does not
                   support. lg gives --sl-size-500 = 40px, so the circle is 40 - 32 = 8px wide
                   of the design. Content was kept over geometry: dropping "Teacher" loses
                   information, the 8px does not. Recorded as a Stage 4 discrepancy and as a
                   design-system gap. -->
              ${model.user.role}
              <!-- "gear" is not in the theme's 54-icon registry. Omitted with its footprint
                   preserved; never hand-drawn. Recorded as a Stage 4 discrepancy. -->
              <span aria-hidden="true" class="icon-omitted" slot="badge"></span>
            </sl-avatar>
            <sl-icon name="chevron-down" size="sm"></sl-icon>
          </button>
        </div>
      </div>

      <div class="school-bar">
        <div class="gutter">
          <!-- "school-flag" is not in the registry; same treatment as "gear" above. -->
          <span aria-hidden="true" class="icon-omitted"></span>
          <span class="school-name">${model.school.name}</span>
          <sl-button fill="link" shape="pill" size="md" @click=${this.#onSwitchSchoolClick}>
            Switch school
          </sl-button>
        </div>
      </div>
    `;
  }

  #onNavClick(event: Event, navId: NavId): void {
    event.preventDefault();
    this.navSelectEvent.emit({ navId });
  }

  #onSwitchSchoolClick(): void {
    this.switchSchoolEvent.emit();
  }

  #onProfileClick(): void {
    this.profileSelectEvent.emit();
  }
}
