import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  dispatchModalToggle,
  event,
  positionPopover
} from '@sl-design-system/shared';
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
  interface GlobalEventHandlersEventMap {
    'sl-open': SlOpenEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-notification-manager': NotificationManager;
  }
}

export type SlOpenEvent = CustomEvent<void>;

export type SlNotificationManagerCloseEvent = CustomEvent<void>;

/** How the manager is shown; picked from the viewport width each time it opens. */
export type NotificationManagerMode = 'popover' | 'drawer' | 'fullscreen';

/** Time in which a click on the anchor that light-dismissed the popover should not reopen it. */
const REOPEN_GUARD = 300;

/**
 * The panel with the history of notifications, toggled by `<sl-notification-button>`. It is the
 * container: it picks a popover, drawer or full screen from the viewport width, and owns the
 * header, the arrow and focus. The content is an `<sl-notification-list>`.
 *
 * - From `drawer-below` (1024px) up: a light, non-modal popover anchored to the button.
 * - From `fullscreen-below` (600px) up: a modal drawer at the end side of the screen.
 * - Below that: a modal, full screen panel.
 *
 * Focus goes to the heading on open, and back to the button on close.
 *
 * ```html
 * <sl-notification-button manager="inbox"></sl-notification-button>
 * <sl-notification-manager id="inbox"></sl-notification-manager>
 * ```
 *
 * @csspart dialog - The dialog element.
 * @csspart header - The header with the title and actions.
 * @csspart body - The scrolling container of the list.
 * @csspart arrow - The arrow pointing at the button in popover mode.
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

  /** The element the manager was opened from, and returns focus to. */
  #anchor?: HTMLElement;

  /** Cleans up the positioning of the popover. */
  #cleanup?: () => void;

  /** When the popover was last closed, and by which anchor. */
  #lastClosed?: { anchor?: HTMLElement; time: number };

  /** Media queries for the breakpoints; resizing while open reopens in the new mode. */
  #media?: MediaQueryList[];

  /** Whether the manager is in the process of opening. */
  #showing = false;

  /** Whether the dialog is being reopened in a different mode. */
  #switching = false;

  /** The store the manager is listening to. */
  #subscribed?: NotificationStore;

  /** @internal */
  @query('[part="arrow"]') arrow?: HTMLElement;

  /** @internal */
  @query('dialog') dialog?: HTMLDialogElement;

  /** @internal */
  @query('sl-notification-list') list?: NotificationList;

  /** @internal Emits when the manager has closed. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<SlNotificationManagerCloseEvent>;

  /** @internal Emits when the manager has opened. */
  @event({ name: 'sl-open' }) openEvent!: EventEmitter<SlOpenEvent>;

  /** @internal The current mode. */
  @state() mode: NotificationManagerMode = 'popover';

  /** @internal The number of unread notifications. */
  @state() unreadCount = 0;

  /**
   * Below this viewport width (in px) the manager is a drawer instead of a popover.
   *
   * @default 1024
   */
  @property({ type: Number, attribute: 'drawer-below' }) drawerBelow?: number;

  /**
   * Below this viewport width (in px) the manager is full screen.
   *
   * @default 600
   */
  @property({ type: Number, attribute: 'fullscreen-below' }) fullscreenBelow?: number;

  /** Whether the manager is open. */
  @property({ type: Boolean, reflect: true }) open?: boolean;

  /** The store to show. Defaults to the document's store. */
  @property({ attribute: false }) store: NotificationStore = Notification.store;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#subscribe();
  }

  override disconnectedCallback(): void {
    this.#unsubscribe();
    this.#unwatchMedia();
    this.#cleanup?.();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('store') && this.isConnected) {
      this.#subscribe();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('open') && !this.#showing) {
      if (this.open && !this.dialog?.open && !this.#isPopoverOpen()) {
        void this.show();
      } else if (!this.open && (this.dialog?.open || this.#isPopoverOpen())) {
        this.hide();
      }
    }
  }

  override render(): TemplateResult {
    const modal = this.mode !== 'popover';

    return html`
      <dialog
        @cancel=${this.#onCancel}
        @close=${this.#onClose}
        @click=${this.#onClick}
        @toggle=${this.#onToggle}
        aria-labelledby="title"
        class=${this.mode}
        part="dialog">
        <div part="header">
          <h2 id="title" tabindex="-1">${msg('Notifications', { id: 'sl.notification.title' })}</h2>
          <sl-button
            @click=${this.#onMarkAllRead}
            ?disabled=${this.unreadCount === 0}
            fill="ghost"
            size="sm">
            ${msg('Mark all as read', { id: 'sl.notification.markAllRead' })}
          </sl-button>
          ${
            modal
              ? html`
                  <sl-button
                    @click=${() => this.hide()}
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
        ${
          modal
            ? nothing
            : html`
                <div part="arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 11" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 11 20 11 10 1 0 11" paint-order="stroke" />
                  </svg>
                </div>
              `
        }
      </dialog>
    `;
  }

  /**
   * Opens the manager. On wide screens it is anchored to `anchor`, usually the
   * `<sl-notification-button>` that opened it.
   */
  async show(anchor?: HTMLElement): Promise<void> {
    if (anchor) {
      this.#anchor = anchor;
    }

    this.#showing = true;
    this.mode = this.#pickMode();
    this.open = true;
    await this.updateComplete;
    this.#showing = false;

    const dialog = this.dialog;
    if (!dialog || dialog.open || this.#isPopoverOpen()) {
      return;
    }

    this.list?.reset();

    if (this.mode === 'popover') {
      dialog.setAttribute('popover', 'auto');
      dialog.showPopover();

      if (this.#anchor) {
        this.#cleanup = positionPopover(dialog, this.#anchor, {
          arrowElement: this.arrow,
          arrowPadding: 16,
          offset: 12,
          position: 'bottom-end',
          viewportMargin: 8
        });
      }
    } else {
      dialog.removeAttribute('popover');
      dialog.showModal();
      dispatchModalToggle(this, dialog, true);
    }

    this.#watchMedia();

    // Focus the heading, so screen readers start at the top
    this.renderRoot.querySelector<HTMLElement>('#title')?.focus();

    if (!this.#switching) {
      this.openEvent.emit();
    }
  }

  /** Closes the manager and returns focus to the element it was opened from. */
  hide(): void {
    const dialog = this.dialog;

    if (this.#isPopoverOpen()) {
      dialog?.hidePopover();
    } else if (dialog?.open) {
      dialog.close();
    } else {
      this.open = false;
    }
  }

  /** Opens the manager when it is closed, and closes it when it is open. */
  toggle(anchor?: HTMLElement): void {
    const recentlyClosed =
      this.#lastClosed &&
      this.#lastClosed.anchor === anchor &&
      performance.now() - this.#lastClosed.time < REOPEN_GUARD;

    if (this.open) {
      this.hide();
    } else if (!recentlyClosed) {
      void this.show(anchor);
    }
  }

  #isPopoverOpen(): boolean {
    return !!this.dialog?.matches(':popover-open');
  }

  #pickMode(): NotificationManagerMode {
    const width = window.innerWidth;

    if (width < (this.fullscreenBelow ?? 600)) {
      return 'fullscreen';
    } else if (width < (this.drawerBelow ?? 1024)) {
      return 'drawer';
    }

    return 'popover';
  }

  /** Called when the dialog or popover has closed, however that happened. */
  #closed(): void {
    // Ignore late events from the previous mode, after reopening in a new one
    if (this.#switching || this.dialog?.open || this.#isPopoverOpen()) {
      return;
    }

    this.#cleanup?.();
    this.#cleanup = undefined;

    this.#unwatchMedia();
    this.#lastClosed = { anchor: this.#anchor, time: performance.now() };
    this.open = false;

    // Return focus to the button, unless focus already moved somewhere else (light dismiss)
    const active = document.activeElement;
    if (!active || active === document.body || active === this || this.contains(active)) {
      this.#anchor?.focus();
    }

    this.closeEvent.emit();
  }

  #onCancel(event: Event): void {
    // Let the dialog close itself; just make sure Escape doesn't close parent dialogs too
    event.stopPropagation();
  }

  #onClick(event: PointerEvent & { target: HTMLElement }): void {
    // Clicking the backdrop of the drawer closes it
    if (event.target === this.dialog && this.mode !== 'popover') {
      const rect = this.dialog.getBoundingClientRect();

      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        this.dialog.close();
      }
    }
  }

  #onClose(): void {
    if (this.dialog) {
      dispatchModalToggle(this, this.dialog, false);
    }

    this.#closed();
  }

  #onMarkAllRead(): void {
    this.list?.markAllRead();
  }

  #onToggle(event: ToggleEvent): void {
    // Only the popover mode fires `toggle` with `closed` without a `close` event
    if (event.newState === 'closed' && this.mode === 'popover') {
      this.#closed();
    }
  }

  #onMediaChange = (): void => {
    const mode = this.#pickMode();

    if (!this.open || mode === this.mode) {
      return;
    }

    // Reopen in the new mode
    this.#switching = true;
    this.#cleanup?.();
    this.#cleanup = undefined;
    this.hide();
    void this.show().then(() => (this.#switching = false));
  };

  #watchMedia(): void {
    if (this.#media) {
      return;
    }

    this.#media = [
      matchMedia(`(width < ${this.drawerBelow ?? 1024}px)`),
      matchMedia(`(width < ${this.fullscreenBelow ?? 600}px)`)
    ];
    this.#media.forEach(mql => mql.addEventListener('change', this.#onMediaChange));
  }

  #unwatchMedia(): void {
    this.#media?.forEach(mql => mql.removeEventListener('change', this.#onMediaChange));
    this.#media = undefined;
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
