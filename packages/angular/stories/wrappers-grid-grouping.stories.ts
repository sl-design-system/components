import {
  GridColumnComponent,
  GridColumnGroupComponent,
  GridComponent,
  GridSortColumnComponent
} from '@sl-design-system/angular/grid';
import { Button } from '@sl-design-system/button';
import { ArrayListDataSource, isListDataSourceGroupItem } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';
import { html } from 'lit';

export default {
  title: 'Wrappers/Grid/Grouping',
  decorators: [
    moduleMetadata({
      imports: [
        GridComponent,
        GridColumnComponent,
        GridColumnGroupComponent,
        GridSortColumnComponent
      ]
    })
  ]
} as Meta;

export const Grouped: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Group related columns under shared headers for better structure.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column-group header="Student">
            <sl-grid-column path="id" header="Nr."></sl-grid-column>
            <sl-grid-column path="firstName" header="First name"></sl-grid-column>
            <sl-grid-column path="lastName" header="Last name"></sl-grid-column>
          </sl-grid-column-group>
          <sl-grid-column-group header="School">
            <sl-grid-column path="school.name" header="Name"></sl-grid-column>
            <sl-grid-column path="school.city" header="City"></sl-grid-column>
          </sl-grid-column-group>
        </sl-grid>
      `
    };
  }
};

export const ByDataSource: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    const dataSource = new ArrayListDataSource(students, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    return {
      description: 'Group rows by school by providing a grouped data source to the grid.',
      props: { dataSource },
      template: `
        <sl-grid [dataSource]="dataSource" [noSkipLinks]="true">
          <sl-grid-sort-column direction="asc" path="fullName" header="Student"></sl-grid-sort-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const SortedGroups: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    const dataSource = new ArrayListDataSource(students, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name',
      groupSortBy: (a, b) => {
        const valueA = (isListDataSourceGroupItem(a) ? a.label : a.group?.label) ?? '',
          valueB = (isListDataSourceGroupItem(b) ? b.label : b.group?.label) ?? '';

        if (valueA === valueB) {
          return 0;
        } else if (valueA.startsWith('Koninklijk')) {
          return -1;
        } else if (valueB.startsWith('Koninklijk')) {
          return 1;
        }

        return valueA.localeCompare(valueB);
      }
    });

    return {
      description:
        'Use a custom group sort function to pin specific groups before the alphabetical order.',
      props: { dataSource },
      template: `
        <sl-grid [dataSource]="dataSource" [noSkipLinks]="true">
          <sl-grid-sort-column direction="asc" path="fullName" header="Student"></sl-grid-sort-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const CustomGroupHeader: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    const dataSource = new ArrayListDataSource(students, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    const groupHeaderRenderer = (item: { label?: string; count: number }) => html`
      <span slot="group-heading">${item.label} (${item.count})</span>
      <sl-button size="sm">Add student</sl-button>
    `;

    return {
      description:
        'Customize the group heading content by providing groupHeaderRenderer and scopedElements.',
      props: {
        dataSource,
        groupHeaderRenderer,
        groupHeaderScopedElements: { 'sl-button': Button }
      },
      template: `
        <sl-grid
          [dataSource]="dataSource"
          [groupHeaderRenderer]="groupHeaderRenderer"
          [scopedElements]="groupHeaderScopedElements"
          [noSkipLinks]="true">
          <sl-grid-sort-column direction="asc" path="fullName" header="Student"></sl-grid-sort-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const StickyColumnsWithCustomGroupHeader: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    const dataSource = new ArrayListDataSource(students, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    const groupHeaderRenderer = (item: { label?: string; count: number }) => html`
      <span slot="group-heading">${item.label} (${item.count})</span>
      <sl-button size="sm">Add student</sl-button>
    `;

    return {
      description:
        'Combine grouped rows, a custom group header and sticky columns while scrolling horizontally.',
      props: {
        dataSource,
        groupHeaderRenderer,
        groupHeaderScopedElements: { 'sl-button': Button }
      },
      template: `
        <sl-grid
          [dataSource]="dataSource"
          [groupHeaderRenderer]="groupHeaderRenderer"
          [scopedElements]="groupHeaderScopedElements"
          [noSkipLinks]="true">
          <sl-grid-column
            [grow]="0"
            header="Nr."
            path="studentNumber"
            [sticky]="true"
            [width]="120"></sl-grid-column>
          <sl-grid-column [grow]="0" path="group.name" [sticky]="true" [width]="220"></sl-grid-column>
          <sl-grid-column [grow]="3" header="Student" path="fullName" [width]="260"></sl-grid-column>
          <sl-grid-column path="email" [width]="260"></sl-grid-column>
          <sl-grid-column path="school.name" header="School" [width]="260"></sl-grid-column>
          <sl-grid-column path="school.address" [width]="240"></sl-grid-column>
          <sl-grid-column path="school.city" [width]="160"></sl-grid-column>
          <sl-grid-column path="school.country" [width]="160"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
