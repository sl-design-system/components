import { ArrayDataSource } from '@sl-design-system/shared';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'dataSource' | 'selects'>;
type Story = StoryObj<Props>;

export default {
  title: 'In progress/Tree',
  argTypes: {
    dataSource: {
      table: { disable: true }
    },
    selects: {
      control: {
        type: 'inline-radio',
        options: ['single', 'multiple']
      }
    }
  },
  render: ({ dataSource, selects }) => html`<sl-tree .dataSource=${dataSource} .selects=${selects}></sl-tree>`
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    dataSource: new ArrayDataSource(['Item 1', 'Item 2', 'Item 3'])
  }
};
