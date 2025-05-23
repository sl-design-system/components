import { faCopy, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Avatar } from '@sl-design-system/avatar';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type SlSelectionChangeEvent } from '../grid.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Selection',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
};

Icon.register(faCopy, faTrash);

export const SingleRow: Story = {
  render: (_, { loaded: { students } }) => {
    const onSelectionChange = ({ detail: { grid } }: SlSelectionChangeEvent<Student>): void => {
      const selection = grid.dataSource!.selection,
        element = document.getElementById('selection')!;

      if (selection.size > 0) {
        const id = selection.values().next().value,
          student = (students as Student[]).find(s => s.id === id);

        element.innerText = `You have selected ${student?.fullName}.`;
      } else {
        element.innerText = 'You have not selected anybody yet.';
      }
    };

    return html`
      <p>
        This example allows for single selection of rows in the grid, by clicking anywhere on the row. This is done by
        setting the <code>selects</code> property to <code>single-row</code>. If you want to perform an action when the
        selection changes, you can listen for <code>sl-grid-selection-change</code> events. Details on what is exactly
        selected can be found in the data source, accessible through <code>event.detail.grid.dataSource</code>.
      </p>
      <p id="selection">You have not selected anybody yet.</p>
      <sl-grid @sl-grid-selection-change=${onSelectionChange} .items=${students} selects="single-row">
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Multiple: Story = {
  args: {
    selectAll: false
  },
  render: ({ selectAll }, { loaded: { students } }) => {
    return html`
      <p>
        This example shows how you can select multiple rows by toggling the checkbox in the first column. If you add an
        <code>sl-grid-selection-column</code> element, it will automatically set the <code>selects</code> property to
        <code>multiple</code> for you. When you have selected multiple rows, you can perform bulk actions on them by
        using the floating tool-bar at the bottom of the grid. You can add bulk actions by using the
        <code>bulk-actions</code> slot.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-selection-column ?select-all=${selectAll}></sl-grid-selection-column>
        <sl-grid-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>

        <!-- These get slotted into the floating tool-bar -->
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-copy"></sl-icon>
          Duplicate
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-trash"></sl-icon>
          Delete
        </sl-button>
      </sl-grid>
    `;
  }
};

export const MultipleRow: Story = {
  render: (_, { loaded: { students } }) => {
    return html`
      <p>
        This example shows how you can select multiple rows at a time, but not just by toggling the checkbox at the
        start of the row, but by clicking anywhere on the row. This is done by setting the <code>selects</code> property
        to the <code>multiple-row</code> value.
      </p>
      <sl-grid .items=${students} selects="multiple-row">
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>

        <!-- These get slotted into the floating tool-bar -->
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-copy"></sl-icon>
          Duplicate
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-trash"></sl-icon>
          Delete
        </sl-button>
      </sl-grid>
    `;
  }
};

export const Grouped: Story = {
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    return html`
      <p>
        This example shows how selection works in combination with grouping. By adding a
        <code>sl-grid-selection-column</code> element, the grid is automatically configured for multiple selection.
        Since grouping is also enabled through the <code>groupBy</code> data source option, the grid will automatically
        handle the selection of groups and items. When you have selected multiple rows, you can perform bulk actions on
        them by using the floating tool-bar at the bottom of the grid. You can add bulk actions by using the
        <code>bulk-actions</code> slot.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};
