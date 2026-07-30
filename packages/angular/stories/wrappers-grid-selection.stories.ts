import { faCopy } from '@fortawesome/pro-regular-svg-icons';
import { ButtonComponent } from '@sl-design-system/angular/button';
import { ButtonBarComponent } from '@sl-design-system/angular/button-bar';
import {
  GridColumnComponent,
  GridComponent,
  GridFilterColumnComponent,
  GridSelectionColumnComponent
} from '@sl-design-system/angular/grid';
import { IconComponent } from '@sl-design-system/angular/icon';
import { MenuButtonComponent, MenuItemComponent } from '@sl-design-system/angular/menu';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import {
  ArrayListDataSource,
  isListDataSourceDataItem,
  isListDataSourceGroupItem
} from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { Icon as SlIcon } from '@sl-design-system/icon';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { html } from 'lit';

SlIcon.register(faCopy);

const avatarRenderer = (student: Student) => html`
  <sl-avatar
    .displayName=${student.fullName}
    .pictureUrl=${student.pictureUrl}
    size="sm"></sl-avatar>
`;

const avatarScopedElements = { 'sl-avatar': Avatar };
const avatarButtonScopedElements = { 'sl-avatar': Avatar, 'sl-button': Button };

export default {
  title: 'Wrappers/Grid/Selection',
  decorators: [
    moduleMetadata({
      imports: [
        ButtonBarComponent,
        ButtonComponent,
        GridComponent,
        GridColumnComponent,
        GridSelectionColumnComponent,
        GridFilterColumnComponent,
        IconComponent,
        MenuButtonComponent,
        MenuItemComponent
      ]
    })
  ]
} as Meta;

export const Activate: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    let activeStudent: Student | undefined;
    let message = 'You have not activated anybody yet.';

    const activateRenderer = (student: Student) => {
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
    };

    const onActiveRowChange = (event: Event): void => {
      const student = (event as CustomEvent<Student>).detail;
      activeStudent = student;
      message = student
        ? `You have activated ${student.fullName}.`
        : 'You have not activated anybody yet.';
      (event.target as HTMLElement)
        .closest('div')!
        .querySelector('#activation-message')!.textContent = message;

      // Keep button aria state in sync with the active row.
      (event.target as { requestUpdate?(): void }).requestUpdate?.();
    };

    return {
      description:
        'This example allows you to activate a student by clicking anywhere on the row. This behavior is enabled by setting the row-action property to activate.',
      props: { students, onActiveRowChange, activateRenderer, avatarButtonScopedElements },
      template: `
        <p id="activation-message">You have not activated anybody yet.</p>
        <sl-grid
          [items]="students"
          rowAction="activate"
          [noSkipLinks]="true"
          (slGridActiveRowChange)="onActiveRowChange($event)">
          <sl-grid-column
            [grow]="3"
            header="Student"
            [renderer]="activateRenderer"
            [scopedElements]="avatarButtonScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Multiple: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = (loaded['students'] as Student[]).slice(0, 5);

    return {
      description:
        'This example shows how you can select multiple rows by toggling the checkbox in the first column. Bulk actions appear in a floating toolbar when rows are selected.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-selection-column [selectAll]="false"></sl-grid-selection-column>
          <sl-grid-column
            [grow]="3"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <sl-button fill="outline" slot="bulk-actions" variant="inverted">
            <sl-icon name="far-copy"></sl-icon>
            Duplicate
          </sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Delete</sl-button>
          <sl-button [disabled]="true" fill="outline" slot="bulk-actions" variant="inverted">Action 1</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Action 2</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Action 3</sl-button>
        </sl-grid>
      `
    };
  }
};

export const MultipleWithMenuButton: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = (loaded['students'] as Student[]).slice(0, 5);

    return {
      description:
        'This example validates bulk actions with menu controls when the floating toolbar is collapsed.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-selection-column [selectAll]="false"></sl-grid-selection-column>
          <sl-grid-column
            [grow]="3"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Duplicate</sl-button>
          <sl-menu-button fill="outline" slot="bulk-actions" variant="inverted">
            <span slot="button">Visibility</span>
            <sl-menu-item>Hide</sl-menu-item>
            <sl-menu-item>Show</sl-menu-item>
          </sl-menu-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Delete</sl-button>
        </sl-grid>
      `
    };
  }
};

export const MultipleRow: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    let data = [...(loaded['students'] as Student[])];

    const ds = new ArrayListDataSource(data);

    const getSelectedIds = (): string[] =>
      ds.items
        .filter(item => ds.isSelected(item))
        .filter(item => isListDataSourceDataItem(item))
        .map(item => item.data.id);

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

    return {
      description:
        'This example shows how you can select multiple rows by clicking anywhere on the row. This is done by setting the row-action property to select. Bulk actions can copy or delete the selected rows.',
      props: { ds, onCopy, onDelete, onUpdate, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [dataSource]="ds" rowAction="select" [noSkipLinks]="true">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column
            [grow]="3"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <sl-button fill="outline" slot="bulk-actions" variant="inverted" (click)="onUpdate()">Update emails</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted" (click)="onCopy()">Duplicate</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted" (click)="onDelete()">Delete</sl-button>
        </sl-grid>
      `
    };
  }
};

export const WithFiltering: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows a combination of selection and filtering. You can have a selection that may not be visible due to filtering.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-filter-column
            header="Student"
            path="fullName"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-filter-column>
          <sl-grid-filter-column
            header="School"
            labelPath="school.name"
            mode="select"
            path="school.id">
          </sl-grid-filter-column>
        </sl-grid>
      `
    };
  }
};

export const WithLinks: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    let activeStudent: Student | undefined;

    const activateRenderer = (student: Student) => {
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
    };

    const onActiveRowChange = (event: Event): void => {
      const student = (event as CustomEvent<Student>).detail;
      activeStudent = student;
      const el = document.getElementById('selection-message');
      if (el) {
        el.textContent = student
          ? `You have activated ${student.fullName}.`
          : 'You have not activated or selected anybody yet.';
      }

      // Keep button aria state in sync with the active row.
      (event.target as { requestUpdate?(): void }).requestUpdate?.();
    };

    const onSelectionChange = (event: Event): void => {
      const detail = (
        event as CustomEvent<{
          grid: { dataSource?: { selected?: number }; activeRow?: Student };
        }>
      ).detail;
      const selected = detail?.grid?.dataSource?.selected ?? 0,
        el = document.getElementById('selection-message');
      if (el && selected > 0) {
        if (detail?.grid) {
          detail.grid.activeRow = undefined;
        }
        el.textContent = `You have selected ${selected} ${selected > 1 ? 'students' : 'student'}.`;
      } else if (el) {
        el.textContent = 'You have not activated or selected anybody yet.';
      }
    };

    return {
      description:
        'This example shows how you can have mixed selection: bulk actions via the checkbox column while clicking anywhere else activates the row.',
      props: {
        students,
        onActiveRowChange,
        onSelectionChange,
        activateRenderer,
        avatarButtonScopedElements
      },
      template: `
        <p id="selection-message">You have not activated or selected anybody yet.</p>
        <sl-grid
          [items]="students"
          rowAction="activate"
          [noSkipLinks]="true"
          (slGridActiveRowChange)="onActiveRowChange($event)"
          (slGridSelectionChange)="onSelectionChange($event)">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column
            [grow]="3"
            header="Student"
            [renderer]="activateRenderer"
            [scopedElements]="avatarButtonScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Duplicate</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Delete</sl-button>
        </sl-grid>
      `
    };
  }
};

export const Grouped: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    let data = [...(loaded['students'] as Student[])];

    const ds = new ArrayListDataSource(data, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });
    const storyId = `grouped-${Date.now()}`;

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

    const onGetSelected = (): void => {
      const names = ds.unfilteredItems
        .filter(item => isListDataSourceDataItem(item))
        .filter(item => ds.isSelected(item))
        .map(item => item.data.firstName)
        .join(', ');

      const el = document.getElementById(`selected-students-${storyId}`);
      if (el) {
        el.textContent = names || '(no selected students)';
      }
    };

    return {
      description:
        'This example shows how selection works in combination with grouping. The grid automatically handles the selection of groups and individual items.',
      props: { ds, onDelete, onGetSelected, storyId, avatarRenderer, avatarScopedElements },
      template: `
        <sl-button-bar style="margin-block-end: var(--sl-size-200)">
          <sl-button (click)="onGetSelected()">Get selected students</sl-button>
          <span [attr.id]="'selected-students-' + storyId">(no selected students)</span>
        </sl-button-bar>
        <sl-grid [dataSource]="ds" [noSkipLinks]="true" [attr.data-story-id]="storyId">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column
            [grow]="3"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <sl-button fill="outline" slot="bulk-actions" variant="inverted" (click)="onDelete()">Delete</sl-button>
        </sl-grid>
      `
    };
  }
};
