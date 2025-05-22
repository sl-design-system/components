import { Avatar } from '@sl-design-system/avatar';
import {
  FetchListDataSource,
  FetchListDataSourceError,
  ListDataSourcePlaceholder
} from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { MenuButton as MenuButtonComponent, MenuItem } from '@sl-design-system/menu';
import { Tooltip } from '@sl-design-system/tooltip';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import '../../register.js';
import { type GridColumnDataRenderer } from '../column.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Basics',
  tags: ['draft'],
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
      <sl-grid .items=${students}>
        <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column
          header="Date of birth"
          .renderer=${dateOfBirthRenderer}
          .scopedElements=${{ 'sl-format-date': FormatDate }}
        ></sl-grid-column>
        <sl-grid-column ellipsize-text header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const ColumnGroups: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>This example shows how you can group columns together using the <code>sl-grid-column-group</code> component.</p>
    <sl-grid .items=${students} striped>
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
      This example shows how to use the <code>ellipsize-text</code> attribute to truncate text that overflows its
      column. Content that is truncated will also automatically add a tooltip with the full text.
    </p>
    <sl-grid .items=${students} style="max-inline-size: 500px" ellipsize-text column-divider>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="school.name"></sl-grid-column>
      <sl-grid-column path="school.address"></sl-grid-column>
      <sl-grid-column path="school.city"></sl-grid-column>
      <sl-grid-column path="school.country"></sl-grid-column>
    </sl-grid>
  `
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
      This example shows how to customize the column headers by setting the <code>header</code> property of
      <code>sl-grid-column</code>. If you are using custom elements in the header, make sure you add the
      <code>scopedElements</code> property to the column with the used custom elements. If you don't do this, the custom
      elements won't be rendered correctly.
    </p>
    <sl-grid .items=${students}>
      <sl-grid-column
        path="firstName"
        .header=${() => html`
          <span>First name</span>
          <sl-icon aria-describedby="tooltip" name="info"></sl-icon>
          <sl-tooltip id="tooltip">Some information about the first name</sl-tooltip>
        `}
        .scopedElements=${{ 'sl-icon': Icon, 'sl-tooltip': Tooltip }}
      >
      </sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column
        .header=${() => html`
          <sl-icon name="home-blank"></sl-icon>
          <span>City</span>
        `}
        path="school.city"
        .scopedElements=${{ 'sl-icon': Icon }}
      >
      </sl-grid-column>
      <sl-grid-column
        .header=${() => html`
          <span>School</span>
          <sl-menu-button fill="ghost" size="sm">
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
        }}
      >
      </sl-grid-column>
    </sl-grid>
  `
};

export const MenuButton: Story = {
  render: (_, { loaded: { students } }) => {
    const menuButtonRenderer: GridColumnDataRenderer<Student> = () => {
      return html`
        <sl-menu-button fill="ghost" size="sm">
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
        <code>sl-menu-button</code> inside it. Make sure to add the <code>scopedElements</code> property to the column
        with the used custom elements. If you don't do this, the custom elements won't be rendered correctly.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-column
          grow="3"
          header="Person"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column
          grow="0"
          header=""
          parts="menu-button"
          .renderer=${menuButtonRenderer}
          .scopedElements=${{
            'sl-icon': Icon,
            'sl-menu-button': MenuButtonComponent,
            'sl-menu-item': MenuItem
          }}
          width="48"
        ></sl-grid-column>
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
      <p>This example shows how, when using keyboard navigation, you can skip the grid and jump directly past it.</p>
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
        const response = await fetch(`https://dummyjson.com/quotes?skip=${page * pageSize}&limit=${pageSize}`);

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
        This example shows how you can lazy load the data. It uses <code>FetchListDataSource</code> to lazy load quotes
        by famous people from a remote service. It initially will only load the data for the visible rows. If you scroll
        further down the page, it will load additional data as needed. It uses data from
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
              variant="circle"
            ></sl-skeleton>
            <sl-skeleton style="block-size: 18px; inline-size: ${Math.max(Math.random() * 100, 30)}%"></sl-skeleton>
          </div>
        `;
      } else {
        const { firstName, infix, lastName, pictureUrl } = item;

        return html`
          <sl-avatar
            .displayName=${[firstName, infix, lastName].join(' ')}
            .pictureUrl=${pictureUrl}
            size="sm"
          ></sl-avatar>
        `;
      }
    };

    const dataSource = new FetchListDataSource<Student>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const { students, total } = await getStudents({ count: pageSize, startIndex: page * pageSize });

        // Simulate a slow response: wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        return { items: students, totalItems: total };
      },
      size: Math.floor(window.innerHeight / 30)
    });

    return html`
      <p>This example customizes the rendering of the student column to also handle loading states.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column grow="0" header="Nr." path="studentNumber" width="120"></sl-grid-column>
        <sl-grid-column
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const ReorderColumns: Story = {
  render: (_, { loaded: { students } }) => {
    class GridReorderExample extends LitElement {
      @state() columns = [{ path: 'fullName' }, { path: 'email' }, { path: 'group.name' }, { path: 'school.name' }];

      override render(): TemplateResult {
        return html`
          <p>This example demonstrates that when you reorder columns in a grid, the grid updates accordingly.</p>
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
