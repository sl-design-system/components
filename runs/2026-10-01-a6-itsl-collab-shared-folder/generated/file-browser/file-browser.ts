import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuItem } from '@sl-design-system/menu';
import { SearchField } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './file-browser.css' with { type: 'css' };
import {
  A6FileTable,
  type FileRow,
  type FileSort,
  type SlA6FileSelectionChangeEvent,
  type SlA6FileSortChangeEvent
} from './file-table/file-table.js';
import { A6Paginator, formatItemRange } from './paginator/paginator.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a6-file-search': SlA6FileSearchEvent;
    'sl-a6-bulk-action': SlA6BulkActionEvent;
  }
}

/** The bulk operations the Actions menu offers. */
export type BulkAction = 'move' | 'download' | 'delete';

/** The data this component renders; owned/fetched by the page. `page` is 0-based. */
export interface FileBrowserModel {
  addHref: string;
  files: FileRow[];
  page: number;
  pageSize: number;
  sort?: FileSort;
  totalItems: number;
}

export type SlA6FileSearchEvent = CustomEvent<{ query: string }>;
export type SlA6BulkActionEvent = CustomEvent<{ action: BulkAction; fileIds: string[] }>;

/**
 * The Actions menu's items: order, label and which registered icon carries each. Structure, not
 * data.
 *
 * Every icon is `null`. Figma draws `arrow-turn-down-right`, `download` and `trash`; **none of
 * the three is among the 54 names this theme registers**, so each item keeps a 24px `aria-hidden`
 * box and no glyph, preserving the 8px gap and the label's x-offset. Figma's own Dropdown
 * annotation asks for a `{verb}` or `{verb}+{noun}` label, which these satisfy.
 */
const BULK_ACTIONS: ReadonlyArray<{ action: BulkAction; label: string; icon: string | null }> = [
  { action: 'move', label: 'Move to', icon: null },
  { action: 'download', label: 'Download', icon: null },
  { action: 'delete', label: 'Delete', icon: null }
];

/**
 * Figma `Content-block` `4411:11840`, 728 x 870 — the folder's file browser: a search field, the
 * Add and Actions controls with the Actions dropdown, the item-count and select-all row, the file
 * table and the paginator.
 *
 * The page owns the file data; this component owns only the **transient selection**, which is UI
 * state rather than anything fetched.
 *
 * The table's and paginator's events are deliberately **not** re-emitted here: the `@event`
 * decorator defaults to `{bubbles: true, composed: true}`, so they already reach the page, and
 * re-declaring their names would be a duplicate-identifier build break.
 *
 * ```html
 * <sl-a6-file-browser .model=${model} actions-menu-open></sl-a6-file-browser>
 * ```
 *
 * @fires sl-a6-file-search - Emitted with the query when the in-folder search is submitted.
 * @fires sl-a6-bulk-action - Emitted with the chosen action and the selected file ids.
 */
export class A6FileBrowser extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-a6-file-table': A6FileTable,
      'sl-a6-paginator': A6Paginator,
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon,
      'sl-menu': Menu,
      'sl-menu-item': MenuItem,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The folder's files and the current page. */
  @property({ attribute: false }) model?: FileBrowserModel;

  /**
   * Whether the Actions dropdown is shown open. The reference frame captures this page with the
   * menu open, so the page sets it; it defaults to closed.
   */
  @property({ type: Boolean, reflect: true, attribute: 'actions-menu-open' }) actionsMenuOpen =
    false;

  /** @internal The transient row selection. Not fetched data, so it is not on the model. */
  @state() private selectedIds: string[] = [];

  /** @internal The Actions trigger, used as the dropdown's anchor. */
  @query('.bulk') private bulkButton?: HTMLElement;

  /** @internal The Actions dropdown. */
  @query('.dropdown') private dropdown?: HTMLElement & { anchorElement?: HTMLElement };

  /** @internal Emits when the in-folder search is submitted. */
  @event({ name: 'sl-a6-file-search' })
  searchEvent!: EventEmitter<SlA6FileSearchEvent>;

  /** @internal Emits when a bulk action is chosen. */
  @event({ name: 'sl-a6-bulk-action' })
  bulkActionEvent!: EventEmitter<SlA6BulkActionEvent>;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    // `sl-menu` sets the native `popover` attribute on itself in `connectedCallback` and is
    // `display: none` until `:popover-open`, so simply rendering it leaves it invisible — which is
    // how the first Stage 4 capture came out, with the menu reported as collapsed. Showing it is
    // the same two steps `sl-menu-button` performs (`menu.anchorElement = button`, then show):
    // `anchorElement` is a plain declared property with no `@internal` tag, and `showPopover()` is
    // the platform API, so neither is a reach past the public surface.
    const menu = this.dropdown;

    if (!menu) {
      return;
    }

    if (this.actionsMenuOpen) {
      if (this.bulkButton) {
        menu.anchorElement = this.bulkButton;
      }

      if (!menu.matches(':popover-open')) {
        menu.showPopover();
      }
    } else if (menu.matches(':popover-open')) {
      menu.hidePopover();
    }
  }

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    const files = model.files,
      allSelected = files.length > 0 && this.selectedIds.length === files.length;

    return html`
      <!--
        The a11y annotation 4571:8212 marks this block as an H2 but the design draws no visible
        heading here, so the heading is visually hidden: the outline the annotation asks for,
        without inventing UI that is not in the reference.
      -->
      <h2 class="visually-hidden">Files</h2>

      <sl-search-field
        @sl-search=${this.#onSearch}
        aria-label="Search in folder"
        class="search"
        placeholder="Search in folder"></sl-search-field>

      <div class="actions">
        <!--
          Figma 'Standalone link' 4411:11845 — a LINK, not a button: its own annotation says a
          standalone link is for navigation only and must not trigger an action, and "Add" opens
          the add-element page. The trailing affordance is 'chevron-right', which IS registered.
        -->
        <a class="add" href=${model.addHref}>
          Add
          <sl-icon aria-hidden="true" name="chevron-right" size="xl"></sl-icon>
        </a>

        <div class="actions-menu">
          <sl-button
            @click=${this.#onActionsClick}
            ?disabled=${this.selectedIds.length === 0}
            aria-expanded=${this.actionsMenuOpen}
            aria-haspopup="menu"
            class="bulk">
            Actions
            <sl-icon aria-hidden="true" name="caret-down-solid" size="xl"></sl-icon>
          </sl-button>
          ${this.actionsMenuOpen
            ? html`
                <sl-menu class="dropdown" position="bottom-start">
                  ${BULK_ACTIONS.map(
                    item => html`
                      <sl-menu-item @click=${() => this.#onBulkAction(item.action)}>
                        <span aria-hidden="true" class="menu-icon">
                          ${item.icon ? html`<sl-icon name=${item.icon}></sl-icon>` : nothing}
                        </span>
                        ${item.label}
                      </sl-menu-item>
                    `
                  )}
                </sl-menu>
              `
            : nothing}
        </div>
      </div>

      <div class="listing">
        <div class="summary">
        <span class="count">
          ${formatItemRange(model.page, model.pageSize, model.totalItems)}
        </span>
        <div class="select-all">
          <sl-checkbox @sl-change=${this.#onSelectAll} .checked=${allSelected}>
            Select all visible
          </sl-checkbox>
          <span class="visible-count">(${files.length})</span>
          </div>
        </div>
        <sl-a6-file-table
        @sl-a6-file-selection-change=${this.#onSelectionChange}
        @sl-a6-file-sort-change=${this.#onSortChange}
          .model=${{ files, selectedIds: this.selectedIds, sort: model.sort }}></sl-a6-file-table>
      </div>

      <sl-a6-paginator
        .model=${{
          page: model.page,
          pageSize: model.pageSize,
          totalItems: model.totalItems
        }}></sl-a6-paginator>
    `;
  }

  #onSearch(event: Event & { detail?: string }): void {
    this.searchEvent.emit({ query: event.detail ?? '' });
  }

  #onActionsClick(): void {
    this.actionsMenuOpen = !this.actionsMenuOpen;
  }

  #onBulkAction(action: BulkAction): void {
    this.bulkActionEvent.emit({ action, fileIds: this.selectedIds });
    this.actionsMenuOpen = false;
  }

  #onSelectionChange(event: SlA6FileSelectionChangeEvent): void {
    this.selectedIds = event.detail.selectedIds;
  }

  #onSortChange(_event: SlA6FileSortChangeEvent): void {
    // The sort lives on the page's model; this component only lets the event bubble past. The
    // listener exists so the intent is explicit rather than looking like an omission.
  }

  #onSelectAll(event: Event & { detail?: boolean }): void {
    this.selectedIds = event.detail === true ? (this.model?.files ?? []).map(file => file.id) : [];
  }
}
