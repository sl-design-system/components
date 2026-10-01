import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Grid, GridFilterColumn } from '@sl-design-system/grid';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './students-grid.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a2-students-grid': StudentsGrid;
  }
}

/** A single row of the students grid. The design carries no domain data — every field is `'Text'`. */
export interface StudentRow {
  id: string;
  column1: string;
  column2: string;
  column3: string;
  column4: string;
}

/**
 * The students data grid from the NSP "class overview" design, with a footer row fused below it.
 *
 * This is a presentational child: the data-owning `students-panel` passes `rows` in; this
 * component neither fetches nor owns the data. It composes the existing `sl-grid` +
 * `sl-grid-filter-column` (4×) for the header/filter/data rows, and renders the footer as a
 * sibling `<div>` beneath the grid, since `sl-grid` has no footer concept of its own (its
 * `<tfoot>` is reserved for the horizontal scrollbar).
 *
 * ```html
 * <sl-a2-students-grid .rows=${rows}></sl-a2-students-grid>
 * ```
 *
 * @slot footer - Replaces the footer row's content; defaults to the design's literal "Footer".
 */
export class StudentsGrid extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-grid': Grid,
      'sl-grid-filter-column': GridFilterColumn
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The rows to render in the grid. */
  @property({ attribute: false }) rows: StudentRow[] = [];

  /** Whether the footer row is shown below the grid. */
  @property({ type: Boolean, reflect: true, attribute: 'show-footer' }) showFooter = true;

  override render(): TemplateResult {
    return html`
      <sl-grid .items=${this.rows}>
        <sl-grid-filter-column grow="0" header="Text" path="column1" width="288">
        </sl-grid-filter-column>
        <sl-grid-filter-column grow="0" header="Text" path="column2" width="288">
        </sl-grid-filter-column>
        <sl-grid-filter-column grow="0" header="Text" path="column3" width="288">
        </sl-grid-filter-column>
        <sl-grid-filter-column grow="0" header="Text" path="column4" width="288">
        </sl-grid-filter-column>
      </sl-grid>
      ${this.showFooter
        ? html`
            <div class="footer">
              <slot name="footer">Footer</slot>
            </div>
          `
        : ''}
    `;
  }
}

// This is a CHILD component (rendered only inside `students-panel`), but per this run's
// house pattern it still self-registers, guarded, so the story / any standalone usage works;
// the parent also lists it in its own `scopedElements` map.
if (!customElements.get('sl-a2-students-grid')) {
  customElements.define('sl-a2-students-grid', StudentsGrid);
}
