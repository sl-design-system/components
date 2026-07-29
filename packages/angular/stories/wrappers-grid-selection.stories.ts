import { ButtonComponent } from '@sl-design-system/angular/button';
import {
  GridColumnComponent,
  GridComponent,
  GridFilterColumnComponent,
  GridSelectionColumnComponent
} from '@sl-design-system/angular/grid';
import { ArrayListDataSource, isListDataSourceDataItem } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Selection',
  decorators: [
    moduleMetadata({
      imports: [
        ButtonComponent,
        GridComponent,
        GridColumnComponent,
        GridSelectionColumnComponent,
        GridFilterColumnComponent
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

    let message = 'You have not activated anybody yet.';

    const onActiveRowChange = (event: Event): void => {
      const student = (event as CustomEvent<Student>).detail;
      message = student
        ? `You have activated ${student.fullName}.`
        : 'You have not activated anybody yet.';
      (event.target as HTMLElement)
        .closest('div')!
        .querySelector('#activation-message')!.textContent = message;
    };

    return {
      description:
        'This example allows you to activate a student by clicking anywhere on the row. This behavior is enabled by setting the row-action property to activate.',
      props: { students, onActiveRowChange },
      template: `
        <p id="activation-message">You have not activated anybody yet.</p>
        <sl-grid
          [items]="students"
          rowAction="activate"
          [noSkipLinks]="true"
          (slGridActiveRowChange)="onActiveRowChange($event)">
          <sl-grid-column [grow]="3" header="Student" path="fullName"></sl-grid-column>
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
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows how you can select multiple rows by toggling the checkbox in the first column. Bulk actions appear in a floating toolbar when rows are selected.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column [grow]="3" header="Student" path="fullName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Duplicate</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Delete</sl-button>
          <sl-button [disabled]="true" fill="outline" slot="bulk-actions" variant="inverted">Action 1</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Action 2</sl-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Action 3</sl-button>
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

    const onCopy = (): void => {
      const ids = ds.items
        .filter(item => ds.isSelected(item))
        .filter(item => isListDataSourceDataItem(item))
        .map(item => item.data.id);

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
      const ids = ds.items
        .filter(item => ds.isSelected(item))
        .filter(item => isListDataSourceDataItem(item))
        .map(item => item.data.id);

      data = data.filter(student => !ids.includes(student.id));

      ds.setData(data);
      ds.deselectAll();
      ds.update();
    };

    return {
      description:
        'This example shows how you can select multiple rows by clicking anywhere on the row. This is done by setting the row-action property to select. Bulk actions can copy or delete the selected rows.',
      props: { ds, onCopy, onDelete },
      template: `
        <sl-grid [dataSource]="ds" rowAction="select" [noSkipLinks]="true">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column [grow]="3" header="Student" path="fullName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

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
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-filter-column header="Student" path="fullName"></sl-grid-filter-column>
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

    const onActiveRowChange = (event: Event): void => {
      const student = (event as CustomEvent<Student>).detail;
      const el = document.getElementById('selection-message');
      if (el) {
        el.textContent = student
          ? `You have activated ${student.fullName}.`
          : 'You have not activated or selected anybody yet.';
      }
    };

    const onSelectionChange = (event: Event): void => {
      const detail = (event as CustomEvent<{ grid: { dataSource: { selected: number } } }>).detail;
      const selected = detail?.grid?.dataSource?.selected ?? 0,
        el = document.getElementById('selection-message');
      if (el && selected > 0) {
        el.textContent = `You have selected ${selected} ${selected > 1 ? 'students' : 'student'}.`;
      }
    };

    return {
      description:
        'This example shows how you can have mixed selection: bulk actions via the checkbox column while clicking anywhere else activates the row.',
      props: { students, onActiveRowChange, onSelectionChange },
      template: `
        <p id="selection-message">You have not activated or selected anybody yet.</p>
        <sl-grid
          [items]="students"
          rowAction="activate"
          [noSkipLinks]="true"
          (slGridActiveRowChange)="onActiveRowChange($event)"
          (slGridSelectionChange)="onSelectionChange($event)">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column [grow]="3" header="Student" path="fullName"></sl-grid-column>
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
        .filter(item => isListDataSourceDataItem(item))
        .map(item => item.data.id);

      data = data.filter(student => !ids.includes(student.id));

      ds.setData(data);
      ds.deselectAll();
      ds.update();
    };

    return {
      description:
        'This example shows how selection works in combination with grouping. The grid automatically handles the selection of groups and individual items.',
      props: { ds, onDelete, storyId },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true" [attr.data-story-id]="storyId">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column [grow]="3" header="Student" path="fullName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>

          <sl-button fill="outline" slot="bulk-actions" variant="inverted" (click)="onDelete()">Delete</sl-button>
        </sl-grid>
      `
    };
  }
};
