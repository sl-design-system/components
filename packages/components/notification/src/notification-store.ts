export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

/** Why a notification was closed. */
export type NotificationCloseReason = 'timeout' | 'user' | 'api';

/**
 * The (single) action of a notification. Prefer a link (`href`) back to where the work lives; a
 * direct action (`handler`) should be safe to repeat and need no further input.
 */
export interface NotificationAction {
  /** The label of the action, for example "View report" or "Try again". */
  label: string;

  /** Navigates to this URL when activated. */
  href?: string;

  /** Called when the action is activated. */
  handler?(notification: Notification): void;
}

export interface NotificationOptions {
  /** The single action of the notification. A notification with an action does not time out. */
  action?: NotificationAction;

  /** Optional description, shown below the label. */
  description?: string;

  /**
   * How long the notification stays on screen in milliseconds. Use `'auto'` to base it on the
   * length of the text, or `0` to keep it until it is dismissed.
   *
   * @default 'auto'
   */
  duration?: 'auto' | number;

  /** Optional group, for finding related notifications later on. */
  group?: string;

  /** The label of the notification; required. */
  label: string;

  /**
   * The variant of the notification.
   *
   * @default 'info'
   */
  variant?: NotificationVariant;
}

/** The minimum time a notification with an automatic duration stays on screen. */
const MIN_DURATION = 6000;

/** The maximum time a notification with an automatic duration stays on screen. */
const MAX_DURATION = 15000;

let nextUniqueId = 0;

/**
 * Store with the history of all notifications. There is one default store per document (see
 * `Notification.store`), but you can create your own to scope notifications to, for example, a
 * micro-frontend.
 *
 * The store dispatches these events:
 *
 * - `add`: a notification was added (`CustomEvent<Notification>`)
 * - `change`: anything in the store changed
 */
export class NotificationStore extends EventTarget {
  #items: Notification[] = [];
  #limit = 50;

  /** All notifications in the history, newest first. */
  get all(): Notification[] {
    return [...this.#items];
  }

  /** The notifications that are currently on screen, oldest first. */
  get active(): Notification[] {
    return this.#items.filter(n => n.active).reverse();
  }

  /** The number of notifications in the history that have not been read. */
  get unreadCount(): number {
    return this.#items.filter(n => !n.read).length;
  }

  /**
   * The maximum number of notifications kept in the history. Notifications that are still on screen
   * are never dropped.
   *
   * @default 50
   */
  get limit(): number {
    return this.#limit;
  }

  set limit(limit: number) {
    this.#limit = Math.max(0, limit);

    if (this.#trim()) {
      this.notify();
    }
  }

  /** Adds a new notification and returns it. */
  add(options: NotificationOptions): Notification {
    const notification = new Notification(options, this);

    this.#items.unshift(notification);
    this.#trim();

    this.dispatchEvent(new CustomEvent('add', { detail: notification }));
    this.notify();

    return notification;
  }

  /** Returns the notification with the given id. */
  get(id: string): Notification | undefined {
    return this.#items.find(n => n.id === id);
  }

  /**
   * Removes notifications from the stack, the history and the unread count. Pass a single
   * notification, an array of them, or a predicate.
   */
  remove(
    notifications: Notification | Notification[] | ((notification: Notification) => boolean)
  ): void {
    const matches =
      typeof notifications === 'function'
        ? notifications
        : (n: Notification) =>
            Array.isArray(notifications) ? notifications.includes(n) : n === notifications;

    const removed = this.#items.filter(matches);
    if (!removed.length) {
      return;
    }

    this.#items = this.#items.filter(n => !removed.includes(n));
    removed.forEach(n => n.dismiss('api'));

    this.notify();
  }

  /** Marks all notifications as read. */
  markAllRead(): void {
    let changed = false;

    this.#items.forEach(n => {
      if (!n.read) {
        n.read = changed = true;
      }
    });

    if (changed) {
      this.notify();
    }
  }

  /** Removes all notifications. */
  clear(): void {
    this.remove(() => true);
  }

  /** @internal Lets listeners know something has changed. */
  notify(): void {
    this.dispatchEvent(new Event('change'));
  }

  /** Drops the oldest notifications beyond the limit. Returns whether any were dropped. */
  #trim(): boolean {
    if (this.#items.length <= this.#limit) {
      return false;
    }

    const keep = new Set(this.#items.slice(0, this.#limit));
    this.#items = this.#items.filter(n => keep.has(n) || n.active);

    return true;
  }
}

/**
 * A single notification. The class is also the entry point for the default store: app code only
 * ever needs to call `Notification.add()` and never touches the elements.
 *
 * ```ts
 * import { Notification } from '@sl-design-system/notification';
 *
 * const n = Notification.add({
 *   label: '“Fractions – week 3” published',
 *   description: 'Students in 2B can now see it.',
 *   variant: 'success',
 *   action: { label: 'View', href: '/assignments/42' }
 * });
 *
 * await n.closed; // 'timeout' | 'user' | 'api'
 * ```
 */
export class Notification {
  /** The default store of the document. */
  static store = new NotificationStore();

  /** Adds a notification to the default store and returns it. */
  static add(options: NotificationOptions): Notification {
    return this.store.add(options);
  }

  /** Removes notifications from the default store. */
  static remove(
    notifications: Notification | Notification[] | ((notification: Notification) => boolean)
  ): void {
    this.store.remove(notifications);
  }

  /** Returns the notification with the given id from the default store. */
  static get(id: string): Notification | undefined {
    return this.store.get(id);
  }

  /** Marks all notifications in the default store as read. */
  static markAllRead(): void {
    this.store.markAllRead();
  }

  /** Removes all notifications from the default store. */
  static clear(): void {
    this.store.clear();
  }

  /** All notifications in the default store, newest first. */
  static get all(): Notification[] {
    return this.store.all;
  }

  /** The number of unread notifications in the default store. */
  static get unreadCount(): number {
    return this.store.unreadCount;
  }

  /** The maximum number of notifications kept in the history of the default store. */
  static get limit(): number {
    return this.store.limit;
  }

  static set limit(limit: number) {
    this.store.limit = limit;
  }

  /** Listen to `add` or `change` events of the default store. */
  static addEventListener(
    type: 'add' | 'change',
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean
  ): void {
    this.store.addEventListener(type, listener, options);
  }

  /** Stop listening to events of the default store. */
  static removeEventListener(
    type: 'add' | 'change',
    listener: EventListenerOrEventListenerObject,
    options?: EventListenerOptions | boolean
  ): void {
    this.store.removeEventListener(type, listener, options);
  }

  #active = true;
  #read = false;
  #resolveClosed!: (reason: NotificationCloseReason) => void;
  #store: NotificationStore;

  /** The single action of the notification. */
  readonly action?: NotificationAction;

  /** Resolves with the reason once the notification is no longer on screen. */
  readonly closed: Promise<NotificationCloseReason>;

  /** When the notification was added. */
  readonly createdAt = new Date();

  /** The description of the notification. */
  readonly description?: string;

  /** The requested duration; see `timeout` for the time it actually stays on screen. */
  readonly duration: 'auto' | number;

  /** The group of the notification. */
  readonly group?: string;

  /** The unique id of the notification. */
  readonly id = `sl-notification-${nextUniqueId++}`;

  /** The label of the notification. */
  readonly label: string;

  /** The variant of the notification. */
  readonly variant: NotificationVariant;

  /** Whether the notification is still on screen. */
  get active(): boolean {
    return this.#active;
  }

  /**
   * Whether the notification needs to stay on screen until it is dismissed: errors and
   * notifications with an action never time out, because the user has to be able to reach them.
   */
  get persistent(): boolean {
    return this.timeout === 0;
  }

  /** Whether the notification has been read. */
  get read(): boolean {
    return this.#read;
  }

  set read(read: boolean) {
    this.#read = read;
  }

  /** The store this notification belongs to. */
  get store(): NotificationStore {
    return this.#store;
  }

  /** The time in milliseconds the notification stays on screen; 0 means until dismissed. */
  get timeout(): number {
    return getTimeout(this);
  }

  constructor(options: NotificationOptions, store: NotificationStore = Notification.store) {
    this.#store = store;

    this.action = options.action;
    this.description = options.description;
    this.duration = options.duration ?? 'auto';
    this.group = options.group;
    this.label = options.label;
    this.variant = options.variant ?? 'info';

    this.closed = new Promise(resolve => (this.#resolveClosed = resolve));
  }

  /**
   * Hides the notification. It stays in the history, so it can still be found in the manager.
   *
   * After a timeout, errors, warnings and notifications with an action stay unread; info and
   * success count as seen. Closing it yourself (`'user'`) marks it as read.
   */
  dismiss(reason: NotificationCloseReason = 'api'): void {
    if (!this.#active) {
      return;
    }

    this.#active = false;

    if (reason === 'user') {
      this.#read = true;
    } else if (reason === 'timeout' && !this.action && ['info', 'success'].includes(this.variant)) {
      this.#read = true;
    }

    this.#resolveClosed(reason);
    this.#store.notify();
  }

  /** Marks the notification as read. */
  markRead(): void {
    if (!this.#read) {
      this.#read = true;
      this.#store.notify();
    }
  }
}

/**
 * Returns the time in milliseconds the notification stays on screen, or 0 when it stays until it is
 * dismissed. The automatic duration is 2 seconds plus 300 milliseconds per word, between 6 and 15
 * seconds.
 */
export const getTimeout = ({
  action,
  description,
  duration = 'auto',
  label,
  variant
}: Pick<
  NotificationOptions,
  'action' | 'description' | 'duration' | 'label' | 'variant'
>): number => {
  if (action || variant === 'error') {
    return 0;
  } else if (typeof duration === 'number') {
    return Math.max(0, duration);
  }

  const words = `${label ?? ''} ${description ?? ''}`.trim().split(/\s+/).filter(Boolean).length;

  return Math.min(MAX_DURATION, Math.max(MIN_DURATION, 2000 + 300 * words));
};
