import { Avatar } from '@sl-design-system/avatar';
import { Checkbox } from '@sl-design-system/checkbox';
import {
  ArrayListDataSource,
  FetchListDataSource,
  FetchListDataSourceError,
  ListDataSourcePlaceholder
} from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { Infotip } from '@sl-design-system/infotip';
import { MenuButton as MenuButtonComponent, MenuItem } from '@sl-design-system/menu';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { LitElement, type TemplateResult, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import '.././register.js';
import { type GridColumnDataRenderer } from '../column.js';
import { type Grid } from '../grid.js';
import { type GridSummaryTotals, calculateSummaryTotals } from '../summary.js';
import { type Pupil, avatarRenderer, pupils } from './story-utils.js';

type Story = StoryObj;

interface ResourceFile {
  empty: null;
  name: string;
  type: 'pdf' | 'xls' | 'zip';
}

export default {
  title: 'Grid/Basics',
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { students } }) => {
    const dateOfBirthRenderer: GridColumnDataRenderer<Student> = ({ dateOfBirth }) => {
      return html`<sl-format-date .date=${dateOfBirth}></sl-format-date>`;
    };

    return html`
      <p>
        This example shows a basic grid with student information. The student column uses a custom
        <code>renderer</code> to render the student's avatar. The date of birth column uses the
        <code>sl-format-date</code> component to format the date.
      </p>
      <sl-grid .items=${students} no-skip-links>
        <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
        <sl-grid-column
          grow="3"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        <sl-grid-column
          header="Date of birth"
          .renderer=${dateOfBirthRenderer}
          .scopedElements=${{ 'sl-format-date': FormatDate }}></sl-grid-column>
        <sl-grid-column ellipsize-text header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const ColumnGroups: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows how you can group columns together using the
      <code>sl-grid-column-group</code> component.
    </p>
    <sl-grid .items=${students} striped no-skip-links>
      <sl-grid-column-group header="Name">
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
      </sl-grid-column-group>
      <sl-grid-column-group header="School">
        <sl-grid-column path="school.name"></sl-grid-column>
        <sl-grid-column path="school.city"></sl-grid-column>
        <sl-grid-column path="school.country"></sl-grid-column>
      </sl-grid-column-group>
    </sl-grid>
  `
};

export const EllipsizeText: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows how to use the <code>ellipsize-text</code> attribute to truncate text that
      overflows its column. Content that is truncated will also automatically add a tooltip with the
      full text.
    </p>
    <sl-grid
      .items=${students}
      style="max-inline-size: 500px"
      ellipsize-text
      column-divider
      no-skip-links>
      <sl-grid-column path="firstName" width="80"></sl-grid-column>
      <sl-grid-column path="lastName" width="80"></sl-grid-column>
      <sl-grid-column path="school.name" width="100"></sl-grid-column>
      <sl-grid-column path="school.address" width="100"></sl-grid-column>
      <sl-grid-column path="school.city" width="65"></sl-grid-column>
      <sl-grid-column path="school.country" width="75"></sl-grid-column>
    </sl-grid>
  `
};

export const EllipsizeTextWithCustomContent: Story = {
  render: () => {
    const files: ResourceFile[] = [
      {
        empty: null,
        name: 'Some name which has extremely long and very very long filename.pdf',
        type: 'pdf'
      },
      {
        empty: null,
        name: 'OC_6VG_U1-5_woordenlijsten.zip',
        type: 'zip'
      },
      {
        empty: null,
        name: 'Examendioom',
        type: 'xls'
      }
    ];

    const fileTypeStyles = css`
      & .file-type {
        align-items: center;
        block-size: var(--sl-size-300);
        display: inline-flex;
        inline-size: var(--sl-size-300);
        justify-content: center;
      }

      & .file-type svg {
        block-size: var(--sl-size-300);
        fill: none;
        inline-size: var(--sl-size-300);
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
      }

      & .file-type.pdf {
        color: var(--sl-color-foreground-negative-bold);
      }

      & .file-type.xls {
        color: var(--sl-color-foreground-positive-bold);
      }

      & .file-type.zip {
        color: var(--sl-color-foreground-accent-orange-bold);
      }
    `;

    const downloadStyles = css`
      & .download {
        align-items: center;
        appearance: none;
        background: transparent;
        block-size: var(--sl-size-300);
        border: 0;
        color: var(--sl-color-foreground-neutral-bold);
        cursor: pointer;
        display: inline-flex;
        inline-size: var(--sl-size-300);
        justify-content: center;
        padding: 0;
      }

      & .download svg {
        block-size: var(--sl-size-300);
        fill: none;
        inline-size: var(--sl-size-300);
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
      }
    `;

    const fileTypeRenderer: GridColumnDataRenderer<ResourceFile> = ({ type }) => {
      return html`
        <span aria-label="${type.toUpperCase()} file" class="file-type ${type}" role="img">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <path d="M6 2h8l4 4v16H6z"></path>
            <path d="M14 2v5h4"></path>
            <path d="M9 13h6"></path>
            <path d="M9 17h6"></path>
          </svg>
        </span>
      `;
    };

    const downloadRenderer: GridColumnDataRenderer<ResourceFile> = ({ name }) => {
      return html`
        <button aria-label="Download ${name}" class="download" type="button">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <path d="M12 3v11"></path>
            <path d="m7 10 5 5 5-5"></path>
            <path d="M5 19h14"></path>
          </svg>
        </button>
      `;
    };

    return html`
      <p>
        This example reproduces the layout where an ellipsized text cell is combined with custom
        rendered icon and action cells. Hover the truncated file name to show its tooltip.
      </p>
      <sl-grid .items=${files} style="max-inline-size: 420px" ellipsize-text no-skip-links>
        <sl-grid-column
          grow="0"
          header="Type"
          hide-header-text
          width="48"
          .renderer=${fileTypeRenderer}
          .renderStyles=${() => fileTypeStyles}></sl-grid-column>
        <sl-grid-column header="Name" path="name" width="240"></sl-grid-column>
        <sl-grid-column grow="0" header="Info" path="empty" width="80"></sl-grid-column>
        <sl-grid-column
          grow="0"
          header="Download"
          hide-header-text
          width="48"
          .renderer=${downloadRenderer}
          .renderStyles=${() => downloadStyles}></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Header: Story = {
  render: (_, { loaded: { students } }) => html`
    <style>
      sl-grid::part(first-name),
      sl-grid::part(school-city) {
        gap: var(--sl-size-100);
      }

      sl-grid::part(school-name) {
        justify-content: space-between;
      }
    </style>
    <p>
      This example shows how to customize the column headers by setting the
      <code>header</code> property of <code>sl-grid-column</code>. If you are using custom elements
      in the header, make sure you add the <code>scopedElements</code> property to the column with
      the used custom elements. If you don't do this, the custom elements won't be rendered
      correctly.
    </p>
    <sl-grid .items=${students} no-skip-links>
      <sl-grid-column
        path="firstName"
        .header=${() => html`
          <span>First name</span>
          <sl-infotip describes="First name" size="md">
            Some information about the first name
          </sl-infotip>
        `}
        .scopedElements=${{ 'sl-icon': Icon, 'sl-infotip': Infotip }}>
      </sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column
        .header=${() => html`
          <sl-icon name="home-blank"></sl-icon>
          <span>City</span>
        `}
        path="school.city"
        .scopedElements=${{ 'sl-icon': Icon }}>
      </sl-grid-column>
      <sl-grid-column
        .header=${() => html`
          <span>School</span>
          <sl-menu-button aria-label="School options" fill="ghost" size="sm">
            <sl-icon slot="button" name="ellipsis"></sl-icon>
            <sl-menu-item>Option 1</sl-menu-item>
            <sl-menu-item>Option 2</sl-menu-item>
            <sl-menu-item>Option 3</sl-menu-item>
          </sl-menu-button>
        `}
        path="school.name"
        .scopedElements=${{
          'sl-icon': Icon,
          'sl-menu-button': MenuButtonComponent,
          'sl-menu-item': MenuItem
        }}>
      </sl-grid-column>
    </sl-grid>
  `
};

export const KeyboardHeaderScroll: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows keyboard navigation through sortable column headers in a horizontally
      scrollable grid with a sticky selection column.
    </p>
    <sl-grid .items=${students} style="inline-size: 320px" no-skip-links>
      <sl-grid-selection-column sticky></sl-grid-selection-column>
      <sl-grid-sort-column grow="0" path="firstName" width="220"></sl-grid-sort-column>
      <sl-grid-sort-column grow="0" path="lastName" width="220"></sl-grid-sort-column>
      <sl-grid-sort-column grow="0" path="email" width="260"></sl-grid-sort-column>
      <sl-grid-sort-column grow="0" path="school.name" width="260"></sl-grid-sort-column>
    </sl-grid>
    <button type="button">Focus after grid</button>
  `
};

export const MenuButton: Story = {
  render: (_, { loaded: { students } }) => {
    const menuButtonRenderer: GridColumnDataRenderer<Student> = ({
      firstName,
      infix,
      lastName
    }) => {
      const fullName = [firstName, infix, lastName].filter(Boolean).join(' ');

      return html`
        <sl-menu-button aria-label=${`Options for ${fullName}`} fill="ghost" size="sm">
          <sl-icon slot="button" name="ellipsis"></sl-icon>
          <sl-menu-item>Do something with this student</sl-menu-item>
          <sl-menu-item>Something else</sl-menu-item>
          <hr />
          <sl-menu-item>Delete person</sl-menu-item>
        </sl-menu-button>
      `;
    };

    return html`
      <style>
        sl-grid::part(header menu-button) {
          /* Hide the column divider for the empty header. */
          background: var(--sl-elevation-surface-raised-alternative);
        }
      </style>
      <p>
        This example has a column with a custom <code>renderer</code> property that renders an
        <code>sl-menu-button</code> inside it. Make sure to add the
        <code>scopedElements</code> property to the column with the used custom elements. If you
        don't do this, the custom elements won't be rendered correctly.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-column
          grow="3"
          header="Person"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column
          grow="0"
          header="Actions"
          hide-header-text
          parts="menu-button"
          .renderer=${menuButtonRenderer}
          .scopedElements=${{
            'sl-icon': Icon,
            'sl-menu-button': MenuButtonComponent,
            'sl-menu-item': MenuItem
          }}
          width="48"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const SkipLinks: Story = {
  render: (_, { loaded: { students } }) => {
    const linkRenderer: GridColumnDataRenderer<Student> = ({ email }) => {
      return html`<a href="mailto:${email}">${email}</a>`;
    };

    return html`
      <p>
        This example shows how, when using keyboard navigation, you can skip the grid and jump
        directly past it.
      </p>
      <sl-grid .items=${students} column-divider>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email" .renderer=${linkRenderer}></sl-grid-column>
        <sl-grid-column path="school.address"></sl-grid-column>
        <sl-grid-column path="school.city"></sl-grid-column>
      </sl-grid>
      <p>A paragraph that follows the table, with a <a href="#">link</a> in it.</p>
    `;
  }
};

export const LazyLoad: Story = {
  render: () => {
    interface Quote {
      id: string;
      quote: string;
      author: string;
    }

    interface QuotesResponse {
      quotes: Quote[];
      total: number;
      skip: number;
      limit: number;
    }

    const dataSource = new FetchListDataSource<Quote>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const response = await fetch(
          `https://dummyjson.com/quotes?skip=${page * pageSize}&limit=${pageSize}`
        );

        if (response.ok) {
          const { quotes, total } = (await response.json()) as QuotesResponse;

          return { items: quotes, totalItems: total };
        } else {
          throw new FetchListDataSourceError('Failed to fetch data', response);
        }
      }
    });

    return html`
      <p>
        This example shows how you can lazy load the data. It uses
        <code>FetchListDataSource</code> to lazy load quotes by famous people from a remote service.
        It initially will only load the data for the visible rows. If you scroll further down the
        page, it will load additional data as needed. It uses data from
        <a href="https://dummyjson.com" target="_blank">https://dummyjson.com</a>.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="id" grow="0" width="50"></sl-grid-column>
        <sl-grid-column path="quote" grow="3"></sl-grid-column>
        <sl-grid-column path="author"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Skeleton: Story = {
  render: () => {
    const avatarRenderer: GridColumnDataRenderer<Student> = item => {
      if (typeof item === 'symbol' && item === ListDataSourcePlaceholder) {
        return html`
          <div style="display: flex; align-items: center; gap: 0.25rem; inline-size: 100%">
            <sl-skeleton
              style="aspect-ratio: 1; block-size: var(--sl-size-300); inline-size: auto"
              variant="circle"></sl-skeleton>
            <sl-skeleton
              style="block-size: 18px; inline-size: ${Math.max(
                Math.random() * 100,
                30
              )}%"></sl-skeleton>
          </div>
        `;
      } else {
        const { firstName, infix, lastName, pictureUrl } = item;

        return html`
          <sl-avatar
            .displayName=${[firstName, infix, lastName].join(' ')}
            .pictureUrl=${pictureUrl}
            size="sm"></sl-avatar>
        `;
      }
    };

    const dataSource = new FetchListDataSource<Student>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const { students, total } = await getStudents({
          count: pageSize,
          startIndex: page * pageSize
        });

        // Simulate a slow response: wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        return { items: students, totalItems: total };
      },
      size: Math.floor(window.innerHeight / 30)
    });

    return html`
      <p>
        This example customizes the rendering of the student column to also handle loading states.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column grow="0" header="Nr." path="studentNumber" width="120"></sl-grid-column>
        <sl-grid-column
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const ReorderColumns: Story = {
  render: (_, { loaded: { students } }) => {
    class GridReorderExample extends LitElement {
      @state() columns = [
        { path: 'fullName' },
        { path: 'email' },
        { path: 'group.name' },
        { path: 'school.name' }
      ];

      override render(): TemplateResult {
        return html`
          <p>
            This example demonstrates that when you reorder columns in a grid, the grid updates
            accordingly.
          </p>
          <sl-button-bar style="margin-block-end: 1rem">
            <sl-button @click=${this.onClick}>Reorder columns</sl-button>
          </sl-button-bar>
          <sl-grid .items=${students}>
            ${repeat(
              this.columns,
              column => column.path,
              column => html`<sl-grid-column .path=${column.path}></sl-grid-column>`
            )}
          </sl-grid>
        `;
      }

      onClick(): void {
        this.columns = [...this.columns.sort(() => Math.random() - 0.5)];
      }
    }

    try {
      customElements.define('grid-reorder-example', GridReorderExample);
    } catch {
      /* empty */
    }

    return html`<grid-reorder-example></grid-reorder-example>`;
  }
};

export const SummaryRow: Story = {
  render: () => html`
    <p>
      A summary row shows the totals of the columns. Set <code>summary-type</code> on a column to
      show a total: <code>number</code> columns show the sum (or the average),
      <code>text</code> columns the number of non-empty values and <code>boolean</code> columns a
      fraction, count or percentage. A dash is shown in columns without a total. The summary row is
      shown at the bottom by default and stays visible while you scroll.
    </p>
    <sl-grid .items=${pupils.slice(0, 11)}>
      <sl-grid-column
        header="Student"
        path="name"
        summary-label="students"
        summary-type="text"></sl-grid-column>
      <sl-grid-column header="Class" path="class"></sl-grid-column>
      <sl-grid-column
        align="end"
        header="Grade"
        path="grade"
        summary-format="average"
        summary-type="number"></sl-grid-column>
      <sl-grid-column
        header="Homework"
        path="homework"
        summary-type="boolean"
        .renderer=${(pupil: Pupil) => (pupil.homework ? 'Yes' : 'No')}></sl-grid-column>
      <sl-grid-column
        header="Present"
        path="present"
        summary-type="boolean"
        .renderer=${(pupil: Pupil) => (pupil.present ? 'Yes' : 'No')}></sl-grid-column>
    </sl-grid>
  `
};

interface SubjectRow {
  [subject: string]: boolean | number | string;
  class: string;
  grade: number;
  name: string;
  profile: string;
}

const subjects = ['AK', 'EC', 'EN', 'NSK1', 'WI', 'VT', 'ZW', 'TE', 'EC2', 'rtF2', 'mgez'],
  /** Which subjects are checked: every subject has its own deterministic pattern. */
  subjectPattern: Record<string, (index: number) => boolean> = {
    AK: () => true,
    EC: index => index === 2 || index === 6,
    EN: () => true,
    NSK1: index => [2, 4, 6, 7].includes(index),
    WI: index => index === 4,
    VT: () => true,
    ZW: index => index === 6,
    TE: index => [2, 4, 6].includes(index),
    EC2: index => [2, 4, 6, 7].includes(index),
    rtF2: () => true,
    mgez: index => index === 2 || index === 6
  },
  subjectRows: SubjectRow[] = [
    ['Irma Akpinar', 'F3CB', 'N&G', 4.1],
    ['Josien Veenstra', 'F3CB', 'N&G', 7.3],
    ['Sjors de Jong', 'F3CB', 'N&G', 6.7],
    ['Rene Top', 'F5AB', '-', 5.5],
    ['Fleur Fauna', 'F3CB', 'N&G', 7.8],
    ['Gert Flits', 'F3CB', 'N&G', 3.5],
    ['Gers Dijkstra', 'F3CB', '-', 9.2],
    ['Mees Aka', 'F3CB', 'N&G', 6.3],
    ['Josien Veenstra', 'F3CB', 'N&G', 7.3],
    ['Rene Top', 'F3CB', '-', 5.5],
    ['Gert Flits', 'F5AB', 'N&G', 3.5]
  ].map(([name, className, profile, grade], index) => ({
    class: className as string,
    grade: grade as number,
    name: name as string,
    profile: profile as string,
    ...Object.fromEntries(subjects.map(subject => [subject, subjectPattern[subject](index)]))
  }));

export const SummaryRowCheckboxColumns: Story = {
  render: () => {
    const gridRef = createRef<Grid>(),
      checkboxRenderer =
        (subject: string): GridColumnDataRenderer<SubjectRow> =>
        row =>
          html`
            <sl-checkbox
              @sl-change=${({ detail }: SlChangeEvent<boolean>) => {
                // Update the data, then re-render the grid so the totals are recalculated
                row[subject] = detail;
                gridRef.value?.requestUpdate();
              }}
              aria-label="${subject}: ${row.name}"
              ?checked=${row[subject]}
              size="sm"></sl-checkbox>
          `;

    return html`
      <p>
        A grand total row for a grid with many boolean columns. There is no dedicated column type
        for checkboxes, so the columns use a <code>renderer</code> that renders an
        <code>sl-checkbox</code>, while <code>summary-type="boolean"</code> calculates the fractions
        from the underlying values. Use the menu beside the label to switch between fractions,
        counts and percentages.
      </p>
      <sl-grid ${ref(gridRef)} .items=${subjectRows}>
        <sl-grid-column
          grow="3"
          header="Student"
          path="name"
          summary-label="students"
          summary-menu
          summary-type="text"></sl-grid-column>
        <sl-grid-column grow="0" header="Class" path="class" width="80"></sl-grid-column>
        <sl-grid-column grow="0" header="Profile" path="profile" width="80"></sl-grid-column>
        ${subjects.map(
          subject => html`
            <sl-grid-column
              grow="0"
              header=${subject.replace(/2$/, '')}
              path=${subject}
              summary-type="boolean"
              width="70"
              .renderer=${checkboxRenderer(subject)}
              .scopedElements=${{ 'sl-checkbox': Checkbox }}></sl-grid-column>
          `
        )}
        <sl-grid-column
          align="end"
          grow="0"
          header="Grade"
          path="grade"
          summary-format="average"
          summary-type="number"
          width="80"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const SummaryRowTop: Story = {
  render: () => html`
    <p>
      Use <code>summary-position="top"</code> to show the summary row below the header. It sticks to
      the header when you scroll.
    </p>
    <sl-grid summary-position="top" .items=${pupils}>
      <sl-grid-column
        header="Student"
        path="name"
        summary-label="students"
        summary-type="text"></sl-grid-column>
      <sl-grid-column header="Class" path="class"></sl-grid-column>
      <sl-grid-column
        align="end"
        header="Grade"
        path="grade"
        summary-format="average"
        summary-type="number"></sl-grid-column>
    </sl-grid>
  `
};

export const SummaryRowFormatMenu: Story = {
  render: () => html`
    <p>
      Add <code>summary-menu</code> to a column to show a menu beside its total. The menu changes
      the format of all boolean totals that don't have a fixed <code>summary-format</code>. The
      format only changes how the total is displayed, never the calculated value or the number of
      records it is relative to. You can also set the format on the grid with
      <code>summary-format</code>.
    </p>
    <sl-grid .items=${pupils.slice(0, 11)}>
      <sl-grid-column
        header="Student"
        path="name"
        summary-label="students"
        summary-menu
        summary-type="text"></sl-grid-column>
      <sl-grid-column header="Class" path="class"></sl-grid-column>
      <sl-grid-column
        header="Homework"
        path="homework"
        summary-type="boolean"
        .renderer=${(pupil: Pupil) => (pupil.homework ? 'Yes' : 'No')}></sl-grid-column>
      <sl-grid-column
        header="Present"
        path="present"
        summary-type="boolean"
        .renderer=${(pupil: Pupil) => (pupil.present ? 'Yes' : 'No')}></sl-grid-column>
      <sl-grid-column
        header="Passed (always a count)"
        path="passed"
        summary-format="count"
        summary-type="boolean"
        .renderer=${(pupil: Pupil) => (pupil.passed ? 'Yes' : 'No')}></sl-grid-column>
      <sl-grid-column
        align="end"
        header="Grade"
        path="grade"
        summary-format="average"
        summary-type="number"></sl-grid-column>
    </sl-grid>
  `
};

export const SummaryRowCustomContent: Story = {
  render: () => html`
    <p>
      Use the <code>summary</code> property to replace the calculated total with a string or a
      renderer function. The renderer receives the raw totals of the column.
    </p>
    <sl-grid .items=${pupils.slice(0, 11)}>
      <sl-grid-column header="Student" path="name" .summary=${'Totals'}></sl-grid-column>
      <sl-grid-column
        align="end"
        header="Grade"
        path="grade"
        summary-type="number"
        .summary=${(totals?: GridSummaryTotals) =>
          totals?.evaluated
            ? `${(totals.sum / totals.evaluated).toFixed(1)} on average`
            : '-'}></sl-grid-column>
    </sl-grid>
  `
};

export const SummaryRowPageTotal: Story = {
  render: () => {
    const ds = new ArrayListDataSource(pupils, { pagination: true, pageSize: 5 });

    return html`
      <style>
        .pagination {
          align-items: center;
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          margin-block: 1rem;
        }
        sl-paginator {
          flex: 1;
          justify-content: center;
        }
      </style>
      <p>
        Set <code>summary-scope="page"</code> to only calculate the totals for the rows on the
        current page. The label then says "Page total".
      </p>
      <sl-grid summary-scope="page" .dataSource=${ds}>
        <sl-grid-column
          header="Student"
          path="name"
          summary-label="students"
          summary-type="text"></sl-grid-column>
        <sl-grid-column header="Class" path="class"></sl-grid-column>
        <sl-grid-column
          align="end"
          header="Grade"
          path="grade"
          summary-format="average"
          summary-type="number"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .itemLabel=${'students'} .dataSource=${ds}></sl-paginator-status>
        <sl-paginator .dataSource=${ds}></sl-paginator>
      </div>
    `;
  }
};

export const SummaryRowFetch: Story = {
  render: () => {
    const ds = new FetchListDataSource<Pupil>({
      pageSize: 10,
      fetchPage: ({ page, pageSize }) => {
        // A real server calculates the totals for all the records matching the filters. The
        // totals are the raw values, so the format can be changed without fetching again.
        const summary = {
          name: calculateSummaryTotals(pupils.map(pupil => pupil.name)),
          grade: calculateSummaryTotals(pupils.map(pupil => pupil.grade)),
          present: calculateSummaryTotals(pupils.map(pupil => pupil.present))
        };

        return new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                items: pupils.slice(page * pageSize, page * pageSize + pageSize),
                summary,
                totalItems: pupils.length
              }),
            500
          )
        );
      }
    });

    return html`
      <p>
        A <code>FetchListDataSource</code> doesn't have all the rows, so it can't calculate the
        totals itself. Return the raw totals as <code>summary</code> from the
        <code>fetchPage</code> callback, next to <code>items</code> and <code>totalItems</code>. The
        summary row shows a dash until the totals have arrived.
      </p>
      <sl-grid .dataSource=${ds}>
        <sl-grid-column
          header="Student"
          path="name"
          summary-label="students"
          summary-menu
          summary-type="text"></sl-grid-column>
        <sl-grid-column header="Class" path="class"></sl-grid-column>
        <sl-grid-column
          align="end"
          header="Grade"
          path="grade"
          summary-format="average"
          summary-type="number"></sl-grid-column>
        <sl-grid-column
          header="Present"
          path="present"
          summary-type="boolean"
          .renderer=${(pupil: Pupil) => (pupil.present ? 'Yes' : 'No')}></sl-grid-column>
      </sl-grid>
    `;
  }
};
