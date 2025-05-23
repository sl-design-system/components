import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Person, type Student, getPeople, getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type GridGroupHeaderRenderer } from '../grid.js';
import { type GridViewModelGroup } from '../view-model.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Grouping',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
};

export const Basic: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[]);
    dataSource.setGroupBy('school.id', undefined, undefined, 'school.name');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Collapsed: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[]);
    dataSource.setGroupBy('school.id', undefined, undefined, 'school.name');

    setTimeout(() => {
      const grid = document.querySelector('sl-grid')!;
      grid.view.groups.forEach(group => grid.view.toggleGroup(group));
    });

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Selection: Story = {
  render: () => {
    return html`<p>This example shows how you combine grouping with selection.</p>`;
  }
};

export const DragAndDrop: Story = {
  render: () => {
    return html`<p>This example shows how you combine grouping with drag and drop.</p>`;
  }
};

export const CustomGroupHeader: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayListDataSource(people as Person[]);
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
