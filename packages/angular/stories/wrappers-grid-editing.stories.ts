import {
  GridColumnComponent,
  GridComponent,
  GridSelectColumnComponent,
  GridTextFieldColumnComponent
} from '@sl-design-system/angular/grid';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Editing',
  decorators: [
    moduleMetadata({
      imports: [
        GridComponent,
        GridColumnComponent,
        GridTextFieldColumnComponent,
        GridSelectColumnComponent
      ]
    })
  ]
} as Meta;

export const TextField: StoryObj = {
  loaders: [
    async () => {
      const { people } = await getPeople({ count: 40 });

      return { people };
    }
  ],
  render: (_, { loaded }) => {
    const people = loaded['people'] as Person[];

    return {
      description: 'Edit a text value directly in a grid column using sl-grid-text-field-column.',
      props: { people },
      template: `
        <sl-grid [items]="people" [noSkipLinks]="true">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="profession"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Select: StoryObj = {
  loaders: [
    async () => {
      const { people } = await getPeople({ count: 40 });

      return { people };
    }
  ],
  render: (_, { loaded }) => {
    const people = loaded['people'] as Person[];

    return {
      description: 'Use a select editor for controlled values like status.',
      props: { people, statuses: ['Available', 'Busy', 'Away'] },
      template: `
        <sl-grid [items]="people" [noSkipLinks]="true">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-select-column path="status" [options]="statuses"></sl-grid-select-column>
        </sl-grid>
      `
    };
  }
};
