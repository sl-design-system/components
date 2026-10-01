import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { InlineMessage, type SlDismissEvent } from '@sl-design-system/inline-message';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
// One import per child module. These are VALUE imports, so each module body runs and its guarded
// `customElements.define` executes — the registration side effect is already covered here; a
// separate `import './x/x.js'` line would be a duplicate.
import { CourseTable, type CourseTableModel } from './course-table/course-table.js';
import { DEFAULT_BANNER_TEXT, DEFAULT_COURSE_TABLE, DEFAULT_SECTION_NAV, DEFAULT_TOP_NAV } from './demo-data.js';
import { SectionNav, type SectionNavModel } from './section-nav/section-nav.js';
import { TopNav, type TopNavModel } from './top-nav/top-nav.js';
import styles from './files-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-itsl-files-page': FilesPage;
  }
}

/**
 * The itslearning "Save course materials" files page: the app-shell top nav, the Files app's
 * secondary nav, a page title, a dismissible info banner and the course-files table.
 *
 * This is the root/data-owning component: it holds the demo `topNav`, `sectionNav` and
 * `courseTable` data (in a real app these would be fetched — see `./demo-data.ts` for where those
 * calls would go) and passes each child its own slice as a single cohesive model object. It
 * renders the whole design with no args.
 *
 * ```html
 * <sl-itsl-files-page></sl-itsl-files-page>
 * ```
 */
export class FilesPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-inline-message': InlineMessage,
      // Each of these also registers itself globally, but ScopedElementsMixin gives this host
      // its own registry, and a tag missing from this map is NOT resolved against the global
      // one — it would render as an inert unknown element with no shadow root.
      'sl-itsl-files-course-table': CourseTable,
      'sl-itsl-files-section-nav': SectionNav,
      'sl-itsl-files-top-nav': TopNav
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The signed-in user, active main-menu link and search term shown in the top nav.
   *
   * @default DEFAULT_TOP_NAV
   */
  @property({ attribute: false }) topNav: TopNavModel = DEFAULT_TOP_NAV;

  /**
   * The "Files" app name and active secondary-nav route.
   *
   * @default DEFAULT_SECTION_NAV
   */
  @property({ attribute: false }) sectionNav: SectionNavModel = DEFAULT_SECTION_NAV;

  /**
   * The course-files table rows.
   *
   * @default DEFAULT_COURSE_TABLE
   */
  @property({ attribute: false }) courseTable: CourseTableModel = DEFAULT_COURSE_TABLE;

  /**
   * The page title, rendered as the `<h1>`.
   *
   * @default 'Save course materials'
   */
  @property() heading = 'Save course materials';

  /**
   * The dismissible info banner's body text. Rendered as-is (not localized — i18n is off for
   * this run); set to `undefined` to omit the banner entirely.
   *
   * @default DEFAULT_BANNER_TEXT
   */
  @property({ attribute: 'banner-text' }) bannerText: string | undefined = DEFAULT_BANNER_TEXT;

  /**
   * @internal Whether the info banner has been dismissed. `sl-inline-message` removes itself
   * from the DOM on dismiss (`InlineMessage.#onClick` calls `this.remove()`), which is unsafe to
   * rely on for a node rendered by this component's own template — so this flag is tracked
   * instead, and the banner is templated out once it's set.
   */
  @state() private bannerDismissed = false;

  override render(): TemplateResult {
    return html`
      <div class="page">
        <sl-itsl-files-top-nav .model=${this.topNav}></sl-itsl-files-top-nav>
        <sl-itsl-files-section-nav .model=${this.sectionNav}></sl-itsl-files-section-nav>
        <div class="content-area-wrapper">
          <div class="content-area">
            <h1 id="page-heading">${this.heading}</h1>
            <section aria-labelledby="page-heading" class="card">
              ${!this.bannerDismissed && this.bannerText
                ? html`
                    <sl-inline-message @sl-dismiss=${this.#onBannerDismiss} class="banner" variant="info">
                      ${this.bannerText}
                    </sl-inline-message>
                  `
                : nothing}
              <sl-itsl-files-course-table .model=${this.courseTable}></sl-itsl-files-course-table>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  #onBannerDismiss(event: SlDismissEvent): void {
    event.stopPropagation();
    this.bannerDismissed = true;
  }
}

// This is the top-level element for this run's page, so — unlike its scoped children above — it
// registers itself globally, guarded so re-importing this module doesn't throw.
if (!customElements.get('sl-itsl-files-page')) {
  customElements.define('sl-itsl-files-page', FilesPage);
}
