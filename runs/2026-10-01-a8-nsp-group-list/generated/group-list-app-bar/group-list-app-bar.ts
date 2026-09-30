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
import styles from './group-list-app-bar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-group-list-notifications-click': SlGroupListNotificationsClickEvent;
    'sl-group-list-account-click': SlGroupListAccountClickEvent;
  }
}

/** The signed-in user's account summary shown in the app bar's account control. */
export interface AccountModel {
  /** The user's full name; used as the account control's accessible name. */
  displayName: string;
  /** The URL of the user's profile picture. */
  pictureUrl?: string;
  /** Fallback initials shown when no picture is set (or it fails to load). */
  initials?: string;
}

/** The data this component renders: the signed-in account and the unread notification count. */
export interface AppBarModel {
  account: AccountModel;
  unreadNotificationCount: number;
}

export type SlGroupListNotificationsClickEvent = CustomEvent<void>;

export type SlGroupListAccountClickEvent = CustomEvent<void>;

/**
 * The top application bar: the brand mark, a notifications bell and the account control.
 *
 * This is a presentational component - it renders the model it's given and emits when the
 * notifications bell or the account control are activated; it owns no data and shows no menu
 * itself (the parent/root decides what happens next).
 *
 * ```html
 * <sl-group-list-app-bar .model=${model}></sl-group-list-app-bar>
 * ```
 *
 * @fires sl-group-list-notifications-click - Emitted when the notifications bell is activated.
 * @fires sl-group-list-account-click - Emitted when the account control is activated.
 */
export class GroupListAppBar extends ScopedElementsMixin(LitElement) {
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

  /** The account summary and unread notification count to render. */
  @property({ attribute: false }) model?: AppBarModel;

  /** Emits when the notifications bell is activated. */
  @event({ name: 'sl-group-list-notifications-click' })
  notificationsClickEvent!: EventEmitter<SlGroupListNotificationsClickEvent>;

  /** Emits when the account control is activated. */
  @event({ name: 'sl-group-list-account-click' })
  accountClickEvent!: EventEmitter<SlGroupListAccountClickEvent>;

  override render(): TemplateResult {
    const account = this.model?.account,
      unreadCount = this.model?.unreadNotificationCount ?? 0,
      bellLabel = unreadCount > 0 ? 'Notifications, unread' : 'Notifications';

    return html`
      <div aria-hidden="true" class="logo">S</div>
      <div class="actions">
        <div class="bell">
          <sl-button
            @click=${this.#onNotificationsClick}
            aria-label=${bellLabel}
            fill="outline"
            shape="pill">
            <!--
              The design calls for a Font Awesome "bell" icon. This checkout has no
              @fortawesome registry access (private registry, no auth token available) and the
              theme's own icon set (packages/themes/sanoma-pro/icons.ts) does not include a
              bell, so it is reproduced as an inline SVG outline instead.
            -->
            <svg aria-hidden="true" class="bell-icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.5c-3.1 0-5.6 2.5-5.6 5.6v3.1c0 .6-.2 1.1-.6 1.6l-1.3 1.6c-.8 1-.1 2.6 1.2 2.6h12.6c1.3 0 2-1.6 1.2-2.6l-1.3-1.6c-.4-.5-.6-1-.6-1.6V8.1c0-3.1-2.5-5.6-5.6-5.6z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5" />
              <path
                d="M9.5 19a2.5 2.5 0 0 0 5 0"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5" />
            </svg>
          </sl-button>
          <sl-badge aria-hidden="true" color="red" emphasis="bold" size="sm"></sl-badge>
        </div>
        ${account
          ? html`
              <sl-button
                @click=${this.#onAccountClick}
                aria-expanded="false"
                aria-haspopup="menu"
                aria-label=${account.displayName}
                class="account">
                <sl-avatar
                  aria-hidden="true"
                  display-initials=${ifDefined(account.initials)}
                  display-name=${account.displayName}
                  image-only
                  picture-url=${ifDefined(account.pictureUrl)}
                  size="sm"></sl-avatar>
                <sl-icon name="chevron-down"></sl-icon>
              </sl-button>
            `
          : nothing}
      </div>
    `;
  }

  #onNotificationsClick(): void {
    this.notificationsClickEvent.emit();
  }

  #onAccountClick(): void {
    this.accountClickEvent.emit();
  }
}
