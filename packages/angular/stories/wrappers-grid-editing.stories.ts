import {
  GridColumnComponent,
  GridComponent,
  GridSelectColumnComponent,
  GridTextFieldColumnComponent
} from '@sl-design-system/angular/grid';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const personLabel = ({ firstName, lastName }: Person): string => `${firstName} ${lastName}`;

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

/**
 * ### TextField Props Example
 *
 * ```typescript
 * {
 *   people: Person[] // e.g., [{ firstName: 'John', lastName: 'Doe', profession: 'Engineer', ... }, ...]
 * }
 * ```
 */
export const TextField: StoryObj = {
  argTypes: {
    people: {
      description: 'Array of Person objects representing the data rows to be displayed in the grid',
      table: {
        type: { summary: 'Person[]' }
      }
    }
  },
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
      props: { people, personLabel },
      template: `
        <sl-grid [items]="people" [noSkipLinks]="true">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-text-field-column path="address.zip" [formControlLabel]="personLabel"></sl-grid-text-field-column>
        </sl-grid>
      `
    };
  }
};

/**
 * ### Select Props Example
 *
 * ```typescript
 * {
 *   people: Person[] // e.g., [{ firstName: 'John', lastName: 'Doe', status: 'Available', ... }, ...]
 *   statuses: ['Available', 'Busy', 'Away']
 * }
 * ```
 *
 * The `statuses` array defines the available options for the select dropdown editor. Each item in
 * the `people` array can have its `status` property updated by selecting from these options.
 */
export const Select: StoryObj = {
  argTypes: {
    people: {
      description: 'Array of Person objects representing the data rows to be displayed in the grid',
      table: {
        type: { summary: 'Person[]' }
      }
    },
    statuses: {
      description: 'Array of available status options displayed in the select column dropdown',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: "['Available', 'Busy', 'Away']" }
      }
    }
  },
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
