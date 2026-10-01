import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { type StudentRow, StudentsGrid } from './students-grid/students-grid.js';
import styles from './students-panel.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a2-add-students': SlA2AddStudentsEvent;
    'sl-a2-create-groups': SlA2CreateGroupsEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a2-students-panel': StudentsPanel;
  }
}

/** Emitted when the "Add students" action is activated. */
export type SlA2AddStudentsEvent = CustomEvent<{ classId?: string }>;

/** Emitted when the "Create groups" action is activated. */
export type SlA2CreateGroupsEvent = CustomEvent<{ studentIds: string[] }>;

/** The data this panel needs: just the student rows for its grid. */
export interface StudentsPanelModel {
  students: StudentRow[];
}

/**
 * The "Students" panel from the NSP "class overview" design: a heading, two action buttons
 * (each oddly its own single-button `sl-button-bar`, matching both the screenshot and Code
 * Connect), and the students data grid.
 *
 * This is a presentational child: the data-owning `<sl-a2-class-overview-page>` passes the
 * `model` (student rows) in; this component neither fetches nor owns the data. It does not
 * re-emit the grid's own `sl-a2-students-grid-row-activate` event - that bubbles on its own and
 * the page listens for it directly.
 *
 * ```html
 * <sl-a2-students-panel .model=${{ students }}></sl-a2-students-panel>
 * ```
 *
 * @slot heading - Replaces the default "Students" heading.
 * @slot actions - Replaces/extends the two action button bars.
 * @fires sl-a2-add-students - Emitted when "Add students" is activated.
 * @fires sl-a2-create-groups - Emitted when "Create groups" is activated.
 */
export class StudentsPanel extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-a2-students-grid': StudentsGrid
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The panel's data: the student rows for the grid.
   *
   * @default null
   */
  @property({ attribute: false }) model: StudentsPanelModel | null = null;

  /** @internal Emits when "Add students" is activated. */
  @event({ name: 'sl-a2-add-students' }) addStudentsEvent!: EventEmitter<SlA2AddStudentsEvent>;

  /** @internal Emits when "Create groups" is activated. */
  @event({ name: 'sl-a2-create-groups' }) createGroupsEvent!: EventEmitter<SlA2CreateGroupsEvent>;

  #onAddStudents(): void {
    this.addStudentsEvent.emit({});
  }

  #onCreateGroups(): void {
    // The design's grid has no selection column (its row checkbox is `hidden="true"` in
    // `get_metadata`), so nothing is selectable here; this always ships an empty array.
    this.createGroupsEvent.emit({ studentIds: [] });
  }

  override render(): TemplateResult {
    const students = this.model?.students ?? [];

    return html`
      <section aria-labelledby="students-heading">
        <slot name="heading"><h2 id="students-heading">Students</h2></slot>
        <slot name="actions">
          <sl-button-bar>
            <!--
              Code Connect gives this bar fill="outline", but sl-button-bar propagates its own
              fill down to every slotted button, which would strip the solid blue fill the
              screenshot clearly shows. Setting fill/variant directly on the button instead, and
              leaving the bar's own fill unset, reproduces the rendered design rather than the
              self-contradictory snippet.
            -->
            <!--
              Code Connect's leading icon is far-presentation-screen; it is absent from this
              theme's icons.ts (only 54 unprefixed names are registered) and the far- prefix
              needs @fortawesome/pro-regular-svg-icons, which isn't installed. Rendered as a
              text-only button; recorded Stage 4 discrepancy.
            -->
            <sl-button fill="solid" variant="primary" @click=${this.#onAddStudents}>
              Add students
            </sl-button>
          </sl-button-bar>
          <sl-button-bar>
            <sl-button fill="outline" @click=${this.#onCreateGroups}>Create groups</sl-button>
          </sl-button-bar>
        </slot>
        <sl-a2-students-grid .rows=${students}></sl-a2-students-grid>
      </section>
    `;
  }
}

// This is the top-level element for this component, so - unlike its scoped `sl-button`,
// `sl-button-bar` and `sl-a2-students-grid` children above - it registers itself globally,
// guarded so re-importing this module doesn't throw (it's rendered standalone here and also
// composed by the sibling `sl-a2-class-overview-page`).
if (!customElements.get('sl-a2-students-panel')) {
  customElements.define('sl-a2-students-panel', StudentsPanel);
}
