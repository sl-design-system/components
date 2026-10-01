import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import styles from './section-nav.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-itsl-files-section-nav': SectionNav;
  }

  interface GlobalEventHandlersEventMap {
    'sl-itsl-files-tab-select': SlItslFilesTabSelectEvent;
  }
}

/** The stable id of one of the two secondary-nav routes in the Files app. */
export type FilesTabId = 'your-files' | 'save-course-materials';

/** The data this component renders; owned and passed in by the page. */
export interface SectionNavModel {
  appName: string;
  activeTabId: FilesTabId;
}

/** The detail of the `sl-itsl-files-tab-select` event. */
export interface TabSelectDetail {
  id: FilesTabId;
  href: string;
}

export type SlItslFilesTabSelectEvent = CustomEvent<TabSelectDetail>;

/** Structural config: the fixed section-nav tab set, in design order. Not part of the data model. */
interface SectionTabConfig {
  id: FilesTabId;
  label: string;
  href: string;
}

/**
 * Structural/presentation config owned by this component (not model input) — the design's two
 * secondary-nav entries never vary per user, so they're a local constant rather than a
 * `SectionNavModel` field. Hrefs aren't specified by the design; these are placeholder in-app
 * routes — flagged in the implementation report.
 */
const SECTION_TABS: SectionTabConfig[] = [
  { id: 'your-files', label: 'Your files', href: '/files/your-files' },
  { id: 'save-course-materials', label: 'Save course materials', href: '/files/save-course-materials' }
];

/** Default model so the story renders fully with no args. */
const DEFAULT_MODEL: SectionNavModel = {
  appName: 'Files',
  activeTabId: 'save-course-materials'
};

/**
 * The itslearning "Files" app's secondary navigation bar: the app glyph + name, and the two
 * routes within the Files app ("Your files" / "Save course materials"). Presentational — the
 * page passes in its `model` and handles the emitted tab-select event.
 *
 * These are links to separate itslearning routes, not in-page tab panels, so the markup is a
 * `<nav>` of `<a aria-current="page">` links rather than `role="tablist"` / `sl-tab-group`.
 *
 * ```html
 * <sl-itsl-files-section-nav
 *   .model=${{ appName: 'Files', activeTabId: 'save-course-materials' }}
 * ></sl-itsl-files-section-nav>
 * ```
 *
 * @fires sl-itsl-files-tab-select - Emitted when a section-nav link is clicked; cancelable so a
 *   host router can call `preventDefault()` on it to stop the anchor's default navigation.
 */
export class SectionNav extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a section-nav link is clicked. */
  @event({ name: 'sl-itsl-files-tab-select' }) tabSelectEvent!: EventEmitter<SlItslFilesTabSelectEvent>;

  /**
   * The app name and active tab this bar renders. Defaults to a representative demo state so
   * the story renders fully with no args.
   */
  @property({ attribute: false }) model?: SectionNavModel;

  override render(): TemplateResult {
    const model = this.model ?? DEFAULT_MODEL;

    return html`
      <nav aria-label="Files">
        <div class="app">
          <!-- The design's green "Files" app glyph ("your-files") is a custom raster/SVG asset,
               not a name registered in packages/themes/itslearning/icons.ts, and there is no
               asset-export step in this pipeline. Omitted; the empty placeholder keeps the
               32x32 slot so the "Files" label doesn't shift left. Discrepancy recorded. -->
          <span class="app-icon" aria-hidden="true"></span>
          <span class="app-name">${model.appName}</span>
        </div>
        <ul class="tabs">
          ${SECTION_TABS.map(tab => {
            const active = tab.id === model.activeTabId;

            return html`
              <li class="tab">
                <a
                  href=${tab.href}
                  aria-current=${ifDefined(active ? 'page' : undefined)}
                  @click=${(e: MouseEvent) => this.#onTabClick(e, tab)}
                >
                  ${tab.label}
                </a>
              </li>
            `;
          })}
        </ul>
      </nav>
    `;
  }

  /**
   * Emits `sl-itsl-files-tab-select` as a cancelable event; if a host listener calls
   * `preventDefault()` on it, the anchor's own default navigation is stopped too, so a host
   * router can take over.
   */
  #onTabClick(e: MouseEvent, tab: SectionTabConfig): void {
    const notCancelled = this.tabSelectEvent.emit({ id: tab.id, href: tab.href }, { cancelable: true });

    if (!notCancelled) {
      e.preventDefault();
    }
  }
}

if (!customElements.get('sl-itsl-files-section-nav')) {
  customElements.define('sl-itsl-files-section-nav', SectionNav);
}
