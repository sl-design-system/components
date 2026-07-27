import {
  GridColumnComponent,
  GridColumnGroupComponent,
  GridComponent
} from '@sl-design-system/angular/grid';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const students = [
  {
    studentNumber: 1001,
    firstName: 'Emma',
    lastName: 'Thompson',
    fullName: 'Emma Thompson',
    dateOfBirth: '2010-05-16',
    school: {
      name: 'Northview High School for Applied Sciences and International Programs',
      city: 'Helsinki'
    }
  },
  {
    studentNumber: 1002,
    firstName: 'Liam',
    lastName: 'Johnson',
    fullName: 'Liam Johnson',
    dateOfBirth: '2009-11-03',
    school: {
      name: 'Riverside School for Arts and Communication',
      city: 'Espoo'
    }
  },
  {
    studentNumber: 1003,
    firstName: 'Noah',
    lastName: 'Williams',
    fullName: 'Noah Williams',
    dateOfBirth: '2010-01-27',
    school: {
      name: 'Westside Academy',
      city: 'Tampere'
    }
  }
];

export default {
  title: 'Wrappers/Grid',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, GridColumnGroupComponent]
    })
  ]
} as Meta;

export const Basics: StoryObj = {
  render: () => ({
    description:
      'A grid displays tabular data in rows and columns. This example shows a basic setup with static data and simple columns.',
    props: { students },
    template: `
      <sl-grid [items]="students" [noSkipLinks]="true">
        <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
        <sl-grid-column grow="3" header="Student" path="fullName"></sl-grid-column>
        <sl-grid-column header="Date of birth" path="dateOfBirth"></sl-grid-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `
  })
};

export const ColumnGroups: StoryObj = {
  render: () => ({
    description:
      'You can group related columns by using sl-grid-column-group for clearer table structure.',
    props: { students },
    template: `
      <sl-grid [items]="students" [striped]="true" [noSkipLinks]="true">
        <sl-grid-column-group header="Name">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid-column-group>
        <sl-grid-column-group header="School">
          <sl-grid-column path="school.name"></sl-grid-column>
          <sl-grid-column path="school.city"></sl-grid-column>
        </sl-grid-column-group>
      </sl-grid>
    `
  })
};

export const Header: StoryObj = {
  render: () => ({
    description: 'Customize column header labels by setting the header attribute per column.',
    props: { students },
    template: `
      <sl-grid [items]="students" [noSkipLinks]="true">
        <sl-grid-column header="Student number" path="studentNumber"></sl-grid-column>
        <sl-grid-column header="Student name" path="fullName"></sl-grid-column>
        <sl-grid-column header="Birth date" path="dateOfBirth"></sl-grid-column>
        <sl-grid-column header="School name" path="school.name"></sl-grid-column>
      </sl-grid>
    `
  })
};

export const EllipsizeText: StoryObj = {
  render: () => ({
    description:
      'Use ellipsize-text to truncate long text values while keeping columns compact and readable.',
    props: { students },
    template: `
      <sl-grid
        [items]="students"
        [ellipsizeText]="true"
        [noSkipLinks]="true"
        style="max-inline-size: 700px">
        <sl-grid-column path="fullName"></sl-grid-column>
        <sl-grid-column path="school.name"></sl-grid-column>
      </sl-grid>
    `
  })
};

export const Striped: StoryObj = {
  render: () => ({
    description: 'Use striped rows to improve readability in larger datasets.',
    props: { students },
    template: `
      <sl-grid [items]="students" [striped]="true" [noSkipLinks]="true">
        <sl-grid-column path="studentNumber"></sl-grid-column>
        <sl-grid-column path="fullName"></sl-grid-column>
        <sl-grid-column path="school.name"></sl-grid-column>
      </sl-grid>
    `
  })
};
