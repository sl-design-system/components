import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type StudentSearchModel, type StudentSearchValue } from '../types.js';
import styles from './group-details-add-student-panel.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-b-sesame-group-details-dismiss-panel': SlBSesameGroupDetailsDismissPanelEvent;
    'sl-b-sesame-group-details-search-students': SlBSesameGroupDetailsSearchStudentsEvent;
  }
}

/** Emitted when the search is submitted. The detail is the whole form value. */
export type SlBSesameGroupDetailsSearchStudentsEvent = CustomEvent<StudentSearchValue>;

/** Emitted when the panel's close control is activated. */
export type SlBSesameGroupDetailsDismissPanelEvent = CustomEvent<void>;

/**
 * Structural, not data: the grade-level options are the school's fixed set, so they live here
 * rather than on the model.
 *
 * The real option list was never captured — Figma holds it in two entirely hidden 15-option
 * dropdown panels (`2142:48202`, `2142:48348`) whose labels are placeholders. Only "Please select"
 * and "3" are visible anywhere in the design. Grades 1-9 are invented to fill the set; see the
 * run's OQ-12.
 */
const GRADE_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/**
 * The dismissible "Add student to group" panel: a four-field search across the school's existing
 * student records, and the result region below it.
 *
 * This component owns its form state. The four controls and the single `<sl-form>` live in the
 * same component, driven by one `FormController`; the page pushes the whole value in through
 * `model` and never binds a field's `.value` individually.
 *
 * Every glyph here (`search`, `xmark`) is present in the theme's registry — this component has no
 * icon omissions.
 *
 * @fires sl-b-sesame-group-details-search-students - Emitted with the whole search value.
 * @fires sl-b-sesame-group-details-dismiss-panel - Emitted when the panel is dismissed.
 */
export class GroupDetailsAddStudentPanel extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-select': Select,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Owns the four search controls as one value. */
  #form = new FormController<StudentSearchValue>(this);

  /** The current search value and how many records matched it. */
  @property({ attribute: false }) model?: StudentSearchModel;

  /** @internal Emits the whole search value when the search is submitted. */
  @event({ name: 'sl-b-sesame-group-details-search-students' })
  searchStudentsEvent!: EventEmitter<SlBSesameGroupDetailsSearchStudentsEvent>;

  /** @internal Emits when the panel is dismissed. */
  @event({ name: 'sl-b-sesame-group-details-dismiss-panel' })
  dismissPanelEvent!: EventEmitter<SlBSesameGroupDetailsDismissPanelEvent>;

  override updated(changes: Map<string, unknown>): void {
    super.updated(changes);

    // The whole value is pushed in at once — never per field. Binding `.value` on each control
    // makes the controller and the template two sources of truth for the same state.
    if (changes.has('model') && this.model) {
      this.#form.value = { ...this.model.value };
    }
  }

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html`${nothing}`;
    }

    return html`
      <section aria-label="Add student to group">
        <header>
          <h2>ADD STUDENT TO GROUP</h2>
          <sl-button
            aria-label="Close add student panel"
            fill="link"
            size="sm"
            @click=${this.#onDismissClick}
          >
            <sl-icon name="xmark" size="md"></sl-icon>
          </sl-button>
        </header>

        <h3>Search for a student</h3>
        <p class="intro">Start by searching school records to add an existing student.</p>

        <sl-form @sl-submit=${this.#onSubmit}>
          <div class="controls">
            <sl-form-field label="First name">
              <sl-text-field name="firstName" placeholder="Type here"></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Last name">
              <sl-text-field name="lastName" placeholder="Type here"></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Email (optional)">
              <sl-text-field name="email" placeholder="Type here" type="email"></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Grade level">
              <sl-select name="gradeLevel" placeholder="Please select">
                ${GRADE_LEVELS.map(
                  grade => html`<sl-option .value=${grade}>${grade}</sl-option>`
                )}
              </sl-select>
            </sl-form-field>
          </div>
        </sl-form>

        ${model.resultCount === 0
          ? html`
              <div class="no-results">
                <p class="no-results-heading">
                  <sl-icon name="search" size="md"></sl-icon>
                  No matching results
                </p>
                <p class="no-results-body">
                  Can't find the student? Please, add a new student by clicking Create new student
                  below.
                </p>
              </div>
            `
          : nothing}
      </section>
    `;
  }

  #onSubmit(): void {
    this.searchStudentsEvent.emit(this.#form.value as StudentSearchValue);
  }

  #onDismissClick(): void {
    this.dismissPanelEvent.emit();
  }
}
