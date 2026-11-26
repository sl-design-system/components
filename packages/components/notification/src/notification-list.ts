import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { RelativeTime } from '@sl-design-system/relative-time';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './notification-list.css' with { type: 'css' };
import { Notification, type NotificationStore } from './notification-store.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-notification-list': NotificationList;
  }
}

const ICONS = {
  info: 'info',
  success: 'circle-check-solid',
  warning: 'triangle-exclamation-solid',
  error: 'octagon-xmark-solid'
};

/**
 * The content of the notification manager: what the user hasn't seen yet. It opens on the unread
 * notifications only; read ones are loaded on request, a page at a time, under "Earlier".
 *
 * The unread list is fixed until the next `reset()`: marking something read changes its look, but
 * nothing moves. New notifications that arrive in the meantime are added at the top.
 *
 * The list is one tab stop (roving tabindex): ↓ ↑ Home End move between the rows, Enter activates a
 * row, → and ← move into and out of its action.
 *
 * It can be used on its own too, for example on a full page of notifications.
 *
 * @csspart list - A list of notifications.
 * @csspart row - A notification in a list.
 * @csspart earlier - The "Earlier" heading.
 * @csspart empty - The message shown when there is nothing unread.
 * @csspart more - The "Show earlier notifications" button.
 * @csspart end - The message shown when all notifications have been loaded.
 */
@localized()
export class NotificationList extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-relative-time': RelativeTime
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The store the list is listening to. */
  #subscribed?: NotificationStore;

  /** The index of the row to focus after the next update. */
  #focusAfterUpdate?: number;

  /** @internal The index of the row that is the tab stop. */
  @state() focusIndex = 0;

  /** @internal The time the list was last reset. */
  @state() openedAt = new Date();

  /** @internal The number of read notifications loaded under "Earlier". */
  @state() readShown = 0;

  /** @internal The ids of the notifications that were unread when the list was last reset. */
  @state() snapshot = new Set<string>();

  /**
   * The number of read notifications loaded each time "Show earlier notifications" is used.
   *
   * @default 10
   */
  @property({ type: Number, attribute: 'page-size' }) pageSize?: number;

  /** The store to show. Defaults to the document's store. */
  @property({ attribute: false }) store: NotificationStore = Notification.store;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#subscribe();
    this.reset();
  }

  override disconnectedCallback(): void {
    this.#unsubscribe();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('store') && this.isConnected) {
      this.#subscribe();
      this.reset();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.#focusAfterUpdate !== undefined) {
      this.#rows[this.#focusAfterUpdate]?.focus();
      this.#focusAfterUpdate = undefined;
    }
  }

  override render(): TemplateResult {
    const { top, rest } = this.#split(),
      earlier = rest.slice(0, this.readShown),
      more = rest.length > this.readShown;

    return html`
      ${
        top.length
          ? html`
              <ul part="list">
                ${repeat(
                  top,
                  n => n.id,
                  (n, i) => this.#renderRow(n, i)
                )}
              </ul>
            `
          : html`
              <div part="empty">
                <p class="empty-title">
                  ${msg('You’re all caught up', { id: 'sl.notification.emptyTitle' })}
                </p>
                <p>${msg('No unread notifications.', { id: 'sl.notification.emptyText' })}</p>
              </div>
            `
      }
      ${
        earlier.length
          ? html`
              <h3 part="earlier">${msg('Earlier', { id: 'sl.notification.earlier' })}</h3>
              <ul part="list">
                ${repeat(
                  earlier,
                  n => n.id,
                  (n, i) => this.#renderRow(n, top.length + i)
                )}
              </ul>
            `
          : nothing
      }
      ${
        more
          ? html`
              <div part="more">
                <sl-button @click=${this.#onLoadMore} fill="outline" size="md">
                  ${msg('Show earlier notifications', { id: 'sl.notification.showEarlier' })}
                </sl-button>
              </div>
            `
          : this.readShown > 0
            ? html`
                <p part="end">${msg('No more notifications', { id: 'sl.notification.end' })}</p>
              `
            : nothing
      }
    `;
  }

  /**
   * Takes a new snapshot of the unread notifications and drops the loaded pages. The manager calls
   * this each time it opens.
   */
  reset(): void {
    this.snapshot = new Set(this.store.all.filter(n => !n.read).map(n => n.id));
    this.openedAt = new Date();
    this.readShown = 0;
    this.focusIndex = 0;
  }

  /** Marks all notifications as read. Nothing moves until the next `reset()`. */
  markAllRead(): void {
    this.store.markAllRead();
  }

  /** Focuses the row that is the tab stop. */
  focusRow(): void {
    this.#rows[this.focusIndex]?.focus();
  }

  get #rows(): HTMLElement[] {
    return Array.from(this.renderRoot.querySelectorAll<HTMLElement>('[part~="row"]'));
  }

  #renderRow(notification: Notification, index: number): TemplateResult {
    const { action, description, id, label, read, variant } = notification,
      link = action?.href ? action : undefined;

    return html`
      <li
        @click=${(event: Event) => this.#onRowClick(event, notification)}
        @focus=${() => (this.focusIndex = index)}
        @keydown=${(event: KeyboardEvent) => this.#onRowKeydown(event, notification, index)}
        aria-describedby=${link ? `${id}-hint` : nothing}
        class=${classMap({ unread: !read })}
        data-variant=${variant}
        part="row"
        tabindex=${index === this.focusIndex ? '0' : '-1'}>
        <span class="icon"><sl-icon .name=${ICONS[variant]} size="md"></sl-icon></span>
        <div class="text">
          <div class="header">
            <span class="label">
              ${
                read
                  ? nothing
                  : html`
                      <span class="visually-hidden"
                        >${msg('Unread', { id: 'sl.notification.unread' })}:
                      </span>
                    `
              }${label}
            </span>
            <sl-relative-time .date=${notification.createdAt} sync></sl-relative-time>
          </div>
          ${description ? html`<p class="description">${description}</p>` : nothing}
          ${
            link
              ? html`
                  <div class="actions">
                    <a
                      @keydown=${this.#onActionKeydown}
                      class="action"
                      href=${link.href!}
                      tabindex="-1"
                      >${link.label}</a
                    >
                  </div>
                  <span hidden id="${id}-hint"
                    >${msg('Has action', { id: 'sl.notification.hasAction' })}: ${link.label}</span
                  >
                `
              : nothing
          }
        </div>
      </li>
    `;
  }

  /** Splits the history into the rows at the top (unread when opened, or new) and the rest. */
  #split(): { top: Notification[]; rest: Notification[] } {
    const top: Notification[] = [],
      rest: Notification[] = [];

    this.store.all.forEach(n => {
      if (this.snapshot.has(n.id) || n.createdAt > this.openedAt) {
        top.push(n);
      } else if (n.read) {
        rest.push(n);
      } else {
        // Unread, but not in the snapshot (for example marked unread again): show it at the top
        top.push(n);
      }
    });

    return { top, rest };
  }

  #onActionKeydown(event: KeyboardEvent & { target: HTMLElement }): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'ArrowLeft') {
        event.target.closest<HTMLElement>('[part~="row"]')?.focus();
      }
    } else if (event.key === 'Enter') {
      // Let the link do its thing, but don't activate the row as well
      event.stopPropagation();
    }
  }

  #onLoadMore(): void {
    const { top } = this.#split();

    this.#focusAfterUpdate = top.length + this.readShown;
    this.focusIndex = this.#focusAfterUpdate;
    this.readShown += this.pageSize ?? 10;
  }

  #onRowClick(event: Event, notification: Notification): void {
    notification.markRead();

    // Clicking the row follows its link, unless the link itself was clicked
    const link = (event.currentTarget as HTMLElement).querySelector('a');
    if (link && !event.composedPath().includes(link)) {
      link.click();
    }
  }

  #onRowKeydown(event: KeyboardEvent, notification: Notification, index: number): void {
    if (event.target !== event.currentTarget) {
      return;
    }

    const rows = this.#rows;
    let next: number | undefined;

    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(rows.length - 1, index + 1);
        break;
      case 'ArrowUp':
        next = Math.max(0, index - 1);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = rows.length - 1;
        break;
      case 'ArrowRight': {
        const action = rows[index]?.querySelector<HTMLElement>('.action');
        if (action) {
          event.preventDefault();
          action.focus();
        }
        return;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.#onRowClick(event, notification);
        return;
      default:
        return;
    }

    event.preventDefault();
    this.focusIndex = next;
    rows[next]?.focus();
  }

  #onChange = (): void => {
    this.requestUpdate();
  };

  #subscribe(): void {
    if (this.#subscribed === this.store) {
      return;
    }

    this.#unsubscribe();
    this.#subscribed = this.store;
    this.#subscribed.addEventListener('change', this.#onChange);
  }

  #unsubscribe(): void {
    this.#subscribed?.removeEventListener('change', this.#onChange);
    this.#subscribed = undefined;
  }
}
