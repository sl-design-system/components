import { faCopy, faRightToLine, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
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

Icon.register(faCopy, faRightToLine, faTrash);

export const Activate: Story = {
  render: (_, { loaded: { students } }) => {
    const onActiveRowChange = ({ detail: student }: SlActiveRowChangeEvent<Student>): void => {
      document.getElementById('selection')!.innerText = student
        ? `You have activated ${student.fullName}.`
        : 'You have not activated anybody yet.';
    };

    return html`
      <p>
        This example allows you to activate a student by clicking anywhere on the row, or by using the keyboard to click
        on the button with the avatar. This behavior is enabled by setting the <code>row-action</code> property to
        <code>activate</code>. After activation, the activated student will be highlighted in the grid by setting the
        <code>activeRow</code> property. An <code>sl-grid-active-row-change</code> event is dispatched when the active
        row changes, which you can use to update the UI or perform other actions based on the active row.
      </p>
      <p id="selection">You have not activated anybody yet.</p>
      <sl-grid @sl-grid-active-row-change=${onActiveRowChange} .items=${students} row-action="activate">
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${(student: Student) => html`
            <sl-button fill="link" variant="primary">${avatarRenderer(student)}</sl-button>
          `}
          .scopedElements=${{ 'sl-avatar': Avatar, 'sl-button': Button }}
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
        <code>sl-grid-selection-column</code> element, it will automatically enable multi selection for you. When you
        have selected multiple rows, you can perform bulk actions on them by using the floating tool-bar at the bottom
        of the grid. You can add bulk actions by using the <code>bulk-actions</code> slot.
      </p>
      <sl-grid .items=${(students as Student[]).slice(0, 5)}>
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
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          Action 1
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          Action 2
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          Action 3
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
        start of the row, but by clicking anywhere on the row. This is done by setting the
        <code>row-action</code> property to the <code>select</code> value.
      </p>
      <sl-grid .items=${students} row-action="select">
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

export const WithFiltering: Story = {
  render: (_, { loaded: { students } }) => {
    return html`
      <p>
        This example shows a combination of selection and filtering. You can have a selection that may not be visible
        due to filtering.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-filter-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-filter-column>
        <sl-grid-filter-column
          header="School"
          label-path="school.name"
          mode="select"
          path="school.id"
        ></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const WithLinks: Story = {
  render: (_, { loaded: { students } }) => {
    const onActiveRowChange = ({ detail: student }: SlActiveRowChangeEvent<Student>): void => {
      document.getElementById('selection')!.innerText = student
        ? `You have activated ${student.fullName}.`
        : 'You have not activated or selected anybody yet.';
    };

    const onSelectionChange = ({ detail: { grid } }: SlSelectionChangeEvent<Student>): void => {
      const selection = document.getElementById('selection')!,
        selected = grid.dataSource?.selected ?? 0;

      if (selected > 0) {
        grid.activeRow = undefined; // Reset selected student when selection changes

        selection.innerText = `You have selected ${selected} ${selected > 1 ? 'students' : 'student'}.`;
      } else {
        selection.innerText = 'You have not activated or selected anybody yet.';
      }
    };

    return html`
      <p>
        This example shows how you can have mixed selection: you can perform bulk actions using the checkbox in the
        selection column while at the same time clicking anywhere else to activate the row. Using keyboard, you can do
        both.
      </p>
      <p id="selection">You have not activated or selected anybody yet.</p>
      <sl-grid
        @sl-grid-active-row-change=${onActiveRowChange}
        @sl-grid-selection-change=${onSelectionChange}
        .items=${students}
        row-action="activate"
      >
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${(student: Student) => html`
            <sl-button fill="link" variant="primary">${avatarRenderer(student)}</sl-button>
          `}
          .scopedElements=${{ 'sl-avatar': Avatar, 'sl-button': Button }}
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
