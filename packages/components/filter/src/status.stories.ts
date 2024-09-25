import { type Person, getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource, type DataSource } from '@sl-design-system/shared';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Props = { dataSource?(people: Person[]): DataSource<Person> };
type Story = StoryObj<Props>;

export default {
  title: 'Filter/Status',
  tags: ['draft'],
  args: {
    dataSource: undefined
  },
  argTypes: {
    dataSource: { table: { disable: true } }
  },
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ dataSource }, { loaded: { people } }) => {
    return html`<sl-filter-status .dataSource=${dataSource?.(people as Person[])}></sl-filter-status>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    dataSource: people => new ArrayDataSource(people)
  }
};

export const Blank: Story = {
  args: {
    dataSource: undefined
  }
};

export const FilterByPath: Story = {
  args: {
    dataSource: people => {
      const dataSource = new ArrayDataSource(people);
      dataSource.addFilter('profession', 'profession', 'Endocrinologist');
      dataSource.addFilter('membership', 'membership', 'Premium');
      dataSource.update();

      return dataSource;
    }
  }
};

export const FilterByFunction: Story = {
  args: {
    dataSource: people => {
      const dataSource = new ArrayDataSource(people);
      dataSource.addFilter('search', ({ firstName, lastName }) => {
        return /Ann/.test(firstName) || /Ann/.test(lastName);
      });
      dataSource.update();

      return dataSource;
    }
  }
};
