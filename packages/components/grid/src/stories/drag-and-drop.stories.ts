import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource, isListDataSourceDataItem } from '@sl-design-system/data-source';
import { type Person, getPeople, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '.././register.js';
import { type GridDropFilter, type SlDropEvent } from '../grid.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

const regroupDroppedPerson = (
  dataSource: ArrayListDataSource<Person>,
  event: SlDropEvent<Person>
): void => {
  const { item, relativeItem } = event.detail,
    targetMembership = relativeItem?.membership;

  if (
    !isListDataSourceDataItem(item) ||
    !targetMembership ||
    item.data.membership === targetMembership
  ) {
    return;
  }

  const updatedPeople = dataSource.unfilteredItems.map(({ data }) =>
    data === item.data ? { ...data, membership: targetMembership } : data
  );

  dataSource.setData(updatedPeople);
  dataSource.update();
};

export default {
  title: 'Grid/Drag and drop',
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { students } }) => {
    return html`
      <p>
        Drag a row by its handle and drop it between other rows to change their order. Adding a
        <code>sl-grid-drag-handle-column</code> automatically sets <code>draggable-rows</code> to
        <code>between</code>, so the grid reorders the rows as you drag. This example uses unsorted
        columns so the rows keep the order you choose.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
        <sl-grid-column
          grow="3"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const OnTop: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayListDataSource(people as Person[]);
    const dropFilter: GridDropFilter<Person> = ({ membership }) => membership !== 'Regular';

    const onDrop = (event: SlDropEvent<Person>): void => {
      const { item, relativeItem, position } = event.detail;
      if (position !== 'on-top' || !relativeItem || !dropFilter(relativeItem)) {
        return;
      }

      const items = dataSource.items,
        sourceIndex = items.findIndex(source => source.type === item.type && source.id === item.id),
        targetIndex = items.findIndex(
          target => isListDataSourceDataItem(target) && target.data === relativeItem
        );

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return;
      }

      dataSource.reorder(item, items[targetIndex], sourceIndex < targetIndex ? 'after' : 'before');
    };

    return html`
      <p>
        Drop a row on a highlighted member to move it to that member's position. Regular members
        cannot be drop targets. In <code>on-top</code> mode, the application handles
        <code>sl-grid-drop</code> and updates the data source explicitly.
      </p>
      <sl-grid
        @sl-grid-drop=${onDrop}
        draggable-rows="on-top"
        .dropFilter=${dropFilter}
        .dataSource=${dataSource}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Fixed: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    (people as Array<Person & { draggable: boolean }>).forEach(
      (person, index) => (person.draggable = index > 0 && index <= 6)
    );

    return html`
      <sl-grid .items=${people}>
        <sl-grid-drag-handle-column path="draggable"></sl-grid-drag-handle-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Grouping: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayListDataSource(people as Person[], {
      groupBy: 'membership'
    });

    const onDrop = (event: SlDropEvent<Person>): void => {
      regroupDroppedPerson(dataSource, event);
    };

    return html`
      <p>
        This example shows drag and drop behavior in combination with grouping. You can drag
        individual rows or complete groups. Reordering within a group keeps the current membership.
        Dropping a row onto a different group moves the person into that group by updating the
        membership field.
      </p>
      <sl-grid @sl-grid-drop=${onDrop} .dataSource=${dataSource}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};
