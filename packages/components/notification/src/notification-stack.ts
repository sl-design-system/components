import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { ShortcutController, type SlModalToggleEvent } from '@sl-design-system/shared';
import { cssState } from '@sl-design-system/shared/decorators/css-state.js';
import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';
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
import { patchModalDialogs } from './modal.js';
import { type NotificationManager } from './notification-manager.js';
import styles from './notification-stack.css' with { type: 'css' };
import { Notification, type NotificationStore } from './notification-store.js';
import { NotificationElement, type SlNotificationCloseEvent } from './notification.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-notification-stack': NotificationStack;
  }
}

export type NotificationStackPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

/** Whether to follow modal dialogs into the top layer, see `followDialogs`. */
export type NotificationStackFollowDialogs = 'true' | 'false' | 'patch';

/** The time after which an expanded stack collapses, once pointer and focus have left. */
const COLLAPSE_DELAY = 400;

/** The time a notification takes to animate out. */
const LEAVE_DURATION = 200;

/** The number of card edges shown behind the front notification of a collapsed pile. */
const MAX_EDGES = 2;

/** The number of notifications shown when expanded on a small screen. */
const MAX_VISIBLE_SMALL = 2;

/** Notifications that have already been announced; announce once, never again when moving. */
const announced = new WeakSet<Notification>();

/** All connected stacks; used to decide whether a stack needs to be inserted automatically. */
const stacks = new Set<NotificationStack>();

/** Whether the shortcut hint has been announced in this session. */
let shortcutHintAnnounced = false;

/**
 * Where notifications live. There is one stack per document, inserted automatically the first time
 * `Notification.add()` is called. It is a `popover="manual"`, so it sits in the top layer above
 * sticky headers and z-index fights, and it is always the last element in `body`: the last stop in
 * the tab order.
 *
 * With more than one notification on screen, they collapse into a pile with the newest in front;
 * hover, focus or a click opens it. Errors and notifications with an action are never piled.
 *
 * When a modal dialog opens, the stack moves into that dialog and shows itself again, so the
 * notifications stay visible _and_ usable above the backdrop.
 *
 * ```html
 * <sl-notification-stack manager="inbox" position="bottom-end"></sl-notification-stack>
 * ```
 *
 * @csspart persistent - The container of the notifications that don't time out.
 * @csspart pile - The container of the notifications that time out.
 * @csspart more - The "N more · View all" button.
 * @cssstate expanded - The pile is expanded.
 * @cssstate small - The viewport is narrower than 600px.
 */
@localized()
export class NotificationStack extends ScopedElementsMixin(ElementInternalsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-notification': NotificationElement
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Timer for collapsing the pile. */
  #collapseTimer?: ReturnType<typeof setTimeout>;

  /** Whether focus is inside the stack. */
  #focused = false;

  /** Where the stack normally lives, while it is inside a modal dialog. */
  #home: { parent: Node; next: Node | null } | null = null;

  /** Whether the pointer is over the stack. */
  #hovered = false;

  /** The notification that last had focus; it is the tab stop. */
  #lastFocused?: NotificationElement;

  /** Notifications that are animating out, with the timer that removes them. */
  #leaving = new Map<Notification, ReturnType<typeof setTimeout>>();

  /** Open modal dialogs, oldest first. */
  #modals: HTMLDialogElement[] = [];

  /** Whether the stack is being moved; guards the lifecycle callbacks. */
  #moving = false;

  /** Keeps the stack the last element in `body`. */
  #observer = new MutationObserver(() => this.#keepLast());

  /** All notifications that are rendered, in the order they were added. */
  #rendered: Notification[] = [];

  /** The element that had focus before focus moved into the stack. */
  #returnFocus?: HTMLElement;

  #shortcut = new ShortcutController(this);

  /** The small screen media query. */
  #small = matchMedia('(width < 600px)');

  /** The store the stack is listening to. */
  #subscribed?: NotificationStore;

  /** @internal Whether the pile is expanded. */
  @state() @cssState() expanded = false;

  /** @internal Whether the viewport is narrow. */
  @state() @cssState() small = this.#small.matches;

  /**
   * Whether to follow modal dialogs into the top layer. SL dialogs and native dialogs in the light
   * DOM are followed by default. Use `patch` to also follow dialogs in (closed) shadow roots of
   * third-party components, by wrapping `HTMLDialogElement.prototype.showModal`; this patches a
   * global, so it is opt-in.
   *
   * @default 'true'
   */
  @property({ attribute: 'follow-dialogs' }) followDialogs?: NotificationStackFollowDialogs;

  /** The id of the `<sl-notification-manager>` the "View all" button opens. */
  @property() manager?: string;

  /**
   * The maximum number of notifications shown when the pile is expanded.
   *
   * @default 5
   */
  @property({ type: Number, attribute: 'max-visible' }) maxVisible?: number;

  /**
   * Where the notifications appear on screen. Under 600px wide the stack is always full width at
   * the bottom.
   *
   * @default 'bottom-end'
   */
  @property({ reflect: true }) position?: NotificationStackPosition;

  /**
   * The key that moves focus to the newest notification, and back again.
   *
   * @default 'F8'
   */
  @property() shortcut?: string;

  /** The store this stack shows. Defaults to the document's store. */
  @property({ attribute: false }) store: NotificationStore = Notification.store;

  /** Whether there are notifications on screen. */
  get hasNotifications(): boolean {
    return this.#rendered.length > 0;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.elementInternals.role = 'region';
    this.elementInternals.ariaLabel = msg('Notifications', { id: 'sl.notification.title' });

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', 'manual');
    }

    if (this.#moving) {
      return;
    }

    stacks.add(this);

    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onFocusOut);
    this.addEventListener('keydown', this.#onKeydown);
    this.addEventListener('pointerenter', this.#onPointerEnter);
    this.addEventListener('pointerleave', this.#onPointerLeave);

    document.addEventListener('sl-modal-toggle', this.#onModalToggle);
    document.addEventListener('toggle', this.#onToggle, true);
    this.#small.addEventListener('change', this.#onSmallChange);

    this.#observer.observe(document.body, { childList: true });
    this.#subscribe();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.#moving) {
      return;
    }

    if (this.#modals.length) {
      // The dialog was removed while open (framework unmount, no 'close'): don't go down with it
      queueMicrotask(() => this.#closed(this.#modals.at(-1)!));
      return;
    }

    stacks.delete(this);

    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('focusout', this.#onFocusOut);
    this.removeEventListener('keydown', this.#onKeydown);
    this.removeEventListener('pointerenter', this.#onPointerEnter);
    this.removeEventListener('pointerleave', this.#onPointerLeave);

    document.removeEventListener('sl-modal-toggle', this.#onModalToggle);
    document.removeEventListener('toggle', this.#onToggle, true);
    this.#small.removeEventListener('change', this.#onSmallChange);

    this.#observer.disconnect();
    this.#unsubscribe();

    clearTimeout(this.#collapseTimer);
    this.#leaving.forEach(timer => clearTimeout(timer));
    this.#leaving.clear();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('store') && this.isConnected) {
      this.#subscribe();
    }

    if (!this.hasUpdated || changes.has('shortcut')) {
      this.#shortcut.bind({ [this.shortcut ?? 'F8']: this.#onShortcut });
    }

    if (changes.has('followDialogs') && this.followDialogs === 'patch') {
      patchModalDialogs();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    this.#updatePopover();
    this.#updateTabIndexes();
  }

  override render(): TemplateResult {
    const isLeaving = (n: Notification): boolean => this.#leaving.has(n),
      persistent = this.#rendered.filter(n => n.persistent),
      timed = this.#rendered.filter(n => !n.persistent),
      // Notifications that are animating out don't count; the next one takes their place right away
      staying = timed.filter(n => !isLeaving(n)),
      front = staying.at(-1),
      maxVisible = this.small ? MAX_VISIBLE_SMALL : (this.maxVisible ?? 5),
      hidden = this.expanded ? Math.max(0, staying.length - maxVisible) : 0,
      edges = this.expanded ? 0 : Math.min(MAX_EDGES, staying.length - 1);

    return html`
      <div part="persistent">
        ${repeat(
          persistent,
          n => n.id,
          n => this.#renderNotification(n, false)
        )}
      </div>
      <div part="pile">
        ${
          hidden > 0 && this.manager
            ? html`
                <button @click=${this.#onViewAll} part="more" type="button">
                  ${msg(str`${hidden} more · View all`, { id: 'sl.notification.moreViewAll' })}
                </button>
              `
            : nothing
        }
        ${repeat(
          timed,
          n => n.id,
          (n, index) => {
            const isFront = n === front,
              visible = isLeaving(n) || (this.expanded ? staying.indexOf(n) >= hidden : isFront);

            return this.#renderNotification(n, !visible, !isFront || this.expanded, index * 2);
          }
        )}
        ${
          // The edges of the cards behind the front one; always rendered, so they can animate
          front
            ? html`
                <div
                  @click=${this.#onEdgeClick}
                  aria-hidden="true"
                  class=${classMap({ edges: true, 'has-edges': edges > 0 })}
                  style="order: ${timed.indexOf(front) * 2 - 1}">
                  ${Array.from({ length: MAX_EDGES }).map(
                    (_, i) => html`
                      <div
                        class=${classMap({ edge: true, off: i < MAX_EDGES - edges })}
                        style="--_inset: ${MAX_EDGES - i}"></div>
                    `
                  )}
                </div>
              `
            : nothing
        }
      </div>
    `;
  }

  /** Expands the pile. */
  expand(): void {
    clearTimeout(this.#collapseTimer);
    this.expanded = true;
  }

  /** Collapses the pile. */
  collapse(): void {
    clearTimeout(this.#collapseTimer);
    this.expanded = false;
  }

  #renderNotification(
    notification: Notification,
    hidden: boolean,
    suspended = false,
    order?: number
  ): TemplateResult {
    return html`
      <sl-notification
        @sl-close=${this.#onClose}
        .notification=${notification}
        .suspended=${suspended}
        class=${classMap({ leaving: this.#leaving.has(notification) })}
        data-id=${notification.id}
        style=${order === undefined ? nothing : `order: ${order}`}
        ?hidden=${hidden}></sl-notification>
    `;
  }

  #announce(notification: Notification): void {
    if (announced.has(notification)) {
      return;
    }

    announced.add(notification);

    const parts = [notification.label, notification.description];
    if (notification.action) {
      parts.push(
        `${msg('Has action', { id: 'sl.notification.hasAction' })}: ${notification.action.label}`
      );
    }

    if (!shortcutHintAnnounced) {
      shortcutHintAnnounced = true;

      parts.push(
        msg(str`Press ${this.shortcut ?? 'F8'} to go to notifications.`, {
          id: 'sl.notification.shortcutHint'
        })
      );
    }

    const text = parts.filter(Boolean).join('. '),
      el = this.renderRoot.querySelector<HTMLElement>(`[data-id="${notification.id}"]`),
      target = (el ?? this) as HTMLElement & {
        ariaNotify?(text: string, options?: { priority?: 'normal' | 'high' }): void;
      };

    // Announce on the notification element, so the announcement uses its `lang`
    if (typeof target.ariaNotify === 'function') {
      target.ariaNotify(text, { priority: notification.variant === 'error' ? 'high' : 'normal' });
    } else {
      announce(text, notification.variant === 'error' ? 'assertive' : 'polite');
    }
  }

  /** Synchronizes the rendered notifications with the active ones in the store. */
  #sync = (): void => {
    const active = this.store.active;

    this.#rendered.forEach(n => {
      if (!active.includes(n) && !this.#leaving.has(n)) {
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.#leaving.set(
          n,
          setTimeout(
            () => {
              this.#leaving.delete(n);
              this.#rendered = this.#rendered.filter(r => r !== n);
              this.requestUpdate();
            },
            reduced ? 0 : LEAVE_DURATION
          )
        );
      }
    });

    const added = active.filter(n => !this.#rendered.includes(n));
    this.#rendered = [...this.#rendered, ...added];

    this.requestUpdate();

    if (added.length) {
      void this.updateComplete.then(() => added.forEach(n => this.#announce(n)));
    }
  };

  #subscribe(): void {
    if (this.#subscribed === this.store) {
      return;
    }

    this.#unsubscribe();
    this.#subscribed = this.store;
    this.#subscribed.addEventListener('change', this.#sync);
    this.#sync();
  }

  #unsubscribe(): void {
    this.#subscribed?.removeEventListener('change', this.#sync);
    this.#subscribed = undefined;
  }

  #updatePopover(): void {
    if (!this.isConnected || this.#moving) {
      return;
    }

    const open = this.matches(':popover-open');

    if (this.hasNotifications && !open) {
      this.showPopover();
    } else if (!this.hasNotifications && open) {
      this.hidePopover();
      this.collapse();
    }
  }

  /** One tab stop: the notification that last had focus, or the newest one. */
  #updateTabIndexes(): void {
    const notifications = this.#visibleNotifications(),
      current =
        notifications.find(n => n === this.#lastFocused) ??
        notifications.find(n => n.notification === this.store.active.at(-1)) ??
        notifications.at(-1);

    notifications.forEach(n => (n.tabIndex = n === current ? 0 : -1));
  }

  /** The visible notifications, in visual order from top to bottom. */
  #visibleNotifications(): NotificationElement[] {
    return Array.from(
      this.renderRoot.querySelectorAll<NotificationElement>('sl-notification:not([hidden])')
    )
      .filter(n => !n.classList.contains('leaving'))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  }

  #collapseSoon(): void {
    clearTimeout(this.#collapseTimer);

    this.#collapseTimer = setTimeout(() => {
      if (!this.#focused && !this.#hovered) {
        this.collapse();
      }
    }, COLLAPSE_DELAY);
  }

  #onClose(event: SlNotificationCloseEvent & { target: NotificationElement }): void {
    if (event.detail.reason !== 'user') {
      return;
    }

    const el = event.target,
      active = this.shadowRoot?.activeElement;

    // Move focus to the next notification, or back to where it was when none are left
    if (active === el || el.contains(active as Node)) {
      const notifications = this.#visibleNotifications().filter(n => n !== el),
        index = this.#visibleNotifications().indexOf(el),
        next = notifications[Math.min(index, notifications.length - 1)];

      if (next) {
        next.tabIndex = 0;
        next.focus();
      } else {
        this.#restoreFocus();
      }
    }
  }

  #onEdgeClick(): void {
    this.expand();
  }

  #onFocusIn = (event: FocusEvent): void => {
    if (!this.#focused) {
      const from = event.relatedTarget as HTMLElement | null;

      if (from && !this.contains(from)) {
        this.#returnFocus = from;
      }
    }

    const notification = event
      .composedPath()
      .find((el): el is NotificationElement => el instanceof NotificationElement);

    if (notification) {
      this.#lastFocused = notification;
    }

    this.#focused = true;
    this.expand();
  };

  #onFocusOut = (event: FocusEvent): void => {
    const to = event.relatedTarget as Node | null;

    if (!to || (!this.contains(to) && !this.shadowRoot?.contains(to))) {
      this.#focused = false;
      this.#collapseSoon();
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const notifications = this.#visibleNotifications(),
        active = this.shadowRoot?.activeElement,
        index = notifications.findIndex(n => n === active || n.contains(active as Node));

      if (index === -1) {
        return;
      }

      event.preventDefault();

      const next =
        notifications[
          event.key === 'ArrowDown'
            ? Math.min(notifications.length - 1, index + 1)
            : Math.max(0, index - 1)
        ];

      this.#lastFocused = next;
      notifications.forEach(n => (n.tabIndex = n === next ? 0 : -1));
      next.focus();
    } else if (event.key === 'Escape' && this.expanded) {
      event.preventDefault();
      this.collapse();
    }
  };

  #onModalToggle = (event: SlModalToggleEvent): void => {
    if (this.followDialogs === 'false') {
      return;
    }

    const { dialog, open } = event.detail;

    if (open && dialog.matches(':modal')) {
      this.#opened(dialog);
    } else if (!open) {
      this.#closed(dialog);
    }
  };

  #onPointerEnter = (): void => {
    this.#hovered = true;
    this.expand();
  };

  #onPointerLeave = (): void => {
    this.#hovered = false;
    this.#collapseSoon();
  };

  #onShortcut = (event: KeyboardEvent): void => {
    if (!this.hasNotifications) {
      return;
    }

    event.preventDefault();

    if (this.#focused) {
      this.#restoreFocus();
    } else {
      let active = document.activeElement;
      while (active?.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
      }

      this.#returnFocus = active instanceof HTMLElement ? active : undefined;

      const newest = this.renderRoot.querySelector<NotificationElement>(
        `[data-id="${this.store.active.at(-1)?.id}"]`
      );

      if (newest) {
        newest.tabIndex = 0;
        newest.focus();
      }
    }
  };

  #onSmallChange = (): void => {
    this.small = this.#small.matches;
  };

  /** Native dialogs in the light DOM; `toggle` doesn't bubble, so this is a capturing listener. */
  #onToggle = (event: Event): void => {
    const dialog = event.target;

    if (this.followDialogs === 'false' || !(dialog instanceof HTMLDialogElement)) {
      return;
    }

    if (dialog.matches(':modal')) {
      this.#opened(dialog);
    } else {
      this.#closed(dialog);
    }
  };

  #onViewAll(): void {
    const manager = this.manager
      ? (document.getElementById(this.manager) as NotificationManager | null)
      : null;

    this.collapse();
    void manager?.show();
  }

  #restoreFocus(): void {
    const target = this.#returnFocus;
    this.#returnFocus = undefined;

    if (target?.isConnected) {
      target.focus();
    } else {
      (document.activeElement as HTMLElement | null)?.blur?.();
    }
  }

  #opened(dialog: HTMLDialogElement): void {
    if (this.#modals.includes(dialog)) {
      return;
    }

    this.#modals.push(dialog);
    dialog.addEventListener('close', () => this.#closed(dialog), { once: true });

    this.#moveInto(dialog);
  }

  #closed(dialog: HTMLDialogElement): void {
    if (!this.#modals.includes(dialog)) {
      return;
    }

    this.#modals = this.#modals.filter(d => d !== dialog && d.isConnected && d.open);
    this.#moveInto(this.#modals.at(-1) ?? null);
  }

  /** Moves the stack into the given dialog, or back home, and shows it again so it is topmost. */
  #moveInto(dialog: HTMLDialogElement | null): void {
    this.#moving = true;

    if (dialog) {
      this.#home ??= { parent: this.parentNode ?? document.body, next: this.nextSibling };
      dialog.append(this);
    } else if (this.#home) {
      const { parent, next } = this.#home;

      parent.insertBefore(this, next?.parentNode === parent ? next : null);
      this.#home = null;
    }

    // Removing a node hides its popover; showing it again puts it above the dialog
    if (this.matches(':popover-open')) {
      this.hidePopover();
    }

    if (this.hasNotifications) {
      this.showPopover();
    }

    this.#moving = false;
  }

  /** Keeps the stack the last element in `body`, so it is the last stop in the tab order. */
  #keepLast(): void {
    if (
      this.#moving ||
      this.#focused ||
      this.#modals.length ||
      this.parentElement !== document.body ||
      document.body.lastElementChild === this
    ) {
      return;
    }

    this.#moving = true;
    document.body.append(this);

    if (this.hasNotifications) {
      this.showPopover();
    }

    this.#moving = false;
  }
}

// Insert a stack automatically, the first time a notification is added to the default store
Notification.store.addEventListener('add', () => {
  if (stacks.size === 0 && customElements.get('sl-notification-stack')) {
    document.body.append(document.createElement('sl-notification-stack'));
  }
});
