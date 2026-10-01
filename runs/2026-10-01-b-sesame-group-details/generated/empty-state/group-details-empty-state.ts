import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './group-details-empty-state.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-b-sesame-group-details-add-first-student': SlBSesameGroupDetailsAddFirstStudentEvent;
  }
}

/** Emitted when the empty state's call to action is activated. */
export type SlBSesameGroupDetailsAddFirstStudentEvent = CustomEvent<void>;

/**
 * The "You don't have any students yet" block.
 *
 * Two recorded departures from the Figma node:
 *  - The illustration `2142:48471` is a 100x71 image asset and the pipeline has **no asset export
 *    step**, so it renders as an `aria-hidden` box of exactly that size. Not substituted, not
 *    drawn — a recorded Stage 4 discrepancy.
 *  - The body copy is a one-item bulleted list in Figma (`<ul><li class="list-disc">`). Rendered
 *    as a plain centred paragraph: a one-item list is not a list, and the bullet is almost
 *    certainly unintended (Inconsistency 8, OQ-7).
 *
 * Takes no model — two literals and one event.
 *
 * @fires sl-b-sesame-group-details-add-first-student - Emitted when the block is activated.
 */
export class GroupDetailsEmptyState extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the empty state is activated. */
  @event({ name: 'sl-b-sesame-group-details-add-first-student' })
  addFirstStudentEvent!: EventEmitter<SlBSesameGroupDetailsAddFirstStudentEvent>;

  override render(): TemplateResult {
    return html`
      <div class="illustration" aria-hidden="true"></div>
      <p class="heading">You don't have any students yet</p>
      <p class="body">
        <button type="button" @click=${this.#onClick}>Start by adding a student</button>
      </p>
    `;
  }

  #onClick(): void {
    this.addFirstStudentEvent.emit();
  }
}
