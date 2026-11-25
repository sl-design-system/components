import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
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
import { type NotificationManager } from './notification-manager.js';
import { Notification, type NotificationStore } from './notification-store.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-notification-button': NotificationButton;
  }
}

/**
 * Icon button that shows the number of unread notifications and toggles the
 * `<sl-notification-manager>`. It points at the manager the same way a native popover button does:
 *
 * ```html
 * <sl-notification-button manager="inbox"></sl-notification-button>
 * <sl-notification-manager id="inbox"></sl-notification-manager>
 * ```
 *
 * The accessible name includes the count ("Notifications, 3 unread"); the badge itself is hidden
 * from assistive technology. Changes to the count are not announced: the notification already was.
 *
 * @csspart button - The button.
 * @csspart badge - The badge with the unread count.
 * @cssstate expanded - The manager is open.
 */
@localized()
export class NotificationButton extends ScopedElementsMixin(ElementInternalsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-badge': Badge,
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The manager element this button is connected to. */
  #manager?: NotificationManager | null;

  /** The store the button is listening to. */
  #subscribed?: NotificationStore;

  /** @internal The badge. */
  @query('sl-badge') badge?: HTMLElement;

  /** @internal The button. */
  @query('sl-button') button?: HTMLElement;

  /** The number of unread notifications; read-only. */
  @state() count = 0;

  /** @internal Whether the manager is open. */
  @state() @cssState() expanded = false;

  /** The id of the `<sl-notification-manager>` this button toggles. */
  @property() manager?: string;

  /**
   * The maximum count shown in the badge; above it, the badge shows "99+".
   *
   * @default 99
   */
  @property({ type: Number, attribute: 'max-count' }) maxCount?: number;

  /** The store to count unread notifications in. Defaults to the document's store. */
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
    this.#connectManager(null);

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

    if (changes.has('manager')) {
      this.#connectManager(this.#findManager());
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
            : msg('Notifications', { id: 'sl.notification.title' });

    return html`
      <sl-button
        @click=${this.#onClick}
        aria-expanded=${this.expanded ? 'true' : 'false'}
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
    `;
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

  #connectManager(manager?: NotificationManager | null): void {
    if (this.#manager === manager) {
      return;
    }

    this.#manager?.removeEventListener('sl-open', this.#onManagerToggle);
    this.#manager?.removeEventListener('sl-close', this.#onManagerToggle);

    this.#manager = manager;
    this.#manager?.addEventListener('sl-open', this.#onManagerToggle);
    this.#manager?.addEventListener('sl-close', this.#onManagerToggle);

    if (this.button) {
      (
        this.button as HTMLElement & { ariaControlsElements?: Element[] | null }
      ).ariaControlsElements = manager ? [manager] : null;
    }

    this.expanded = !!manager?.open;
  }

  #findManager(): NotificationManager | null {
    if (!this.manager) {
      return null;
    }

    const root = this.getRootNode() as Document | ShadowRoot;

    return (root.getElementById?.(this.manager) ??
      document.getElementById(this.manager)) as NotificationManager | null;
  }

  #onClick(): void {
    // The manager may have been rendered after this button
    this.#connectManager(this.#findManager());

    this.#manager?.toggle(this);
  }

  #onManagerToggle = (): void => {
    this.expanded = !!this.#manager?.open;
  };

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
