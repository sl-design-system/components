import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './a3mp-quick-actions-bar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a3mp-quick-action': SlA3mpQuickActionEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a3mp-quick-actions-bar': A3mpQuickActionsBar;
  }
}

/** Emitted when one of the quick-action buttons is activated. */
export type SlA3mpQuickActionEvent = CustomEvent<{ actionId: string }>;

/** One quick action rendered as a button in the bar. */
export interface QuickAction {
  /** Stable key for the action, e.g. `'new-task'`. */
  id: string;
  /** The label as drawn, e.g. `'New task'`. */
  label: string;
}

/** The data this component renders; owned/fetched by the page, passed in here. */
export interface QuickActionsModel {
  /** The leading label, as drawn: `'Quick actions:'`. */
  leadLabel: string;
  /** The actions, in display order. */
  actions: QuickAction[];
}

/**
 * The white 40px quick-actions strip beneath the app bar: a leading label followed by a row of
 * icon + label action buttons. Presentational — the page owns the `model` and handles the
 * emitted `sl-a3mp-quick-action` event.
 *
 * None of the four design icons (`plus`, `comment`, `note`, `image`) is registered in the
 * `bingel-int` theme, so each action's icon box is rendered empty at its drawn 16x16 footprint —
 * see the per-button comment in the template.
 *
 * ```html
 * <sl-a3mp-quick-actions-bar .model=${{ leadLabel: 'Quick actions:', actions: [...] }}>
 * </sl-a3mp-quick-actions-bar>
 * ```
 *
 * @fires sl-a3mp-quick-action - Emitted with the activated action's `id` when a button is pressed.
 */
export class A3mpQuickActionsBar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a quick-action button is activated. */
  @event({ name: 'sl-a3mp-quick-action' }) quickActionEvent!: EventEmitter<SlA3mpQuickActionEvent>;

  /**
   * The leading label and the actions to render, passed in by the page that owns the data.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: QuickActionsModel;

  override render(): TemplateResult {
    const actions = this.model?.actions ?? [];

    return html`
      <nav aria-label="Quick actions">
        <span class="lead-label">${this.model?.leadLabel}</span>
        ${actions.map(
          action => html`
            <button type="button" @click=${() => this.#onActionClick(action)}>
              <!-- Icon omitted: the design's glyph for this action is not registered in
                   bingel-int; its 16x16 footprint is preserved so the label position holds. -->
              <span class="icon" aria-hidden="true"></span>
              <span class="label">${action.label}</span>
            </button>
          `
        )}
      </nav>
    `;
  }

  #onActionClick(action: QuickAction): void {
    this.quickActionEvent.emit({ actionId: action.id });
  }
}

// Guarded global registration. Without this the module runs, the class is defined, the type
// check passes — and `<sl-a3mp-quick-actions-bar>` stays an inert unknown element with no shadow
// root.
if (!customElements.get('sl-a3mp-quick-actions-bar')) {
  customElements.define('sl-a3mp-quick-actions-bar', A3mpQuickActionsBar);
}
