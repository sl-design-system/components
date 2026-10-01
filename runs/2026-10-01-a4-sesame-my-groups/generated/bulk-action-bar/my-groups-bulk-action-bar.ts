import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { registerRunIcons } from '../run-icons.js';
import styles from './my-groups-bulk-action-bar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-my-groups-bulk-action': SlMyGroupsBulkActionEvent;
    'sl-my-groups-bulk-dismiss': SlMyGroupsBulkDismissEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-my-groups-bulk-action-bar': MyGroupsBulkActionBar;
  }
}

/** The bulk operations that can be applied to the current table selection. */
export type BulkAction = 'delete' | 'reactivate' | 'archive';

/** The slice of the page's domain model this bar renders. */
export interface BulkSelectionModel {
  selectedCount: number;
  totalCount: number;
  canReactivate: boolean;
}

export type SlMyGroupsBulkActionEvent = CustomEvent<{ action: BulkAction }>;

export type SlMyGroupsBulkDismissEvent = CustomEvent<void>;

/**
 * Structural constant: the bar's fixed action set, in design order, with the icon each one uses.
 * This is presentation config, not data — the model only says whether reactivating is allowed.
 */
const BULK_ACTIONS: ReadonlyArray<{ action: BulkAction; icon: string; label: string }> = [
  { action: 'delete', icon: 'trash', label: 'Delete' },
  { action: 'reactivate', icon: 'boxes-packing', label: 'Reactivate' },
  { action: 'archive', icon: 'box-archive', label: 'Archive' }
];

/**
 * The id of the description of why "Reactivate" is unavailable. It is local to this shadow root on
 * purpose: an `aria-describedby` IDREF cannot cross a shadow boundary, so pointing at the page's
 * inline message (which lives in the page's shadow root) resolved to nothing. `ForwardAriaMixin`
 * resolves the IDREF against the `<sl-button>`'s root -- this shadow root -- and hands the inner
 * `<button>` an *element reference*, which does cross into the button's own shadow root.
 */
const DISABLED_REASON_ID = 'reactivate-disabled-reason';

// `@fortawesome/*` is not installed in this checkout, so the run ships local approximations of the
// glyphs instead of the `Icon.register(faTrash)` the framework skill prescribes. See `run-icons.ts`.
registerRunIcons();

/**
 * The floating bulk-selection action bar: a brand-filled pill that appears over the groups table
 * while rows are selected. It shows how many of the total groups are selected, a dismiss control
 * that clears the selection, and the three bulk operations.
 *
 * Presentational — it receives its `model` from the data-owning page and emits an event per
 * action rather than mutating the selection itself. It renders nothing when nothing is selected.
 *
 * ```html
 * <sl-my-groups-bulk-action-bar .model=${model}></sl-my-groups-bulk-action-bar>
 * ```
 *
 * @fires sl-my-groups-bulk-action - Emitted when the user activates one of the bulk actions.
 * @fires sl-my-groups-bulk-dismiss - Emitted when the user clears the selection.
 */
export class MyGroupsBulkActionBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The sentence explaining why reactivating is unavailable. When set and the model forbids
   * reactivating, the bar renders it as a visually hidden description inside its own shadow root
   * and points the "Reactivate" button's `aria-describedby` at it.
   *
   * It is the text, not the id of the page's inline message, because an IDREF cannot cross the
   * shadow boundary between the page and this component. The page keeps rendering the visible
   * message; this copy exists only for the button's description.
   */
  @property({ attribute: 'disabled-reason' }) disabledReason?: string;


  /** The current selection: how many groups are selected, out of how many, and what is allowed. */
  @property({ attribute: false }) model?: BulkSelectionModel;

  /** Emits when the user activates one of the bulk actions. */
  @event({ name: 'sl-my-groups-bulk-action' }) actionEvent!: EventEmitter<SlMyGroupsBulkActionEvent>;

  /** Emits when the user clears the selection. */
  @event({ name: 'sl-my-groups-bulk-dismiss' })
  dismissEvent!: EventEmitter<SlMyGroupsBulkDismissEvent>;

  override render(): TemplateResult {
    if (!this.model || this.model.selectedCount === 0) {
      return html`${nothing}`;
    }

    const { selectedCount, totalCount, canReactivate } = this.model,
      // Only describe the button when there is something to say; an empty `aria-describedby` is
      // worse than none, which is exactly what the page-level id used to produce.
      reason = canReactivate ? undefined : this.disabledReason;

    return html`
      <div aria-label="Bulk actions" class="bar" role="region">
        ${reason
          ? html`<span class="visually-hidden" id=${DISABLED_REASON_ID}>${reason}</span>`
          : nothing}
        <sl-button
          @click=${this.#onDismiss}
          aria-label="Clear selection"
          fill="ghost"
          shape="pill"
          size="sm">
          <sl-icon name="xmark" size="lg"></sl-icon>
        </sl-button>
        <p aria-live="polite" class="count">
          <span class="count-value">${selectedCount}</span>
          <span>selected out of ${totalCount}</span>
        </p>
        <div class="actions">
          ${BULK_ACTIONS.map(({ action, icon, label }) => {
            const disabled = action === 'reactivate' && !canReactivate;

            return html`
              <sl-button
                @click=${this.#onAction}
                aria-describedby=${ifDefined(disabled && reason ? DISABLED_REASON_ID : undefined)}
                aria-disabled=${ifDefined(disabled ? 'true' : undefined)}
                data-action=${action}
                ?data-disabled=${disabled}
                fill="ghost"
                shape="pill"
                size="sm">
                <sl-icon name=${icon}></sl-icon>
                ${label}
              </sl-button>
            `;
          })}
        </div>
      </div>
    `;
  }

  #onAction(event: Event): void {
    const button = event.currentTarget as HTMLElement,
      action = button.dataset.action as BulkAction | undefined;

    // The unavailable action is marked `aria-disabled` rather than `disabled` so it stays
    // focusable and its description can actually be announced. `sl-button` already swallows the
    // click of an `aria-disabled` button, but the bar does not depend on that to decide not to act.
    if (!action || button.hasAttribute('data-disabled')) {
      return;
    }

    this.actionEvent.emit({ action });
  }

  #onDismiss(): void {
    this.dismissEvent.emit();
  }
}
