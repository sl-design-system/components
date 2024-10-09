import { Avatar } from '@sl-design-system/avatar';
import { FetchDataSource, FetchDataSourceError, FetchDataSourcePlaceholder } from '@sl-design-system/data-source';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
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
  loaders: [async () => ({ people: (await getPeople()).people })]
};

export const Simple: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const Few: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const Small: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} style="width: 300px">
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
    </sl-grid>
  `
};

export const ColumnGroups: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} striped>
      <sl-grid-column-group header="Name">
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
      </sl-grid-column-group>
      <sl-grid-column-group header="Address">
        <sl-grid-column path="address.street"></sl-grid-column>
        <sl-grid-column path="address.city"></sl-grid-column>
        <sl-grid-column path="address.zip"></sl-grid-column>
        <sl-grid-column path="address.state"></sl-grid-column>
      </sl-grid-column-group>
      <sl-grid-column-group>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid-column-group>
    </sl-grid>
  `
};

export const EllipsizeTextAllColumns: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} style="max-inline-size: 500px" ellipsize-text>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="address.street"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
      <sl-grid-column path="membership"></sl-grid-column>
    </sl-grid>
  `
};

export const EllipsizeTextSingleColumn: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} style="max-inline-size: 800px">
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="address.street" ellipsize-text></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
      <sl-grid-column path="membership"></sl-grid-column>
    </sl-grid>
  `
};

export const CustomRenderers: Story = {
  render: (_, { loaded: { people } }) => {
    const avatarRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
      return html`<sl-avatar .displayName=${[firstName, lastName].join(' ')} size="sm"></sl-avatar>`;
    };

    const menuButtonRenderer: GridColumnDataRenderer<Person> = person => {
      const onClick = () => {
        console.log('Menu item for person clicked', person);
      };

      return html`
        <sl-menu-button fill="ghost">
          <sl-icon slot="button" name="ellipsis"></sl-icon>
          <sl-menu-item @click=${onClick}>Do something with this person</sl-menu-item>
          <sl-menu-item @click=${onClick}>Something else</sl-menu-item>
          <hr />
          <sl-menu-item @click=${onClick}>Delete person</sl-menu-item>
        </sl-menu-button>
      `;
    };

    return html`
      <sl-grid .items=${people}>
        <sl-grid-column
          grow="3"
          header="Person"
          .renderer=${avatarRenderer}
          .scopedElements=${{
            'sl-avatar': Avatar,
            'sl-icon': Icon,
            'sl-menu-button': MenuButton,
            'sl-menu-item': MenuItem
          }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column grow="0" header="" .renderer=${menuButtonRenderer} width="64"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const CustomHeader: Story = {
  render: (_, { loaded: { people } }) => html`
    <style>
      sl-grid::part(first-name),
      sl-grid::part(address-city) {
        gap: 8px;
      }

      sl-grid::part(profession) {
        justify-content: space-between;
      }
    </style>
    <sl-grid .items=${people}>
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
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column
        path="address.city"
        .header=${html`
          City
          <sl-icon name="home-blank"></sl-icon>
        `}
        .scopedElements=${{ 'sl-icon': Icon }}
      >
      </sl-grid-column>
      <sl-grid-column
        path="profession"
        .header=${html`
          Profession
          <sl-menu-button fill="ghost">
            <sl-icon slot="button" name="ellipsis"></sl-icon>
            <sl-menu-item>Option 1</sl-menu-item>
            <sl-menu-item>Option 2</sl-menu-item>
            <sl-menu-item>Option 3</sl-menu-item>
          </sl-menu-button>
        `}
        .scopedElements=${{ 'sl-icon': Icon, 'sl-menu-button': MenuButton, 'sl-menu-item': MenuItem }}
      >
      </sl-grid-column>
    </sl-grid>
  `
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

    const dataSource = new FetchDataSource<Quote>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const response = await fetch(`https://dummyjson.com/quotes?skip=${(page - 1) * pageSize}&limit=${pageSize}`);

        if (response.ok) {
          const { quotes, total } = (await response.json()) as QuotesResponse;

          return { items: quotes, totalItems: total };
        } else {
          throw new FetchDataSourceError('Failed to fetch data', response);
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
    const dataSource = new FetchDataSource<Person>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const { people, total } = await getPeople({ count: pageSize, startIndex: (page - 1) * pageSize });

        // Simulate a slow response
        await new Promise(resolve => setTimeout(resolve, 5000));

        return { items: people, totalItems: total };
      },
      size: Math.floor(window.innerHeight / 30)
    });

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="id"></sl-grid-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const CustomSkeleton: Story = {
  render: () => {
    const avatarRenderer: GridColumnDataRenderer<Person> = item => {
      if (typeof item === 'symbol' && item === FetchDataSourcePlaceholder) {
        return html`
          <div style="display: flex; align-items: center; gap: 0.25rem; inline-size: 100%">
            <sl-skeleton style="aspect-ratio: 1; block-size: var(--sl-size-avatar-sm)" variant="circle"></sl-skeleton>
            <sl-skeleton style="block-size: 18px; inline-size: ${Math.max(Math.random() * 100, 30)}%"></sl-skeleton>
          </div>
        `;
      } else {
        const { firstName, lastName } = item;

        return html`<sl-avatar .displayName=${[firstName, lastName].join(' ')} size="sm"></sl-avatar>`;
      }
    };

    const dataSource = new FetchDataSource<Person>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const { people, total } = await getPeople({ count: pageSize, startIndex: (page - 1) * pageSize });

        // Simulate a slow response
        await new Promise(resolve => setTimeout(resolve, 5000));

        return { items: people, totalItems: total };
      },
      size: Math.floor(window.innerHeight / 30)
    });

    return html`
      <sl-grid .dataSource=${dataSource} .scopedElements=${{ 'sl-avatar': Avatar }}>
        <sl-grid-column grow="0" path="id" width="50"></sl-grid-column>
        <sl-grid-column header="Student" .renderer=${avatarRenderer}></sl-grid-column>
      </sl-grid>
    `;
  }
};
