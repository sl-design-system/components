import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
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
import {
  type Notification,
  type NotificationAction,
  type NotificationCloseReason,
  type NotificationVariant,
  getTimeout
} from './notification-store.js';
import styles from './notification.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-pause': SlPauseEvent;
    'sl-resume': SlResumeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-notification': NotificationElement;
  }
}

/** Emitted when the notification has closed. Uses the `sl-close` event name. */
export type SlNotificationCloseEvent = CustomEvent<{ reason: NotificationCloseReason }>;

export type SlPauseEvent = CustomEvent<void>;

export type SlResumeEvent = CustomEvent<void>;

/** Converts the `duration` attribute: `auto` or a number of milliseconds. */
const durationConverter = {
  fromAttribute: (value: string | null): 'auto' | number | undefined => {
    if (value === null) {
      return undefined;
    } else if (value === 'auto') {
      return 'auto';
    }

    const number = Number(value);

    return isNaN(number) ? 'auto' : number;
  },
  toAttribute: (value?: 'auto' | number): string | undefined => value?.toString()
};

/**
 * A single notification: a label, an optional description and at most one action. It dismisses
 * itself after a time based on the length of its text, unless it is an error or has an action.
 * While it has focus, or the pointer is over it, the timer stops; when focus and pointer leave, the
 * full time starts again.
 *
 * You normally don't create this element yourself; use `Notification.add()` and the
 * `<sl-notification-stack>` will render it.
 *
 * ```html
 * <sl-notification label="Lesplanner has been updated" variant="info">
 *   <span slot="description">Reload to use the new version.</span>
 * </sl-notification>
 * ```
 *
 * @slot actions - The action of the notification; at most one.
 * @slot description - The description of the notification; overrides the `description` property.
 * @csspart icon - The status icon.
 * @csspart label - The label.
 * @csspart description - The description.
 * @csspart actions - The container of the action.
 * @csspart timer - The track of the timer bar.
 * @csspart bar - The bar showing the time left.
 * @cssstate timed - The notification closes after a timeout.
 * @cssstate running - The timer is running.
 */
@localized()
export class NotificationElement extends ScopedElementsMixin(ElementInternalsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The animation of the timer bar. */
  #animation?: Animation;

  /** Whether the element has focus. */
  #focused = false;

  /** Whether the pointer is over the element. */
  #hovered = false;

  /** The timeout id of the running timer. */
  #timer?: ReturnType<typeof setTimeout>;

  /** @internal The bar showing the time left. */
  @query('[part="bar"]') bar?: HTMLElement;

  /** @internal Emits when the notification has closed. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<SlNotificationCloseEvent>;

  /** @internal Emits when the timer stops because the notification has focus or is hovered. */
  @event({ name: 'sl-pause' }) pauseEvent!: EventEmitter<SlPauseEvent>;

  /** @internal Emits when the timer starts again. */
  @event({ name: 'sl-resume' }) resumeEvent!: EventEmitter<SlResumeEvent>;

  /** @internal Whether the description slot has content. */
  @state() hasSlottedDescription = false;

  /** @internal Whether the actions slot has content. */
  @state() hasSlottedActions = false;

  /** The single action; set automatically when using `notification`. */
  @property({ attribute: false }) action?: NotificationAction;

  /** The description, shown below the label. */
  @property() description?: string;

  /**
   * How long the notification stays on screen in milliseconds; `auto` bases it on the length of the
   * text and `0` keeps it until it is dismissed. Errors and notifications with an action never time
   * out.
   *
   * @default 'auto'
   */
  @property({ converter: durationConverter }) duration?: 'auto' | number;

  /** The label of the notification. */
  @property() label?: string;

  /** The notification from the store this element shows. */
  @property({ attribute: false }) notification?: Notification;

  /** Whether the timer is paused because the notification has focus or is hovered. */
  @property({ type: Boolean, reflect: true }) paused?: boolean;

  /**
   * @internal Set by the stack to stop the timer, for example while the stack is expanded or when
   * this notification is not in front.
   */
  @property({ type: Boolean, attribute: false }) suspended?: boolean;

  /**
   * The variant of the notification.
   *
   * @default 'info'
   */
  @property({ reflect: true }) variant?: NotificationVariant;

  /** @internal Whether the timer is running. */
  @state() @cssState() running = false;

  /** @internal Whether the notification closes after a timeout. */
  @cssState()
  get timed(): boolean {
    return this.timeout > 0;
  }

  /** The time in milliseconds the notification stays on screen; 0 means until dismissed. */
  get timeout(): number {
    return getTimeout({
      action: this.action ?? (this.hasSlottedActions ? { label: '' } : undefined),
      description: this.description,
      duration: this.duration,
      label: this.label ?? '',
      variant: this.variant
    });
  }

  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string {
    switch (this.variant) {
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'triangle-exclamation-solid';
      case 'error':
        return 'octagon-xmark-solid';
      default:
        return 'info';
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.elementInternals.role = 'group';

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }

    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onFocusOut);
    this.addEventListener('keydown', this.#onKeydown);
    this.addEventListener('pointerenter', this.#onPointerEnter);
    this.addEventListener('pointerleave', this.#onPointerLeave);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('focusout', this.#onFocusOut);
    this.removeEventListener('keydown', this.#onKeydown);
    this.removeEventListener('pointerenter', this.#onPointerEnter);
    this.removeEventListener('pointerleave', this.#onPointerLeave);

    this.#stopTimer();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('notification') && this.notification) {
      const { action, description, duration, label, variant } = this.notification;

      Object.assign(this, { action, description, duration, label, variant });
    }

    if (changes.has('label')) {
      this.elementInternals.ariaLabel = this.label ?? null;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    this.#syncTimer(changes.has('duration') || changes.has('label'));
  }

  override render(): TemplateResult {
    const hasDescription = !!this.description || this.hasSlottedDescription,
      hasActions = !!this.action || this.hasSlottedActions;

    return html`
      <div part="icon">
        <sl-icon .name=${this.iconName} size="md"></sl-icon>
      </div>
      <div part="content">
        <div part="label">${this.label}</div>
        <div part="description" ?hidden=${!hasDescription}>
          <slot @slotchange=${this.#onDescriptionSlotChange} name="description"
            >${this.description}</slot
          >
        </div>
        <div part="actions" ?hidden=${!hasActions}>
          <slot @slotchange=${this.#onActionsSlotChange} name="actions"
            >${this.#renderAction()}</slot
          >
        </div>
      </div>
      <sl-button
        @click=${this.#onDismiss}
        aria-label=${msg('Dismiss notification', { id: 'sl.notification.dismiss' })}
        fill="ghost"
        size="md">
        <sl-icon name="xmark"></sl-icon>
      </sl-button>
      <div part="timer" aria-hidden="true">
        <div part="bar"></div>
      </div>
    `;
  }

  /**
   * Closes the notification. Moves focus away first, so it isn't lost, and emits `sl-close` once
   * the element is no longer needed.
   */
  close(reason: NotificationCloseReason = 'api'): void {
    this.#stopTimer();

    this.notification?.dismiss(reason);
    this.closeEvent.emit({ reason });
  }

  #renderAction(): TemplateResult | typeof nothing {
    const action = this.action;

    if (!action) {
      return nothing;
    } else if (action.href) {
      return html`
        <a @click=${this.#onAction} class="action" href=${action.href}>${action.label}</a>
      `;
    } else {
      return html`
        <button @click=${this.#onAction} class="action" type="button">${action.label}</button>
      `;
    }
  }

  #onAction(): void {
    if (this.notification) {
      this.action?.handler?.(this.notification);
    }

    // Using the action of a notification marks it as read
    this.close('user');
  }

  #onActionsSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.hasSlottedActions = event.target.assignedElements({ flatten: true }).length > 0;
  }

  #onDescriptionSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.hasSlottedDescription = event.target
      .assignedNodes({ flatten: true })
      .some(node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim());
  }

  #onDismiss(event: Event): void {
    event.stopPropagation();

    this.close('user');
  }

  #onFocusIn = (): void => {
    this.#focused = true;
    this.#updatePaused();
  };

  #onFocusOut = (event: FocusEvent): void => {
    if (!this.contains(event.relatedTarget as Node | null) && event.relatedTarget !== this) {
      this.#focused = false;
      this.#updatePaused();
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this.close('user');
    }
  };

  #onPointerEnter = (): void => {
    this.#hovered = true;
    this.#updatePaused();
  };

  #onPointerLeave = (): void => {
    this.#hovered = false;
    this.#updatePaused();
  };

  #updatePaused(): void {
    const paused = this.#focused || this.#hovered;

    if (paused !== !!this.paused) {
      this.paused = paused;

      if (paused) {
        this.pauseEvent.emit();
      } else {
        this.resumeEvent.emit();
      }
    }
  }

  /** Starts or stops the timer, depending on the state of the notification. */
  #syncTimer(restart = false): void {
    const shouldRun = this.isConnected && this.timeout > 0 && !this.paused && !this.suspended;

    if (shouldRun && (!this.running || restart)) {
      this.#startTimer();
    } else if (!shouldRun && this.running) {
      this.#stopTimer();
    }
  }

  #startTimer(): void {
    this.#stopTimer();

    const timeout = this.timeout;

    this.running = true;
    this.#timer = setTimeout(() => {
      this.#timer = undefined;
      this.close('timeout');
    }, timeout);

    // The bar is decorative; the timeout above is what closes the notification
    this.#animation = this.bar?.animate([{ scale: '1 1' }, { scale: '0 1' }], {
      duration: timeout,
      easing: 'linear',
      fill: 'forwards'
    });
  }

  #stopTimer(): void {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = undefined;
    }

    this.#animation?.cancel();
    this.#animation = undefined;
    this.running = false;
  }
}
