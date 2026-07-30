import {
  GridColumnComponent,
  GridComponent,
  GridSelectionColumnComponent
} from '@sl-design-system/angular/grid';
import { Avatar } from '@sl-design-system/avatar';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { html } from 'lit';

const avatarRenderer = (student: Student) => html`
  <sl-avatar
    .displayName=${student.fullName}
    .pictureUrl=${student.pictureUrl}
    size="sm"></sl-avatar>
`;

const avatarScopedElements = { 'sl-avatar': Avatar };

export default {
  title: 'Wrappers/Grid/Scrolling',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, GridSelectionColumnComponent]
    })
  ]
} as Meta;

export const Vertical: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 100 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows vertical scrolling with a constrained grid height. The grid will scroll vertically when there are more rows than can fit in the available space.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [items]="students" style="block-size: 400px" [noSkipLinks]="true">
          <sl-grid-column path="id" header="Nr."></sl-grid-column>
          <sl-grid-column
            [grow]="3"
            path="fullName"
            header="Student"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const VerticalOverflow: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 100 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'Set a fixed block-size and overflow on the grid to create an internal vertical scroll container while keeping the header sticky.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <style>
          .overflow-grid {
            block-size: 320px;
            border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
            border-radius: var(--sl-size-borderRadius-default);
            overflow-y: auto;
          }
        </style>
        <sl-grid [items]="students" class="overflow-grid" [noBorder]="true" [noSkipLinks]="true">
          <sl-grid-column path="studentNumber" header="Nr." [grow]="0"></sl-grid-column>
          <sl-grid-column
            path="fullName"
            header="Student"
            [grow]="3"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Horizontal: StoryObj = {
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
        'This example shows horizontal scrolling with a constrained grid width and fixed column widths.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [items]="students" style="inline-size: 420px" [noSkipLinks]="true">
          <sl-grid-column path="id" header="Nr." [width]="140"></sl-grid-column>
          <sl-grid-column
            path="fullName"
            header="Student"
            [width]="220"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email" [width]="280"></sl-grid-column>
          <sl-grid-column path="school.name" header="School" [width]="200"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Both: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 100 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows both vertical and horizontal scrolling with constrained grid dimensions and many columns.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [items]="students" style="inline-size: 500px; block-size: 400px" [noSkipLinks]="true">
          <sl-grid-column path="id" header="Nr." [width]="100"></sl-grid-column>
          <sl-grid-column
            path="fullName"
            header="Student"
            [width]="220"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email" [width]="250"></sl-grid-column>
          <sl-grid-column path="school.name" header="School" [width]="180"></sl-grid-column>
          <sl-grid-column path="group.name" header="Group" [width]="150"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const BothSticky: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 100 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'Combine horizontal and vertical scrolling with sticky header and sticky columns. Row activation is enabled to match interaction behavior from the regular grid story.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <style>
          .cover {
            background: var(--sl-elevation-surface-base-default);
            block-size: 1rem;
            position: sticky;
            inset-block-start: 0;
            z-index: 3;
          }
          .sticky-grid::part(thead) {
            inset-block-start: 1rem;
          }
        </style>
        <div class="cover"></div>
        <sl-grid [items]="students" rowAction="activate" class="sticky-grid" [noSkipLinks]="true">
          <sl-grid-selection-column [sticky]="true"></sl-grid-selection-column>
          <sl-grid-column path="studentNumber" header="Nr." [grow]="0" [sticky]="true"></sl-grid-column>
          <sl-grid-column path="group.name" [sticky]="true"></sl-grid-column>
          <sl-grid-column
            path="fullName"
            header="Student"
            [grow]="3"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
          <sl-grid-column path="school.address"></sl-grid-column>
          <sl-grid-column path="school.city"></sl-grid-column>
          <sl-grid-column path="school.country" [sticky]="true"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
