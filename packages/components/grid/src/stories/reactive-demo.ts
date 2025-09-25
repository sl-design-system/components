import { Avatar } from '@sl-design-system/avatar';
import '@sl-design-system/button/register.js';
import { type Student, getStudents } from '@sl-design-system/example-data';
import '@sl-design-system/icon/register.js';
import { tooltip } from '@sl-design-system/tooltip';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../register.js';
import { SlSelectionChangeEvent } from '../grid.js';
import { avatarRenderer } from './story-utils.js';

/**
 * A demonstration component showing @state() reactivity with a grid
 * This component demonstrates the Multiple story functionality using @state()
 */
@customElement('reactive-demo')
export class ReactiveDemo extends LitElement {
  @state() students: Student[] = [];

  @state() private test1 = true;
  @state() private test2 = false;
  @state() private selectAll = false;
  @state() selectedCount = 0;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.students = (await getStudents()).students.slice(0, 5);
  }

  override render() {
    return html`
      <div>
        <h3>Reactive State Demo with @state() + Grid</h3>
        <p>This component demonstrates Lit's @state() decorator with the Multiple story functionality:</p>

        <div style="margin: 16px 0; padding: 16px; background: #f9f9f9; border: 1px solid #ddd;">
          <h4>State Controls:</h4>
          <sl-button @click=${this.toggleTest1}>Toggle test1 - disabled: ${this.test1}</sl-button>
          <br />
          <br />
          <sl-button @click=${this.toggleTest2}>Toggle test2 - disabled: ${this.test2}</sl-button>
        </div>

        ${this.students.length > 0
          ? this._renderGridSection()
          : html`<p><em>No students data provided. Pass students via the .students property.</em></p>`}

        <div style="margin: 16px 0; padding: 16px; border: 1px solid #ccc; background: #f5f5f5;">
          <h4>Current State:</h4>
          <ul>
            <li>
              test1: ${this.test1}
              (${this.test1 ? 'will disable "Test disabled" button' : 'will enable "Test disabled" button'})
            </li>
            <li>
              test2: ${this.test2}
              (${this.test2 ? 'will disable "Test enabled" button' : 'will enable "Test enabled" button'})
            </li>
            <li>selectAll: ${this.selectAll}</li>
          </ul>
        </div>

        <p>
          <strong>How it works:</strong> Each checkbox is bound to a <code>@state()</code> property. When you
          check/uncheck a box, the component automatically re-renders and updates the grid's bulk action buttons
          accordingly. This demonstrates reactive state management in Lit components.
        </p>
        <p>
          <strong>Note:</strong> Due to how Lit's reactivity works, the grid re-renders when any @state() property
          changes, which resets the grid's selection state. In a real application, you would either manage the grid's
          selection state externally or use more sophisticated state management patterns to preserve UI state across
          re-renders.
        </p>
      </div>
    `;
  }

  toggleTest1(): void {
    this.test1 = !this.test1;
  }

  toggleTest2(): void {
    this.test2 = !this.test2;
  }

  private _renderGridSection() {
    return html`
      <div style="margin: 16px 0;">
        <h4>Grid with Reactive State:</h4>
        <p>The buttons below respond to the state changes above:</p>
        <sl-grid .items=${this.students} @sl-grid-selection-change=${this.#onSelectionChange}>
          <sl-grid-selection-column ?select-all=${this.selectAll}></sl-grid-selection-column>
          <sl-grid-column
            header="Student"
            path="fullName"
            .renderer=${avatarRenderer}
            .scopedElements=${{ 'sl-avatar': Avatar }}
          ></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <!-- These get slotted into the floating tool-bar -->

          <sl-button ?disabled=${this.test1} fill="outline" slot="bulk-actions" variant="inverted">
            <sl-icon name="far-copy"></sl-icon>
            test1 disabled: ${this.test1})
          </sl-button>
          <sl-button ?disabled=${this.test2} fill="outline" slot="bulk-actions" variant="inverted">
            <sl-icon name="far-copy"></sl-icon>
            test2 disabled: ${this.test2})
          </sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">
            <sl-icon name="far-trash"></sl-icon>
            Delete
          </sl-button>
          <sl-button disabled fill="outline" slot="bulk-actions" variant="inverted">
            <sl-icon name="far-right-to-line"></sl-icon>
            Action 1
          </sl-button>
          <sl-button
            ${tooltip('I am a tooltip')}
            aria-disabled="true"
            fill="outline"
            slot="bulk-actions"
            variant="inverted"
          >
            <sl-icon name="far-right-to-line"></sl-icon>
            Action 2
          </sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">
            <sl-icon name="far-right-to-line"></sl-icon>
            Action 3
          </sl-button>
        </sl-grid>
      </div>
    `;
  }

  #onSelectionChange({ detail: { grid } }: SlSelectionChangeEvent<Student>): void {
    const selected = grid.dataSource?.items.filter(item => item.selected);
    console.log('SlSelectionChangeEvent - selected items:', selected?.length || 0);
    console.log('Current state - test1:', this.test1, 'test2:', this.test2);
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('test1') || changedProperties.has('test2') || changedProperties.has('selectAll')) {
      console.log('State changed:', {
        test1: this.test1,
        test2: this.test2,
        selectAll: this.selectAll
      });
    }
  }

  private _toggleTest1() {
    this.test1 = !this.test1;
  }

  private _toggleTest2() {
    this.test2 = !this.test2;
  }

  private _toggleSelectAll() {
    this.selectAll = !this.selectAll;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'reactive-demo': ReactiveDemo;
  }
}
