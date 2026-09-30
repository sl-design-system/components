import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Card } from '@sl-design-system/card';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import {
  type AccountModel,
  type AppBarModel,
  GroupListAppBar,
  type SlGroupListAccountClickEvent,
  type SlGroupListNotificationsClickEvent
} from './group-list-app-bar/group-list-app-bar.js';
import {
  GroupListLiveLesson,
  type JoinedStudent,
  type LiveLessonModel,
  type SlLiveLessonJoinEvent,
  type SlLiveLessonOpenEbookEvent,
  type SlLiveLessonUseCodeEvent
} from './group-list-live-lesson/group-list-live-lesson.js';
import styles from './group-list-page.css' with { type: 'css' };

// Re-exported for convenience so consumers of this module don't also need to import the
// children's modules directly to get at the shared contract types.
export type { AccountModel, AppBarModel, JoinedStudent, LiveLessonModel };

declare global {
  interface HTMLElementTagNameMap {
    'sl-group-list-page': GroupListPage;
  }
}

/** A single class/group tile shown in the "My groups" grid. */
export interface GroupSummary {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  coverAlt: string;
  href: string;
}

/** The data this page renders: the signed-in student's greeting, app bar, live lesson and groups. */
export interface GroupListPageData {
  firstName: string;
  appBar: AppBarModel;
  liveLesson: LiveLessonModel | null;
  groups: GroupSummary[];
}

/**
 * Structural/mock data owned by this root page. In a real app this comes from
 * `GET /api/me/dashboard`; the fetch would replace this constant.
 *
 * Every image URL below has no exported asset and will 404 at render time - a recorded,
 * expected Stage 4 discrepancy (see the design manifest).
 */
export const DEFAULT_DATA: GroupListPageData = {
  firstName: 'Sarah',
  appBar: {
    account: {
      displayName: 'Sarah de Vries',
      initials: 'SV',
      pictureUrl: '/assets/a8-nsp-group-list/account-avatar.png'
    },
    unreadNotificationCount: 3
  },
  liveLesson: {
    id: 'lesson-h4a-english',
    groupName: 'Class H4A',
    subject: 'English',
    imageUrl: '/assets/a8-nsp-group-list/live-lesson-h4a.png',
    imageAlt: 'A red London telephone box on a city street',
    joinedStudents: [
      {
        id: 'student-1',
        displayName: 'Anna de Boer',
        initials: 'AB',
        pictureUrl: '/assets/a8-nsp-group-list/student-1.png'
      },
      {
        id: 'student-2',
        displayName: 'Bram Jansen',
        initials: 'BJ',
        pictureUrl: '/assets/a8-nsp-group-list/student-2.png'
      },
      {
        id: 'student-3',
        displayName: 'Charlotte Visser',
        initials: 'CV',
        pictureUrl: '/assets/a8-nsp-group-list/student-3.png'
      },
      {
        id: 'student-4',
        displayName: 'Daan Bakker',
        initials: 'DB',
        pictureUrl: '/assets/a8-nsp-group-list/student-4.png'
      },
      {
        id: 'student-5',
        displayName: 'Eva Smit',
        initials: 'ES',
        pictureUrl: '/assets/a8-nsp-group-list/student-5.png'
      },
      {
        id: 'student-6',
        displayName: 'Finn Mulder',
        initials: 'FM',
        pictureUrl: '/assets/a8-nsp-group-list/student-6.png'
      },
      {
        id: 'student-7',
        displayName: 'Guus de Groot',
        initials: 'GG',
        pictureUrl: '/assets/a8-nsp-group-list/student-7.png'
      }
    ]
  },
  groups: [
    {
      id: 'h5a',
      name: 'Class H5A',
      description: 'Biologie voor jou - havo 5',
      coverUrl: '/assets/a8-nsp-group-list/cover-h5a.png',
      coverAlt: 'Cover of the textbook Biologie voor jou, havo 5',
      href: '/groups/h5a'
    },
    {
      id: 'v5b',
      name: 'Class V5B',
      description: 'Biologie voor jou - vwo 5',
      coverUrl: '/assets/a8-nsp-group-list/cover-v5b.png',
      coverAlt: 'Cover of the textbook Biologie voor jou, vwo 5',
      href: '/groups/v5b'
    },
    {
      id: 'v6c',
      name: 'Class V6C',
      description: 'Biologie voor jou - vwo 6',
      coverUrl: '/assets/a8-nsp-group-list/cover-v6c.png',
      coverAlt: 'Cover of the textbook Biologie voor jou, vwo 6',
      href: '/groups/v6c'
    },
    {
      id: 'v4a',
      name: 'Class V4A',
      description: 'Biologie voor jou - vwo 4',
      coverUrl: '/assets/a8-nsp-group-list/cover-v4a.png',
      coverAlt: 'Cover of the textbook Biologie voor jou, vwo 4',
      href: '/groups/v4a'
    },
    {
      id: 'h4a',
      name: 'Class H4A',
      description: 'Biologie voor jou - havo 4',
      coverUrl: '/assets/a8-nsp-group-list/cover-h4a.png',
      coverAlt: 'Cover of the textbook Biologie voor jou, havo 4',
      href: '/groups/h4a'
    }
  ]
};

/**
 * The student dashboard home screen: a "Welcome back" greeting, the currently live lesson (if
 * any) and a grid of the student's groups. This is the root/page component: it owns the data
 * (a realistic mock here, with a comment marking where the real fetch would go) and passes the
 * appropriate slice to each presentational child.
 *
 * ```html
 * <sl-group-list-page></sl-group-list-page>
 * ```
 */
export class GroupListPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-group-list-app-bar': GroupListAppBar,
      'sl-group-list-live-lesson': GroupListLiveLesson,
      'sl-card': Card,
      'sl-badge': Badge
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The page's data: the signed-in student's greeting, app bar, live lesson and groups.
   *
   * @default DEFAULT_DATA
   */
  @property({ attribute: false }) data: GroupListPageData = DEFAULT_DATA;

  override render(): TemplateResult {
    const { firstName, appBar, liveLesson, groups } = this.data;

    return html`
      <sl-group-list-app-bar
        .model=${appBar}
        @sl-group-list-account-click=${this.#onAccountClick}
        @sl-group-list-notifications-click=${this.#onNotificationsClick}
      ></sl-group-list-app-bar>

      <div class="body">
        <h1>Welcome back, ${firstName}</h1>
        <p class="subtext">
          Select a group to view materials, follow your progress, and join today's lessons
        </p>

        <section aria-labelledby="live-now-heading">
          <div class="section-label">
            <sl-badge aria-hidden="true" color="red" emphasis="bold" size="sm"></sl-badge>
            <h2 id="live-now-heading">Live now</h2>
          </div>
          ${liveLesson
            ? html`
                <sl-group-list-live-lesson
                  .model=${liveLesson}
                  @sl-live-lesson-join=${this.#onJoin}
                  @sl-live-lesson-open-ebook=${this.#onOpenEbook}
                  @sl-live-lesson-use-code=${this.#onUseCode}
                ></sl-group-list-live-lesson>
              `
            : nothing}
        </section>

        <section aria-labelledby="my-groups-heading">
          <h2 id="my-groups-heading">My groups</h2>
          <ul role="list">
            ${groups.map(
              group => html`
                <li>
                  <sl-card orientation="horizontal">
                    <img alt=${group.coverAlt} slot="media" src=${group.coverUrl} />
                    <a aria-level="3" href=${group.href} role="heading">${group.name}</a>
                    <span slot="body">${group.description}</span>
                  </sl-card>
                </li>
              `
            )}
          </ul>
        </section>
      </div>
    `;
  }

  #onNotificationsClick(_event: SlGroupListNotificationsClickEvent): void {
    // This is an example app with no router/menu; a real app would open the notifications panel.
    console.info('Notifications clicked');
  }

  #onAccountClick(_event: SlGroupListAccountClickEvent): void {
    // This is an example app with no router/menu; a real app would open the account menu.
    console.info('Account control clicked');
  }

  #onJoin(event: SlLiveLessonJoinEvent): void {
    // This is an example app with no router; a real app would navigate to the lesson.
    console.info('Join live lesson', event.detail);
  }

  #onUseCode(event: SlLiveLessonUseCodeEvent): void {
    // This is an example app with no router; a real app would open the "use lesson code" dialog.
    console.info('Use lesson code', event.detail);
  }

  #onOpenEbook(event: SlLiveLessonOpenEbookEvent): void {
    // This is an example app with no router; a real app would open the e-book.
    console.info('Open e-book', event.detail);
  }
}

// This is the only globally defined element for this run; its scoped children above never
// register themselves, guarded so re-importing this module doesn't throw.
if (!customElements.get('sl-group-list-page')) {
  customElements.define('sl-group-list-page', GroupListPage);
}
