import { Avatar } from '@sl-design-system/avatar';
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

export const TruncateText: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} style="max-inline-size: 800px" truncate-text>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="address.street"></sl-grid-column>
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
