import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Breadcrumbs } from '@sl-design-system/breadcrumbs';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  A7AppBar,
  type SlA7MyportalClassChangeEvent,
  type SlA7MyportalQuickActionEvent,
  type SlA7MyportalSchoolChangeEvent
} from './app-bar/app-bar.js';
import { A7FilePanel, type SlA7MyportalFileOpenEvent } from './file-panel/file-panel.js';
import { A7MaterialHeader } from './material-header/material-header.js';
import {
  A7MaterialTree,
  type SlA7MyportalTreeSearchEvent,
  type SlA7MyportalTreeSelectEvent,
  type SlA7MyportalTreeToggleEvent
} from './material-tree/material-tree.js';
import { A7NavRail, type SlA7MyportalNavSelectEvent } from './nav-rail/nav-rail.js';
import { type A7PageModel, MOCK_PAGE } from './mock-data.js';
import styles from './materials-overviews-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a7-myportal-materials-overviews-page': A7MaterialsOverviewsPage;
  }
}

/** The last thing the user did that this page records but does not otherwise act on. */
export type A7PageAction =
  | { kind: 'none' }
  | { kind: 'quick-action'; id: string }
  | { kind: 'user-menu-toggle' }
  | { kind: 'digiboard' }
  | { kind: 'edit' }
  | { kind: 'file-open'; id: string };

/**
 * The Bingel teaching-material overview page: app bar, primary rail, breadcrumb, a material header
 * card, and a two-column body pairing the material catalogue with the files for the selected
 * document type.
 *
 * This is the run's root and its **sole data owner**. It holds the whole page model (mocked in
 * `mock-data.ts`, which notes where the real fetch would go) and hands each presentational child
 * the slice it renders. It is also the only element in this run that registers globally; the five
 * children are scoped and never call `customElements.define`, so two frames of the same Figma file
 * cannot collide on a tag.
 *
 * Every event its children declare is wired here and changes observable state — a page whose
 * controls are inert renders identically to one that works, and three runs in this batch shipped
 * exactly that.
 *
 * ```html
 * <sl-a7-myportal-materials-overviews-page></sl-a7-myportal-materials-overviews-page>
 * ```
 */
export class A7MaterialsOverviewsPage extends ScopedElementsMixin(LitElement) {
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-a7-myportal-app-bar': A7AppBar,
      'sl-a7-myportal-file-panel': A7FilePanel,
      'sl-a7-myportal-material-header': A7MaterialHeader,
      'sl-a7-myportal-material-tree': A7MaterialTree,
      'sl-a7-myportal-nav-rail': A7NavRail,
      'sl-breadcrumbs': Breadcrumbs
    };
  }

  static override styles: CSSResultGroup = styles;

  /** The page's data. Defaults to the design as drawn, so the element needs no configuration. */
  @property({ attribute: false }) model: A7PageModel = MOCK_PAGE;

  /** The current search query. Filters the expanded section's rows. */
  @state() searchQuery = '';

  /** The most recent action that has no further effect on this page. Observable for testing. */
  @state() lastAction: A7PageAction = { kind: 'none' };

  override render(): TemplateResult {
    const model = this.model,
      query = this.searchQuery.trim().toLowerCase(),
      tree = query
        ? {
            sections: model.tree.sections.map(section => ({
              ...section,
              items: section.items.filter(item => item.label.toLowerCase().includes(query))
            }))
          }
        : model.tree;

    return html`
      <sl-a7-myportal-app-bar
        .model=${model.appBar}
        @sl-a7-myportal-class-change=${this.#onClassChange}
        @sl-a7-myportal-quick-action=${this.#onQuickAction}
        @sl-a7-myportal-school-change=${this.#onSchoolChange}
        @sl-a7-myportal-user-menu-toggle=${this.#onUserMenuToggle}
      ></sl-a7-myportal-app-bar>
      <div class="body">
        <sl-a7-myportal-nav-rail
          active-item=${model.activeNavItem}
          @sl-a7-myportal-nav-select=${this.#onNavSelect}
        ></sl-a7-myportal-nav-rail>
        <div class="content">
          <sl-breadcrumbs>
            <a aria-current="page" href="#">${model.breadcrumb}</a>
          </sl-breadcrumbs>
          <sl-a7-myportal-material-header
            .model=${model.materialHeader}
            @sl-a7-myportal-digiboard-action=${this.#onDigiboard}
            @sl-a7-myportal-material-edit=${this.#onEdit}
          ></sl-a7-myportal-material-header>
          <div class="columns">
            <sl-a7-myportal-material-tree
              active-item-id=${model.activeTreeItemId}
              .model=${tree}
              @sl-a7-myportal-tree-search=${this.#onTreeSearch}
              @sl-a7-myportal-tree-select=${this.#onTreeSelect}
              @sl-a7-myportal-tree-toggle=${this.#onTreeToggle}
            ></sl-a7-myportal-material-tree>
            <sl-a7-myportal-file-panel
              .model=${model.filePanel}
              @sl-a7-myportal-file-open=${this.#onFileOpen}
            ></sl-a7-myportal-file-panel>
          </div>
        </div>
      </div>
    `;
  }

  #onClassChange({ detail }: SlA7MyportalClassChangeEvent): void {
    this.model = { ...this.model, appBar: { ...this.model.appBar, selectedClassId: detail.classId } };
  }

  #onSchoolChange({ detail }: SlA7MyportalSchoolChangeEvent): void {
    this.model = { ...this.model, appBar: { ...this.model.appBar, selectedSchoolId: detail.schoolId } };
  }

  #onNavSelect({ detail }: SlA7MyportalNavSelectEvent): void {
    this.model = { ...this.model, activeNavItem: detail.itemId };
  }

  /**
   * Selecting a document type moves the selection AND re-titles the file panel, because the panel
   * lists the files of whatever is selected — that is the page's whole interaction.
   */
  #onTreeSelect({ detail }: SlA7MyportalTreeSelectEvent): void {
    const item = this.model.tree.sections.flatMap(section => section.items).find(i => i.id === detail.itemId);

    this.model = {
      ...this.model,
      activeTreeItemId: detail.itemId,
      filePanel: { ...this.model.filePanel, heading: item?.label ?? this.model.filePanel.heading }
    };
  }

  #onTreeToggle({ detail }: SlA7MyportalTreeToggleEvent): void {
    this.model = {
      ...this.model,
      tree: {
        sections: this.model.tree.sections.map(section =>
          section.id === detail.sectionId ? { ...section, expanded: detail.expanded } : section
        )
      }
    };
  }

  #onTreeSearch({ detail }: SlA7MyportalTreeSearchEvent): void {
    this.searchQuery = detail.query;
  }

  #onQuickAction({ detail }: SlA7MyportalQuickActionEvent): void {
    this.lastAction = { id: detail.action, kind: 'quick-action' };
  }

  #onUserMenuToggle(): void {
    this.lastAction = { kind: 'user-menu-toggle' };
  }

  #onDigiboard(): void {
    this.lastAction = { kind: 'digiboard' };
  }

  #onEdit(): void {
    this.lastAction = { kind: 'edit' };
  }

  #onFileOpen({ detail }: SlA7MyportalFileOpenEvent): void {
    this.lastAction = { id: detail.fileId, kind: 'file-open' };
  }
}

if (!customElements.get('sl-a7-myportal-materials-overviews-page')) {
  customElements.define('sl-a7-myportal-materials-overviews-page', A7MaterialsOverviewsPage);
}
