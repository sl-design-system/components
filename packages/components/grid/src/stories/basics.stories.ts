import { Avatar } from '@sl-design-system/avatar';
import {
  FetchListDataSource,
  FetchListDataSourceError,
  FetchListDataSourcePlaceholder
} from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { MenuButton as MenuButtonComponent, MenuItem } from '@sl-design-system/menu';
import { Tooltip } from '@sl-design-system/tooltip';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type GridColumnDataRenderer } from '../column.js';

type Story = StoryObj;

export default {
  title: 'Grid/Basics',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
};

export const Basic: Story = {
  render: (_, { loaded: { students } }) => {
    const avatarRenderer: GridColumnDataRenderer<Student> = ({ firstName, infix, lastName, pictureUrl }) => {
      return html`
        <sl-avatar
          .displayName=${[firstName, infix, lastName].join(' ')}
          .pictureUrl=${pictureUrl}
          size="sm"
        ></sl-avatar>
      `;
    };

    const dateOfBirthRenderer: GridColumnDataRenderer<Student> = ({ dateOfBirth }) => {
      return html`<sl-format-date .date=${dateOfBirth}></sl-format-date>`;
    };

    return html`
      <sl-grid .items=${students}>
        <sl-grid-column header="Nr." path="studentNumber"></sl-grid-column>
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
    <sl-grid .items=${students}>
      <sl-grid-column
        path="firstName"
        .header=${html`
          First name
          <sl-icon aria-describedby="tooltip" name="info"></sl-icon>
          <sl-tooltip id="tooltip">Some information about the first name</sl-tooltip>
        `}
        .scopedElements=${{ 'sl-icon': Icon, 'sl-tooltip': Tooltip }}
      >
      </sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column
        .header=${html`
          <sl-icon name="home-blank"></sl-icon>
          City
        `}
        path="school.city"
        .scopedElements=${{ 'sl-icon': Icon }}
      >
      </sl-grid-column>
      <sl-grid-column
        .header=${html`
          School
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
    const avatarRenderer: GridColumnDataRenderer<Student> = ({ firstName, infix, lastName, pictureUrl }) => {
      return html`
        <sl-avatar
          .displayName=${[firstName, infix, lastName].join(' ')}
          .pictureUrl=${pictureUrl}
          size="sm"
        ></sl-avatar>
      `;
    };

    const menuButtonRenderer: GridColumnDataRenderer<Student> = student => {
      const onClick = () => {
        console.log('Menu item for student clicked', student);
      };

      return html`
        <sl-menu-button fill="ghost">
          <sl-icon slot="button" name="ellipsis"></sl-icon>
          <sl-menu-item @click=${onClick}>Do something with this student</sl-menu-item>
          <sl-menu-item @click=${onClick}>Something else</sl-menu-item>
          <hr />
          <sl-menu-item @click=${onClick}>Delete person</sl-menu-item>
        </sl-menu-button>
      `;
    };

    return html`
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
          .renderer=${menuButtonRenderer}
          .scopedElements=${{
            'sl-icon': Icon,
            'sl-menu-button': MenuButtonComponent,
            'sl-menu-item': MenuItem
          }}
          width="64"
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
      <h1>Some data for your information:</h1>
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
      if (typeof item === 'symbol' && item === FetchListDataSourcePlaceholder) {
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
