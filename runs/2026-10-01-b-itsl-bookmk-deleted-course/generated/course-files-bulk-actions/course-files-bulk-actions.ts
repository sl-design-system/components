import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './course-files-bulk-actions.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-course-files-bulk-action': SlCourseFilesBulkActionEvent;
    'sl-course-files-clear-selection': SlCourseFilesClearSelectionEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-course-files-bulk-actions': CourseFilesBulkActions;
  }
}

/** The bulk actions this panel can offer for the current selection. */
export type CourseFilesBulkActionId = 'download';

/** The selection state this panel reports on. Data only — the labels live in this component. */
export interface CourseFilesBulkActionsModel {
  selectedCount: number;
  selectableTotal: number;
}

export type SlCourseFilesBulkActionEvent = CustomEvent<{ actionId: CourseFilesBulkActionId }>;
export type SlCourseFilesClearSelectionEvent = CustomEvent<void>;

/**
 * Structural config: the bulk actions this panel renders, in order. Not model data — the parent
 * says *what is selected*, this component knows *what can be done with a selection*.
 */
const BULK_ACTIONS = [{ id: 'download', label: 'Download' }] as const;

/**
 * The bulk actions panel shown below the course files table once one or more files are selected:
 * a live count of the selection, the available bulk actions, and a "Clear selection" button.
 *
 * ```html
 * <sl-course-files-bulk-actions .model=${{ selectedCount: 2, selectableTotal: 40 }}>
 * </sl-course-files-bulk-actions>
 * ```
 *
 * @slot actions - Extra consumer-supplied bulk action buttons. Defaults to the built-in actions.
 *
 * @csspart panel - The bordered panel wrapper (the `region` landmark).
 * @csspart count - The selection count paragraph.
 * @csspart actions - The bulk action button group.
 * @csspart clear - The divider + "Clear selection" group.
 *
 * @fires sl-course-files-bulk-action - Emitted when a bulk action is activated.
 * @fires sl-course-files-clear-selection - Emitted when the selection should be cleared.
 */
export class CourseFilesBulkActions extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a bulk action is activated. */
  @event({ name: 'sl-course-files-bulk-action' })
  bulkActionEvent!: EventEmitter<SlCourseFilesBulkActionEvent>;

  /** @internal Emits when the user clears the selection. */
  @event({ name: 'sl-course-files-clear-selection' })
  clearSelectionEvent!: EventEmitter<SlCourseFilesClearSelectionEvent>;

  /** The current selection: how many files are selected, out of how many selectable ones. */
  @property({ attribute: false }) model!: CourseFilesBulkActionsModel;

  override render(): TemplateResult {
    return html`
      <div part="panel" role="region" aria-label="Bulk actions">
        <p part="count" aria-live="polite">
          <span class="count-value">${this.model?.selectedCount}</span>
          <span>selected out of ${this.model?.selectableTotal}</span>
        </p>
        <div class="buttons">
          <div part="actions">
            <slot name="actions">
              ${BULK_ACTIONS.map(
                action => html`
                  <sl-button fill="link" @click=${() => this.#onAction(action.id)}>
                    ${action.label}
                  </sl-button>
                `
              )}
            </slot>
          </div>
          <div part="clear">
            <hr />
            <sl-button fill="link" @click=${this.#onClearSelection}>
              <sl-icon name="xmark" size="xl" aria-hidden="true"></sl-icon>
              Clear selection
            </sl-button>
          </div>
        </div>
      </div>
    `;
  }

  #onAction(actionId: CourseFilesBulkActionId): void {
    this.bulkActionEvent.emit({ actionId });
  }

  #onClearSelection(): void {
    this.clearSelectionEvent.emit();
  }
}
