import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import styles from './its-course-bar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-course-bar-overflow': SlCourseBarOverflowEvent;
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

export type SlCourseBarOverflowEvent = CustomEvent<void>;

/**
 * The course bar app-shell chrome: the course's circular avatar + name, a strip of route links
 * to other pages in the course, and an overflow control.
 *
 * This is a presentational component - it renders the `model` it's given and emits when the
 * overflow control is activated; the tabs are plain route links (`<a href>`), not
 * `sl-tab-group`, since there is no in-page panel content to switch between.
 *
 * ```html
 * <sl-its-course-bar .model=${model}></sl-its-course-bar>
 * ```
 *
 * @fires sl-course-bar-overflow - Emitted when the overflow ("more options") control is activated.
 */
export class ItsCourseBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The course, its route links and the currently active one. */
  @property({ attribute: false }) model?: CourseBarModel;

  /** @internal Emits when the overflow control is activated. */
  @event({ name: 'sl-course-bar-overflow' }) overflowEvent!: EventEmitter<SlCourseBarOverflowEvent>;

  override render(): TemplateResult {
    const model = this.model,
      tabs = model?.tabs ?? [];

    return html`
      <div class="course">
        <!--
          The design shows a peach-filled circle with a graduation-cap glyph. "graduation-cap"
          is not registered by the itslearning theme (see icons.ts), so it is omitted rather
          than hand-drawn; sl-avatar's initials fallback ("NS") stands in for the glyph, and
          the peach fill is not reproduced (no matching token — recorded gap).
        -->
        <sl-avatar
          image-only
          display-name=${ifDefined(model?.courseName)}
          picture-url=${ifDefined(model?.courseImageUrl)}
          size="sm"></sl-avatar>
        <span class="name">${model?.courseName}</span>
      </div>
      <nav aria-label="Course">
        <ul>
          ${tabs.map(tab => {
            const active = tab.id === model?.activeTabId;

            return html`
              <li>
                <a aria-current=${ifDefined(active ? 'page' : undefined)} href=${tab.href}
                  >${tab.label}</a
                >
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
        <sl-icon name="ellipsis"></sl-icon>
      </sl-button>
    `;
  }

  #onOverflowClick(): void {
    this.overflowEvent.emit();
  }
}
