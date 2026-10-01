import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
// One import per child module. These are VALUE imports because the child CLASSES are needed for
// the `scopedElements` map below. The children deliberately do NOT register themselves — the only
// `customElements.define` in this run is the guarded one at the bottom of this file.
import {
  AddElementHeader,
  type AddElementHeaderModel,
  type SlCreateFolderActionEvent,
  type SlUploadFileActionEvent
} from './add-element-header/add-element-header.js';
import styles from './add-element-page.css' with { type: 'css' };
import {
  ItsCourseBar,
  type CourseBarModel,
  type SlCourseBarOverflowEvent
} from './its-course-bar/its-course-bar.js';
import { ItsTopNav, type SlTopNavSearchEvent, type TopNavModel } from './its-top-nav/its-top-nav.js';
import {
  ResourceCategoryPanel,
  type ResourcePanelModel,
  type SlResourceCategorySelectEvent
} from './resource-category-panel/resource-category-panel.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-add-element-page': AddElementPage;
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
  // Invented mock identity: the design shows a user photo we do not have.
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
  ],
  activeTabId: 'resources'
};

// GET /api/courses/{courseId}/resources/folders/{folderId}
const HEADER_MODEL: AddElementHeaderModel = {
  breadcrumbs: [
    { id: 'resources', label: 'Resources', href: '#' },
    { id: 'folder', label: '[folder name]', href: '#' }
  ],
  folderName: '[folder name]'
};

// GET /api/courses/{courseId}/resources/element-types
const RESOURCE_PANEL_MODEL: ResourcePanelModel = {
  categories: [
    { id: 'xlsx', label: 'Excel', description: 'Description', href: '#' },
    { id: 'pptx', label: 'PowerPoint', description: 'Description', href: '#' },
    { id: 'docx', label: 'Word', description: 'Description', href: '#' },
    { id: 'page', label: 'Page', description: 'Description', href: '#' }
  ]
};

/**
 * The "Add element to [folder name]" page in a course's Resources area: the app-shell top
 * navigation and course bar, a page header with breadcrumbs, the page title and the
 * Upload file / Create folder actions, and a "Resources" panel listing the element types that
 * can be added to the folder.
 *
 * This is the root/data-owning component: it holds the top-nav, course-bar, header and
 * resource-panel data (in a real app these would be fetched — see the `GET` comments above each
 * mock constant for where that call would go) and passes each child its own slice as a single
 * cohesive model object. It renders the whole design with no properties.
 *
 * ```html
 * <sl-add-element-page></sl-add-element-page>
 * ```
 */
export class AddElementPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-add-element-header': AddElementHeader,
      'sl-its-course-bar': ItsCourseBar,
      'sl-its-top-nav': ItsTopNav,
      'sl-resource-category-panel': ResourceCategoryPanel
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`
      <div class="page">
        <sl-its-top-nav .model=${TOP_NAV_MODEL} @sl-top-nav-search=${this.#onTopNavSearch}>
        </sl-its-top-nav>
        <sl-its-course-bar
          .model=${COURSE_BAR_MODEL}
          @sl-course-bar-overflow=${this.#onCourseBarOverflow}>
        </sl-its-course-bar>
        <div class="content">
          <sl-add-element-header
            .model=${HEADER_MODEL}
            @sl-upload-file-action=${this.#onUploadFile}
            @sl-create-folder-action=${this.#onCreateFolder}>
          </sl-add-element-header>
          <sl-resource-category-panel
            .model=${RESOURCE_PANEL_MODEL}
            @sl-resource-category-select=${this.#onResourceCategorySelect}>
          </sl-resource-category-panel>
        </div>
      </div>
    `;
  }

  #onTopNavSearch(event: SlTopNavSearchEvent): void {
    console.info('sl-top-nav-search', event.detail);
  }

  #onCourseBarOverflow(event: SlCourseBarOverflowEvent): void {
    console.info('sl-course-bar-overflow', event.detail);
  }

  #onUploadFile(event: SlUploadFileActionEvent): void {
    console.info('sl-upload-file-action', event.detail);
  }

  #onCreateFolder(event: SlCreateFolderActionEvent): void {
    console.info('sl-create-folder-action', event.detail);
  }

  #onResourceCategorySelect(event: SlResourceCategorySelectEvent): void {
    console.info('sl-resource-category-select', event.detail);
  }
}

// This is the top-level element for this run's page, so — unlike its scoped children above — it
// registers itself globally, guarded so re-importing doesn't throw.
customElements.get('sl-add-element-page') ?? customElements.define('sl-add-element-page', AddElementPage);
