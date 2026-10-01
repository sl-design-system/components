import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Accordion, AccordionItem } from '@sl-design-system/accordion';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { Option } from '@sl-design-system/listbox';
import { Radio, RadioGroup } from '@sl-design-system/radio-group';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type CreateStudentModel, type StudentDraft } from '../types.js';
import styles from './group-details-create-student-form.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-b-sesame-group-details-cancel-create': SlBSesameGroupDetailsCancelCreateEvent;
    'sl-b-sesame-group-details-create-student': SlBSesameGroupDetailsCreateStudentEvent;
    'sl-b-sesame-group-details-regenerate-username': SlBSesameGroupDetailsRegenerateUsernameEvent;
  }
}

/** Emitted when the form is submitted, with the draft and whether to stay open for another. */
export type SlBSesameGroupDetailsCreateStudentEvent = CustomEvent<{
  createAnother: boolean;
  draft: StudentDraft;
}>;

/** Emitted when the form is cancelled. */
export type SlBSesameGroupDetailsCancelCreateEvent = CustomEvent<void>;

/** Emitted when a fresh username is requested. */
export type SlBSesameGroupDetailsRegenerateUsernameEvent = CustomEvent<void>;

/** Structural, not data — see the sibling panel for why these are invented (OQ-12). */
const GRADE_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/**
 * The "Can't find the student?" form: creates a brand-new student record and adds it to the group.
 *
 * One `<sl-form>` and one `FormController` own every control here, including the action row —
 * the conventions forbid a parent wrapping a child's controls in a form of its own.
 *
 * Two deliberate departures from the Figma geometry, both recorded:
 *  - "Regenerate" is re-parented next to the Username field it belongs to. Figma absolutely
 *    positions it at `left: 336px; top: 621px` as a sibling of the whole form (Inconsistency 16).
 *  - The Grade-level select renders at 16/24 like every other control on the page; the design
 *    gives this one select 14/20 and every other input 16/24 (Inconsistency 11, OQ-5).
 *
 * The accordion toggle glyph `plus` is present in the theme's registry — no icon omissions here.
 *
 * @fires sl-b-sesame-group-details-create-student - Emitted with the draft and the "create another" flag.
 * @fires sl-b-sesame-group-details-cancel-create - Emitted when the form is cancelled.
 * @fires sl-b-sesame-group-details-regenerate-username - Emitted when a new username is requested.
 */
export class GroupDetailsCreateStudentForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-accordion': Accordion,
      'sl-accordion-item': AccordionItem,
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-option': Option,
      'sl-radio': Radio,
      'sl-radio-group': RadioGroup,
      'sl-select': Select,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Owns every control in this component as one value. */
  #form = new FormController<StudentDraft & { createAnother: boolean }>(this);

  /** The draft student and whether the form stays open after submitting. */
  @property({ attribute: false }) model?: CreateStudentModel;

  /** @internal Emits the draft when the form is submitted. */
  @event({ name: 'sl-b-sesame-group-details-create-student' })
  createStudentEvent!: EventEmitter<SlBSesameGroupDetailsCreateStudentEvent>;

  /** @internal Emits when the form is cancelled. */
  @event({ name: 'sl-b-sesame-group-details-cancel-create' })
  cancelCreateEvent!: EventEmitter<SlBSesameGroupDetailsCancelCreateEvent>;

  /** @internal Emits when a fresh username is requested. */
  @event({ name: 'sl-b-sesame-group-details-regenerate-username' })
  regenerateUsernameEvent!: EventEmitter<SlBSesameGroupDetailsRegenerateUsernameEvent>;

  override updated(changes: Map<string, unknown>): void {
    super.updated(changes);

    if (changes.has('model') && this.model) {
      this.#form.value = { ...this.model.draft, createAnother: this.model.createAnother };
    }
  }

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html`${nothing}`;
    }

    return html`
      <section aria-label="Create a new student">
        <h3>Can't find the student?</h3>
        <p class="intro">
          If you can't find the student in the search suggestions or you add the student to school
          records for the first time, hit Create new student button.
        </p>

        <sl-form @sl-submit=${this.#onSubmit}>
          <div class="fields">
            <sl-form-field label="First name">
              <sl-text-field name="firstName" placeholder="Type here"></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Last name">
              <sl-text-field name="lastName" placeholder="Type here"></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Grade level">
              <sl-select name="gradeLevel" placeholder="Please select">
                ${GRADE_LEVELS.map(
                  grade => html`<sl-option .value=${grade}>${grade}</sl-option>`
                )}
              </sl-select>
            </sl-form-field>

            <sl-form-field label="Login type">
              <sl-radio-group name="loginType">
                <sl-radio value="easy"
                  >Easy login (simple username, password and QR code)</sl-radio
                >
                <sl-radio value="regular">Regular</sl-radio>
              </sl-radio-group>
            </sl-form-field>

            <sl-accordion single>
              <sl-accordion-item>
                <span slot="summary">Login types explained</span>
                <p class="accordion-body">
                  Easy login gives younger students a short username, a simple password and a QR
                  code to scan. Regular login uses an email address and a password the student
                  manages themselves.
                </p>
              </sl-accordion-item>
            </sl-accordion>

            <!-- "Regenerate" re-parented here, beside the field it acts on. -->
            <sl-form-field label="Email (optional)">
              <sl-text-field name="email" placeholder="Type here" type="email"></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Username">
              <sl-text-field name="username" placeholder="Type here"></sl-text-field>
            </sl-form-field>

            <sl-button
              class="regenerate"
              fill="link"
              size="md"
              @click=${this.#onRegenerateClick}
            >
              Regenerate
            </sl-button>
          </div>

          <div class="actions">
            <sl-button fill="solid" shape="rect" size="md" variant="primary" @click=${this.#onSubmit}>
              Create new student
            </sl-button>
            <sl-button fill="link" size="md" @click=${this.#onCancelClick}>Cancel</sl-button>
          </div>

          <!--
            The design places the "Create another" checkbox BELOW the two buttons rather than
            above them (Inconsistency 15). Reproduced as drawn, because Stage 4's ground truth is
            the frame, and the ordering is legible rather than broken.
          -->
          <sl-checkbox name="createAnother">Create another</sl-checkbox>
        </sl-form>
      </section>
    `;
  }

  #onSubmit(): void {
    // `createAnother ?? false`, not a destructuring default: an unchecked sl-checkbox reports
    // `null`, and a destructuring default only fires on `undefined`. Measured in the Stage 6
    // interaction pass, which saw `createAnother: null` on an event typed `boolean` — a defect no
    // still-image comparison can see.
    const { createAnother, ...draft } = (this.#form.value ?? {}) as StudentDraft & {
      createAnother: boolean | null;
    };

    this.createStudentEvent.emit({ createAnother: createAnother ?? false, draft });
  }

  #onCancelClick(): void {
    this.cancelCreateEvent.emit();
  }

  #onRegenerateClick(): void {
    this.regenerateUsernameEvent.emit();
  }
}
