import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Tab, TabGroup, TabPanel } from '@sl-design-system/tabs';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { GroupDetailsAddStudentPanel } from './add-student-panel/group-details-add-student-panel.js';
import { GroupDetailsAppFooter } from './app-footer/group-details-app-footer.js';
import { GroupDetailsAppHeader } from './app-header/group-details-app-header.js';
import { GroupDetailsCreateStudentForm } from './create-student-form/group-details-create-student-form.js';
import { GroupDetailsEmptyState } from './empty-state/group-details-empty-state.js';
import { GroupDetailsSummary } from './summary/group-details-summary.js';
import styles from './group-details-page.css' with { type: 'css' };
import {
  type AppFooterModel,
  type AppHeaderModel,
  type CreateStudentModel,
  type GroupDetailFieldId,
  type GroupSummaryModel,
  type StudentSearchModel,
  type StudentSearchValue,
  type StudentDraft,
  type NavId,
  type TabId
} from './types.js';

/**
 * Structural, not data: the three tabs are the same for every group. Only the Students tab has
 * content in the design — the Teachers and licenses panels were never drawn (manifest gap 3), so
 * they render empty rather than inventing content for them.
 */
const TABS: ReadonlyArray<{ count?: number; id: TabId; label: string }> = [
  { id: 'students', label: 'Students', count: 10 },
  { id: 'teachers', label: 'Teachers', count: 1 },
  { id: 'licenses', label: 'Manage student licenses' }
];

/**
 * The "Group details" page (Figma `2142:48093`, MySesame Redesign, 1280 x 2392).
 *
 * The sole data owner for this run: it holds the mock record, passes each child the slice it
 * renders, and handles every event the children emit. The story renders it with no arguments.
 *
 * **Three mutually exclusive states are drawn simultaneously in the Figma frame** — the
 * add-student search panel, the create-student form and the "no students yet" empty state — while
 * the Students tab badge says 10 (Inconsistency 7). The default story reproduces the frame as
 * drawn, because that frame is Stage 4's ground truth. Stage 5 adds the realistic exclusive
 * variants.
 *
 * Note on re-render cost: every model below is built **once** in a field initialiser and mutated
 * in place by the handlers. Constructing a model object inside `render` is what made the sibling
 * run A4 re-render its root 301 times per click.
 */
export class GroupDetailsPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-b-sesame-group-details-add-student-panel': GroupDetailsAddStudentPanel,
      'sl-b-sesame-group-details-app-footer': GroupDetailsAppFooter,
      'sl-b-sesame-group-details-app-header': GroupDetailsAppHeader,
      'sl-b-sesame-group-details-create-student-form': GroupDetailsCreateStudentForm,
      'sl-b-sesame-group-details-empty-state': GroupDetailsEmptyState,
      'sl-b-sesame-group-details-summary': GroupDetailsSummary,
      'sl-badge': Badge,
      'sl-tab': Tab,
      'sl-tab-group': TabGroup,
      'sl-tab-panel': TabPanel
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // A real app would fetch these. Built once, mutated in place — never rebuilt in `render`.
  /** @internal */ #header: AppHeaderModel = {
    brandName: 'MittSanoma',
    activeNavId: 'groups',
    // The design renders "EM" for "Anna Magiera". Carried verbatim rather than derived, so the
    // visual diff matches; flagged for the designer (Inconsistency 3, OQ-4).
    user: { name: 'Anna Magiera', initials: 'EM', role: 'Teacher' },
    school: { id: 'bogaerts', name: 'Bogaerts International School' }
  };

  /** @internal */ #summary: GroupSummaryModel = {
    groupId: 'french-1d',
    fields: [
      // The Figma layer is named `4B` but renders "French 1D"; the rendered text is authoritative.
      { id: 'name', label: 'Group name', value: 'French 1D' },
      { id: 'schoolYear', label: 'School year', value: '22/23' },
      { id: 'type', label: 'Group type', value: 'Study group' }
    ],
    linkingCode: 'AB3FRR',
    canArchive: true
  };

  /** @internal */ #search: StudentSearchModel = {
    value: { firstName: '', lastName: 'Woźniak', email: '', gradeLevel: '' },
    resultCount: 0
  };

  /** @internal */ #create: CreateStudentModel = {
    draft: {
      firstName: 'Karol',
      lastName: 'Woźniak',
      gradeLevel: '3',
      loginType: 'easy',
      email: '',
      username: 'karol123'
    },
    createAnother: false
  };

  /** @internal */ #footer: AppFooterModel = { organisationName: 'Sanoma' };

  /**
   * Which of the three student-tab states to show.
   *
   * Unset — the default, and what Stage 4 measures — renders **all three at once**, because that
   * is what the Figma frame draws (Inconsistency 7). The three single-state values exist for the
   * stories that exercise the realistic, mutually exclusive behaviour.
   */
  @property({ reflect: true, attribute: 'data-only' }) only?: 'create' | 'empty' | 'search';

  override render(): TemplateResult {
    return html`
      <div class="page">
        <sl-b-sesame-group-details-app-header
          .model=${this.#header}
          @sl-b-sesame-group-details-nav-select=${this.#onNavSelect}
          @sl-b-sesame-group-details-profile-select=${this.#onProfileSelect}
          @sl-b-sesame-group-details-switch-school=${this.#onSwitchSchool}
        ></sl-b-sesame-group-details-app-header>

        <div class="content">
          <sl-b-sesame-group-details-summary
            .model=${this.#summary}
            @sl-b-sesame-group-details-archive-group=${this.#onArchiveGroup}
            @sl-b-sesame-group-details-back=${this.#onBack}
            @sl-b-sesame-group-details-edit-field=${this.#onEditField}
          ></sl-b-sesame-group-details-summary>

          <sl-tab-group>
            ${TABS.map(
              tab => html`
                <sl-tab ?selected=${tab.id === 'students'}>
                  ${tab.label}
                  ${tab.count === undefined
                    ? ''
                    : html`<sl-badge color="yellow" emphasis="bold" slot="badge" size="sm"
                        >${tab.count}</sl-badge
                      >`}
                </sl-tab>
              `
            )}

            <sl-tab-panel>
              <div class="panel">
                ${this.#shows('search')
                  ? html`<sl-b-sesame-group-details-add-student-panel
                  .model=${this.#search}
                  @sl-b-sesame-group-details-dismiss-panel=${this.#onDismissPanel}
                  @sl-b-sesame-group-details-search-students=${this.#onSearchStudents}
                    ></sl-b-sesame-group-details-add-student-panel>`
                  : nothing}
                ${this.#shows('create')
                  ? html`<sl-b-sesame-group-details-create-student-form
                  .model=${this.#create}
                  @sl-b-sesame-group-details-cancel-create=${this.#onCancelCreate}
                  @sl-b-sesame-group-details-create-student=${this.#onCreateStudent}
                  @sl-b-sesame-group-details-regenerate-username=${this.#onRegenerateUsername}
                    ></sl-b-sesame-group-details-create-student-form>`
                  : nothing}
                ${this.#shows('empty')
                  ? html`<sl-b-sesame-group-details-empty-state
                  @sl-b-sesame-group-details-add-first-student=${this.#onAddFirstStudent}
                    ></sl-b-sesame-group-details-empty-state>`
                  : nothing}
              </div>
            </sl-tab-panel>

            <!-- Never drawn in the design. Rendered empty rather than invented. -->
            <sl-tab-panel></sl-tab-panel>
            <sl-tab-panel></sl-tab-panel>
          </sl-tab-group>
        </div>

        <sl-b-sesame-group-details-app-footer
          .model=${this.#footer}
          @sl-b-sesame-group-details-legal-select=${this.#onLegalSelect}
        ></sl-b-sesame-group-details-app-footer>
      </div>
    `;
  }

  /** Unset shows everything the frame draws; a value narrows to that one state. */
  #shows(state: 'create' | 'empty' | 'search'): boolean {
    return this.only === undefined || this.only === state;
  }

  #onNavSelect(event: CustomEvent<{ navId: NavId }>): void {
    this.#header.activeNavId = event.detail.navId;
    this.requestUpdate();
  }

  #onSwitchSchool(): void {
    // A real app would open the school picker here.
  }

  #onProfileSelect(): void {
    // A real app would open the profile menu here.
  }

  #onBack(): void {
    // A real app would navigate back to the group list here.
  }

  #onEditField(event: CustomEvent<{ fieldId: GroupDetailFieldId }>): void {
    // A real app would open the editor for this field here.
    void event.detail.fieldId;
  }

  #onArchiveGroup(): void {
    this.#summary.canArchive = false;
    this.requestUpdate();
  }

  #onSearchStudents(event: CustomEvent<StudentSearchValue>): void {
    this.#search.value = event.detail;
    this.#search.resultCount = 0;
    this.requestUpdate();
  }

  #onDismissPanel(): void {
    this.#search.resultCount = -1;
    this.requestUpdate();
  }

  #onCreateStudent(
    event: CustomEvent<{ createAnother: boolean; draft: StudentDraft }>
  ): void {
    this.#create.draft = event.detail.draft;
    this.#create.createAnother = event.detail.createAnother;
    this.requestUpdate();
  }

  #onCancelCreate(): void {
    // A real app would close the create form here.
  }

  #onRegenerateUsername(): void {
    this.#create.draft = { ...this.#create.draft, username: `karol${Date.now() % 1000}` };
    this.requestUpdate();
  }

  #onAddFirstStudent(): void {
    // A real app would focus the search panel here.
  }

  #onLegalSelect(): void {
    // A real app would navigate to the legal page here.
  }
}

// The ONLY global registration in this run. The children are scoped elements and define nothing.
customElements.define('sl-b-sesame-group-details-page', GroupDetailsPage);
