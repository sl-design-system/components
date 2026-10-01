import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Badge } from '@sl-design-system/badge';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
// `@fortawesome/*` is not installed in this checkout, so the framework skill's
// `Icon.register(faGear)` convention cannot be followed here. The run ships its own icon
// library instead; see ../run-icons.ts for the recorded fidelity trade-off.
import { registerRunIcons } from '../run-icons.js';
import styles from './my-groups-app-header.css' with { type: 'css' };

registerRunIcons();

declare global {
  interface HTMLElementTagNameMap {
    'sl-my-groups-app-header': MyGroupsAppHeader;
  }

  interface GlobalEventHandlersEventMap {
    'sl-my-groups-nav-select': SlMyGroupsNavSelectEvent;
    'sl-my-groups-switch-school': SlMyGroupsSwitchSchoolEvent;
  }
}

/** The stable id of one of the four primary navigation destinations. */
export type NavId = 'learning-materials' | 'groups' | 'users' | 'licenses';

/** The data the app header renders; owned and passed in by the page. */
export interface AppHeaderModel {
  activeNavId: NavId;
  user: { name: string; initials: string; role: string };
  school: { id: string; name: string };
}

export type SlMyGroupsNavSelectEvent = CustomEvent<{ navId: NavId }>;

export type SlMyGroupsSwitchSchoolEvent = CustomEvent<void>;

/** Structural config: one primary navigation destination. Not part of the data model. */
interface NavItem {
  id: NavId;
  label: string;
  href: string;
}

/**
 * Structural/presentation config owned by this component rather than passed in: the four nav
 * destinations never vary per user, so the model carries only `activeNavId`. The design does
 * not specify routes, so every `href` is the `'#'` placeholder — flagged in the report.
 */
const NAV_ITEMS: NavItem[] = [
  { id: 'learning-materials', label: 'Learning materials', href: '#' },
  { id: 'groups', label: 'Groups', href: '#' },
  { id: 'users', label: 'Users', href: '#' },
  { id: 'licenses', label: 'Licenses', href: '#' }
];

/**
 * The application header of the "My Groups" screen: the brand wordmark, the primary navigation,
 * the signed-in user control, and a secondary bar naming the active school with a "Switch
 * school" action.
 *
 * Presentational — it renders the `model` the page gives it and emits when a nav destination or
 * "Switch school" is activated; it owns no data and opens no menu itself.
 *
 * ```html
 * <sl-my-groups-app-header .model=${model}></sl-my-groups-app-header>
 * ```
 *
 * @fires sl-my-groups-nav-select - Emitted with the selected nav id when a nav item is activated.
 * @fires sl-my-groups-switch-school - Emitted when "Switch school" is activated.
 */
export class MyGroupsAppHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-badge': Badge,
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The active nav destination, the signed-in user and the active school. */
  @property({ attribute: false }) model?: AppHeaderModel;

  /** @internal Emits when a nav item is activated. */
  @event({ name: 'sl-my-groups-nav-select' }) navSelectEvent!: EventEmitter<SlMyGroupsNavSelectEvent>;

  /** @internal Emits when "Switch school" is activated. */
  @event({ name: 'sl-my-groups-switch-school' })
  switchSchoolEvent!: EventEmitter<SlMyGroupsSwitchSchoolEvent>;

  override render(): TemplateResult {
    const { user, school } = this.model ?? {};

    return html`
      <div class="nav-bar">
        <!-- logo asset placeholder: the Figma wordmark is an expiring asset URL, so the brand
             mark is reproduced as text sized to the logo's box. -->
        <span class="wordmark">my van</span>

        <nav aria-label="Main">
          <ul>
            ${NAV_ITEMS.map(item => {
              const active = item.id === this.model?.activeNavId;

              return html`
                <li>
                  <a
                    @click=${(e: MouseEvent) => this.#onNavClick(e, item)}
                    aria-current=${ifDefined(active ? 'page' : undefined)}
                    href=${item.href}
                    >${item.label}</a
                  >
                </li>
              `;
            })}
          </ul>
        </nav>

        ${user
          ? html`
              <!--
                A plain button: the user menu it would open is out of scope for this screen, so
                it carries no aria-haspopup/aria-expanded. Advertising a popup that never opens
                is worse than none. Both ARIA states come back with the menu, together with the
                event the Shared Types contract would then need to declare.
              -->
              <button class="user" type="button">
                <span class="user-text">
                  <span class="user-name">${user.name}</span>
                  <span class="user-role">${user.role}</span>
                </span>
                <sl-avatar
                  aria-hidden="true"
                  color="yellow"
                  display-initials=${user.initials}
                  display-name=${user.name}
                  image-only
                  size="md">
                  <!--
                    size="sm" is SLDS's *dot* badge: badge.css gives [size='sm'][round] a
                    transparent host plus an 8px ::before dot, so it cannot carry an icon. An
                    explicit color + emphasis is what paints a solid fill (see avatar.stories.ts);
                    without it the badge computes rgba(0, 0, 0, 0) and the clip-path cutout
                    sl-avatar always draws tears a hole in the circle.
                  -->
                  <sl-badge color="grey" emphasis="bold" slot="badge">
                    <sl-icon name="gear" size="2xs"></sl-icon>
                  </sl-badge>
                </sl-avatar>
                <sl-icon name="chevron-up" size="md"></sl-icon>
              </button>
            `
          : nothing}
      </div>

      ${school
        ? html`
            <div class="school-bar">
              <sl-icon name="school-flag" size="md"></sl-icon>
              <span class="school-name">${school.name}</span>
              <sl-button @click=${this.#onSwitchSchoolClick} class="switch-school" fill="link">
                Switch school
              </sl-button>
            </div>
          `
        : nothing}
    `;
  }

  /**
   * The nav `href`s are `'#'` placeholders (the design specifies no routes), so the anchor's own
   * navigation is always suppressed and the page decides what happens via the emitted event.
   */
  #onNavClick(e: MouseEvent, item: NavItem): void {
    e.preventDefault();

    this.navSelectEvent.emit({ navId: item.id });
  }

  #onSwitchSchoolClick(): void {
    this.switchSchoolEvent.emit();
  }
}
