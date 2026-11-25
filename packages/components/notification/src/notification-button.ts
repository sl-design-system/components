import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  dispatchModalToggle,
  event,
  positionPopover
} from '@sl-design-system/shared';
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
import { property, query, state } from 'lit/decorators.js';
import { registerFallbackIcons } from './icons.js';
import styles from './notification-button.css' with { type: 'css' };
import { NotificationManager } from './notification-manager.js';
import { Notification, type NotificationStore } from './notification-store.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-open': SlOpenEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-notification-button': NotificationButton;
  }
}

/** Emitted when the manager has opened. */
export type SlOpenEvent = CustomEvent<void>;

/** Emitted when the manager has closed. Uses the `sl-close` event name. */
export type SlNotificationButtonCloseEvent = CustomEvent<void>;

/** How the manager is shown; picked from the viewport width each time it opens. */
export type NotificationButtonMode = 'popover' | 'drawer' | 'fullscreen';

/** Time in which a click on the button that light-dismissed the popover should not reopen it. */
const REOPEN_GUARD = 300;

/**
 * Icon button that shows the number of unread notifications and opens the
 * `<sl-notification-manager>` with the history. How it shows the manager depends on the width of
 * the viewport, each time it opens:
 *
 * - From `drawer-below` (1024px) up: a light, non-modal popover anchored to the button.
 * - From `fullscreen-below` (600px) up: a modal drawer at the end side of the screen.
 * - Below that: a modal, full screen panel.
 *
 * Focus goes to the heading of the manager on open, and back to the button on close.
 *
 * ```html
 * <sl-notification-button></sl-notification-button>
 * ```
 *
 * The accessible name includes the count ("Notifications, 3 unread"); the badge itself is hidden
 * from assistive technology. Changes to the count are not announced: the notification already was.
 *
 * @csspart button - The button.
 * @csspart badge - The badge with the unread count.
 * @csspart dialog - The dialog the manager is shown in.
 * @csspart manager - The manager.
 * @csspart arrow - The arrow pointing at the button in popover mode.
 * @cssstate expanded - The manager is open.
 */
@localized()
export class NotificationButton extends ScopedElementsMixin(ElementInternalsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-badge': Badge,
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-notification-manager': NotificationManager
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Cleans up the positioning of the popover. */
  #cleanup?: () => void;

  /** When the popover was last closed. */
  #lastClosed = 0;

  /** Media queries for the breakpoints; resizing while open reopens in the new mode. */
  #media?: MediaQueryList[];

  /** Whether the manager is in the process of opening. */
  #showing = false;

  /** The store the button is listening to. */
  #subscribed?: NotificationStore;

  /** Whether the dialog is being reopened in a different mode. */
  #switching = false;

  /** @internal */
  @query('[part="arrow"]') arrow?: HTMLElement;

  /** @internal The badge. */
  @query('sl-badge') badge?: HTMLElement;

  /** @internal The button. */
  @query('sl-button') button?: HTMLElement;

  /** @internal */
  @query('dialog') dialog?: HTMLDialogElement;

  /** @internal */
  @query('sl-notification-manager') managerElement?: NotificationManager;

  /** @internal Emits when the manager has closed. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<SlNotificationButtonCloseEvent>;

  /** @internal Emits when the manager has opened. */
  @event({ name: 'sl-open' }) openEvent!: EventEmitter<SlOpenEvent>;

  /** The number of unread notifications; read-only. */
  @state() count = 0;

  /** @internal How the manager is currently shown. */
  @state() mode: NotificationButtonMode = 'popover';

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

  /**
   * The maximum count shown in the badge; above it, the badge shows "99+".
   *
   * @default 99
   */
  @property({ type: Number, attribute: 'max-count' }) maxCount?: number;

  /** Whether the manager is open. */
  @property({ type: Boolean, reflect: true }) @cssState('expanded') open?: boolean;

  /** The store to count unread notifications in, and show in the manager. */
  @property({ attribute: false }) store: NotificationStore = Notification.store;

  constructor() {
    super();

    registerFallbackIcons();
  }

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
      if (this.open && !this.#isOpen()) {
        void this.show();
      } else if (!this.open && this.#isOpen()) {
        this.hide();
      }
    }

    const previous = changes.get('count');
    if (previous !== undefined && this.count > previous) {
      this.#bump();
    }
  }

  override render(): TemplateResult {
    const max = this.maxCount ?? 99,
      label =
        this.count > max
          ? msg(str`Notifications, more than ${max} unread`, {
              id: 'sl.notification.buttonLabelOverflow'
            })
          : this.count > 0
            ? msg(str`Notifications, ${this.count} unread`, { id: 'sl.notification.buttonLabel' })
            : msg('Notifications', { id: 'sl.notification.title' }),
      modal = this.mode !== 'popover';

    return html`
      <sl-button
        @click=${this.#onClick}
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-haspopup="dialog"
        aria-label=${label}
        fill="ghost"
        part="button"
        size="lg">
        <sl-icon name="bell" size="lg"></sl-icon>
      </sl-button>
      ${
        this.count > 0
          ? html`
              <sl-badge aria-hidden="true" color="red" emphasis="bold" part="badge">
                ${this.count > max ? `${max}+` : this.count}
              </sl-badge>
            `
          : nothing
      }
      <dialog
        @cancel=${this.#onCancel}
        @click=${this.#onDialogClick}
        @close=${this.#onClose}
        @toggle=${this.#onToggle}
        aria-label=${msg('Notifications', { id: 'sl.notification.title' })}
        class=${this.mode}
        part="dialog">
        <sl-notification-manager
          @sl-close=${this.#onManagerClose}
          .store=${this.store}
          ?closable=${modal}
          part="manager"></sl-notification-manager>
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

  /** Opens the manager. */
  async show(): Promise<void> {
    this.#showing = true;
    this.mode = this.#pickMode();
    this.open = true;
    await this.updateComplete;
    this.#showing = false;

    const dialog = this.dialog;
    if (!dialog || this.#isOpen()) {
      return;
    }

    if (this.mode === 'popover') {
      dialog.setAttribute('popover', 'auto');

      // With the button as its source, clicking the button doesn't light-dismiss the popover
      dialog.showPopover({
        source: this.button
      });

      if (this.button) {
        this.#cleanup = positionPopover(dialog, this.button, {
          arrowElement: this.arrow,
          arrowPadding: 16,
          offset: 8,
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

    const manager = this.managerElement;
    await manager?.updateComplete;
    manager?.reset();
    manager?.focusHeading();

    if (!this.#switching) {
      this.openEvent.emit();
    }
  }

  /** Closes the manager and returns focus to the button. */
  hide(): void {
    const dialog = this.dialog;

    if (dialog?.matches(':popover-open')) {
      dialog.hidePopover();
    } else if (dialog?.open) {
      dialog.close();
    } else {
      this.open = false;
    }
  }

  /** Opens the manager when it is closed, and closes it when it is open. */
  toggle(): void {
    if (this.open) {
      this.hide();
    } else if (performance.now() - this.#lastClosed > REOPEN_GUARD) {
      void this.show();
    }
  }

  #bump(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.badge?.animate([{ scale: '1' }, { scale: '1.25' }, { scale: '1' }], {
      duration: 200,
      easing: 'cubic-bezier(0.25, 0, 0.3, 1)'
    });
  }

  #isOpen(): boolean {
    return !!this.dialog && (this.dialog.open || this.dialog.matches(':popover-open'));
  }

  #pickMode(): NotificationButtonMode {
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
    if (this.#switching || this.#isOpen()) {
      return;
    }

    this.#cleanup?.();
    this.#cleanup = undefined;

    this.#unwatchMedia();
    this.#lastClosed = performance.now();
    this.open = false;

    // Return focus to the button, unless focus already moved somewhere else (light dismiss)
    const active = document.activeElement;
    if (!active || active === document.body || active === this) {
      this.button?.focus();
    }

    this.closeEvent.emit();
  }

  #onCancel(event: Event): void {
    // Let the dialog close itself; just make sure Escape doesn't close parent dialogs too
    event.stopPropagation();
  }

  #onClick(): void {
    this.toggle();
  }

  #onClose(): void {
    if (this.dialog) {
      dispatchModalToggle(this, this.dialog, false);
    }

    this.#closed();
  }

  #onDialogClick(event: PointerEvent & { target: HTMLElement }): void {
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

  #onManagerClose(event: Event): void {
    // The manager's close button; this button emits its own `sl-close` once closed
    event.stopPropagation();

    this.hide();
  }

  #onToggle(event: ToggleEvent): void {
    // Only the popover mode fires `toggle` with `closed` without a `close` event
    if (event.newState === 'closed' && this.mode === 'popover') {
      this.#closed();
    }
  }

  #onMediaChange = (): void => {
    if (!this.open || this.#pickMode() === this.mode) {
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
    this.count = this.#subscribed?.unreadCount ?? 0;
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
