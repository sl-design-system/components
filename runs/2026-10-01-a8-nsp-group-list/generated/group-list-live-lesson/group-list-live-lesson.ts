import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './group-list-live-lesson.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-live-lesson-join': SlLiveLessonJoinEvent;
    'sl-live-lesson-use-code': SlLiveLessonUseCodeEvent;
    'sl-live-lesson-open-ebook': SlLiveLessonOpenEbookEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-group-list-live-lesson': GroupListLiveLesson;
  }
}

/** A single student that has already joined the live lesson. */
export interface JoinedStudent {
  id: string;
  displayName: string;
  initials?: string;
  pictureUrl?: string;
}

/** The data this component renders: the live lesson's class/subject info, media and roster. */
export interface LiveLessonModel {
  id: string;
  groupName: string;
  subject: string;
  imageUrl: string;
  imageAlt: string;
  /** The full roster of students that already joined; this component caps the visible stack. */
  joinedStudents: JoinedStudent[];
}

export type SlLiveLessonJoinEvent = CustomEvent<{ lessonId: string }>;

export type SlLiveLessonUseCodeEvent = CustomEvent<{ lessonId: string }>;

export type SlLiveLessonOpenEbookEvent = CustomEvent<{ lessonId: string }>;

/** Structural constant: at most this many avatars are rendered in the joined-students stack. */
const MAX_VISIBLE_AVATARS = 3;

/**
 * The "Live now" hero card: shows the currently live lesson's class photo, class/subject info,
 * a capped stack of the students that already joined, and the three lesson actions.
 *
 * This is a presentational component: it receives its `model` from the data-owning page and
 * emits an event per action instead of navigating or fetching anything itself.
 *
 * ```html
 * <sl-group-list-live-lesson .model=${model}></sl-group-list-live-lesson>
 * ```
 *
 * @fires sl-live-lesson-join - Emitted when the user clicks "Join live lesson".
 * @fires sl-live-lesson-use-code - Emitted when the user clicks "Use lesson code".
 * @fires sl-live-lesson-open-ebook - Emitted when the user clicks "Open e-book".
 */
export class GroupListLiveLesson extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-button': Button
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The live lesson's class/subject info, media and roster. */
  @property({ attribute: false }) model?: LiveLessonModel;

  /** Emits when the user clicks "Join live lesson". */
  @event({ name: 'sl-live-lesson-join' }) joinEvent!: EventEmitter<SlLiveLessonJoinEvent>;

  /** Emits when the user clicks "Use lesson code". */
  @event({ name: 'sl-live-lesson-use-code' }) useCodeEvent!: EventEmitter<SlLiveLessonUseCodeEvent>;

  /** Emits when the user clicks "Open e-book". */
  @event({ name: 'sl-live-lesson-open-ebook' })
  openEbookEvent!: EventEmitter<SlLiveLessonOpenEbookEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { groupName, subject, imageUrl, imageAlt, joinedStudents } = this.model,
      visibleStudents = joinedStudents.slice(0, MAX_VISIBLE_AVATARS);

    return html`
      <article aria-labelledby="heading">
        <img alt=${imageAlt} class="photo" src=${imageUrl} />
        <div class="details">
          <h3 id="heading">${groupName}</h3>
          <p class="subject">${subject}</p>
          <div class="joined">
            <ul aria-hidden="true" class="avatars">
              ${visibleStudents.map(
                student => html`
                  <li>
                    <sl-avatar
                      display-initials=${ifDefined(student.initials)}
                      display-name=${student.displayName}
                      image-only
                      picture-url=${ifDefined(student.pictureUrl)}
                      size="sm"
                    ></sl-avatar>
                  </li>
                `
              )}
            </ul>
            <span>${joinedStudents.length} students already joined</span>
          </div>
        </div>
        <div class="actions">
          <sl-button @click=${this.#onJoin} shape="pill" variant="primary">
            Join live lesson
          </sl-button>
          <sl-button @click=${this.#onUseCode} shape="pill">Use lesson code</sl-button>
          <sl-button @click=${this.#onOpenEbook} fill="ghost" shape="pill">Open e-book</sl-button>
        </div>
      </article>
    `;
  }

  #onJoin(): void {
    if (this.model) {
      this.joinEvent.emit({ lessonId: this.model.id });
    }
  }

  #onUseCode(): void {
    if (this.model) {
      this.useCodeEvent.emit({ lessonId: this.model.id });
    }
  }

  #onOpenEbook(): void {
    if (this.model) {
      this.openEbookEvent.emit({ lessonId: this.model.id });
    }
  }
}
