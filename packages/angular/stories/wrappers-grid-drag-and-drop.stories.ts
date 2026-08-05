import {
  GridColumnComponent,
  GridComponent,
  GridDragHandleColumnComponent,
  GridSelectionColumnComponent
} from '@sl-design-system/angular/grid';
import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Person, type Student, getPeople, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
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
  title: 'Wrappers/Grid/Drag and drop',
  decorators: [
    moduleMetadata({
      imports: [
        GridComponent,
        GridColumnComponent,
        GridDragHandleColumnComponent,
        GridSelectionColumnComponent
      ]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 20 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows basic drag and drop behavior. You can drag a row and drop it in between other rows to reorder the items in the grid. This is the default behavior when you add a sl-grid-drag-handle-column to the grid.',
      props: { students, avatarRenderer, scopedElements },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
          <sl-grid-column path="id" header="Nr."></sl-grid-column>
          <sl-grid-column
            [grow]="3"
            header="Student"
            path="fullName"
            [renderer]="avatarRenderer"
            [scopedElements]="scopedElements"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const OnTop: StoryObj = {
  loaders: [
    async () => {
      const { people } = await getPeople({ count: 20 });

      return { people };
    }
  ],
  render: (_, { loaded }) => {
    const people = loaded['people'] as Person[];
    const dropFilter = (person: Person): boolean => {
      return (person as Person & { membership?: string }).membership !== 'Regular';
    };

    const onDrop = (event: Event): void => {
      const detail = (event as CustomEvent<{ item: Person; relativeItem: Person }>).detail;
      console.log('Dropped', detail.item, detail.relativeItem);
    };

    return {
      description:
        'This example shows drag and drop behavior where you can drop rows on top of other rows. Only rows with certain characteristics (e.g., Premium members) can be drop targets, enforced by a drop filter.',
      props: { people, dropFilter, onDrop },
      template: `
        <sl-grid
          [items]="people"
          draggableRows="on-top"
          [dropFilter]="dropFilter"
          [noSkipLinks]="true"
          (slGridDrop)="onDrop($event)">
          <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="profession"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Fixed: StoryObj = {
  loaders: [
    async () => {
      const { people } = await getPeople({ count: 20 });

      return { people };
    }
  ],
  render: (_, { loaded }) => {
    const people = (loaded['people'] as Array<Person & { draggable: boolean }>).map(
      (person, index) => ({
        ...person,
        draggable: index > 0 && index <= 15
      })
    );

    return {
      description:
        'This example shows how to control which rows can be dragged. Only rows where the draggable property is true can be dragged. This allows you to fix certain rows in place.',
      props: { people },
      template: `
        <sl-grid [items]="people" [noSkipLinks]="true">
          <sl-grid-drag-handle-column path="draggable"></sl-grid-drag-handle-column>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="profession"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Grouping: StoryObj = {
  loaders: [
    async () => {
      const { people } = await getPeople({ count: 30 });

      return { people };
    }
  ],
  render: (_, { loaded }) => {
    const people = loaded['people'] as Person[];
    const dataSource = new ArrayListDataSource(people, {
      groupBy: 'profession',
      groupLabelPath: 'profession'
    });

    return {
      description:
        'This example shows drag and drop behavior in combination with grouping. Items can be dragged and dropped both within and between groups.',
      props: { dataSource },
      template: `
        <sl-grid [dataSource]="dataSource" [noSkipLinks]="true">
          <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="profession"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
