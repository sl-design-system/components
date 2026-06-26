import { faCopy, faRightToLine, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import {
  ArrayListDataSource,
  isListDataSourceDataItem,
  isListDataSourceGroupItem
} from '@sl-design-system/data-source';
import '@sl-design-system/dialog/register.js';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../register.js';
import { type SlActiveRowChangeEvent, type SlSelectionChangeEvent } from '../grid.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Selection',
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
};

Icon.register(faCopy, faRightToLine, faTrash);

export const Activate: Story = {
  render: (_, { loaded: { students } }) => {
    let activeStudent: Student | undefined;

    const onActiveRowChange = ({ detail: student }: SlActiveRowChangeEvent<Student>): void => {
      activeStudent = student;
      document.getElementById('selection')!.innerText = student
        ? `You have activated ${student.fullName}.`
        : 'You have not activated anybody yet.';
    };

    return html`
      <p>
        This example allows you to activate a student by clicking anywhere on the row, or by using
        the keyboard to click on the button with the avatar. This behavior is enabled by setting the
        <code>row-action</code> property to <code>activate</code>. After activation, the activated
        student will be highlighted in the grid by setting the <code>activeRow</code> property. An
        <code>sl-grid-active-row-change</code> event is dispatched when the active row changes,
        which you can use to update the UI or perform other actions based on the active row.
      </p>
      <p>
        <strong>Note:</strong> For accessibility, you should add <code>aria-pressed</code> and
        <code>aria-description</code> to the button that activates the row. Set
        <code>aria-pressed</code> to <code>"true"</code> when the row is active and
        <code>"false"</code> when it is not. Set <code>aria-description</code> to "Activate row" or
        "Deactivate row" depending on the state. The grid does not set these attributes for you, so
        you need to track the active row using the <code>sl-grid-active-row-change</code> event and
        update your renderer accordingly. See the code below for an example.
      </p>
      <p id="selection">You have not activated anybody yet.</p>
      <sl-grid
        @sl-grid-active-row-change=${onActiveRowChange}
        .items=${students}
        row-action="activate">
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${(student: Student) => {
            const isActive = activeStudent === student;

            return html`
              <sl-button
                aria-description=${isActive ? 'Deactivate row' : 'Activate row'}
                aria-pressed=${isActive ? 'true' : 'false'}
                fill="link"
                variant="primary">
                ${avatarRenderer(student)}
              </sl-button>
            `;
          }}
          .scopedElements=${{ 'sl-avatar': Avatar, 'sl-button': Button }}></sl-grid-column>
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
        This example shows how you can select multiple rows by toggling the checkbox in the first
        column. If you add an <code>sl-grid-selection-column</code> element, it will automatically
        enable multi selection for you. When you have selected multiple rows, you can perform bulk
        actions on them by using the floating tool-bar at the bottom of the grid. You can add bulk
        actions by using the <code>bulk-actions</code> slot.
      </p>
      <sl-grid .items=${(students as Student[]).slice(0, 5)}>
        <sl-grid-selection-column ?select-all=${selectAll}></sl-grid-selection-column>
        <sl-grid-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
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
        <sl-button disabled fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          Action 1
        </sl-button>
        <sl-button
          aria-disabled="true"
          fill="outline"
          slot="bulk-actions"
          tooltip="I am a tooltip"
          variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          Action 2
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          Action 3
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          This is a very long action button
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          This is another very long action button
        </sl-button>
      </sl-grid>
    `;
  }
};

export const MultipleInDialog: Story = {
  tags: ['!dev'], // this is a scenario that is highly questionable, so we don't want to show it in the side bar, but keep it on hand if someone needs it
  args: {
    selectAll: false
  },
  render: ({ selectAll }, { loaded: { students } }) => {
    return html`
      <style>
        sl-dialog::part(dialog) {
          anchor-name: --grid-dialog;
          max-block-size: 70vh;
        }
        sl-dialog::part(body) {
          display: flex;
          flex-direction: column;
        }
        sl-grid::part(bulk-actions) {
          inset-block-start: calc(anchor(bottom) - var(--sl-size-300));
          position-anchor: --grid-dialog;
        }
      </style>
      <p>This example shows how a grid with selection behaves in a dialog.</p>
      <p>
        This is actually a bad idea, UX/UI wise, but we show it for demonstration/ documentation
        purposes.
      </p>
      <sl-button command="--show-modal" commandfor="invoker-dialog">Open dialog</sl-button>

      <p>
        With some extra styling it is possible to make the grid behave nicely in the dialog, with
        the floating tool-bar anchored to the bottom of the dialog and not the viewport. This way,
        the bulk actions are always easily accessible when you select rows, even when the dialog is
        scrollable.
      </p>
      <p>
        Also wrap the grid in a <code>div</code> with <code>overflow: auto</code> to make the
        overflow behave better when the content exceeds the maximum height of the dialog.
      </p>

      <pre
        style="background: var(--sl-color-background-subtle); padding: var(--sl-size-200); border-radius: var(--sl-size-borderRadius-default); overflow: auto">
sl-dialog::part(dialog) {
  anchor-name: --grid-dialog;
  max-block-size: 70vh;
}

sl-dialog::part(body) {
  display: flex;
  flex-direction: column;
}

sl-grid::part(bulk-actions) {
  inset-block-start: calc(anchor(bottom) - var(--sl-size-300));
  position-anchor: --grid-dialog;
}</pre
      >

      <p>
        There is a known issue where the bulk actions bar gets placed under the dialog overlay when
        you close and reopen the dialog. To work around this, you can deselect all rows after
        closing the dialog.
        <br />
        Also, the virtual list seems to have a bit of a problem rendering the items in the dialog;
        the placement is off by a few pixels, until you select a row.
      </p>
      <sl-dialog id="invoker-dialog" close-button>
        <p>
          This example shows how you can select multiple rows by toggling the checkbox in the first
          column. If you add an
          <code>sl-grid-selection-column</code>
          element, it will automatically enable multi selection for you. When you have selected
          multiple rows, you can perform bulk actions on them by using the floating tool-bar at the
          bottom of the grid. You can add bulk actions by using the
          <code>bulk-actions</code>
          slot.
        </p>
        <div style="flex:1; overflow: auto">
          <sl-grid .items=${(students as Student[]).slice(0, 30)}>
            <sl-grid-selection-column ?select-all=${selectAll}></sl-grid-selection-column>
            <sl-grid-column
              header="Student"
              path="fullName"
              .renderer=${avatarRenderer}
              .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
            <sl-grid-column path="email"></sl-grid-column>

            <!-- These get slotted into the floating tool-bar -->
            <sl-button fill="outline" slot="bulk-actions" variant="inverted">
              <sl-icon name="far-copy"></sl-icon> Duplicate
            </sl-button>
            <sl-button fill="outline" slot="bulk-actions" variant="inverted">
              <sl-icon name="far-trash"></sl-icon>
              Delete
            </sl-button>
            <sl-button disabled fill="outline" slot="bulk-actions" variant="inverted">
              <sl-icon name="far-right-to-line"></sl-icon>
              Action 1
            </sl-button>
            <sl-button
              aria-disabled="true"
              fill="outline"
              slot="bulk-actions"
              tooltip="I am a tooltip"
              variant="inverted">
              <sl-icon name="far-right-to-line"></sl-icon>
              Action 2
            </sl-button>
            <sl-button fill="outline" slot="bulk-actions" variant="inverted">
              <sl-icon name="far-right-to-line"></sl-icon>
              Action 3
            </sl-button>
            <sl-button fill="outline" slot="bulk-actions" variant="inverted">
              <sl-icon name="far-right-to-line"></sl-icon>
              This is a very long action button
            </sl-button>
            <sl-button fill="outline" slot="bulk-actions" variant="inverted">
              <sl-icon name="far-right-to-line"></sl-icon>
              This is another very long action button
            </sl-button>
          </sl-grid>
        </div>
      </sl-dialog>
    `;
  }
};

export const MultipleWithMenuButton: Story = {
  args: {
    selectAll: false
  },
  render: ({ selectAll }, { loaded: { students } }) => {
    return html`
      <p>
        This example validates click events for menu items in bulk actions when the floating
        tool-bar is collapsed. Reduce the viewport width, select rows, open "Visibility" and click
        "Hide" or "Show".
      </p>
      <sl-grid .items=${(students as Student[]).slice(0, 5)}>
        <sl-grid-selection-column ?select-all=${selectAll}></sl-grid-selection-column>
        <sl-grid-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>

        <!-- These get slotted into the floating tool-bar -->
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-copy"></sl-icon>
          Duplicate
        </sl-button>

        <sl-menu-button
          aria-label="Visibility"
          fill="outline"
          slot="bulk-actions"
          variant="inverted">
          <span slot="button">Visibility</span>
          <sl-menu-item @click=${() => alert('Hide')}>Hide</sl-menu-item>
          <sl-menu-item @click=${() => alert('Show')}>Show</sl-menu-item>
        </sl-menu-button>

        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-trash"></sl-icon>
          Delete
        </sl-button>
        <sl-button disabled fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-right-to-line"></sl-icon>
          Action 1
        </sl-button>
        <sl-button
          aria-disabled="true"
          fill="outline"
          slot="bulk-actions"
          tooltip="I am a tooltip"
          variant="inverted">
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
    let data = [...(students as Student[])];

    const ds = new ArrayListDataSource(data);

    const getSelectedIds = (): string[] => {
      return ds.items
        .filter(item => ds.isSelected(item))
        .filter(item => isListDataSourceDataItem(item))
        .map(item => item.data.id);
    };

    const onCopy = (): void => {
      const ids = getSelectedIds();

      data = data.flatMap(student => {
        if (ids.includes(student.id)) {
          const copy = {
            ...student,
            id: `${student.id}-copy`,
            lastName: `${student.lastName} (copy)`,
            fullName: `${student.firstName}${student.infix ? ` ${student.infix}` : ''} ${student.lastName} (copy)`
          };

          return [student, copy];
        }

        return [student];
      });

      ds.setData(data);
      ds.update();
    };

    const onDelete = (): void => {
      const ids = getSelectedIds();

      data = data.filter(student => !ids.includes(student.id));

      ds.setData(data);
      ds.deselectAll();
      ds.update();
    };

    const onUpdate = (): void => {
      const ids = getSelectedIds();

      data = data.map(student => {
        if (ids.includes(student.id)) {
          return { ...student, email: 'updated@example.com' };
        }

        return student;
      });

      ds.setData(data);
      ds.update();
    };

    return html`
      <p>
        This example shows how you can select multiple rows at a time, but not just by toggling the
        checkbox at the start of the row, but by clicking anywhere on the row. This is done by
        setting the <code>row-action</code> property to the <code>select</code> value.
      </p>
      <p>
        This example also shows how you can perform bulk actions on the selected rows by using the
        floating tool-bar at the bottom of the grid. The actions do not create a new data source,
        but instead update the existing data source by calling
        <code>setData()</code>
        and
        <code>update()</code>
        to signal the grid the data has changed. This way, you do not lose any state when the data
        changes.
      </p>
      <sl-grid .dataSource=${ds} row-action="select">
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>

        <!-- These get slotted into the floating tool-bar -->
        <sl-button @click=${onUpdate} fill="outline" slot="bulk-actions" variant="inverted">
          Update emails
        </sl-button>
        <sl-button @click=${onCopy} fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-copy"></sl-icon>
          Duplicate
        </sl-button>
        <sl-button @click=${onDelete} fill="outline" slot="bulk-actions" variant="inverted">
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
        This example shows a combination of selection and filtering. You can have a selection that
        may not be visible due to filtering.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-filter-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-filter-column>
        <sl-grid-filter-column
          header="School"
          label-path="school.name"
          mode="select"
          path="school.id"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const WithLinks: Story = {
  render: (_, { loaded: { students } }) => {
    let activeStudent: Student | undefined;

    const onActiveRowChange = ({ detail: student }: SlActiveRowChangeEvent<Student>): void => {
      activeStudent = student;
      document.getElementById('selection')!.innerText = student
        ? `You have activated ${student.fullName}.`
        : 'You have not activated or selected anybody yet.';
    };

    const onSelectionChange = ({ detail: { grid } }: SlSelectionChangeEvent<Student>): void => {
      const selection = document.getElementById('selection')!,
        selected = grid.dataSource?.selected ?? 0;

      if (selected > 0) {
        grid.activeRow = undefined; // Reset selected student when selection changes
        activeStudent = undefined;

        selection.innerText = `You have selected ${selected} ${selected > 1 ? 'students' : 'student'}.`;
      } else {
        selection.innerText = 'You have not activated or selected anybody yet.';
      }
    };

    return html`
      <p>
        This example shows how you can have mixed selection: you can perform bulk actions using the
        checkbox in the selection column while at the same time clicking anywhere else to activate
        the row. Using keyboard, you can do both.
      </p>
      <p>
        <strong>Note:</strong> For accessibility, you should add <code>aria-pressed</code> and
        <code>aria-description</code> to the button that activates the row. Set
        <code>aria-pressed</code> to <code>"true"</code> when the row is active and
        <code>"false"</code> when it is not. Set <code>aria-description</code> to "Activate row" or
        "Deactivate row" depending on the state. The grid does not set these attributes for you, so
        you need to track the active row using the <code>sl-grid-active-row-change</code> event and
        update your renderer accordingly. See the code below for an example.
      </p>
      <p id="selection">You have not activated or selected anybody yet.</p>
      <sl-grid
        @sl-grid-active-row-change=${onActiveRowChange}
        @sl-grid-selection-change=${onSelectionChange}
        .items=${students}
        row-action="activate">
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${(student: Student) => {
            const isActive = activeStudent === student;

            return html`
              <sl-button
                aria-description=${isActive ? 'Deactivate row' : 'Activate row'}
                aria-pressed=${isActive ? 'true' : 'false'}
                fill="link"
                variant="primary">
                ${avatarRenderer(student)}
              </sl-button>
            `;
          }}
          .scopedElements=${{ 'sl-avatar': Avatar, 'sl-button': Button }}></sl-grid-column>
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
    let data = students as Student[];

    const ds = new ArrayListDataSource(data, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    const onClick = (): void => {
      const selected = ds.unfilteredItems
        .filter(item => isListDataSourceDataItem(item))
        .filter(item => ds.isSelected(item))
        .map(item => item.data.firstName);

      document.getElementById('selected-students')!.innerText =
        selected.join(', ') || '(no selected students)';
    };

    const onDelete = (): void => {
      const ids = ds.items
        .filter(item => ds.isSelected(item))
        .flatMap(item => (isListDataSourceGroupItem(item) ? (item.members ?? []) : [item]))
        .map(item => item.data.id);

      data = data.filter(student => !ids.includes(student.id));

      ds.setData(data);
      ds.deselectAll();
      ds.update();
    };

    return html`
      <p>
        This example shows how selection works in combination with grouping. By adding a
        <code>sl-grid-selection-column</code>
        element, the grid is automatically configured for multiple selection. Since grouping is also
        enabled through the
        <code>groupBy</code>
        data source option, the grid will automatically handle the selection of groups and items.
        When you have selected multiple rows, you can perform bulk actions on them by using the
        floating tool-bar at the bottom of the grid. You can add bulk actions by using the
        <code>bulk-actions</code>
        slot.
      </p>
      <sl-button-bar @click=${onClick} style="margin-block-end: var(--sl-size-200)">
        <sl-button>Get selected students</sl-button>
        <span id="selected-students">(no selected students)</span>
      </sl-button-bar>
      <sl-grid .dataSource=${ds}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>

        <!-- These get slotted into the floating tool-bar -->
        <sl-button @click=${onDelete} fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-trash"></sl-icon>
          Delete
        </sl-button>
      </sl-grid>
    `;
  }
};
