import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { ArrayListDataSource, isListDataSourceDataItem } from '@sl-design-system/data-source';
import {
  Grid,
  GridColumn,
  GridSelectionColumn,
  GridSortColumn,
  type SlSelectionChangeEvent
} from '@sl-design-system/grid';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { type EventEmitter, event } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property } from 'lit/decorators.js';
// `@fortawesome/*` is not installed in this checkout, so the framework skill's
// `Icon.register(faEllipsis)` convention is unusable here. `../run-icons.js` registers inline
// approximations of `ellipsis`, `eye`, `trash`, `box-archive` and `boxes-packing` instead.
import { registerRunIcons } from '../run-icons.js';
import styles from './my-groups-table.css' with { type: 'css' };

registerRunIcons();

declare global {
  interface HTMLElementTagNameMap {
    'sl-my-groups-table': MyGroupsTable;
  }

  interface GlobalEventHandlersEventMap {
    'sl-my-groups-selection-change': SlMyGroupsSelectionChangeEvent;
    'sl-my-groups-row-action': SlMyGroupsRowActionEvent;
  }
}

/** The kind of group a row represents. */
export type GroupType = 'class' | 'study-group';

/** Whether a group is currently active or has been archived. */
export type GroupStatus = 'active' | 'archived';

/** One of the four actions in a row's overflow menu. */
export type GroupRowAction = 'view-details' | 'delete' | 'archive' | 'reactivate';

/** A single group, as shown in one row of the table. */
export interface GroupRow {
  id: string;
  name: string;
  href: string;
  type: GroupType;
  schoolYear: string;
  studentCount: number;
  endDate: string; // ISO YYYY-MM-DD
  status: GroupStatus;
}

/** The data this table renders: the page's rows plus the selection the page owns. */
export interface GroupsTableModel {
  groups: GroupRow[];
  selectedIds: string[];
}

export type SlMyGroupsSelectionChangeEvent = CustomEvent<{ selectedIds: string[] }>;
export type SlMyGroupsRowActionEvent = CustomEvent<{
  action: GroupRowAction;
  groupId: string;
}>;

/** Structural config: one entry of the per-row overflow menu. */
interface RowMenuItemConfig {
  action: GroupRowAction;
  label: string;
  icon: string;
}

/**
 * Structural/presentation config owned by this component, not model input — the four overflow
 * actions are the same for every row and never come from the data source.
 */
const ROW_MENU_ITEMS: RowMenuItemConfig[] = [
  { action: 'view-details', label: 'View details', icon: 'eye' },
  { action: 'delete', label: 'Delete group', icon: 'trash' },
  { action: 'archive', label: 'Archive group', icon: 'box-archive' },
  { action: 'reactivate', label: 'Reactivate group', icon: 'boxes-packing' }
];

/** Structural config: how a `GroupType` key is written in the Type column. */
const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  class: 'class',
  'study-group': 'study group'
};

/**
 * Inline style for the name link.
 *
 * Cell content produced by an `sl-grid` column renderer is rendered into the GRID's shadow root,
 * which this component's stylesheet cannot reach: `::part()` selects the `<td>` and nothing
 * below it, and the `<a>`'s UA `color` beats any inherited color set on the cell. Custom
 * properties do inherit across shadow boundaries, so the tokens still resolve here. See the
 * implementation report — this is a gap in `sl-grid`, not a token shortcut.
 */
const NAME_LINK_STYLE = [
  'color: var(--sl-color-foreground-primary-bold)',
  'font-weight: var(--sl-fontWeight-600)',
  'text-decoration: underline'
].join('; ');

/** Formats an ISO `YYYY-MM-DD` end date as `DD/MM/YYYY`; passes anything else through. */
const formatEndDate = (value: string | undefined): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');

  return match ? `${match[3]}/${match[2]}/${match[1]}` : (value ?? '');
};

/**
 * The "All school groups" data table: a selectable, sortable list of the school's groups with a
 * per-row overflow menu. Presentational — the page owns the rows and the selection, passes both
 * in as `model`, and reacts to the emitted selection/row-action events.
 *
 * ```html
 * <sl-my-groups-table .model=${{ groups, selectedIds: ['g-1'] }}></sl-my-groups-table>
 * ```
 *
 * @fires sl-my-groups-selection-change - Emitted with the new set of selected group ids whenever
 *   the user changes the selection in the grid. Selection state stays owned by the page: it flows
 *   one way down through `model.selectedIds` and back up through this event.
 * @fires sl-my-groups-row-action - Emitted when an action in a row's overflow menu is chosen.
 */
export class MyGroupsTable extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-grid': Grid,
      'sl-grid-column': GridColumn,
      'sl-grid-selection-column': GridSelectionColumn,
      'sl-grid-sort-column': GridSortColumn
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The elements the Action column's renderer produces. The grid renders column cells in its own
   * shadow root, so custom elements used in a renderer must be registered on the column, not on
   * this component.
   */
  #actionScopedElements: Record<string, typeof HTMLElement> = {
    'sl-icon': Icon,
    'sl-menu-button': MenuButton,
    'sl-menu-item': MenuItem
  };

  /** The data source backing the grid; rebuilt whenever the page hands us a new row array. */
  #dataSource?: ArrayListDataSource<GroupRow>;

  /** The row array the current data source was built from. */
  #groups?: GroupRow[];

  /** @internal Emits when the user changes which groups are selected. */
  @event({ name: 'sl-my-groups-selection-change' })
  selectionChangeEvent!: EventEmitter<SlMyGroupsSelectionChangeEvent>;

  /** @internal Emits when an action is chosen from a row's overflow menu. */
  @event({ name: 'sl-my-groups-row-action' })
  rowActionEvent!: EventEmitter<SlMyGroupsRowActionEvent>;

  /** The groups to list and the ids of the ones that are selected. */
  @property({ attribute: false }) model?: GroupsTableModel;

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('model')) {
      const groups = this.model?.groups ?? [];

      if (!this.#dataSource || groups !== this.#groups) {
        this.#groups = groups;
        this.#dataSource = new ArrayListDataSource(groups, {
          getId: ({ id }) => id,
          selects: 'multiple'
        });

        this.#applySelection(false);
      } else {
        this.#applySelection(true);
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-grid
        @sl-grid-selection-change=${this.#onGridSelectionChange}
        .dataSource=${this.#dataSource}>
        <!--
          Every column has an explicit width; auto-sizing ran the Name column 80px too wide and
          squeezed "School year" into two lines. The widths are the design's own column rhythm
          (measured from where each label starts) and add up to exactly the 1024px content column,
          so no column grows or scrolls: 47 + 326 + 141 + 137 + 128 + 150 + 95.
        -->
        <sl-grid-selection-column width="47"></sl-grid-selection-column>
        <sl-grid-sort-column
          grow="1"
          header="Name"
          path="name"
          width="326"
          .renderer=${this.#renderName}></sl-grid-sort-column>
        <sl-grid-sort-column
          grow="0"
          header="Type"
          path="type"
          width="141"
          .renderer=${this.#renderType}></sl-grid-sort-column>
        <sl-grid-sort-column
          grow="0"
          header="School year"
          path="schoolYear"
          width="137"></sl-grid-sort-column>
        <sl-grid-column
          grow="0"
          header="# Students"
          path="studentCount"
          width="128"></sl-grid-column>
        <sl-grid-column
          grow="0"
          header="End date"
          path="endDate"
          width="150"
          .renderer=${this.#renderEndDate}></sl-grid-column>
        <sl-grid-column
          grow="0"
          header="Action"
          parts="action"
          width="95"
          .renderer=${this.#renderAction}
          .scopedElements=${this.#actionScopedElements}></sl-grid-column>
      </sl-grid>
    `;
  }

  /** The group name as a real link, so it is reachable by keyboard and by assistive tech. */
  #renderName = ({ href, name }: GroupRow): TemplateResult => {
    return html`<a href=${href} style=${NAME_LINK_STYLE}>${name}</a>`;
  };

  #renderType = ({ type }: GroupRow): string => GROUP_TYPE_LABELS[type];

  #renderEndDate = ({ endDate }: GroupRow): string => formatEndDate(endDate);

  #renderAction = (group: GroupRow): TemplateResult => {
    return html`
      <sl-menu-button aria-label=${`Actions for ${group.name}`} fill="ghost">
        <sl-icon name="ellipsis" slot="button"></sl-icon>
        ${ROW_MENU_ITEMS.map(
          ({ action, icon, label }) => html`
            <sl-menu-item @sl-select=${() => this.#onRowAction(action, group.id)}>
              <sl-icon name=${icon}></sl-icon>
              ${label}
            </sl-menu-item>
          `
        )}
      </sl-menu-button>
    `;
  };

  /**
   * Mirrors `model.selectedIds` into the grid's data source.
   *
   * The selection is applied with `update = false` on every call so the data source does not
   * dispatch `sl-selection-change` — that would make the grid re-emit `sl-grid-selection-change`
   * and echo the page's own state straight back at it. A single `update()` afterwards re-renders
   * the grid. `guard` skips the whole thing when the incoming ids already match, which is the
   * normal case when the page re-renders after our own event.
   */
  #applySelection(guard: boolean): void {
    const dataSource = this.#dataSource;

    if (!dataSource) {
      return;
    }

    const selectedIds = this.model?.selectedIds ?? [],
      current = dataSource.selection;

    if (guard && current.size === selectedIds.length && selectedIds.every(id => current.has(id))) {
      return;
    }

    dataSource.deselectAll(false);
    dataSource.items.forEach(item => {
      if (isListDataSourceDataItem(item) && selectedIds.includes(item.id as string)) {
        dataSource.select(item, false);
      }
    });
    dataSource.update();
  }

  #onGridSelectionChange({ detail: { grid } }: SlSelectionChangeEvent<GroupRow>): void {
    const dataSource = grid.dataSource;

    if (!dataSource) {
      return;
    }

    const selectedIds = dataSource.items
      .filter(item => isListDataSourceDataItem<GroupRow>(item) && dataSource.isSelected(item))
      .map(item => item.id as string);

    this.selectionChangeEvent.emit({ selectedIds });
  }

  #onRowAction(action: GroupRowAction, groupId: string): void {
    this.rowActionEvent.emit({ action, groupId });
  }
}
