import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
// One import per child module. These are VALUE imports because the child CLASSES are needed for
// the `scopedElements` map below. The children deliberately do NOT register themselves — the only
// `customElements.define` in this run is the guarded one at the bottom of this file.
import { A6CourseBar, type CourseBarModel } from './course-bar/course-bar.js';
import {
  A6DescriptionCard,
  type DescriptionModel
} from './description-card/description-card.js';
import {
  A6FileBrowser,
  type BulkAction,
  type FileBrowserModel,
  type SlA6BulkActionEvent,
  type SlA6FileSearchEvent
} from './file-browser/file-browser.js';
import {
  type SlA6FileRowActionEvent,
  type SlA6FileSortChangeEvent
} from './file-browser/file-table/file-table.js';
import {
  type SlA6PageChangeEvent,
  type SlA6PageSizeChangeEvent
} from './file-browser/paginator/paginator.js';
import { A6PageHeader, type PageHeaderModel } from './page-header/page-header.js';
import {
  A6SettingsSummary,
  type SettingsSummaryModel
} from './settings-summary/settings-summary.js';
import styles from './shared-folder-page.css' with { type: 'css' };
import { A6TopNav, type SlA6TopNavSearchEvent, type TopNavModel } from './top-nav/top-nav.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-a6-shared-folder-page': A6SharedFolderPage;
  }
}

// GET /api/navigation
const TOP_NAV_MODEL: TopNavModel = {
  brandHref: '#',
  links: [
    { id: 'courses', label: 'Courses', href: '#' },
    { id: 'updates', label: 'Updates', href: '#' },
    { id: 'groups', label: 'Groups', href: '#' },
    { id: 'calendar', label: 'Calendar', href: '#' },
    { id: 'library', label: 'Library', href: '#' }
  ],
  // Invented mock identity: the design shows a user photo this run has no asset for.
  user: { id: 'u1', displayName: 'Anna Nilsson' }
};

// GET /api/courses/{courseId}
const COURSE_BAR_MODEL: CourseBarModel = {
  courseId: 'c1',
  courseName: 'Natural Science 7A',
  tabs: [
    { id: 'overview', label: 'Overview', href: '#' },
    { id: 'plans', label: 'Plans', href: '#' },
    { id: 'resources', label: 'Resources', href: '#' },
    { id: 'reports', label: 'Reports', href: '#' },
    { id: 'participants', label: 'Participants', href: '#' }
  ]
  // `activeTabId` is deliberately absent: this frame highlights no course tab.
};

// GET /api/folders/{folderId}
const PAGE_HEADER_MODEL: PageHeaderModel = {
  breadcrumbs: [
    { id: 'root', label: 'Root page', href: '#' },
    { id: 'b1', label: 'Breadcrumb', href: '#' },
    { id: 'b2', label: 'Breadcrumb', href: '#' },
    { id: 'b3', label: 'Breadcrumb', href: '#' },
    { id: 'b4', label: 'Breadcrumb', href: '#' }
  ],
  heading: 'Donna Tartt elaboration',
  resourceKind: 'shared-folder'
};

const DESCRIPTION_MODEL: DescriptionModel = {
  body: 'Donna Louise Tartt is an American novelist. She wrote the novels The Secret History, The Little Friend, and The Goldfinch, which won the Pulitzer Prize for Fiction and was adapted into a 2019 film of the same name.',
  links: [
    { id: 'l1', label: 'Read all about author', href: '#', kind: 'web-content' },
    { id: 'l2', label: 'You can use page about Donna Tartt', href: '#', kind: 'resource' }
  ]
};

// GET /api/folders/{folderId}/files?page=0&pageSize=10
// The design draws eight rows of a 47-item collection: six .docx, one .xlsx, one .pptx, every one
// published 12/05/2025 by Anna Smith.
const FILE_KINDS = [
  'document',
  'document',
  'document',
  'document',
  'document',
  'spreadsheet',
  'document',
  'presentation'
] as const;

const EXTENSION: Record<(typeof FILE_KINDS)[number], string> = {
  document: 'docx',
  spreadsheet: 'xlsx',
  presentation: 'pptx'
};

const FILE_BROWSER_MODEL: FileBrowserModel = {
  addHref: '#',
  files: FILE_KINDS.map((kind, index) => ({
    id: `f${index + 1}`,
    title: `[File title].${EXTENSION[kind]}`,
    kind,
    publishedAt: '2025-05-12',
    publishedBy: 'Anna Smith',
    href: '#'
  })),
  page: 0,
  pageSize: 10,
  totalItems: 47
};

// GET /api/folders/{folderId}/settings
const SETTINGS_MODEL: SettingsSummaryModel = {
  visibility: 'visible',
  closingDate: '2025-05-30T23:00:00',
  assignedParticipantCount: 5,
  assignedGroupNames: ['[Group name]'],
  toolNames: ['Microsoft Word, Excel and PowerPoint', 'Page']
};

/**
 * Figma `Shared folder - teacher view` `4200:13792`, 1280 x 1335 — the itslearning course page
 * for a shared-files folder in teacher view.
 *
 * The root owns all the data and passes each child the slice it renders. It is the only element
 * in this run that registers globally; the eight children are reached through
 * `ScopedElementsMixin` under `sl-a6-*` tags, so nothing here can collide with the
 * `b-itsl-collab-add-element` run, which is drawn from the same Figma file and already registers
 * `sl-add-element-page` globally.
 *
 * ```html
 * <sl-a6-shared-folder-page></sl-a6-shared-folder-page>
 * ```
 */
export class A6SharedFolderPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-a6-course-bar': A6CourseBar,
      'sl-a6-description-card': A6DescriptionCard,
      'sl-a6-file-browser': A6FileBrowser,
      'sl-a6-page-header': A6PageHeader,
      'sl-a6-settings-summary': A6SettingsSummary,
      'sl-a6-top-nav': A6TopNav
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`
      <div class="app-shell">
        <sl-a6-top-nav
          .model=${TOP_NAV_MODEL}
          @sl-a6-top-nav-search=${this.#onTopNavSearch}></sl-a6-top-nav>
        <sl-a6-course-bar
          .model=${COURSE_BAR_MODEL}
          @sl-a6-course-bar-overflow=${this.#onCourseBarOverflow}></sl-a6-course-bar>
      </div>
      <div class="content-area-wrapper">
        <div class="content-area">
          <sl-a6-page-header
            .model=${PAGE_HEADER_MODEL}
            @sl-a6-page-header-overflow=${this.#onPageHeaderOverflow}></sl-a6-page-header>
          <div class="columns">
            <div class="list">
              <sl-a6-description-card .model=${DESCRIPTION_MODEL}></sl-a6-description-card>
              <sl-a6-file-browser
                .model=${FILE_BROWSER_MODEL}
                @sl-a6-file-search=${this.#onFileSearch}
                @sl-a6-bulk-action=${this.#onBulkAction}
                @sl-a6-file-sort-change=${this.#onFileSortChange}
                @sl-a6-file-row-action=${this.#onFileRowAction}
                @sl-a6-page-change=${this.#onPageChange}
                @sl-a6-page-size-change=${this.#onPageSizeChange}
                actions-menu-open></sl-a6-file-browser>
            </div>
            <sl-a6-settings-summary
              .model=${SETTINGS_MODEL}
              @sl-a6-settings-edit=${this.#onSettingsEdit}></sl-a6-settings-summary>
          </div>
        </div>
      </div>
    `;
  }

  #onTopNavSearch(event: SlA6TopNavSearchEvent): void {
    console.info('sl-a6-top-nav-search', event.detail);
  }

  #onCourseBarOverflow(): void {
    console.info('sl-a6-course-bar-overflow');
  }

  #onPageHeaderOverflow(): void {
    console.info('sl-a6-page-header-overflow');
  }

  #onFileSearch(event: SlA6FileSearchEvent): void {
    console.info('sl-a6-file-search', event.detail);
  }

  #onBulkAction(event: SlA6BulkActionEvent): void {
    const detail: { action: BulkAction; fileIds: string[] } = event.detail;

    console.info('sl-a6-bulk-action', detail);
  }

  #onFileSortChange(event: SlA6FileSortChangeEvent): void {
    console.info('sl-a6-file-sort-change', event.detail);
  }

  #onFileRowAction(event: SlA6FileRowActionEvent): void {
    console.info('sl-a6-file-row-action', event.detail);
  }

  #onPageChange(event: SlA6PageChangeEvent): void {
    console.info('sl-a6-page-change', event.detail);
  }

  #onPageSizeChange(event: SlA6PageSizeChangeEvent): void {
    console.info('sl-a6-page-size-change', event.detail);
  }

  #onSettingsEdit(): void {
    console.info('sl-a6-settings-edit');
  }
}

// This is the top-level element for this run's page, so — unlike its scoped children above — it
// registers itself globally, guarded so re-importing doesn't throw.
customElements.get('sl-a6-shared-folder-page') ??
  customElements.define('sl-a6-shared-folder-page', A6SharedFolderPage);
