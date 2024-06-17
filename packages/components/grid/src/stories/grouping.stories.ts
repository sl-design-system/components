import { type Person, getPeople } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { ArrayDataSource } from '@sl-design-system/shared';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type GridGroupHeaderRenderer } from '../grid.js';
import { type GridViewModelGroup } from '../view-model.js';

type Story = StoryObj;

export default {
  title: 'Layout/Grid/Grouping'
};

export const Basic: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Collapsed: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    setTimeout(() => {
      const grid = document.querySelector('sl-grid')!;
      grid.view.groups.forEach(group => grid.view.toggleGroup(group));
    });

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const CustomHeader: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    const groupHeaderRenderer: GridGroupHeaderRenderer = (group: GridViewModelGroup) => {
      return html`
        <span part="group-heading">${group.value}</span>
        <sl-menu-button fill="ghost" size="sm" style="margin: 4px;">
          <sl-icon name="ellipsis" slot="button"></sl-icon>
          <sl-menu-item>Option 1</sl-menu-item>
          <sl-menu-item>Option 2</sl-menu-item>
        </sl-menu-button>
      `;
    };

    return html`
      <sl-grid
        .dataSource=${dataSource}
        .groupHeaderRenderer=${groupHeaderRenderer}
        .scopedElements=${{ 'sl-icon': Icon, 'sl-menu-button': MenuButton, 'sl-menu-item': MenuItem }}
      >
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};
