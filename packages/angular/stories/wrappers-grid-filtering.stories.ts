import {
  GridColumnComponent,
  GridComponent,
  GridFilterColumnComponent,
  GridSelectionColumnComponent
} from '@sl-design-system/angular/grid';
import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';
import { html } from 'lit';

const avatarRenderer = (student: Student) => {
  const { firstName, infix, lastName, pictureUrl } = student;

  return html`
    <sl-avatar
      .displayName=${[firstName, infix, lastName].filter(Boolean).join(' ')}
      .pictureUrl=${pictureUrl}
      size="sm"></sl-avatar>
  `;
};

const scopedElements = { 'sl-avatar': Avatar };

export default {
  title: 'Wrappers/Grid/Filtering',
  decorators: [
    moduleMetadata({
      imports: [
        GridComponent,
        GridColumnComponent,
        GridFilterColumnComponent,
        GridSelectionColumnComponent
      ]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example filters students based on their name and school. The filters are set declaratively on the sl-grid-filter-column elements using the value property. The label-path property shows the school name instead of the id.',
      props: { students, avatarRenderer, scopedElements },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-filter-column
            path="fullName"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="scopedElements"
            value="ma"></sl-grid-filter-column>
          <sl-grid-filter-column path="group.name" header="Group"></sl-grid-filter-column>
          <sl-grid-filter-column
            path="school.id"
            header="School"
            labelPath="school.name"
            mode="select"
            value="school-3"></sl-grid-filter-column>
        </sl-grid>
      `
    };
  }
};

export const DataSource: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];
    const ds = new ArrayListDataSource(students, {
      filters: [
        { id: 'filter-school', by: 'school.id', value: 'school-1' },
        { id: 'filter-student', by: 'fullName', value: 'ma' }
      ]
    });

    return {
      description:
        'This example shows how to set filters programmatically on the data source using the filters option in the constructor. Use matching ids on the sl-grid-filter-column elements to link them with the data source filters.',
      props: { ds, avatarRenderer, scopedElements },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-filter-column
            id="filter-student"
            path="fullName"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="scopedElements"></sl-grid-filter-column>
          <sl-grid-filter-column
            id="filter-school"
            path="school.id"
            header="School"
            labelPath="school.name"
            mode="select"></sl-grid-filter-column>
        </sl-grid>
      `
    };
  }
};

export const Selection: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows how you can combine filtering with selection. Selected rows remain selected even if they are not visible due to filtering.',
      props: { students, avatarRenderer, scopedElements },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-filter-column
            path="fullName"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="scopedElements"></sl-grid-filter-column>
          <sl-grid-filter-column path="email"></sl-grid-filter-column>
        </sl-grid>
      `
    };
  }
};

export const Grouped: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];
    const ds = new ArrayListDataSource(students, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    return {
      description:
        'This example shows how to combine grouping with filtering. Groups that do not have any items matching the filter criteria will not be shown.',
      props: { ds, avatarRenderer, scopedElements },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-filter-column
            path="fullName"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="scopedElements"></sl-grid-filter-column>
          <sl-grid-filter-column path="email"></sl-grid-filter-column>
        </sl-grid>
      `
    };
  }
};
