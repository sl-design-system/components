import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { InlineMessage } from '@sl-design-system/inline-message';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import {
  type AppHeaderModel,
  MyGroupsAppHeader,
  type SlMyGroupsNavSelectEvent
} from './app-header/my-groups-app-header.js';
import { MyGroupsAppFooter } from './app-footer/my-groups-app-footer.js';
import {
  type BulkSelectionModel,
  MyGroupsBulkActionBar,
  type SlMyGroupsBulkActionEvent
} from './bulk-action-bar/my-groups-bulk-action-bar.js';
import {
  type GroupFilterValue,
  MyGroupsFilterCard,
  type SlMyGroupsFilterSearchEvent
} from './filter-card/my-groups-filter-card.js';
import {
  type GroupRow,
  type GroupsTableModel,
  MyGroupsTable,
  type SlMyGroupsRowActionEvent,
  type SlMyGroupsSelectionChangeEvent
} from './groups-table/my-groups-table.js';
import styles from './my-groups-page.css' with { type: 'css' };
// `@fortawesome/*` is not installed in this checkout, so the framework skill's
// `Icon.register(faBoxArchive)` convention cannot be followed. The run ships its own
// approximations of `box-archive`, `download`, `upload`, `plus` and `triangle-exclamation`.
import { registerRunIcons } from './run-icons.js';

registerRunIcons();

declare global {
  interface HTMLElementTagNameMap {
    'sl-my-groups-page': MyGroupsPage;
  }
}

/**
 * Structural/presentation config: the four page-level actions, in design order. They never vary
 * with the data, so they live here rather than in any model.
 */
const PAGE_ACTIONS: ReadonlyArray<{ id: string; label: string; icon: string; fill: ButtonFill }> = [
  { id: 'archive-school-year', label: 'Archive a school year', icon: 'box-archive', fill: 'outline' },
  { id: 'download-groups', label: 'Download groups', icon: 'download', fill: 'outline' },
  { id: 'upload-groups', label: 'Upload groups', icon: 'upload', fill: 'outline' },
  { id: 'add-group', label: 'Add group', icon: 'plus', fill: 'solid' }
];

/** Structural config: the heading above the list. */
const SECTION_HEADING = 'ALL SCHOOL GROUPS';

/**
 * The DOM id of the visible inline error.
 *
 * It is **not** an `aria-describedby` target for the bulk action bar. An earlier version assumed
 * it could be: the bar's host sits in this shadow root, but its disabled "Reactivate" button sits
 * inside the bar's *own* shadow root, and IDREFs do not cross shadow boundaries — the attribute
 * resolved to nothing. The bar now takes the description as text (`disabled-reason`) and renders
 * its own visually hidden copy with a local id, which is the only arrangement that resolves.
 */
const REACTIVATE_ERROR_ID = 'my-groups-reactivate-error';

/**
 * The error copy is reproduced verbatim from the design, including the "disselect" typo (OQ7) —
 * flagged for the designer rather than silently corrected.
 */
const REACTIVATE_ERROR_TEXT =
  'You cannot reactivate an active group. Please, disselect all active groups to be able to continue.';

/**
 * The page's rows.
 *
 * In a real app this would be `fetch('/api/schools/:schoolId/groups?page=1&pageSize=20')` — the
 * response shape is `GroupRow[]` plus a total. The array is a module constant so its **identity**
 * is stable across renders: `sl-my-groups-table` only rebuilds its data source (and so only
 * discards the user's sorting) when the `groups` array identity changes.
 *
 * `endDate` is blank on 19 of the 20 rows, exactly as in the design; the table's formatter renders
 * an empty string for `''`.
 */
const GROUPS: GroupRow[] = [
  { id: 'g-1', name: 'Class 1', href: '#', type: 'class', schoolYear: '22/23', studentCount: 1, endDate: '2023-03-15', status: 'active' },
  { id: 'g-2', name: 'Class 2', href: '#', type: 'class', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  { id: 'g-3', name: 'Class 3', href: '#', type: 'class', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  { id: 'g-4', name: 'Study group French B1', href: '#', type: 'study-group', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  { id: 'g-5', name: 'Study group French B2', href: '#', type: 'study-group', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  { id: 'g-6', name: 'Study group French B3', href: '#', type: 'study-group', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  { id: 'g-7', name: 'Study group English B1', href: '#', type: 'study-group', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  // Appendix B #4: the design repeats "Study group English B1" here. The duplicate is renamed and
  // the design's own "B2" moves down one row, so the list stays the design's list without the slip.
  { id: 'g-8', name: 'Study group English A1', href: '#', type: 'study-group', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  { id: 'g-9', name: 'Study group English B2', href: '#', type: 'study-group', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  { id: 'g-10', name: 'Study group English B3', href: '#', type: 'study-group', schoolYear: '22/23', studentCount: 1, endDate: '', status: 'active' },
  ...Array.from({ length: 10 }, (_, index): GroupRow => {
    const number = index + 4;

    return {
      id: `g-${index + 11}`,
      name: `Class ${number}`,
      href: '#',
      type: 'class',
      schoolYear: '22/23',
      studentCount: 1,
      endDate: '',
      status: 'active'
    };
  })
];

/** The total number of groups the school has; only the first page of 20 is loaded. */
const TOTAL_COUNT = 40;

/** The filter state the page starts in — in a real app, the query string or the user's defaults. */
const INITIAL_FILTERS: GroupFilterValue = {
  // Figma placeholder text (OQ6): the design's search field literally reads "Input Value".
  query: 'Input Value',
  groupStatus: 'active',
  groupType: 'any',
  schoolYear: 'any'
};

/** The filter state "Clear filters" returns the page to. */
const CLEARED_FILTERS: GroupFilterValue = {
  query: '',
  groupStatus: 'any',
  groupType: 'any',
  schoolYear: 'any'
};

/**
 * The "My Groups" administration page: the app shell (header + footer) around a group-management
 * list view — a page title with four page actions, a filter card, the result count, an inline
 * validation error, the selectable groups table, and a floating bulk-selection action bar.
 *
 * This is the root and the **sole data owner**: it holds the groups, the total, the selection and
 * the filter state (mocked here; see `GROUPS` for where the fetch would go) and hands each child
 * one cohesive model object. Selection flows one way down into the table and back up through its
 * event, so the bulk bar and the table can never disagree about what is selected.
 *
 * It renders the design with no configuration:
 *
 * ```html
 * <sl-my-groups-page></sl-my-groups-page>
 * ```
 */
export class MyGroupsPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-inline-message': InlineMessage,
      'sl-my-groups-app-footer': MyGroupsAppFooter,
      'sl-my-groups-app-header': MyGroupsAppHeader,
      'sl-my-groups-bulk-action-bar': MyGroupsBulkActionBar,
      'sl-my-groups-filter-card': MyGroupsFilterCard,
      'sl-my-groups-table': MyGroupsTable
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The rows. Held as a field rather than rebuilt per render so the array identity stays stable —
   * `sl-my-groups-table` keys its data source off it and would drop the user's sorting otherwise.
   */
  #groups: GroupRow[] = GROUPS;

  /** The total number of groups, of which `#groups` is the first page. */
  #totalCount = TOTAL_COUNT;

  /** @internal The signed-in user, the active school and the active nav destination. */
  @state() private header: AppHeaderModel = {
    activeNavId: 'groups',
    user: { name: 'Anna Magiera', initials: 'AM', role: 'Administrator' },
    school: { id: 'bogaerts', name: 'Bogaerts International School' }
  };

  /** @internal The filter state, owned here and pushed into the filter card. */
  @state() private filters: GroupFilterValue = INITIAL_FILTERS;

  /** @internal The ids of the selected groups. The page owns the selection, not the grid. */
  @state() private selectedIds: string[] = ['g-1', 'g-3', 'g-5'];

  /** The selected groups, resolved from the ids the page owns. */
  get #selectedGroups(): GroupRow[] {
    return this.#groups.filter(({ id }) => this.selectedIds.includes(id));
  }

  /**
   * The cached model objects handed to the table and the bulk bar.
   *
   * Lit compares `.model` by identity, so a fresh object literal in `render()` makes the child
   * re-update on *every* page render even when nothing about it changed — and an updating
   * `sl-my-groups-table` re-emits its selection event, which renders the page again. Caching each
   * model and rebuilding it only when its own inputs change means a no-op re-render hands the
   * child the identical object and the child does nothing.
   *
   * `header` and `filters` need no equivalent: they are already whole objects held in a field and
   * only replaced when they really change.
   */
  #tableModel?: GroupsTableModel;

  #bulkModel?: BulkSelectionModel;

  /** The table's model, rebuilt only when the rows or the selection actually change identity. */
  get #groupsTableModel(): GroupsTableModel {
    const cached = this.#tableModel;

    if (cached && cached.groups === this.#groups && cached.selectedIds === this.selectedIds) {
      return cached;
    }

    const model: GroupsTableModel = { groups: this.#groups, selectedIds: this.selectedIds };

    this.#tableModel = model;

    return model;
  }

  /** The bulk bar's model. Its fields are all scalars, so it is compared by value. */
  get #bulkSelectionModel(): BulkSelectionModel {
    const selectedCount = this.selectedIds.length,
      totalCount = this.#totalCount,
      canReactivate = this.#canReactivate,
      cached = this.#bulkModel;

    if (
      cached &&
      cached.selectedCount === selectedCount &&
      cached.totalCount === totalCount &&
      cached.canReactivate === canReactivate
    ) {
      return cached;
    }

    const model: BulkSelectionModel = { selectedCount, totalCount, canReactivate };

    this.#bulkModel = model;

    return model;
  }

  /**
   * Reactivating only makes sense for groups that are already archived, so a selection containing
   * an active group cannot be reactivated. The same predicate drives both the disabled
   * "Reactivate" button and the inline error, so the two can never contradict each other.
   */
  get #canReactivate(): boolean {
    const selected = this.#selectedGroups;

    return selected.length > 0 && selected.every(({ status }) => status !== 'active');
  }

  override render(): TemplateResult {
    const bulkModel = this.#bulkSelectionModel,
      showError = bulkModel.selectedCount > 0 && !bulkModel.canReactivate;

    return html`
      <sl-my-groups-app-header
        @sl-my-groups-nav-select=${this.#onNavSelect}
        @sl-my-groups-switch-school=${this.#onSwitchSchool}
        .model=${this.header}></sl-my-groups-app-header>

      <!--
        A neutral wrapper on purpose: the "main" landmark belongs to the application that embeds
        this page, so neither the main element nor role="main" is used here.
      -->
      <div class="page">
        <div class="title-row">
          <h1>Groups</h1>
          <div class="page-actions">
            ${PAGE_ACTIONS.map(
              ({ fill, icon, id, label }) => html`
                <sl-button
                  @click=${() => this.#onPageAction(id)}
                  fill=${fill}
                  shape="pill"
                  variant="primary">
                  <sl-icon name=${icon}></sl-icon>
                  ${label}
                </sl-button>
              `
            )}
          </div>
        </div>

        <h2>${SECTION_HEADING}</h2>

        <sl-my-groups-filter-card
          @sl-my-groups-filter-clear=${this.#onFilterClear}
          @sl-my-groups-filter-search=${this.#onFilterSearch}
          .value=${this.filters}></sl-my-groups-filter-card>

        <p aria-live="polite" class="count">${this.#totalCount} Groups</p>

        ${showError
          ? html`
              <sl-inline-message
                class="error"
                id=${REACTIVATE_ERROR_ID}
                indismissible
                role="alert"
                size="sm"
                variant="danger">
                <sl-icon name="triangle-exclamation" slot="icon"></sl-icon>
                ${REACTIVATE_ERROR_TEXT}
              </sl-inline-message>
            `
          : nothing}

        <div class="table-area">
          <sl-my-groups-table
            @sl-my-groups-row-action=${this.#onRowAction}
            @sl-my-groups-selection-change=${this.#onSelectionChange}
            .model=${this.#groupsTableModel}>
          </sl-my-groups-table>

          <sl-my-groups-bulk-action-bar
            @sl-my-groups-bulk-action=${this.#onBulkAction}
            @sl-my-groups-bulk-dismiss=${this.#onBulkDismiss}
            disabled-reason=${REACTIVATE_ERROR_TEXT}
            .model=${bulkModel}></sl-my-groups-bulk-action-bar>
        </div>
      </div>

      <sl-my-groups-app-footer
        @sl-my-groups-language-select=${this.#onLanguageSelect}
        language="en"></sl-my-groups-app-footer>
    `;
  }

  #onNavSelect({ detail: { navId } }: SlMyGroupsNavSelectEvent): void {
    // In a real app the router would navigate; here the page just moves the active marker.
    this.header = { ...this.header, activeNavId: navId };
  }

  #onSwitchSchool(): void {
    // In a real app this would open the school picker.
  }

  #onPageAction(_id: string): void {
    // In a real app each page action would open its own flow (archive wizard, import dialog, …).
  }

  #onFilterSearch({ detail }: SlMyGroupsFilterSearchEvent): void {
    // In a real app this would re-issue the groups request with the new filter as query params.
    this.filters = detail;
  }

  #onFilterClear(): void {
    this.filters = CLEARED_FILTERS;
  }

  /**
   * The table emits a freshly mapped array, so assigning it unconditionally would change the
   * selection's identity on every echo of the page's own state and render forever. Mirrors the
   * table's own `#applySelection` guard: compare members, not identity.
   */
  #onSelectionChange({ detail: { selectedIds } }: SlMyGroupsSelectionChangeEvent): void {
    const current = this.selectedIds;

    if (selectedIds.length === current.length && selectedIds.every(id => current.includes(id))) {
      return;
    }

    this.selectedIds = selectedIds;
  }

  #onRowAction(_event: SlMyGroupsRowActionEvent): void {
    // In a real app each row action would confirm and then PATCH/DELETE the group.
  }

  #onBulkAction(_event: SlMyGroupsBulkActionEvent): void {
    // In a real app this would confirm and then apply the operation to every selected group.
  }

  #onBulkDismiss(): void {
    this.selectedIds = [];
  }

  #onLanguageSelect(): void {
    // In a real app this would open the language picker.
  }
}

// The page is this run's top-level element, so — unlike its scoped children, which never call
// `customElements.define` — it registers itself globally, guarded so a re-import cannot throw.
if (!customElements.get('sl-my-groups-page')) {
  customElements.define('sl-my-groups-page', MyGroupsPage);
}
