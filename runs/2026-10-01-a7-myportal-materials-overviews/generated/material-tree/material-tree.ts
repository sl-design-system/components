import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Icon } from '@sl-design-system/icon';
import { SearchField } from '@sl-design-system/search-field';
import { EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { iconGap } from '../icon-gap.js';
import styles from './material-tree.css' with { type: 'css' };

/** Stable keys for the three section glyphs. None is in the theme registry; all render as a gap. */
export type A7TreeSectionIcon = 'books' | 'files' | 'book';

/** One selectable document type inside an expanded section. */
export interface A7MaterialTreeItem {
  id: string;
  label: string;
  count: number;
}

/** One collapsible section. `count === undefined` means the header draws a chevron instead. */
export interface A7MaterialTreeSection {
  id: string;
  label: string;
  icon: A7TreeSectionIcon;
  expanded: boolean;
  items: A7MaterialTreeItem[];
  count?: number;
}

/** The whole catalogue the tree renders. */
export interface A7MaterialTreeModel {
  sections: A7MaterialTreeSection[];
}

export type SlA7MyportalTreeSearchEvent = CustomEvent<{ query: string }>;
export type SlA7MyportalTreeSelectEvent = CustomEvent<{ itemId: string }>;
export type SlA7MyportalTreeToggleEvent = CustomEvent<{ sectionId: string; expanded: boolean }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a7-myportal-tree-search': SlA7MyportalTreeSearchEvent;
    'sl-a7-myportal-tree-select': SlA7MyportalTreeSelectEvent;
    'sl-a7-myportal-tree-toggle': SlA7MyportalTreeToggleEvent;
  }
}

/** Structural config, not data: the placeholder is chrome this component owns. */
const SEARCH_PLACEHOLDER = 'Search by name';

/**
 * The left-hand material catalogue: a search field above a list of collapsible sections, one of
 * which is expanded into selectable document types carrying counts.
 *
 * Presentational and fully controlled — expansion and selection live on the page, so this
 * component never mutates its own inputs. It re-renders from `model.sections[].expanded` and
 * {@link activeItemId}.
 *
 * The active row is a `[data-active]` boolean, not a variant or a second component. In the design
 * it is the only one of twenty rows whose badge sits inside a doubled
 * `sl-badge > badge-base-theme` frame cycle — the active state was produced by copy-paste rather
 * than by a component variant, so there is no variant to honour.
 *
 * @fires sl-a7-myportal-tree-search - On every committed search input.
 * @fires sl-a7-myportal-tree-select - When a document type is chosen.
 * @fires sl-a7-myportal-tree-toggle - When a section header is activated.
 */
export class A7MaterialTree extends ScopedElementsMixin(LitElement) {
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-badge': Badge, 'sl-icon': Icon, 'sl-search-field': SearchField };
  }

  static override styles: CSSResultGroup = styles;

  /** The catalogue. */
  @property({ attribute: false }) model?: A7MaterialTreeModel;

  /** Which document type is selected. Owned by the page. */
  @property({ attribute: 'active-item-id' }) activeItemId?: string;

  /** Emits on every search input. */
  @event({ name: 'sl-a7-myportal-tree-search' }) treeSearchEvent!: EventEmitter<SlA7MyportalTreeSearchEvent>;

  /** Emits when a document type is chosen. */
  @event({ name: 'sl-a7-myportal-tree-select' }) treeSelectEvent!: EventEmitter<SlA7MyportalTreeSelectEvent>;

  /** Emits when a section header is activated. */
  @event({ name: 'sl-a7-myportal-tree-toggle' }) treeToggleEvent!: EventEmitter<SlA7MyportalTreeToggleEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <sl-search-field
        aria-label=${SEARCH_PLACEHOLDER}
        placeholder=${SEARCH_PLACEHOLDER}
        @sl-change=${this.#onSearch}
      ></sl-search-field>
      <ul class="tree">
        ${model.sections.map(section => this.#renderSection(section))}
      </ul>
    `;
  }

  #renderSection(section: A7MaterialTreeSection): TemplateResult {
    return html`
      <li class="section" ?data-expanded=${section.expanded}>
        <button
          aria-controls="sect-${section.id}"
          aria-expanded=${section.expanded}
          class="section-header"
          type="button"
          @click=${() => this.#onToggle(section)}
        >
          ${iconGap(12)}
          <span class="section-label">${section.label}</span>
          ${section.count === undefined
            ? html`<sl-icon class="section-chevron" name="chevron-down"></sl-icon>`
            : html`<sl-badge>${section.count}</sl-badge>`}
        </button>
        <!--
          Always rendered, hidden when collapsed, so the aria-controls IDREF above always resolves.
          Rendering it conditionally left 11 of 12 sections pointing at an element that is not there.
        -->
        <ul class="items" id="sect-${section.id}" ?hidden=${!section.expanded}>
          ${section.items.map(item => this.#renderItem(item))}
        </ul>
      </li>
    `;
  }

  #renderItem(item: A7MaterialTreeItem): TemplateResult {
    const active = item.id === this.activeItemId;

    return html`
      <li>
        <button
          aria-current=${active ? 'page' : 'false'}
          ?data-active=${active}
          type="button"
          @click=${() => this.treeSelectEvent.emit({ itemId: item.id })}
        >
          <span class="item-label">${item.label}</span>
          <sl-badge color=${active ? 'blue' : 'grey'} emphasis="subtle">${item.count}</sl-badge>
        </button>
      </li>
    `;
  }

  #onToggle(section: A7MaterialTreeSection): void {
    this.treeToggleEvent.emit({ expanded: !section.expanded, sectionId: section.id });
  }

  /** `sl-change` is the documented SLDS API and carries the value as its detail. */
  #onSearch({ detail }: SlChangeEvent<string | undefined>): void {
    this.treeSearchEvent.emit({ query: detail ?? '' });
  }
}
