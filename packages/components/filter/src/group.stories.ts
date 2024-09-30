import { type Person, getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource, type DataSource } from '@sl-design-system/shared';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type FilterGroup } from './group.js';

type Props = Pick<FilterGroup, 'label' | 'options' | 'path'> & { dataSource?(people: Person[]): DataSource<Person> };
type Story = StoryObj<Props>;

export default {
  title: 'Filter/Group',
  tags: ['draft'],
  args: {
    dataSource: undefined
  },
  argTypes: {
    dataSource: { table: { disable: true } }
  },
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ dataSource, label, options, path }, { loaded: { people } }) => {
    return html`
      <sl-filter-group
        .dataSource=${dataSource?.(people as Person[])}
        .label=${label}
        .options=${options}
        .path=${path}
      ></sl-filter-group>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    dataSource: people => new ArrayDataSource(people),
    label: 'Membership',
    options: ['Regular', 'Premium', 'VIP'],
    path: 'membership'
  }
};

export const Filtered: Story = {
  args: {
    ...Basic.args,
    dataSource: people => {
      const dataSource = new ArrayDataSource(people);
      dataSource.addFilter('membership-Regular', 'membership', 'Regular');
      dataSource.addFilter('membership-Premium', 'membership', 'Premium');
      dataSource.update();

      return dataSource;
    }
  }
};
