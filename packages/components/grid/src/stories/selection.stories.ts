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
import { type SlActiveRowChangeEvent, type SlSelectionChangeEvent } from '../grid.js';
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

export const ActivatableRow: Story = {
  render: (_, { loaded: { students } }) => {
    const onActiveRowChange = ({ detail: { item } }: SlActiveRowChangeEvent<Student>): void => {
      const element = document.getElementById('selection')!;

      element.innerText = item ? `You have selected ${item.fullName}.` : 'You have not selected anybody yet.';
    };

    return html`
      <p>
        This example allows you to activate a single row, by clicking anywhere on the row. This is done by adding the
        <code>activatable-row</code> attribute. If you want to perform an action when the active row changes, you can
        listen for <code>sl-grid-active-row-change</code> events.
      </p>
      <p id="selection">You have not selected anybody yet.</p>
      <sl-grid @sl-grid-active-row-change=${onActiveRowChange} .items=${students} activatable-row>
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

export const SelectsMultiple: Story = {
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

export const SelectsMultipleRow: Story = {
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

export const ActivatableRowWithSelectsMultiple: Story = {
  render: (_, { loaded: { students } }) => {
    const onActiveRowChange = ({ detail: { item } }: SlActiveRowChangeEvent<Student>): void => {
      const selection = document.getElementById('selection')!;

      if (item) {
        selection.innerText = `You have activated ${item.fullName}.`;
      } else {
        selection.innerText = 'You have not activated or selected anybody yet.';
      }
    };

    const onSelectionChange = ({ detail: { grid } }: SlSelectionChangeEvent<Student>): void => {
      const selection = document.getElementById('selection')!,
        selected = grid.dataSource?.selected ?? 0;

      if (selected > 0) {
        selection.innerText = `You have selected ${selected} ${selected > 1 ? 'students' : 'student'}.`;
      } else {
        selection.innerText = 'You have not activated or selected anybody yet.';
      }
    };

    return html`
      <p>
        This example shows how you can have mixed selection: you can perform bulk actions using the checkbox in the
        selection column while at the same time clicking anywhere else in the row to activate the row. You do this by
        adding both <code>activatable-row</code> and <code>selects="multiple"</code> attributes.
      </p>
      <p id="selection">You have not activated or selected anybody yet.</p>
      <sl-grid
        @sl-grid-active-row-change=${onActiveRowChange}
        @sl-grid-selection-change=${onSelectionChange}
        activatable-row
        .items=${students}
        selects="multiple"
      >
        <sl-grid-selection-column></sl-grid-selection-column>
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
