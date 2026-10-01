import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
// Bare imports for their side effect only: each child module's own guarded
// `customElements.define` runs when the module body executes. See IMPL-BRIEF.md — this run does
// NOT use `ScopedElementsMixin` (a scoped registry silently renders a tag missing from its map as
// an inert unknown element with no shadow root, which emptied an earlier run's page), and a
// type-only import (`import { type X } from './x.js'`) is erased and registers nothing.
import './chapter-header/kampus-chapter-header.js';
import './header-nav/kampus-header-nav.js';
import './left-toolbar/kampus-left-toolbar.js';
import './notes-panel/kampus-notes-panel.js';
import './subchapter-card/kampus-subchapter-card.js';
import {
  type ChapterHeaderModel,
  type SlBknpChapterActionsEvent,
  type SlBknpChapterNavigateEvent,
  type SlBknpStudentViewChangeEvent
} from './chapter-header/kampus-chapter-header.js';
import { DEFAULT_CHAPTER_PAGE_DATA } from './demo-data.js';
import {
  type HeaderNavModel,
  type SlBknpHeaderActionEvent,
  type SlBknpNavSelectEvent
} from './header-nav/kampus-header-nav.js';
import {
  type BknpToolId,
  type SlBknpToolSelectEvent,
  type ToolRailModel
} from './left-toolbar/kampus-left-toolbar.js';
import {
  type NotesPanelModel,
  type SlBknpNoteEditEvent,
  type SlBknpNotesFilterChangeEvent,
  type SlBknpNotesSeeAllEvent
} from './notes-panel/kampus-notes-panel.js';
import {
  type SlBknpSubchapterActionsEvent,
  type SubchapterCardModel
} from './subchapter-card/kampus-subchapter-card.js';
import styles from './kampus-chapter-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-bknp-chapter-page': BknpChapterPage;
  }
}

/**
 * The full data this page needs: the global header bar, the left tool rail, the chapter header,
 * the notes side panel, and the chapter's subchapter cards. The root owns this as a single
 * cohesive model and hands each presentational child its own slice.
 */
export interface ChapterPageData {
  /** The global header bar's nav/notification state. */
  headerNav: HeaderNavModel;

  /** The left tool rail's user photo and badge state. */
  toolRail: ToolRailModel;

  /** The chapter header's breadcrumbs, title and chapter-navigation targets. */
  chapterHeader: ChapterHeaderModel;

  /** The notes side panel's note groups. */
  notes: NotesPanelModel;

  /** The chapter's subchapter cards, in display order. */
  subchapters: SubchapterCardModel[];
}

/**
 * The Kampus chapter page: the global header bar, a left tool rail, an optional notes side
 * panel, and a content column (chapter header + subchapter grid).
 *
 * This is the root/data-owning component: it holds the chapter's data (in a real app this would
 * be fetched — see `./demo-data.ts` for where that call would go) and passes each child its own
 * slice as a single cohesive model object. It renders the whole design with no args.
 *
 * The rail's "Notes" tool and the panel's own close button both drive one piece of UI state
 * (`notesPanelOpen`); selecting any other tool closes the panel, since no other tool has a panel
 * of its own in this design (see IMPL-BRIEF.md's G9). "Student view" is mirrored from the chapter
 * header's emitted event. All other child events (nav-select, header actions, chapter
 * navigate/actions, notes "see all"/filter/edit, subchapter actions) are consumed and ignored —
 * this design has no menus/routing wired up behind them.
 *
 * ```html
 * <sl-bknp-chapter-page></sl-bknp-chapter-page>
 * ```
 */
export class BknpChapterPage extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The chapter's data: header nav, tool rail, chapter header, notes and subchapters.
   *
   * @default DEFAULT_CHAPTER_PAGE_DATA
   */
  @property({ attribute: false }) data?: ChapterPageData = DEFAULT_CHAPTER_PAGE_DATA;

  /** @internal Whether the notes side panel is open. Conditionally rendered, not hidden. */
  @state() private notesPanelOpen = true;

  /** @internal Whether "Student view" is switched on, mirrored from the chapter header. */
  @state() private studentView = false;

  /** @internal The currently active tool-rail entry. */
  @state() private activeToolId: BknpToolId = 'notes';

  override render(): TemplateResult {
    if (!this.data) {
      return html`${nothing}`;
    }

    const { headerNav, toolRail, chapterHeader, notes, subchapters } = this.data;

    return html`
      <sl-bknp-header-nav
        .model=${headerNav}
        @sl-bknp-nav-select=${this.#onNavSelect}
        @sl-bknp-header-action=${this.#onHeaderAction}
      ></sl-bknp-header-nav>

      <div class="body">
        <sl-bknp-left-toolbar
          .model=${{ ...toolRail, activeToolId: this.activeToolId }}
          @sl-bknp-tool-select=${this.#onToolSelect}
        ></sl-bknp-left-toolbar>

        ${this.notesPanelOpen
          ? html`
              <sl-bknp-notes-panel
                .model=${notes}
                @sl-bknp-notes-close=${this.#onNotesClose}
                @sl-bknp-notes-see-all=${this.#onNotesSeeAll}
                @sl-bknp-notes-filter-change=${this.#onNotesFilterChange}
                @sl-bknp-note-edit=${this.#onNoteEdit}
              ></sl-bknp-notes-panel>
            `
          : nothing}

        <div class="content-column">
          <sl-bknp-chapter-header
            .model=${chapterHeader}
            .studentView=${this.studentView}
            @sl-bknp-chapter-navigate=${this.#onChapterNavigate}
            @sl-bknp-chapter-actions=${this.#onChapterActions}
            @sl-bknp-student-view-change=${this.#onStudentViewChange}
          ></sl-bknp-chapter-header>

          <ul class="subchapter-grid">
            ${subchapters.map(
              subchapter => html`
                <li>
                  <sl-bknp-subchapter-card
                    .model=${subchapter}
                    @sl-bknp-subchapter-actions=${this.#onSubchapterActions}
                  ></sl-bknp-subchapter-card>
                </li>
              `
            )}
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * The rail's "Notes" entry toggles the panel when Notes is already active; selecting any other
   * tool switches the active tool and closes the panel — no other tool has a panel in this design.
   */
  #onToolSelect(e: SlBknpToolSelectEvent): void {
    const { toolId } = e.detail;

    if (toolId === 'notes') {
      this.notesPanelOpen = this.activeToolId === 'notes' ? !this.notesPanelOpen : true;
      this.activeToolId = 'notes';
    } else {
      this.activeToolId = toolId;
      this.notesPanelOpen = false;
    }
  }

  #onNotesClose(): void {
    this.notesPanelOpen = false;
  }

  #onStudentViewChange(e: SlBknpStudentViewChangeEvent): void {
    this.studentView = e.detail.studentView;
  }

  #onNavSelect(e: SlBknpNavSelectEvent): void {
    // This is an example page with no router; a real app would navigate to the selected nav entry.
    console.info('Nav select', e.detail.navId);
  }

  #onHeaderAction(e: SlBknpHeaderActionEvent): void {
    // This is an example page with no router; a real app would open search/notifications/help/account.
    console.info('Header action', e.detail.action);
  }

  #onChapterNavigate(e: SlBknpChapterNavigateEvent): void {
    // This is an example page with no router; a real app would navigate to the previous/next chapter.
    console.info('Chapter navigate', e.detail.direction);
  }

  #onChapterActions(_e: SlBknpChapterActionsEvent): void {
    // No chapter actions menu exists in this design (see IMPL-BRIEF.md's G9).
    console.info('Chapter actions');
  }

  #onNotesSeeAll(_e: SlBknpNotesSeeAllEvent): void {
    // No "all notes" view exists in this design (see IMPL-BRIEF.md's G9).
    console.info('Notes see all');
  }

  #onNotesFilterChange(e: SlBknpNotesFilterChangeEvent): void {
    // The panel's own filter checkboxes are self-contained UI state; nothing further to update here.
    console.info('Notes filter change', e.detail);
  }

  #onNoteEdit(e: SlBknpNoteEditEvent): void {
    // No note editor exists in this design (see IMPL-BRIEF.md's G9).
    console.info('Note edit', e.detail.noteId);
  }

  #onSubchapterActions(e: SlBknpSubchapterActionsEvent): void {
    // No subchapter actions menu exists in this design (see IMPL-BRIEF.md's G9).
    console.info('Subchapter actions', e.detail.subchapterId);
  }
}

// This is the top-level element for this run's page, so it registers itself globally, guarded so
// re-importing doesn't throw.
if (!customElements.get('sl-bknp-chapter-page')) {
  customElements.define('sl-bknp-chapter-page', BknpChapterPage);
}
