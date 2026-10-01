import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './course-bar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a6-course-bar-overflow': SlA6CourseBarOverflowEvent;
  }
}

/** One route link in the course bar's tab strip. */
export interface CourseTab {
  id: string;
  label: string;
  href: string;
}

/** The data this component renders: the active course and its route links. */
export interface CourseBarModel {
  courseId: string;
  courseName: string;
  courseImageUrl?: string;
  tabs: CourseTab[];
  activeTabId?: string;
}

export type SlA6CourseBarOverflowEvent = CustomEvent<void>;

/**
 * The second of the two 56px rows of the itslearning app-shell `Navigation` component
 * (Figma `.Secondary menu`, `I4200:13793;9976:10655`): the course's round "Course Hat" disc and
 * name, a strip of route links to the other pages of the course, and a trailing overflow control.
 *
 * Presentational — it renders the `model` it is given and emits when the overflow control is
 * activated; the root owns the course data and handles the event. The tabs are plain route links
 * (`<a href>`) in a real `<ul>`, not `sl-tab-group`, because they navigate between pages rather
 * than switching in-page panel content.
 *
 * The public API (`CourseTab`, `CourseBarModel`, the `model` property) is adopted verbatim from
 * the `b-itsl-collab-add-element` run's course bar so the two can later share one implementation;
 * only the tag name and the event are namespaced `sl-a6-*` to avoid colliding with that run's
 * global registration.
 *
 * ```html
 * <sl-a6-course-bar .model=${model}></sl-a6-course-bar>
 * ```
 *
 * @fires sl-a6-course-bar-overflow - Emitted when the overflow ("more options") control is activated.
 */
export class A6CourseBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The course, its route links and the currently active one. */
  @property({ attribute: false }) model?: CourseBarModel;

  /** @internal Emits when the overflow control is activated. */
  @event({ name: 'sl-a6-course-bar-overflow' })
  overflowEvent!: EventEmitter<SlA6CourseBarOverflowEvent>;

  override render(): TemplateResult {
    const model = this.model,
      tabs = model?.tabs ?? [];

    return html`
      <div class="course">
        <!--
          The "Course Hat": a 32px peach disc carrying a graduation-cap glyph in the design.
          "graduation-cap" is NOT one of the 54 icon names registered by the itslearning theme
          (packages/themes/itslearning/icons.ts), so the glyph is omitted rather than hand-drawn
          or substituted; the disc keeps its full 32px footprint and is aria-hidden, since the
          course name beside it already carries the meaning.
        -->
        <span aria-hidden="true" class="hat"></span>
        <span class="name">${model?.courseName ?? ''}</span>
      </div>
      <nav aria-label="Course">
        <ul>
          ${tabs.map(tab => {
            // `activeTabId` is optional and is undefined in this frame — no tab is highlighted.
            // `ifDefined` then omits the attribute entirely rather than rendering
            // `aria-current="undefined"`.
            const current = tab.id === model?.activeTabId ? 'page' : undefined;

            return html`
              <li>
                <a aria-current=${ifDefined(current)} href=${tab.href}>${tab.label}</a>
              </li>
            `;
          })}
        </ul>
      </nav>
      <sl-button
        @click=${this.#onOverflowClick}
        aria-label="More course options"
        class="overflow"
        fill="ghost">
        <sl-icon name="ellipsis" size="xl"></sl-icon>
      </sl-button>
    `;
  }

  #onOverflowClick(): void {
    this.overflowEvent.emit();
  }
}
