import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { NotificationList } from './notification-list.js';
import styles from './notification-manager.css' with { type: 'css' };
import { Notification, type NotificationStore } from './notification-store.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-notification-manager': NotificationManager;
  }
}

/** Emitted when the close button of a `closable` manager is used. Uses the `sl-close` name. */
export type SlNotificationManagerCloseEvent = CustomEvent<void>;

/**
 * The panel with the history of notifications: a header with the title and "Mark all as read", and
 * the `<sl-notification-list>` below it. Only the header stays put; the list scrolls.
 *
 * It is shown inline, wherever you put it: in a side panel, or on a page of its own. The
 * `<sl-notification-button>` shows one in a popover, drawer or full screen, depending on the width
 * of the viewport.
 *
 * ```html
 * <sl-notification-manager></sl-notification-manager>
 * ```
 *
 * @csspart header - The header with the title and actions.
 * @csspart body - The scrolling container of the list.
 */
@localized()
export class NotificationManager extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-notification-list': NotificationList
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The store the manager is listening to. */
  #subscribed?: NotificationStore;

  /** @internal */
  @query('sl-notification-list') list?: NotificationList;

  /** @internal Emits when the close button is used. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<SlNotificationManagerCloseEvent>;

  /** @internal The number of unread notifications. */
  @state() unreadCount = 0;

  /** Shows a close button in the header, which emits `sl-close`. */
  @property({ type: Boolean, reflect: true }) closable?: boolean;

  /** The store to show. Defaults to the document's store. */
  @property({ attribute: false }) store: NotificationStore = Notification.store;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#subscribe();
  }

  override disconnectedCallback(): void {
    this.#unsubscribe();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('store') && this.isConnected) {
      this.#subscribe();
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="header">
        <h2 id="title" tabindex="-1">${msg('Notifications', { id: 'sl.notification.title' })}</h2>
        <sl-button
          @click=${this.markAllRead}
          ?disabled=${this.unreadCount === 0}
          fill="link"
          size="sm">
          ${msg('Mark all as read', { id: 'sl.notification.markAllRead' })}
        </sl-button>
        ${
          this.closable
            ? html`
                <sl-button
                  @click=${this.#onClose}
                  aria-label=${msg('Close notifications', { id: 'sl.notification.close' })}
                  class="close"
                  fill="ghost"
                  size="md">
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>
              `
            : nothing
        }
      </div>
      <div part="body">
        <sl-notification-list .store=${this.store}></sl-notification-list>
      </div>
    `;
  }

  /** Moves focus to the heading, so screen readers start at the top. */
  focusHeading(): void {
    this.renderRoot.querySelector<HTMLElement>('#title')?.focus();
  }

  /** Marks all notifications as read. Nothing moves until the next `reset()`. */
  markAllRead(): void {
    this.list?.markAllRead();
  }

  /** Takes a new snapshot of the unread notifications; see `NotificationList.reset()`. */
  reset(): void {
    this.list?.reset();
  }

  #onClose(): void {
    this.closeEvent.emit();
  }

  #onChange = (): void => {
    this.unreadCount = this.#subscribed?.unreadCount ?? 0;
  };

  #subscribe(): void {
    if (this.#subscribed === this.store) {
      return;
    }

    this.#unsubscribe();
    this.#subscribed = this.store;
    this.#subscribed.addEventListener('change', this.#onChange);
    this.#onChange();
  }

  #unsubscribe(): void {
    this.#subscribed?.removeEventListener('change', this.#onChange);
    this.#subscribed = undefined;
  }
}
