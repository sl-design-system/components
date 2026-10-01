import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { A10AppBar, type AppBarModel } from './app-bar/app-bar.js';
import styles from './fam-users-page.css' with { type: 'css' };
import { A10PageHeader, type FamTabId, type PageHeaderModel } from './page-header/page-header.js';
import { A10UserFilters, type PeriodId, type UserFiltersModel } from './user-filters/user-filters.js';
import {
  A10UserTable,
  type FamUser,
  type FamUserSort,
  type UserTableModel
} from './user-table/user-table.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-a10-fam-users-page': FamUsersPage;
  }
}

/**
 * The design's own three records. In a real app this is where
 * `GET /api/fam/users` would land; the shape is the contract either way.
 *
 * `lastLoginAt` is ISO 8601 because that is what a data source returns; the table formats it.
 */
const FAM_USERS: FamUser[] = [
  {
    id: 'akashpm',
    login: 'AkashPM',
    name: 'AkashPM',
    email: 'akashpm@kampus.fi',
    role: 'Publication Manager',
    employeeType: 'Developer',
    cfa: 'Sanoma pro',
    lastLoginAt: '2024-10-23T14:30:00'
  },
  {
    id: 'alisamertensom',
    login: 'AlisamertensOM',
    name: 'Van IN: Alisa Mertens',
    email: 'a.mertens@vanin.be',
    role: 'Outline Manager',
    employeeType: 'Manager',
    // The design's own trailing space, kept verbatim.
    cfa: 'Kampus ',
    lastLoginAt: '2024-10-23T14:30:00'
  },
  {
    id: 'annedepauwca',
    login: 'AnnedePauwCA',
    name: 'Van In: Ann de Pauw CA',
    email: 'anndepauw@vanin.nl',
    role: 'Content Analyst',
    employeeType: 'Manager',
    cfa: 'iDiddit',
    lastLoginAt: '2024-10-23T14:30:00'
  }
];

/** Days each period covers, used by the filter. Structural config, not data. */
const PERIOD_DAYS: Record<PeriodId, number> = {
  'last-7-days': 7,
  'last-30-days': 30,
  'last-90-days': 90
};

/**
 * FAM - Users. The root and the data owner: it holds the records and every piece of UI state,
 * derives the visible slice in one pass (filter -> sort -> page), and hands each child exactly
 * one cohesive model object.
 *
 * It is the ONLY component in this run that calls `customElements.define`. Children register
 * through `scopedElements`, which is what keeps these tags from colliding with run A5's
 * `sl-etsl-*` elements - two frames of the same Figma file, where the house style's guarded
 * registration would turn a collision into a silent mis-render rather than an error.
 */
export class FamUsersPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-a10-app-bar': A10AppBar,
      'sl-a10-page-header': A10PageHeader,
      'sl-a10-user-filters': A10UserFilters,
      'sl-a10-user-table': A10UserTable
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  @state() private users: FamUser[] = [...FAM_USERS];
  @state() private activeTab: FamTabId = 'users';
  @state() private searchTerm = '';
  @state() private period: PeriodId = 'last-30-days';
  @state() private sort: FamUserSort = { column: 'login', direction: 'asc' };
  @state() private page = 0;
  @state() private pageSize = 25;

  get #appBarModel(): AppBarModel {
    // OQ-4: the design shows initials only. No full name exists anywhere in the frame and one
    // was deliberately not invented, so the announced name is weaker than it should be.
    return { productName: 'Editorial Suite', user: { initials: 'JV', name: 'JV' } };
  }

  get #pageHeaderModel(): PageHeaderModel {
    return { title: 'Functional management' };
  }

  get #filtersModel(): UserFiltersModel {
    return { searchTerm: this.searchTerm, period: this.period };
  }

  /** filter -> sort -> page, in one pass, so the footer's totals and the rows cannot disagree. */
  get #tableModel(): UserTableModel {
    const term = this.searchTerm.trim().toLowerCase();

    // The period window is measured from the newest record in the data, not from `Date.now()`.
    // The design's three records are all 2024-10-23; against a real clock every one of the three
    // windows excludes them, the table empties, and the reference could never be reproduced. An
    // always-true condition would have hidden that; anchoring the window to the data keeps the
    // control genuinely functional - a narrower period really does drop older rows - and states
    // the compromise instead of burying it.
    const newest = this.users.reduce((max, user) => {
        const parsed = Date.parse(user.lastLoginAt);

        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 0),
      cutoff = newest - PERIOD_DAYS[this.period] * 24 * 60 * 60 * 1000;

    const filtered = this.users.filter(user => {
      const matchesTerm =
        term === '' ||
        user.login.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);

      const parsed = Date.parse(user.lastLoginAt),
        matchesPeriod = Number.isNaN(parsed) || parsed >= cutoff;

      return matchesTerm && matchesPeriod;
    });

    const { column, direction } = this.sort,
      sorted = [...filtered].sort((a, b) => {
        const result = String(a[column]).localeCompare(String(b[column]));

        return direction === 'asc' ? result : -result;
      });

    const start = this.page * this.pageSize;

    return {
      rows: sorted.slice(start, start + this.pageSize),
      sort: this.sort,
      page: { page: this.page, pageSize: this.pageSize, totalItems: sorted.length }
    };
  }

  override render(): TemplateResult {
    return html`
      <div class="page">
        <sl-a10-app-bar
          .model=${this.#appBarModel}
          @sl-a10-project-switch=${this.#onProjectSwitch}
          @sl-a10-user-menu=${this.#onUserMenu}
        ></sl-a10-app-bar>
        <sl-a10-page-header
          .model=${this.#pageHeaderModel}
          active-tab=${this.activeTab}
          @sl-a10-tab-change=${this.#onTabChange}
        ></sl-a10-page-header>
        <div class="body">
          ${this.activeTab === 'users'
            ? html`
                <div class="column">
                  <sl-a10-user-filters
                    .model=${this.#filtersModel}
                    @sl-a10-search-change=${this.#onSearchChange}
                    @sl-a10-period-change=${this.#onPeriodChange}
                    @sl-a10-add-user=${this.#onAddUser}
                  ></sl-a10-user-filters>
                  <sl-a10-user-table
                    .model=${this.#tableModel}
                    @sl-a10-sort-change=${this.#onSortChange}
                    @sl-a10-user-edit=${this.#onUserEdit}
                    @sl-a10-user-delete=${this.#onUserDelete}
                    @sl-a10-page-change=${this.#onPageChange}
                    @sl-a10-page-size-change=${this.#onPageSizeChange}
                  ></sl-a10-user-table>
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  // OQ-9: the other three tabs are selectable and render an empty body. Inventing placeholder
  // content would be fabrication; making them inert would be a lie about the strip.
  #onTabChange = (event: CustomEvent<FamTabId>): void => {
    this.activeTab = event.detail;
  };

  #onSearchChange = (event: CustomEvent<string>): void => {
    this.searchTerm = event.detail;
    this.page = 0;
  };

  #onPeriodChange = (event: CustomEvent<PeriodId>): void => {
    this.period = event.detail;
    this.page = 0;
  };

  #onSortChange = (event: CustomEvent<FamUserSort>): void => {
    this.sort = event.detail;
  };

  /** The one visibly falsifiable behaviour on the page: the row really goes away. */
  #onUserDelete = (event: CustomEvent<{ userId: string }>): void => {
    this.users = this.users.filter(user => user.id !== event.detail.userId);
  };

  #onPageChange = (event: CustomEvent<number>): void => {
    this.page = event.detail;
  };

  #onPageSizeChange = (event: CustomEvent<number>): void => {
    this.pageSize = event.detail;
    this.page = 0;
  };

  // The design contains no edit screen, no create dialog, no project picker and no account menu,
  // so these four are the host application's integration points. They are left to bubble rather
  // than given invented in-page behaviour.
  #onUserEdit = (): void => {};
  #onAddUser = (): void => {};
  #onProjectSwitch = (): void => {};
  #onUserMenu = (): void => {};
}

customElements.define('sl-a10-fam-users-page', FamUsersPage);
