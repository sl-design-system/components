import '@sl-design-system/avatar/register.js';
import '@sl-design-system/icon/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './a3mp-app-bar.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a3mp-app-bar': A3mpAppBar;
  }

  interface GlobalEventHandlersEventMap {
    'sl-a3mp-app-bar-action': SlA3mpAppBarActionEvent;
  }
}

/** The id of one of the app bar's four interactive controls. */
export type A3mpAppBarActionId = 'class' | 'school' | 'notifications' | 'user';

/** The slice of page state this app bar renders. Owned and passed in by the root. */
export interface AppBarModel {
  /** The class context selector's current label, e.g. `'4A'`. */
  classLabel: string;
  /** The school context selector's current label, e.g. `'Basisschool 1234'`. */
  schoolLabel: string;
  /** The signed-in user shown at the right edge. */
  user: { displayName: string; initials: string };
  /** Whether the notification bell shows an unread state. */
  hasNotifications: boolean;
}

/** The detail of the `sl-a3mp-app-bar-action` event. */
export type SlA3mpAppBarActionEvent = CustomEvent<{ actionId: A3mpAppBarActionId }>;

/**
 * Structural/presentation config, not model data: the accessible-name prefixes for the two
 * context switchers. i18n is OFF for this run, so they are rendered directly.
 */
const CLASS_SWITCHER_LABEL_PREFIX = 'Class: ',
  SCHOOL_SWITCHER_LABEL_PREFIX = 'School: ',
  ACCOUNT_LABEL_PREFIX = 'Account: ',
  NOTIFICATIONS_LABEL = 'Notifications',
  NOTIFICATIONS_UNREAD_LABEL = 'Notifications, unread';

/**
 * The myPortal digital-exercises top chrome bar (Figma `25124:57139`): the bingel wordmark and a
 * class context switcher at the inline start, a school context switcher, a notification bell and
 * the signed-in user's avatar + name at the inline end.
 *
 * Purely presentational — it renders the `model` the page root gives it and emits a single
 * `sl-a3mp-app-bar-action` intent event naming which control was activated; the root owns what
 * each action does (e.g. opening a real menu). Both context "selects" are drawn as select boxes
 * but have no option list in the design, so they are plain buttons, not `sl-select`. The host app
 * owns the page-level `banner`/`main` landmarks, so this renders a neutral `<div>`, with only the
 * right-hand cluster wrapped in a `<nav>`.
 *
 * ```html
 * <sl-a3mp-app-bar .model=${model}></sl-a3mp-app-bar>
 * ```
 *
 * @fires sl-a3mp-app-bar-action - Emitted with the activated control's id when a switcher, the
 *   notification bell or the account control is clicked.
 */
export class A3mpAppBar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits with the activated control's id. */
  @event({ name: 'sl-a3mp-app-bar-action' }) actionEvent!: EventEmitter<SlA3mpAppBarActionEvent>;

  /** The class/school context, the signed-in user and the notification state this bar renders. */
  @property({ attribute: false }) model?: AppBarModel;

  override render(): TemplateResult {
    // The contract types `model` as optional on this leaf so an unset model can't throw inside
    // `render` (which would blank the whole page); the root always provides it in practice.
    const { classLabel, schoolLabel, user, hasNotifications } = this.model ?? {
      classLabel: '',
      schoolLabel: '',
      user: { displayName: '', initials: '' },
      hasNotifications: false
    };

    const notificationsLabel = hasNotifications ? NOTIFICATIONS_UNREAD_LABEL : NOTIFICATIONS_LABEL;

    return html`
      <div class="bar">
        <div class="left">
          <!--
            DISCREPANCY (recorded for Stage 4): the bingel wordmark (Figma node 25124:57141,
            "Frame") is an exported SVG asset. This pipeline has no asset-export step, so nothing
            is drawn here; the element is pinned to the raster's exact 71.25 x 30 footprint so
            nothing downstream shifts.
          -->
          <span aria-hidden="true" class="wordmark"></span>

          <button
            aria-label=${CLASS_SWITCHER_LABEL_PREFIX + classLabel}
            class="selector"
            type="button"
            @click=${() => this.#onAction('class')}>
            <span class="selector-label">${classLabel}</span>
            <sl-icon aria-hidden="true" name="chevron-down"></sl-icon>
          </button>
        </div>

        <nav aria-label="Account and context" class="right">
          <button
            aria-label=${SCHOOL_SWITCHER_LABEL_PREFIX + schoolLabel}
            class="selector selector--school"
            type="button"
            @click=${() => this.#onAction('school')}>
            <span class="selector-label">${schoolLabel}</span>
            <sl-icon aria-hidden="true" name="chevron-down"></sl-icon>
          </button>

          <!--
            DISCREPANCY (recorded for Stage 4): the notification bell (Figma node 25124:57149,
            "Vector") is an exported SVG asset, omitted per the run's asset policy; its 21 x 24
            footprint is kept so the right-hand cluster's spacing is unaffected.
          -->
          <button
            aria-label=${notificationsLabel}
            class="bell"
            type="button"
            @click=${() => this.#onAction('notifications')}></button>

          <button
            aria-label=${ACCOUNT_LABEL_PREFIX + user.displayName}
            class="user"
            type="button"
            @click=${() => this.#onAction('user')}>
            <!--
              image-only suppresses the avatar's own name line, which this design renders
              separately (the "user-name" span below); the initials still render as the fallback
              since no picture asset exists. display-name still carries the user's name for the
              avatar's own alt-text path.
            -->
            <sl-avatar
              display-initials=${user.initials}
              display-name=${user.displayName}
              image-only
              size="md"></sl-avatar>
            <span class="user-name">${user.displayName}</span>
            <span class="chevron-box">
              <sl-icon aria-hidden="true" name="chevron-down"></sl-icon>
            </span>
          </button>
        </nav>
      </div>
    `;
  }

  #onAction(actionId: A3mpAppBarActionId): void {
    this.actionEvent.emit({ actionId });
  }
}

if (!customElements.get('sl-a3mp-app-bar')) {
  customElements.define('sl-a3mp-app-bar', A3mpAppBar);
}
